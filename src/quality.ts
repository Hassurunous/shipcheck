import {lstat} from 'node:fs/promises';
import {join} from 'node:path';
import {checkSchema,type CheckResult} from './checks.js';
import type {Config} from './config.js';
import type {QualityReport} from './quality-contracts.js';

/** Inspect fixed local paths only. Do not resolve ancestors, PATH, or execute probes. */
async function localFile(root:string,path:string):Promise<boolean> {
  let current=root;
  const parts=path.split('/');
  try {
    for(let i=0;i<parts.length;i++) {
      current=join(current,parts[i]!);
      const stat=await lstat(current);
      if(stat.isSymbolicLink() || (i===parts.length-1?!stat.isFile():!stat.isDirectory()))return false;
    }
    return true;
  } catch {return false;}
}

export async function planQuality(root:string,config:Config,languages:readonly string[],authorized:boolean) {
  const checks=[...config.checks];
  const unavailable:CheckResult[]=[];
  if(!config.quality)return {checks,unavailable};
  const {presets,bindings}=config.quality;
  const report:QualityReport={presets,tools:[],gaps:[],limitations:[
    'Discovery checks fixed project-local file paths, not tool versions, configuration validity or successful execution.',
    'External tools use their own configuration and ignore policy; exact checked files remain unknown.',
    'Presets do not install tools or authorize execution. Trusted tool code/configuration runs with user permissions.',
    'AI is separately opt-in; lint/type checks do not establish contextual correctness, security or race freedom.',
  ]};
  const specs=[
    {slot:'eslint' as const,purpose:'lint' as const,enabled:presets.some(p=>p==='javascript' || p==='typescript'),languages:['JavaScript','TypeScript'],
      path:'node_modules/eslint/bin/eslint.js',node:true,args:['.','--format','json'],format:'eslint-json' as const},
    {slot:'typescript' as const,purpose:'typecheck' as const,enabled:presets.includes('typescript'),languages:['TypeScript'],
      path:'node_modules/typescript/bin/tsc',node:true,args:['--project','tsconfig.json','--noEmit','--incremental','false','--pretty','false'],format:'text' as const},
    {slot:'ruff' as const,purpose:'lint' as const,enabled:presets.includes('python'),languages:['Python'],
      path:process.platform==='win32'?'.venv/Scripts/ruff.exe':'.venv/bin/ruff',node:false,args:['check','.','--no-fix','--no-fix-only','--no-cache','--output-format','json'],format:'ruff-json' as const},
  ];
  for(const spec of specs.filter(s=>s.enabled)) {
    const binding=bindings[spec.slot],checkId=typeof binding==='string'?binding:'quality-'+spec.slot;
    const base={slot:spec.slot,checkId,purpose:spec.purpose,source:typeof binding==='string'?'configured' as const:'project-local' as const};
    // Explicit check bindings keep their own language gates and authorization behavior.
    if(binding===false) {
      report.tools.push({...base,status:'disabled',reason:'Preset tool explicitly disabled.'});
      report.gaps.push(spec.slot+' is disabled.');continue;
    }
    if(typeof binding==='string') {
      // Do not duplicate arbitrary configured arguments: they may contain credentials.
      report.tools.push({...base,status:'ready',reason:'Bound to an explicit check; availability and scope are determined when it runs.'});continue;
    }
    if(!spec.languages.some(language=>languages.includes(language))) {
      report.tools.push({...base,status:'not-applicable',reason:'No matching language in the inspected inventory.'});continue;
    }
    const exists=await localFile(root,spec.path);
    const project=spec.slot!=='typescript' || await localFile(root,'tsconfig.json');
    if(!exists || !project) {
      const reason=!exists?'Project-local tool unavailable at '+spec.path+'. Install it yourself or bind an existing check.':'TypeScript preset requires a regular root tsconfig.json; bind a custom check for other layouts.';
      report.tools.push({...base,status:'unavailable',reason});report.gaps.push(reason);
      unavailable.push({id:checkId,purpose:spec.purpose,status:authorized?'error':'skipped',exitCode:null,output:'',scope:'whole-repository',reason:authorized?reason:'Requires --run-checks authorization. '+reason});continue;
    }
    const command=spec.node?process.execPath:join(root,spec.path);
    const args=spec.node?[join(root,spec.path),...spec.args]:spec.args;
    checks.push(checkSchema.parse({id:checkId,purpose:spec.purpose,command,args,format:spec.format,failureExitCodes:spec.slot==='typescript'?[1,2]:[1]}));
    report.tools.push({...base,status:'ready',reason:'Project-local entry point found; execution has not yet been established.',command,args});
  }
  if(!config.checks.some(c=>c.purpose==='test'))report.gaps.push('No check is explicitly labeled purpose: test. Presets do not guess or execute test scripts automatically.');
  if(presets.includes('python'))report.gaps.push('Ruff does not typecheck Python. Verify that a separate explicitly configured check provides any required Python typechecking.');
  return {checks,unavailable,report};
}
