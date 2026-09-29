import {posix} from 'node:path';
import {configSchema,type ConfigInput} from './config.js';
import {loadReferenceResources} from './reference-resources.js';
import type {ReferenceAccess} from './reference-access.js';
import {versionIssue} from './version-policy.js';
import {resourceDefinitionSchema} from './resource-contracts.js';
import {indexSdkDeclarations,compareSdkCalls} from './sdk-syntax.js';
import type {SdkResult} from './sdk-contracts.js';

/** Read installed or explicitly mapped package metadata/declarations; never import SDK code. */
export async function auditSdkContracts(root:string,input:ConfigInput={},scope?:readonly string[],access:ReferenceAccess={}):Promise<SdkResult[]> {
  const config=configSchema.parse(input),results:SdkResult[]=[];
  for(const binding of config.sdkContracts) {
    const files=[...new Set(binding.files)].filter(path=>!scope || scope.includes(path));if(!files.length)continue;
    const result:SdkResult={id:binding.id,package:binding.package,state:'checked',scope:'direct-named-function-calls-only',issues:[],files:[],calls:[]};results.push(result);
    const packageRoot=binding.packageRoot ?? 'node_modules/'+binding.package;
    const rootOption=binding.rootId?{rootId:binding.rootId}:{};
    const manifestRefs=await loadReferenceResources(root,{exclude:config.exclude,resources:[{id:'sdk-manifest',path:posix.join(packageRoot,'package.json'),...rootOption}]},undefined,access);
    const manifest=manifestRefs.snapshots[0];
    result.provider={manifestPath:manifestRefs.report.resources[0]!.path,manifestSha256:manifestRefs.report.resources[0]!.sha256,...rootOption};
    const rootHash=manifestRefs.report.resources[0]!.origin?.rootSha256;
    if(rootHash)result.provider.rootSha256=rootHash;
    if(!manifest){result.state='unavailable';result.issues.push('Package manifest '+manifestRefs.report.resources[0]!.status);continue;}
    let metadata:{name?:unknown;version?:unknown;types?:unknown;typings?:unknown;exports?:unknown;typesVersions?:unknown};
    try {metadata=JSON.parse(manifest.content);if(!metadata || Array.isArray(metadata) || typeof metadata!=='object')throw Error();}
    catch{result.state='unavailable';result.issues.push('invalid-package-manifest');continue;}
    if(metadata.name!==binding.package || typeof metadata.version!=='string'){result.state='unavailable';result.issues.push('package-identity-or-version-unavailable');continue;}
    result.provider.version=metadata.version;
    const versionProblem=versionIssue(metadata.version,binding.expectedVersion,binding.versionRange);
    if(versionProblem){result.state='version-mismatch';result.issues.push(versionProblem);continue;}
    const declared=binding.declarationFile ?? metadata.types ?? metadata.typings;
    if(!binding.declarationFile && (metadata.exports!==undefined || metadata.typesVersions!==undefined)) {result.state='partial';result.issues.push('conditional-package-resolution: supply an explicit declarationFile mapping.');continue;}
    if(typeof declared!=='string' || !/\.d\.(?:ts|mts|cts)$/.test(declared) || !resourceDefinitionSchema.shape.path.safeParse(declared.replace(/^\.\//,'')).success) {
      result.state='unavailable';result.issues.push('declaration-entry-unavailable-or-unsafe');continue;
    }
    const declarationRefs=await loadReferenceResources(root,{exclude:config.exclude,resources:[{id:'sdk-declarations',path:posix.join(packageRoot,declared),kind:'source',...rootOption}]},undefined,access);
    const declaration=declarationRefs.snapshots[0];
    result.provider.declarationPath=declarationRefs.report.resources[0]!.path;result.provider.declarationSha256=declarationRefs.report.resources[0]!.sha256;
    if(!declaration){result.state='unavailable';result.issues.push('Declaration '+declarationRefs.report.resources[0]!.status);continue;}
    const index=indexSdkDeclarations(declaration.content);result.issues.push(...index.issues);
    const sources=await loadReferenceResources(root,{exclude:config.exclude,resources:files.map((path,i)=>({id:'sdk-source'+i,path,kind:'source'}))});
    for(const record of sources.report.resources) {
      result.files.push({path:record.path,sha256:record.sha256,status:record.status});
      if(record.status!=='loaded'){result.issues.push(record.path+': '+record.status);continue;}
      if(!/\.[cm]?[jt]s$|\.tsx$/.test(record.path)){result.issues.push(record.path+': unsupported-sdk-consumer-language');continue;}
      const source=sources.snapshots.find(s=>s.record.id===record.id)!;
      const compared=compareSdkCalls(source.content,record.path,binding.package,index);
      result.issues.push(...compared.issues.map(issue=>record.path+': '+issue));result.calls.push(...compared.calls.map(call=>({path:record.path,...call})));
    }
    if(result.issues.length || result.calls.some(call=>call.status==='unresolved'))result.state='partial';
  }
  return results;
}
