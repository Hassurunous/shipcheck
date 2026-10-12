import {createHash} from 'node:crypto';
import type {Report} from '../findings.js';
import {sensitiveContent} from '../sensitive-content.js';

export type AnalysisResults = Pick<Report,'checks'|'contracts'|'sdkContracts'|'architecture'|'quality'>;
export type AnalysisContext = {scope:'captured-analysis-results'; freshness:'not-revalidated';
  records:{stage:string; kind:string; data:unknown}[]; omittedRecords:number; filtered:boolean};

/** No commands, environment, or arbitrary report fields are forwarded. Tool text is untrusted. */
export function collectAnalysisContext(report:Pick<Report,'findings'|'inspectionWarnings'> & AnalysisResults,
  maxBytes:number, secrets:readonly string[]=[]):AnalysisContext {
  const context:AnalysisContext={scope:'captured-analysis-results',freshness:'not-revalidated',records:[],omittedRecords:0,filtered:false};
  function clean(value:unknown):unknown {
    if(typeof value==='string') {
      if(sensitiveContent.test(value) || secrets.some(secret=>secret && value.includes(secret))) {
        context.filtered=true;return '[sensitive text withheld]';
      }
      if(value.length>1200){context.filtered=true;return value.slice(0,1200)+' [truncated]';}
      return value;
    }
    if(Array.isArray(value)) {
      if(value.length>20)context.filtered=true;
      return value.slice(0,20).map(clean);
    }
    if(value && typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,clean(item)]));
    return value;
  }
  function add(stage:string,kind:string,data:unknown) {
    const record={stage,kind,data:clean(data)};
    context.records.push(record);
    // Reserve room for omission counts changing as the remaining records are visited.
    if(Buffer.byteLength(JSON.stringify(context))+32>maxBytes){context.records.pop();context.omittedRecords++;}
  }
  // Statuses take priority over diagnostics and excerpts. Absence never implies success.
  for(const check of report.checks ?? [])add('checks','execution',{
    id:check.id,purpose:check.purpose,status:check.status,exitCode:check.exitCode,reason:check.reason,
    scope:check.scope,fileCoverage:'unknown',diagnosticCount:check.diagnostics?.length ?? null});
  for(const stage of ['contracts','sdkContracts'] as const)for(const result of report[stage] ?? [])
    add(stage,'status',{id:result.id,state:result.state,scope:result.scope,issues:result.issues});
  if(report.architecture)add('architecture','status',{state:report.architecture.state,
    coverage:report.architecture.coverage,policySha256:report.architecture.policySha256,issues:report.architecture.issues});
  for(const warning of report.inspectionWarnings)add('inspection','warning',warning);
  for(const finding of report.findings)add('deterministic','finding',finding);
  for(const check of report.checks ?? []) {
    for(const diagnostic of check.diagnostics ?? [])add('checks','diagnostic',{checkId:check.id,...diagnostic});
    // Structured stdout duplicates diagnostics; text checks need their bounded execution output.
    if(!check.diagnostics && check.output)add('checks','output',{checkId:check.id,text:check.output});
    if(check.diagnostics && check.stderr)add('checks','stderr',{checkId:check.id,text:check.stderr});
  }
  for(const stage of ['contracts','sdkContracts'] as const)for(const result of report[stage] ?? []) {
    for(const file of result.files)add(stage,'file',{id:result.id,...file});
    for(const call of result.calls)add(stage,'call',{id:result.id,...call});
  }
  if(report.architecture) {
    for(const boundary of report.architecture.boundaries)add('architecture','boundary',boundary);
    for(const convention of report.architecture.conventions)add('architecture','convention',convention);
    for(const file of report.architecture.files)add('architecture','file',file);
  }
  if(report.quality) {
    for(const {command:_command,args:_args,...tool} of report.quality.tools)add('quality','tool',tool);
    add('quality','limits',{gaps:report.quality.gaps,limitations:report.quality.limitations});
  }
  return context;
}

export function analysisMetadata(context:AnalysisContext) {
  const serialized=JSON.stringify(context);
  return {bytes:Buffer.byteLength(serialized),sha256:createHash('sha256').update(serialized).digest('hex'),
    records:context.records.length,omittedRecords:context.omittedRecords,filtered:context.filtered,
    freshness:context.freshness};
}

/** Reserve evidence before selecting source so batching and individual reviews agree. */
export function planAnalysisContext(report:Pick<Report,'findings'|'inspectionWarnings'> & AnalysisResults,
  maxContextBytes:number,credentialEnv:string,environment:NodeJS.ProcessEnv) {
  const secrets=Object.entries(environment).filter(([name,value])=>value &&
    (name.toUpperCase()===credentialEnv.toUpperCase() || /KEY|TOKEN|SECRET|PASSWORD/i.test(name))).map(([,value])=>value!);
  const limit=Math.min(8192,Math.floor(maxContextBytes/4));
  const context=collectAnalysisContext(report,limit,secrets);
  const metadata=analysisMetadata(context);
  const included=metadata.bytes+32<=limit;
  return {context:included?context:undefined,bytes:included?metadata.bytes:0,
    metadata:included?metadata:{...metadata,bytes:0,records:0,omittedRecords:metadata.omittedRecords+metadata.records},
    limited:metadata.omittedRecords>0 || metadata.filtered || !included};
}
