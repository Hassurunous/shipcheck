import {createHash} from 'node:crypto';
import {posix} from 'node:path';
import {configSchema,matchesPattern,isExcluded,type ConfigInput} from './config.js';
import {inspectRepository} from './inspect-repository.js';
import {loadReferenceResources} from './reference-resources.js';
import {assessIntentPolicy} from './intent-policy.js';
import {dependencyLanguage,extractDependencyImports,type ImportObservation} from './dependency-imports.js';
import type {ArchitectureResult} from './architecture-contracts.js';
const within=(p:string,prefix:string)=>p===prefix || p.startsWith(prefix+'/');

export async function auditArchitecture(root:string,input:ConfigInput={},scope?:readonly string[]):Promise<ArchitectureResult|undefined> {
  const config=configSchema.parse(input),policy=config.architecture;if(!policy)return;
  const profile=await inspectRepository(root,{exclude:config.exclude});
  const files=new Set(profile.files.map(f=>f.path)),directories=new Set(profile.directories);
  const selected=[...new Set([...files,...(scope ?? []),...policy.files.filter(p=>!p.includes('*'))])]
    .filter(p=>(!scope || scope.includes(p)) && policy.files.some(pattern=>matchesPattern(p,pattern)) && !isExcluded(p,config.exclude)).sort();
  const result:ArchitectureResult={state:'checked',coverage:'configured-import-declarations-only',
    policySha256:createHash('sha256').update(JSON.stringify(policy)).digest('hex'),files:[],dependencies:[],boundaries:[],conventions:[],issues:[]};
  if(!selected.length)result.issues.push('No source paths selected; no architecture assessment performed.');
  for(const warning of profile.warnings)if(warning.code==='unreadable-directory' || warning.code==='symlink-skipped')
    result.issues.push(warning.path+': '+warning.code+'; inventory may be incomplete.');
  if(selected.length>128)result.issues.push('source-file-limit: '+selected.length+' selected; first 128 assessed.');
  const resolveImport=(from:string,observation:ImportObservation):ArchitectureResult['dependencies'][number]=>{
    const edge={from,line:observation.line,excerpt:observation.excerpt,...(observation.specifier===undefined?{}:{specifier:observation.specifier})};
    const unresolved=(reason:string)=>({...edge,status:'unresolved' as const,reason});
    const spec=observation.specifier,language=dependencyLanguage(from);
    if(observation.reason || !spec)return unresolved(observation.reason ?? 'dynamic-or-unsupported-import');
    if(spec.startsWith('/'))return unresolved('absolute-module-specifier');
    if(/[\\\u0000-\u0020:#?%]/.test(spec) && !(language==='javascript' && /^node:[\w/]+$/.test(spec)))return unresolved('unsupported-module-specifier');
    let target:string|undefined;
    if(language==='javascript' && spec.startsWith('.'))target=posix.join(posix.dirname(from),spec);
    else if(language==='python' && spec.startsWith('.')) {
      const dots=spec.match(/^\.+/)![0].length;
      target=posix.join(posix.dirname(from),...Array<string>(dots-1).fill('..'),spec.slice(dots).replace(/\./g,'/'));
    } else {
      const aliases=policy.aliases.filter(a=>spec===a.prefix || /[/.]$/.test(a.prefix) && spec.startsWith(a.prefix));
      if(aliases.length>1)return unresolved('ambiguous-alias');
      if(aliases.length) {
        const alias=aliases[0]!,suffix=spec.slice(alias.prefix.length);
        target=posix.join(alias.target,['python','java','csharp'].includes(language!)?suffix.replace(/\./g,'/'):suffix);
      } else return {...edge,status:'external',reason:'Unmapped non-relative import; outside configured local graph.'};
    }
    if(target==='.' || target==='..' || target.startsWith('../') || posix.isAbsolute(target))return unresolved('outside-repository');
    const candidates=language==='javascript'?[target,...['.ts','.tsx','.js','.jsx','.mts','.cts','.mjs','.cjs'].flatMap(ext=>[target+ext,target+'/index'+ext]),...(/\.[cm]?js$/.test(target)?[target.replace(/js$/,'ts')]:[])]:
      language==='python'?[target+'.py',target+'/__init__.py']:language==='java'?[target+'.java']:[target];
    const matches=[...new Set(candidates)].filter(p=>!isExcluded(p,config.exclude) && (language==='go' || language==='csharp'?directories.has(p):files.has(p)));
    if(matches.length!==1)return unresolved(matches.length?'ambiguous-local-target':'local-target-unavailable');
    return {...edge,status:'resolved',to:matches[0]!,reason:language==='csharp'?'Mapped namespace declaration; actual type use is not assessed.':'Resolved configured local import.'};
  };
  for(let offset=0;offset<Math.min(selected.length,128);offset+=32) {
    const loaded=await loadReferenceResources(root,{exclude:config.exclude,resources:selected.slice(offset,Math.min(offset+32,128)).map((path,i)=>({id:'architecture'+i,path,kind:'source'}))});
    for(const record of loaded.report.resources) {
      const file={path:record.path,sha256:record.sha256,status:record.status as string};result.files.push(file);
      if(record.status!=='loaded'){result.issues.push(record.path+': '+record.status);continue;}
      if(!policy.boundaries.length)continue;
      const source=loaded.snapshots.find(s=>s.record.id===record.id)!;
      const extracted=extractDependencyImports(source.content,record.path);
      if(extracted.issues.length)file.status='partial';
      result.issues.push(...extracted.issues.map(issue=>record.path+': '+issue));
      const remaining=10000-result.dependencies.length;
      if(extracted.imports.length>remaining)result.issues.push(record.path+': total-import-count-limit');
      result.dependencies.push(...extracted.imports.slice(0,remaining).map(o=>resolveImport(record.path,o)));
    }
  }
  const edges=result.dependencies.filter(e=>e.status==='resolved').map(e=>({from:e.from,to:e.to!,line:e.line,excerpt:e.excerpt}));
  result.boundaries=assessIntentPolicy({boundaries:policy.boundaries},edges).boundaries.map(b=>({...b,status:b.evidence.length?'violation':'no-observed-violation'}));
  const styles={'snake_case':/^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/,'kebab-case':/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/,'PascalCase':/^[A-Z][a-zA-Z0-9]*$/};
  result.conventions=policy.conventions.map(rule=>{
    const evidence=result.files.filter(f=>f.sha256!==null && within(f.path,rule.within) && !styles[rule.style].test(posix.basename(f.path,posix.extname(f.path)))).map(f=>f.path);
    return {...rule,status:evidence.length?'violation':'no-observed-violation',evidence};
  });
  if(result.issues.length || result.dependencies.some(d=>d.status==='unresolved'))result.state='partial';
  return result;
}
