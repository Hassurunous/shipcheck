import {expect,it} from 'vitest';
import {createHash} from 'node:crypto';
import {indexOpenApi} from '../src/openapi-contract.js';
import {resourceRecordSchema} from '../src/resource-contracts.js';
function snapshot(document:unknown) {
  const content=typeof document==='string'?document:JSON.stringify(document);
  return {content,record:resourceRecordSchema.parse({id:'api',path:'docs/api.json',kind:'openapi',status:'loaded',
    sha256:createHash('sha256').update(content).digest('hex'),bytes:Buffer.byteLength(content),lines:1})};
}
const base={openapi:'3.1.1',info:{title:'Example',version:'2026-09'}};
it('indexes direct operations with stable pointers and snapshot provenance',()=>{
  const input=snapshot({...base,paths:{'/users/{id}':{get:{operationId:'getUser'},parameters:[]},'/a~b':{post:{}}}});
  const result=indexOpenApi(input);
  expect(result).toMatchObject({status:'indexed',apiVersion:'2026-09',specificationVersion:'3.1.1',snapshotSha256:input.record.sha256,assessment:'not-compared'});
  expect(result.operations).toEqual([{method:'post',path:'/a~b',pointer:'/paths/~1a~0b/post'},
    {method:'get',path:'/users/{id}',pointer:'/paths/~1users~1{id}/get',operationId:'getUser'}]);
  expect(indexOpenApi(input)).toEqual(result);
});
it('discloses unresolved Path Items and preserves direct operations elsewhere',()=>{
  const result=indexOpenApi(snapshot({...base,paths:{'/external':{$ref:'https://example.invalid/api.json',get:{}},'/local':{get:{}}}}));
  expect(result.status).toBe('partial');expect(result.operations.map(op=>op.path)).toEqual(['/local']);expect(result.issues[0]!.reason).toContain('not resolved');
});
it('distinguishes unsupported versions and formats from invalid structure',()=>{
  for(const openapi of ['2.0','3.2.0','3.1.invalid'])expect(indexOpenApi(snapshot({...base,openapi,paths:{}})).status).toBe('unsupported');
  expect(indexOpenApi(snapshot('openapi: 3.1.1')).status).toBe('unsupported');
  for(const doc of [[],{}, {...base,info:{}},{...base,paths:[]}])expect(indexOpenApi(snapshot(doc)).status).toBe('invalid');
  expect(indexOpenApi(snapshot({...base,openapi:'3.0.4',paths:{}})).status).toBe('indexed');
});
it('reports malformed entries and duplicate identities without claiming a clean comparison',()=>{
  const result=indexOpenApi(snapshot({...base,paths:{bad:{get:{}},'/a':{get:{operationId:'same'},post:null},'/b':{get:{operationId:'same'},post:{operationId:2}}}}));
  expect(result.status).toBe('partial');expect(result.issues).toHaveLength(4);expect(result.operations).toHaveLength(2);expect(result.assessment).toBe('not-compared');
});
it('discloses webhook-only and partially covered documents',()=>{
  expect(indexOpenApi(snapshot({...base,webhooks:{}})).status).toBe('partial');
  expect(indexOpenApi(snapshot({...base,paths:{},webhooks:{}})).issues[0]!.pointer).toBe('/webhooks');
  expect(indexOpenApi(snapshot({...base,paths:{'x-extension':{}}})).operations).toEqual([]);
});
it('requires a loaded resource explicitly labeled OpenAPI',()=>{
  const input=snapshot({...base,paths:{}});input.record.status='hash-mismatch';expect(indexOpenApi(input).status).toBe('unavailable');
  input.record.status='loaded';input.record.kind='document';expect(indexOpenApi(input).status).toBe('unavailable');
});
