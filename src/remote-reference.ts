import {lookup} from 'node:dns/promises';
import {get} from 'node:https';
import {BlockList,isIP} from 'node:net';
import type {LookupFunction} from 'node:net';
import {referenceUrlSchema} from './reference-access.js';

const deniedV4=new BlockList(),deniedV6=new BlockList();
const globalV6=new BlockList();globalV6.addSubnet('2000::',3,'ipv6');
for(const [network,bits] of [['0.0.0.0',8],['10.0.0.0',8],['100.64.0.0',10],['127.0.0.0',8],['169.254.0.0',16],['172.16.0.0',12],['192.0.0.0',24],['192.0.2.0',24],['192.168.0.0',16],['198.18.0.0',15],['198.51.100.0',24],['203.0.113.0',24],['224.0.0.0',4],['240.0.0.0',4]] as const)deniedV4.addSubnet(network,bits,'ipv4');
for(const [network,bits] of [['::',128],['::1',128],['::ffff:0:0',96],['64:ff9b::',96],['100::',64],['2001:db8::',32],['fc00::',7],['fe80::',10],['ff00::',8]] as const)deniedV6.addSubnet(network,bits,'ipv6');
deniedV4.addSubnet('192.88.99.0',24,'ipv4');
for(const [network,bits] of [['2001::',23],['2002::',16],['3fff::',20]] as const)deniedV6.addSubnet(network,bits,'ipv6');
export function publicReferenceAddress(address:string) {
  const family=isIP(address);return family!==0 && (family!==6 || globalV6.check(address,'ipv6')) && !(family===4?deniedV4:deniedV6).check(address,family===4?'ipv4':'ipv6');
}
/** Bounded HTTPS GET, pinned to a public DNS result; no redirects, cookies, auth or proxy. */
export async function readRemoteReference(input:string,limit:number):Promise<Buffer> {
  const url=new URL(referenceUrlSchema.parse(input));
  if(isIP(url.hostname.replace(/^\[|\]$/g,'')))throw Error('remote-address-denied');
  // Bound DNS and the entire response together, not just socket idle time.
  const deadline=AbortSignal.timeout(10000);
  const addresses=await Promise.race([lookup(url.hostname,{all:true}),new Promise<never>((_,reject)=>{
    deadline.addEventListener('abort',()=>reject(Error('remote-timeout')),{once:true});
  })]);
  if(!addresses.length || addresses.some(item=>!publicReferenceAddress(item.address)))throw Error('remote-address-denied');
  const chosen=addresses[0]!;
  const pinnedLookup:LookupFunction=(_host,options,callback)=>{
    if(options.all)callback(null,[chosen]);else callback(null,chosen.address,chosen.family);
  };
  return new Promise((resolve,reject)=>{
    const request=get(url,{lookup:pinnedLookup,agent:false,signal:deadline,headers:{Accept:'application/json, text/plain, text/markdown','Accept-Encoding':'identity'}},response=>{
      if(response.statusCode!==200 || response.headers['content-encoding'] && response.headers['content-encoding']!=='identity') {
        response.destroy();reject(Error('remote-response-rejected'));return;
      }
      const chunks:Buffer[]=[];let bytes=0;
      response.on('data',(chunk:Buffer)=>{bytes+=chunk.length;if(bytes>limit){response.destroy();reject(Error('remote-size-limit'));}else chunks.push(chunk);});
      response.on('end',()=>resolve(Buffer.concat(chunks)));
      response.on('error',()=>reject(Error('remote-read-failed')));
      response.on('aborted',()=>reject(Error('remote-read-failed')));
    });
    request.on('error',()=>reject(Error('remote-read-failed')));
  });
}
