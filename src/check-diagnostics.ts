import {createHash} from 'node:crypto';
import {isAbsolute,relative,resolve} from 'node:path';
import {z} from 'zod';

export const diagnosticSchema=z.object({
  id:z.string(),tool:z.enum(['eslint','ruff']),ruleId:z.string().nullable(),
  severity:z.enum(['error','warning','info']),message:z.string(),
  path:z.string().nullable(),line:z.number().int().positive().optional(),column:z.number().int().positive().optional(),
  origin:z.literal('external-tool'),
});
export type Diagnostic=z.infer<typeof diagnosticSchema>;
export type DiagnosticFormat='eslint-json'|'ruff-json';
const location=z.object({row:z.number().int().positive(),column:z.number().int().positive()});
const eslintSchema=z.array(z.object({filePath:z.string().min(1),messages:z.array(z.object({
  ruleId:z.string().nullable().optional(),severity:z.number().int().min(0).max(2),message:z.string().min(1),
  line:z.number().int().positive().optional(),column:z.number().int().positive().optional(),
})).max(10000)})).max(10000);
const ruffSchema=z.array(z.object({filename:z.string().nullable(),code:z.string().nullable(),message:z.string().min(1),
  location:location.nullable(),
})).max(10000);

function sourcePath(root:string,path:string|null):string|null {
  if(path===null)return null;
  if(!path || /[\u0000-\u001f]/.test(path))throw new Error('Invalid diagnostic path.');
  if(!isAbsolute(path) && /^[A-Za-z]:/.test(path))throw new Error('Unsupported absolute diagnostic path.');
  const normalized=relative(resolve(root),resolve(root,path.replace(/\\/g,'/')));
  if(!normalized || normalized==='..' || normalized.startsWith('../') || normalized.startsWith('..\\') || isAbsolute(normalized))
    throw new Error('Diagnostic path is outside the repository.');
  return normalized.replace(/\\/g,'/');
}
/** Normalize tool claims only; no source read, fixes, or citation verification. */
export function parseDiagnostics(format:DiagnosticFormat,stdout:string,root:string,checkId:string):Diagnostic[] {
  const parsed:unknown=JSON.parse(stdout);
  const candidates:Omit<Diagnostic,'id'>[]=format==='eslint-json'
    ? eslintSchema.parse(parsed).flatMap(file=>file.messages.filter(message=>message.severity!==0).map(message=>({
      tool:'eslint' as const,ruleId:message.ruleId ?? null,severity:message.severity===2?'error' as const:'warning' as const,
      message:message.message,path:sourcePath(root,file.filePath),
      ...(message.line?{line:message.line}:{}),...(message.column?{column:message.column}:{}),origin:'external-tool' as const,
    })))
    : ruffSchema.parse(parsed).map(message=>({tool:'ruff' as const,ruleId:message.code,severity:'error' as const,
      message:message.message,path:sourcePath(root,message.filename),
      ...(message.filename!==null && message.location?{line:message.location.row,column:message.location.column}:{}),origin:'external-tool' as const,
    }));
  const unique=new Map<string,Diagnostic>();
  for(const diagnostic of candidates) {
    const id=`check/${checkId}:${createHash('sha256').update(JSON.stringify(diagnostic)).digest('hex').slice(0,20)}`;
    unique.set(id,{id,...diagnostic});
  }
  return [...unique.values()].sort((a,b)=>a.id.localeCompare(b.id));
}

export function exceedsThreshold(diagnostics:Diagnostic[],threshold:'error'|'warning'|'info'|'never') {
  const rank={error:3,warning:2,info:1,never:4};
  return diagnostics.some(diagnostic=>rank[diagnostic.severity]>=rank[threshold]);
}
