import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {mkdtemp,writeFile,rm,mkdir,symlink} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {loadReferenceResources,verifyResourceEvidence} from '../src/reference-resources.js';
import {configSchema} from '../src/config.js';
import {runCli} from '../src/cli-command.js';
let root:string;
const config={resources:[{id:'contract',path:'contract.md',version:'v1',authority:'authoritative' as const}]};
beforeEach(async()=>{root=await mkdtemp(join(tmpdir(),'shipcheck-p8-'));vi.stubGlobal('fetch',vi.fn(()=>{throw new Error('Network forbidden');}));});
afterEach(async()=>{vi.unstubAllGlobals();await rm(root,{recursive:true,force:true});});
it('captures raw-byte hashes and decoded text without putting reference bodies in reports',async()=>{
  const bytes=Buffer.from('\ufeffContract\r\nReturn a list.\r\n');await writeFile(join(root,'contract.md'),bytes);
  const loaded=await loadReferenceResources(root,config);
  expect(loaded.report).toMatchObject({state:'ready',evaluation:'not-assessed',resources:[{sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,lines:3}]});
  expect(loaded.snapshots[0]!.content).toBe('Contract\r\nReturn a list.\r\n');
  expect(JSON.stringify(loaded.report)).not.toContain('Return a list.');
  expect(await loadReferenceResources(root,config)).toEqual(loaded);expect(fetch).not.toHaveBeenCalled();
});
it('checks exact citations against both submitted and fresh snapshots',async()=>{
  await writeFile(join(root,'contract.md'),'Contract\nReturn a list.');
  const loaded=await loadReferenceResources(root,config);
  const evidence={resourceId:'contract',snapshotSha256:loaded.snapshots[0]!.record.sha256!,startLine:2,endLine:2,excerpt:'Return a list.'};
  const check=(patch:Partial<typeof evidence>)=>verifyResourceEvidence({...evidence,...patch},loaded.snapshots,loaded.snapshots);
  expect(check({}).status).toBe('matched');expect(check({excerpt:'Return a number.'}).reason).toBe('excerpt-mismatch');
  expect(check({snapshotSha256:'0'.repeat(64)}).reason).toBe('wrong-snapshot');
  expect(check({resourceId:'unknown'}).reason).toBe('not-in-submitted-resources');
  expect(check({endLine:4}).reason).toBe('invalid-line-range');
  expect(verifyResourceEvidence(evidence,loaded.snapshots,[]).reason).toBe('resource-unavailable');
  await writeFile(join(root,'contract.md'),'Contract\nReturn a number.');
  expect(verifyResourceEvidence(evidence,loaded.snapshots,(await loadReferenceResources(root,config)).snapshots).reason).toBe('resource-changed');
});
it('rejects changed content pinned by an expected hash',async()=>{
  await writeFile(join(root,'contract.md'),'Contract');
  const loaded=await loadReferenceResources(root,{resources:[{...config.resources[0]!,expectedSha256:'0'.repeat(64)}]});
  expect(loaded.report.state).toBe('incomplete');expect(loaded.report.resources[0]!.status).toBe('hash-mismatch');expect(loaded.snapshots).toEqual([]);
});
it('distinguishes required, optional, and inapplicable missing resources',async()=>{
  expect((await loadReferenceResources(root,config)).report.state).toBe('incomplete');
  expect((await loadReferenceResources(root,{resources:[{...config.resources[0]!,required:false}]})).report).toMatchObject({state:'ready',resources:[{status:'missing'}]});
  const scoped={resources:[{...config.resources[0]!,appliesTo:['src/**']}]};
  expect((await loadReferenceResources(root,scoped,['test/a.ts'])).report).toMatchObject({state:'ready',resources:[{status:'not-applicable'}]});
  expect((await loadReferenceResources(root,scoped,['src/a.ts'])).report.state).toBe('incomplete');
});
it('rejects escaping paths, malformed scopes, duplicate IDs and excessive resources',()=>{
  for(const path of ['../a','/a','C:/a','docs\\a'])expect(configSchema.safeParse({resources:[{id:'a',path}]}).success).toBe(false);
  expect(configSchema.safeParse({resources:[{id:'a',path:'a',appliesTo:['../**']}]}).success).toBe(false);
  expect(configSchema.safeParse({resources:[...config.resources,...config.resources]}).success).toBe(false);
  expect(configSchema.safeParse({resources:Array.from({length:33},(_,i)=>({id:`r${i}`,path:'a'}))}).success).toBe(false);
});
it('rejects linked directories and excluded references',async()=>{
  await mkdir(join(root,'real'));await writeFile(join(root,'real','a.md'),'Contract');await symlink(join(root,'real'),join(root,'alias'),'junction');
  expect((await loadReferenceResources(root,{resources:[{id:'a',path:'alias/a.md'}]})).report.resources[0]!.status).toBe('linked');
  expect((await loadReferenceResources(root,{exclude:['real/**'],resources:[{id:'a',path:'real/a.md'}]})).report.resources[0]!.status).toBe('excluded');
});
it('bounds individual and aggregate snapshots',async()=>{
  await writeFile(join(root,'large.md'),'x'.repeat(65537));
  expect((await loadReferenceResources(root,{resources:[{id:'a',path:'large.md'}]})).report.resources[0]!.status).toBe('file-size-limit');
  const resources=[];for(let i=0;i<5;i++){const path=`r${i}.md`;await writeFile(join(root,path),'x'.repeat(65536));resources.push({id:`r${i}`,path});}
  const loaded=await loadReferenceResources(root,{resources});expect(loaded.snapshots).toHaveLength(4);expect(loaded.report.resources[4]!.status).toBe('total-size-limit');
});
it('discards binary, invalid UTF8 and likely credential content',async()=>{
  for(const content of [Buffer.from([0]),Buffer.from([255])]){await writeFile(join(root,'contract.md'),content);expect((await loadReferenceResources(root,config)).report.resources[0]!.status).toBe('invalid-text');}
  await writeFile(join(root,'contract.md'),'api_key = "dummy-sensitive-value"');
  const loaded=await loadReferenceResources(root,config);expect(loaded.report.resources[0]!.status).toBe('sensitive-content');expect(loaded.snapshots).toEqual([]);
  expect((await loadReferenceResources(root,{resources:[{id:'a',path:'secrets.md'}]})).report.resources[0]!.status).toBe('sensitive-content');
});
it('blocks live AI before spending when a required reference is unavailable',async()=>{
  await writeFile(join(root,'shipcheck.config.json'),JSON.stringify(config));await writeFile(join(root,'a.py'),'print(1)');
  const result=await runCli(['audit',root,'--ai','live','--budget','baseline','--json']);
  expect(result.exitCode).toBe(2);expect(result.stderr).toContain('Required reference');expect(JSON.parse(result.stdout).ai).toBeUndefined();expect(fetch).not.toHaveBeenCalled();
});
it('shows loaded references as unassessed in console reports',async()=>{
  await writeFile(join(root,'shipcheck.config.json'),JSON.stringify(config));await writeFile(join(root,'contract.md'),'Contract');
  const result=await runCli(['audit',root]);expect(result.exitCode).toBe(0);expect(result.stdout).toContain('READY — NOT ASSESSED');expect(result.stdout).toContain('[LOADED] contract');
});
