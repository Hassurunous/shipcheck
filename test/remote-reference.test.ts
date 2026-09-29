import {afterEach,beforeEach,it,expect,vi} from 'vitest';
import {EventEmitter} from 'node:events';
const dns=vi.hoisted(()=>vi.fn());
const https=vi.hoisted(()=>vi.fn());
vi.mock('node:dns/promises',()=>({lookup:dns}));
vi.mock('node:https',()=>({get:https}));
import {readRemoteReference,publicReferenceAddress} from '../src/remote-reference.js';
beforeEach(()=>{dns.mockReset().mockResolvedValue([{address:'8.8.8.8',family:4}]);https.mockReset();});
afterEach(()=>vi.restoreAllMocks());
function response(statusCode=200,body=Buffer.from('fixture'),headers:Record<string,string>={}) {
  const stream=Object.assign(new EventEmitter(),{statusCode,headers,destroy:vi.fn()});
  https.mockImplementation((_url,_options,callback)=>{queueMicrotask(()=>{callback(stream);if(statusCode===200 && !headers['content-encoding']){stream.emit('data',body);stream.emit('end');}});return new EventEmitter();});
  return stream;
}
it.each(['127.0.0.1','10.0.0.1','172.16.0.1','192.168.1.1','169.254.169.254','100.64.1.1','192.0.2.1','198.51.100.1','203.0.113.1','224.0.0.1','0.0.0.0','::1','::','fc00::1','fe80::1','2001:db8::1','2002:7f00:1::','::ffff:127.0.0.1','64:ff9b::7f00:1','not-an-address'])('rejects non-public or special address %s',address=>{
  expect(publicReferenceAddress(address)).toBe(false);
});
it.each(['8.8.8.8','1.1.1.1','2001:4860:4860::8888','2606:4700:4700::1111'])('allows ordinary public address %s',address=>expect(publicReferenceAddress(address)).toBe(true));
it('pins the validated DNS address and sends no authorization or cookies',async()=>{
  response();expect((await readRemoteReference('https://docs.example.test/spec.md',64)).toString()).toBe('fixture');
  const options=https.mock.calls[0]![1];expect(options.agent).toBe(false);expect(options.headers.Authorization).toBeUndefined();expect(options.headers.Cookie).toBeUndefined();
  const callback=vi.fn();options.lookup('docs.example.test',{},callback);expect(callback).toHaveBeenCalledWith(null,'8.8.8.8',4);
  const all=vi.fn();options.lookup('docs.example.test',{all:true},all);expect(all).toHaveBeenCalledWith(null,[{address:'8.8.8.8',family:4}]);
  expect(dns).toHaveBeenCalledTimes(1);
});
it('rejects all DNS answers if any address is private',async()=>{
  dns.mockResolvedValue([{address:'8.8.8.8',family:4},{address:'127.0.0.1',family:4}]);
  await expect(readRemoteReference('https://docs.example.test/spec.md',64)).rejects.toThrow('remote-address-denied');expect(https).not.toHaveBeenCalled();
});
it.each(['https://127.0.0.1/spec','https://[::1]/spec','http://docs.example.test/spec','https://user:pass@docs.example.test/spec'])('rejects unsafe URL before connection: %s',url=>{
  return expect(readRemoteReference(url,64)).rejects.toThrow();
});
it.each([301,302,307,308,401,404,500])('does not follow redirects or accept HTTP status %s',async code=>{
  const stream=response(code);await expect(readRemoteReference('https://docs.example.test/spec',64)).rejects.toThrow('remote-response-rejected');expect(stream.destroy).toHaveBeenCalled();expect(https).toHaveBeenCalledTimes(1);
});
it('rejects compressed responses and destroys overflow streams',async()=>{
  const compressed=response(200,Buffer.from('x'),{'content-encoding':'gzip'});await expect(readRemoteReference('https://docs.example.test/spec',64)).rejects.toThrow('remote-response-rejected');expect(compressed.destroy).toHaveBeenCalled();
  const overflow=response(200,Buffer.alloc(65));await expect(readRemoteReference('https://docs.example.test/spec',64)).rejects.toThrow('remote-size-limit');expect(overflow.destroy).toHaveBeenCalled();
});
it('accepts an exact byte limit and rejects aborted streams',async()=>{
  response(200,Buffer.alloc(64));expect(await readRemoteReference('https://docs.example.test/spec',64)).toHaveLength(64);
  https.mockImplementation((_url,_options,callback)=>{queueMicrotask(()=>{const stream=Object.assign(new EventEmitter(),{statusCode:200,headers:{}});callback(stream);stream.emit('aborted');});return new EventEmitter();});
  await expect(readRemoteReference('https://docs.example.test/spec',64)).rejects.toThrow('remote-read-failed');
});
it('bounds unresolved DNS with the same request deadline',async()=>{
  const controller=new AbortController();vi.spyOn(AbortSignal,'timeout').mockReturnValue(controller.signal);dns.mockReturnValue(new Promise(()=>{}));
  const pending=readRemoteReference('https://docs.example.test/spec',64);controller.abort();await expect(pending).rejects.toThrow('remote-timeout');expect(https).not.toHaveBeenCalled();
});
it('retains the deadline after DNS resolution for a stalled HTTPS request',async()=>{
  const controller=new AbortController();vi.spyOn(AbortSignal,'timeout').mockReturnValue(controller.signal);
  https.mockImplementation((_url,options)=>{const request=new EventEmitter();options.signal.addEventListener('abort',()=>request.emit('error',Error('abort')));queueMicrotask(()=>controller.abort());return request;});
  await expect(readRemoteReference('https://docs.example.test/spec',64)).rejects.toThrow('remote-read-failed');
});
