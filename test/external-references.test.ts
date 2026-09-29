import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import * as fs from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {loadReferenceResources,verifyResourceEvidence} from '../src/reference-resources.js';
import {configSchema,type ConfigInput} from '../src/config.js';
import {runCli} from '../src/cli-command.js';
import {reviewWithAi} from '../src/ai/review.js';
import {auditContracts} from '../src/contract-audit.js';
import {resourceDefinitionSchema,resourceRecordSchema} from '../src/resource-contracts.js';
const remote=vi.hoisted(()=>vi.fn());
vi.mock('../src/remote-reference.js',()=>({readRemoteReference:remote}));
it('validates external citation length once for definitions and loaded records',()=>{
  const prefix='@references/x/',path='a'.repeat(512-prefix.length);
  const definition=resourceDefinitionSchema.parse({id:'x',rootId:'provider',path});
  expect(resourceDefinitionSchema.safeParse({...definition,path:path+'a'}).success).toBe(false);
  expect(resourceRecordSchema.safeParse({...definition,path:prefix+path,origin:{kind:'external-root',path,rootId:'provider'},status:'missing',sha256:null,bytes:0,lines:0}).success).toBe(true);
});
let workspace:string,root:string,provider:string;
const hash=(value:string)=>createHash('sha256').update(value).digest('hex');
const resources:ConfigInput={resources:[{id:'spec',rootId:'provider',path:'spec.md'}]};
beforeEach(async()=>{workspace=await fs.mkdtemp(join(tmpdir(),'shipcheck-external-'));root=join(workspace,'consumer');provider=join(workspace,'provider');await fs.mkdir(root);await fs.mkdir(provider);await fs.writeFile(join(provider,'spec.md'),'Expected behavior.');await fs.writeFile(join(root,'a.ts'),'export const value=1;');remote.mockReset();vi.stubGlobal('fetch',vi.fn(()=>{throw Error('No model request');}));});
afterEach(async()=>{vi.unstubAllGlobals();await fs.rm(workspace,{recursive:true,force:true});});
it('requires a runtime root grant, keeps paths virtual, and records source identity',async()=>{
  const denied=await loadReferenceResources(root,resources);expect(denied.report.resources[0]!.status).toBe('access-denied');expect(denied.snapshots).toEqual([]);
  const loaded=await loadReferenceResources(root,resources,undefined,{roots:{provider}});
  expect(loaded.report.resources[0]).toMatchObject({status:'loaded',path:'@references/spec/spec.md',sha256:hash('Expected behavior.'),origin:{kind:'external-root',path:'spec.md',rootId:'provider'}});
  expect(JSON.stringify(loaded)).not.toContain(provider);expect(loaded.report.resources[0]!.origin!.rootSha256).toMatch(/^[a-f0-9]{64}$/);
});
it('rechecks bytes and root identity rather than trusting reference labels',async()=>{
  const before=await loadReferenceResources(root,resources,undefined,{roots:{provider}});
  const evidence={resourceId:'spec',snapshotSha256:hash('Expected behavior.'),startLine:1,endLine:1,excerpt:'Expected behavior.'};
  expect(verifyResourceEvidence(evidence,before.snapshots,before.snapshots).status).toBe('matched');
  const other=join(workspace,'other');await fs.mkdir(other);await fs.writeFile(join(other,'spec.md'),'Expected behavior.');
  const moved=await loadReferenceResources(root,resources,undefined,{roots:{provider:other}});
  expect(verifyResourceEvidence(evidence,before.snapshots,moved.snapshots).reason).toBe('resource-origin-changed');
  await fs.writeFile(join(provider,'spec.md'),'Changed.');const changed=await loadReferenceResources(root,resources,undefined,{roots:{provider}});
  expect(verifyResourceEvidence(evidence,before.snapshots,changed.snapshots).reason).toBe('resource-changed');
});
it('rejects links and respects exclusions, sensitivity and byte limits in external roots',async()=>{
  const alias=join(workspace,'alias');await fs.symlink(provider,alias,'junction');
  expect((await loadReferenceResources(root,resources,undefined,{roots:{provider:alias}})).report.state).toBe('incomplete');
  const excluded=await loadReferenceResources(root,{...resources,exclude:['spec.md']},undefined,{roots:{provider}});expect(excluded.report.resources[0]!.status).toBe('excluded');
  await fs.writeFile(join(provider,'spec.md'),'x'.repeat(65537));expect((await loadReferenceResources(root,resources,undefined,{roots:{provider}})).report.resources[0]!.status).toBe('file-size-limit');
  await fs.mkdir(join(provider,'linked'));await fs.symlink(root,join(provider,'linked','consumer'),'junction');
  expect((await loadReferenceResources(root,{resources:[{id:'spec',rootId:'provider',path:'linked/consumer/a.ts'}]},undefined,{roots:{provider}})).report.resources[0]!.status).toBe('linked');
});
it('ignores inapplicable external references without requiring grants or network',async()=>{
  const loaded=await loadReferenceResources(root,{resources:[{id:'spec',rootId:'provider',path:'spec.md',appliesTo:['other/**']}]},['a.ts']);
  expect(loaded.report.resources[0]!.status).toBe('not-applicable');expect(remote).not.toHaveBeenCalled();
});
it('requires an exact authorized origin and a hash pin for HTTPS snapshots',async()=>{
  const options:ConfigInput={resources:[{id:'remote',path:'spec.md',url:'https://docs.example.test/spec.md',expectedSha256:hash('Expected behavior.')}]};
  expect(configSchema.safeParse({resources:[{id:'x',path:'x',url:'https://docs.example.test/x'}]}).success).toBe(false);
  expect((await loadReferenceResources(root,options,undefined,{origins:['https://other.example.test']})).report.resources[0]!.status).toBe('access-denied');expect(remote).not.toHaveBeenCalled();
  remote.mockResolvedValue(Buffer.from('Expected behavior.'));
  const loaded=await loadReferenceResources(root,options,undefined,{origins:['https://docs.example.test']});
  expect(loaded.report.resources[0]).toMatchObject({status:'loaded',path:'@references/remote/spec.md',origin:{kind:'https',url:'https://docs.example.test/spec.md'}});
  remote.mockResolvedValue(Buffer.from('Changed.'));expect((await loadReferenceResources(root,options,undefined,{origins:['https://docs.example.test']})).report.resources[0]!.status).toBe('hash-mismatch');
});
it.each([['failure','remote-failed'],['binary','invalid-text'],['invalid-utf8','invalid-text'],['oversized','file-size-limit']] as const)('reports remote %s without accepting a snapshot',async(kind,status)=>{
  if(kind==='failure')remote.mockRejectedValue(Error('Private server error'));else remote.mockResolvedValue(kind==='binary'?Buffer.from([0]):kind==='invalid-utf8'?Buffer.from([255]):Buffer.alloc(65537,120));
  const result=await loadReferenceResources(root,{resources:[{id:'r',path:'spec.md',url:'https://docs.example.test/spec',expectedSha256:hash('fixture')}]},undefined,{origins:['https://docs.example.test']});
  expect(result.report.resources[0]!.status).toBe(status);expect(result.snapshots).toEqual([]);expect(JSON.stringify(result)).not.toContain('Private server error');
});
it.each(['http://docs.example.test/spec','https://user:pass@docs.example.test/spec','https://docs.example.test/spec?token=x','https://docs.example.test/spec#part'])('rejects unsafe reference URL %s',url=>{
  expect(configSchema.safeParse({resources:[{id:'x',path:'x',url,expectedSha256:hash('x')}]}).success).toBe(false);
});
it('uses external references in AI context and verifies virtual-path citations',async()=>{
  const report=await reviewWithAi(root,{execution:'mock',config:{...resources,ai:{models:{'low-cost':'fixture'}}},referenceAccess:{roots:{provider}}},{apiKey:'offline',transport:async request=>{
    expect(request.input[0]!.content).toContain('@references/spec/spec.md');expect(request.input[0]!.content).not.toContain(provider);
    return {status:200,body:JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({candidates:[{title:'Fixture',severity:'warning',explanation:'Fixture',suggestedAction:'Inspect',evidence:[{path:'a.ts',startLine:1,endLine:1,excerpt:'export const value=1;'},{path:'@references/spec/spec.md',startLine:1,endLine:1,excerpt:'Expected behavior.'}]}],referenceConflicts:[]})}]}]})};
  }});
  expect(report.ai!.candidates[0]!.evidenceVerification!.status).toBe('matched');expect(fetch).not.toHaveBeenCalled();
});
it('compares a consumer against another repository with semver and metadata conflict checks',async()=>{
  await fs.writeFile(join(provider,'api.json'),JSON.stringify({openapi:'3.1.0',info:{title:'API',version:'1.2.3'},paths:{'/users':{get:{}}}}));
  await fs.writeFile(join(root,'a.ts'),'fetch("https://api.example.test/users");');
  const config:ConfigInput={resources:[{id:'api',rootId:'provider',path:'api.json',kind:'openapi'}],contracts:[{id:'api',resourceId:'api',files:['a.ts'],baseUrl:'https://api.example.test',versionRange:'^1.0.0'}]};
  const [ok]=await auditContracts(root,config,undefined,{roots:{provider}});expect(ok!.state).toBe('checked');expect(ok!.calls[0]!.status).toBe('matched');expect(ok!.reference!.origin!.rootId).toBe('provider');
  const [mismatch]=await auditContracts(root,{...config,contracts:[{...config.contracts![0]!,versionRange:'^2.0.0'}]},undefined,{roots:{provider}});expect(mismatch!.state).toBe('version-mismatch');
  const [conflict]=await auditContracts(root,{...config,resources:[{...config.resources![0]!,version:'9.0.0'}]},undefined,{roots:{provider}});expect(conflict!.issues.join()).toContain('conflicts');
});
it('wires runtime CLI grants and keeps config authorization impossible',async()=>{
  await fs.writeFile(join(root,'shipcheck.config.json'),JSON.stringify(resources));
  expect((await runCli(['audit',root,'--json'])).exitCode).toBe(2);
  const allowed=await runCli(['audit',root,'--reference-root','provider='+provider,'--json']);expect(allowed.exitCode).toBe(0);expect(JSON.parse(allowed.stdout).references.resources[0].status).toBe('loaded');
  for(const args of [['--reference-root','bad'],['--reference-root','provider=x','--reference-root','provider=y'],['--allow-reference-origin','https://docs.example.test/path']])expect((await runCli(['audit',root,...args])).exitCode).toBe(2);
  expect(configSchema.safeParse({referenceAccess:{roots:{provider}}}).success).toBe(false);
});
