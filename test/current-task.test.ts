import {beforeEach,afterEach,expect,it,vi} from 'vitest';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {runWorkflow} from '../src/workflows.js';
import {runCli} from '../src/cli-command.js';
import {configSchema} from '../src/config.js';
import {describeCurrentTask} from '../src/task-file.js';
import {checkSchema} from '../src/checks.js';
let root:string;
const task={id:'TASK1',title:'Add authorization',files:['a.ts'],requirements:[{id:'AUTH1',text:'Reject unauthorized requests.'}],nonGoals:['Change storage']};
beforeEach(async()=>{root=await mkdtemp(join(tmpdir(),'shipcheck-current-'));vi.stubGlobal('fetch',vi.fn(()=>{throw Error('No network');}));await writeFile(join(root,'a.ts'),'export const a = 1;');});
afterEach(async()=>{vi.restoreAllMocks();vi.unstubAllGlobals();await rm(root,{recursive:true,force:true});});
it('runs the no-file CLI task and preserves source and configuration',async()=>{
  const config=JSON.stringify({currentTask:task});await writeFile(join(root,'shipcheck.config.json'),config);
  vi.spyOn(process,'cwd').mockReturnValue(root);
  const result=await runCli(['task','--json']);expect(result.exitCode).toBe(0);
  expect(JSON.parse(result.stdout)).toMatchObject({currentTask:{id:'TASK1',assessment:'not-assessed',requirements:[{id:'AUTH1',status:'insufficient-evidence'}]},workflow:{scope:['a.ts']}});
  expect(await readFile(join(root,'shipcheck.config.json'),'utf8')).toBe(config);expect(await readFile(join(root,'a.ts'),'utf8')).toBe('export const a = 1;');expect(fetch).not.toHaveBeenCalled();
});
it('fails clearly for missing tasks and unavailable selected paths',async()=>{
  await expect(runWorkflow(root,'task',undefined,{currentTask:true})).rejects.toThrow('No currentTask');
  await writeFile(join(root,'shipcheck.config.json'),JSON.stringify({currentTask:{...task,files:['missing.ts']}}));
  await expect(runWorkflow(root,'task',undefined,{currentTask:true})).rejects.toThrow('missing');
});
it('keeps ordinary audits separate and shows unassessed criteria with mock AI',async()=>{
  await writeFile(join(root,'shipcheck.config.json'),JSON.stringify({currentTask:task}));
  expect((await runWorkflow(root,'audit')).currentTask).toBeUndefined();
  const result=await runWorkflow(root,'task',{execution:'mock'},{currentTask:true});
  expect(result.currentTask?.assessment).toBe('not-assessed');expect(fetch).not.toHaveBeenCalled();
});
it('validates bounded inline tasks and changes identity when expectations change',()=>{
  expect(configSchema.safeParse({currentTask:{...task,files:['../a.ts']}}).success).toBe(false);
  expect(configSchema.safeParse({currentTask:{...task,requirements:[...task.requirements,...task.requirements]}}).success).toBe(false);
  expect(describeCurrentTask(task).sha256).not.toBe(describeCurrentTask({...task,nonGoals:[]}).sha256);
});
it('rejects recognized fix flags but allows inspection arguments',()=>{
  for(const arg of ['--fix','--fix=true','--unsafe-fixes','--write'])expect(checkSchema.safeParse({id:'lint',command:'tool',args:[arg]}).success).toBe(false);
  expect(checkSchema.safeParse({id:'lint',command:'tool',args:['--check']}).success).toBe(true);
});
