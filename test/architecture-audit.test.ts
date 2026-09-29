import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import * as fs from 'node:fs/promises';
import {join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {auditArchitecture} from '../src/architecture-audit.js';
import {extractDependencyImports} from '../src/dependency-imports.js';
import {configSchema,type ConfigInput} from '../src/config.js';
import {runCli} from '../src/cli-command.js';
let root:string;
beforeEach(async()=>{root=await fs.mkdtemp(join(tmpdir(),'shipcheck-architecture-'));vi.stubGlobal('fetch',vi.fn(()=>{throw Error('No network');}));});
afterEach(async()=>{vi.unstubAllGlobals();await fs.rm(root,{recursive:true,force:true});});
async function write(path:string,content:string){await fs.mkdir(dirname(join(root,path)),{recursive:true});await fs.writeFile(join(root,path),content);}
const config:ConfigInput={architecture:{files:['core/**'],boundaries:[{id:'layer',from:'core',to:'ui',reason:'Core must not import UI.'}]}};
it.each([
  ['core/a.ts',"import {view} from '../ui/view.js';",'ui/view.ts','export const view=1;'],
  ['core/a.js',"export * from '../ui/view.js';",'ui/view.js','export const view=1;'],
  ['core/a.mjs',"const view = await import('../ui/view.js');",'ui/view.js','export const view=1;'],
  ['core/a.cjs',"const view = require('../ui/view.js');",'ui/view.js','exports.view=1;'],
  ['core/a.py','from ..ui.view import render','ui/view.py','def render(): pass'],
  ['core/a.go','package core\nimport "app/ui"\n','ui/view.go','package ui'],
  ['core/A.java','package core;\nimport app.ui.View;\nclass A {}','ui/View.java','package app.ui; class View {}'],
  ['core/A.cs','using App.UI;\nclass A {}','ui/View.cs','namespace App.UI { class View {} }'],
])('automatically reports a forbidden import in %s',async(path,source,target,body)=>{
  await write(path,source);await write(target,body);
  const result=(await auditArchitecture(root,{architecture:{...config.architecture!,aliases:[{prefix:'app.ui.',target:'ui'},{prefix:'App.UI',target:'ui'},{prefix:'app/ui',target:'ui'}]}}))!;
  expect(result.state).toBe('checked');expect(result.boundaries[0]!.status).toBe('violation');
  expect(result.files[0]!.sha256).toMatch(/^[a-f0-9]{64}$/);expect(fetch).not.toHaveBeenCalled();
  expect(await fs.readFile(join(root,path),'utf8')).toBe(source);
});
it('preserves direction, prefix boundaries, exact excerpts and external declarations',async()=>{
  await write('core/a.ts','// import "../ui/x"\nconst text="import fake";\nimport "../ui-extra/x";\nimport "node:fs";');await write('ui-extra/x.ts','');
  const result=(await auditArchitecture(root,config))!;
  expect(result.state).toBe('checked');expect(result.boundaries[0]!.status).toBe('no-observed-violation');
  expect(result.dependencies).toMatchObject([{line:3,excerpt:'import "../ui-extra/x";',status:'resolved'},{line:4,status:'external'}]);
});
it.each([
  ['a.ts','import(name);','dynamic-or-unsupported-import'],
  ['a.js','function f(require) { require("../ui/view"); }','require-binding-or-alias-unresolved'],
  ['a.py','from . import view','relative-member-import-unresolved'],
  ['A.java','import app.ui.*; class A {}','static-wildcard-or-unsupported-import'],
  ['A.cs','using V = App.UI.View; class A {}','alias-static-global-or-unsupported-using'],
])('discloses unsupported dependency forms in %s',async(path,source,reason)=>{
  await write('core/'+path,source);
  const result=(await auditArchitecture(root,config))!;
  expect(result.state).toBe('partial');expect(result.dependencies[0]).toMatchObject({status:'unresolved',reason});
});
it('discloses missing, ambiguous, excluded and escaping relative targets',async()=>{
  await write('core/a.ts','import "../ui/view"; import "../../outside"; import "../secret/x";');
  await write('ui/view.ts','');await write('ui/view.js','');await write('secret/x.ts','');
  const result=(await auditArchitecture(root,{...config,exclude:['secret']}))!;
  expect(result.state).toBe('partial');expect(result.dependencies.map(e=>e.reason)).toEqual(['ambiguous-local-target','outside-repository','local-target-unavailable']);
});
it('keeps filename conventions precise and policies hashed',async()=>{
  await write('core/BadName.rs','fn main() {}');await write('core/good_name.rs','');
  const options:ConfigInput={architecture:{files:['core/**'],conventions:[{id:'names',within:'core',style:'snake_case',reason:'Use snake case.'}]}};
  const result=(await auditArchitecture(root,options))!;
  expect(result.state).toBe('checked');expect(result.conventions[0]!.evidence).toEqual(['core/BadName.rs']);
  expect(result.policySha256).not.toBe((await auditArchitecture(root,{architecture:{...options.architecture!,aliases:[{prefix:'x',target:'core'}]}}))!.policySha256);
});
it('restricts scoped sources but resolves against the full inventory',async()=>{
  await write('core/a.ts','import "../ui/view";');await write('core/b.ts','import unknown;');await write('ui/view.ts','');
  const result=(await auditArchitecture(root,config,['core/a.ts']))!;
  expect(result.state).toBe('checked');expect(result.files.map(f=>f.path)).toEqual(['core/a.ts']);expect(result.boundaries[0]!.evidence).toHaveLength(1);
  expect((await auditArchitecture(root,config,['core/deleted.ts']))!.state).toBe('partial');
});
it('reports unsupported languages, parse failures, empty selections and read limits',async()=>{
  expect((await auditArchitecture(root,config))!.state).toBe('partial');
  await write('core/a.rs','fn main() {}');await write('core/a.ts','const : =');await write('core/large.py',' '.repeat(65537));
  const result=(await auditArchitecture(root,config))!;
  expect(result.state).toBe('partial');expect(result.issues.join(' ')).toContain('unsupported-language');expect(result.issues.join(' ')).toContain('file-size-limit');
});
it('ignores comment/string pseudo imports across parsers',()=>{
  for(const [path,source] of [['a.py','# import fake\ns = "import fake"'],['a.go','package a\n// import "fake"'],['A.java','// import fake.X;\nclass A {}'],['A.cs','// using Fake;\nclass A {}']])
    expect(extractDependencyImports(source!,path!).imports).toEqual([]);
});
it('enforces policy validation',()=>{
  for(const architecture of [{files:['../**'],boundaries:config.architecture!.boundaries},{files:['**']},{...config.architecture,aliases:[{prefix:'x',target:'../outside'}]},
    {...config.architecture,conventions:[{id:'layer',within:'core',style:'snake_case',reason:'x'}]}])expect(configSchema.safeParse({architecture}).success).toBe(false);
});
it('discloses overlapping aliases, while explicit aliases resolve Python absolute and TS imports',async()=>{
  await write('core/a.py','import app.ui.view as view');await write('ui/view.py','');
  const options:ConfigInput={architecture:{...config.architecture!,aliases:[{prefix:'app.ui.',target:'ui'}]}};
  expect((await auditArchitecture(root,options))!.boundaries[0]!.status).toBe('violation');
  expect((await auditArchitecture(root,{architecture:{...options.architecture!,aliases:[...options.architecture!.aliases!,{prefix:'app.',target:'src'}]}}))!.dependencies[0]!.reason).toBe('ambiguous-alias');
});
it.each([['A.java','// 😀 café\nimport app.ui.View; class A {}','import app.ui.View;'],['A.cs','// 😀 café\nusing App.UI; class A {}','using App.UI;'],['a.go','// 😀 café\npackage a\nimport "app/ui"','"app/ui"']])('preserves Unicode source offsets in %s', (path,source,excerpt)=>{
  const result=extractDependencyImports(source,path);expect(result.issues).toEqual([]);expect(result.imports[0]!.excerpt).toBe(excerpt);
});
it('makes source and observation caps visible',async()=>{
  await Promise.all(Array.from({length:129},(_,i)=>write('core/f'+String(i).padStart(3,'0')+'.ts','import "node:fs";')));
  const result=(await auditArchitecture(root,config))!;expect(result.files).toHaveLength(128);expect(result.state).toBe('partial');expect(result.issues.join()).toContain('source-file-limit');
  const extraction=extractDependencyImports('import "node:fs";\n'.repeat(129),'a.ts');expect(extraction.imports).toHaveLength(128);expect(extraction.issues).toContain('import-count-limit');
});
it('discloses the aggregate import limit without dropping the report',async()=>{
  await Promise.all(Array.from({length:79},(_,i)=>write('core/f'+i+'.ts','import "node:fs";\n'.repeat(128))));
  const result=(await auditArchitecture(root,config))!;
  expect(result.dependencies).toHaveLength(10000);expect(result.state).toBe('partial');expect(result.issues.join()).toContain('total-import-count-limit');
});
it('accepts the exact per-file byte boundary and discloses aggregate read exhaustion',async()=>{
  const source='//'+ 'x'.repeat(65534);
  await write('core/a.ts',source);expect((await auditArchitecture(root,config))!.state).toBe('checked');
  await Promise.all(['b','c','d','e'].map(name=>write('core/'+name+'.ts',source)));
  const result=(await auditArchitecture(root,config))!;expect(result.state).toBe('partial');
  expect(result.files.find(file=>file.path==='core/e.ts')!.status).toBe('total-size-limit');
});
it.each(['snake_case','kebab-case','PascalCase'] as const)('documents exact basename handling for %s',async style=>{
  const names=['good_name','good-name','GoodName','order.test'];
  await Promise.all(names.map(name=>write('core/'+name+'.py','value=1')));
  const result=(await auditArchitecture(root,{architecture:{files:['core/**'],conventions:[{id:'names',within:'core',style,reason:'Naming policy'}]}}))!;
  expect(result.conventions[0]!.evidence).toHaveLength(3);expect(result.conventions[0]!.evidence).toContain('core/order.test.py');
});
it.each(['\u2028','\u2029'])('does not invent import citations for %j separators',separator=>{
  const result=extractDependencyImports('// comment'+separator+'import "./view";','a.ts');
  expect(result.imports).toEqual([]);expect(result.issues).toContain('unsupported-line-endings');
});
it('does not follow linked sources or excluded files',async()=>{
  await write('other/a.ts','import "../ui/view";');await fs.symlink(join(root,'other'),join(root,'core'),'junction');
  const result=(await auditArchitecture(root,config))!;expect(result.state).toBe('partial');expect(result.dependencies).toEqual([]);
  expect((await auditArchitecture(root,{...config,exclude:['core']}))!.dependencies).toEqual([]);
});
it('emits console, markdown and JSON policies with violation and partial exit precedence',async()=>{
  await write('shipcheck.config.json',JSON.stringify(config));await write('core/a.ts','import "../ui/view";');await write('ui/view.ts','');
  for(const format of [[],['--markdown'],['--json']]) {
    const result=await runCli(['audit',root,...format]);expect(result.exitCode).toBe(1);expect(result.stdout).toMatch(/violation/i);
  }
  await write('core/a.ts','import "../ui/view"; import(name);');
  const partial=await runCli(['audit',root,'--json']);expect(partial.exitCode).toBe(2);expect(partial.stderr).toContain('Architecture assessment is incomplete');
  expect(JSON.parse(partial.stdout).architecture.boundaries[0].status).toBe('violation');
  await write('core/a.ts','import "node:fs";');
  expect((await runCli(['audit',root])).exitCode).toBe(0);
});
