import fs from 'node:fs/promises';
import { join, posix, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { isExcluded } from '../config.js';
import { validateRoot } from '../filesystem-policy.js';
import type { RepositoryProfile } from '../repository-profile.js';
import type { AiSettings, AiResult } from './contracts.js';
import { localImports, resolveLocalImport } from './local-imports.js';

export type SourceFile = {path: string; content: string};
export type AiContext = {files: SourceFile[]; preview: AiResult['preview']};
const extensions = new Set(['.ts','.tsx','.mts','.cts','.js','.jsx','.mjs','.cjs','.py','.go','.rs','.java','.cs','.c','.cpp','.h','.rb','.php','.swift']);
const deniedNames = /(?:^|[._-])(?:secrets?|credentials?|tokens?|passwords?|private|keys?)(?:[._-]|$)/i;
const looksSensitive = /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----|\bsk-[A-Za-z0-9_-]{16,}|\bAKIA[A-Z0-9]{16}\b|(?:api[_-]?key|password|secret|token)\s*[:=]\s*["'][^"'\r\n]{8,}["']/i;

function allowed(path: string) {
  const parts = path.split('/');
  return parts.every(p => p && p !== '..' && !p.startsWith('.') && !deniedNames.test(p)
    && !['node_modules','dist','build','coverage','vendor'].includes(p.toLowerCase()))
    && !/[:\\\u0000-\u001f]/.test(path) && extensions.has(posix.extname(path).toLowerCase());
}

async function readSource(root: string, path: string, limit: number, excluded: string[]): Promise<string> {
  let current = root;
  for (const part of path.split('/')) {
    current = join(current, part);
    const stat = await fs.lstat(current);
    if (stat.isSymbolicLink()) throw new Error('symlink');
    const actual = relative(root, await fs.realpath(current)).split('\\').join('/');
    if (actual.startsWith('../') || isExcluded(actual, excluded)) throw new Error('excluded');
  }
  const stat = await fs.lstat(current);
  if (!stat.isFile()) throw new Error('non-regular');
  if (stat.size > limit) throw new Error('file-size-limit');
  const handle = await fs.open(current, 'r');
  try {
    if (!(await handle.stat()).isFile()) throw new Error('non-regular');
    const buffer = Buffer.alloc(limit + 1);
    let length = 0;
    while (length < buffer.length) {
      const read = await handle.read(buffer, length, buffer.length - length, null);
      if (!read.bytesRead) break;
      length += read.bytesRead;
    }
    if (length > limit) throw new Error('file-size-limit');
    const bytes = buffer.subarray(0,length);
    if (bytes.includes(0)) throw new Error('non-text');
    return new TextDecoder('utf-8',{fatal:true}).decode(bytes);
  } finally { await handle.close(); }
}

/** Only selected source is eligible for a request. Full profiles/marker excerpts are never sent. */
export async function collectContext(profile: RepositoryProfile, settings: AiSettings, requestedPaths?:readonly string[]): Promise<AiContext> {
  const root = await fs.realpath(await validateRoot(profile.root));
  const files: SourceFile[] = [];
  const preview: AiResult['preview'] = {files:[], skipped:[], serializedBytes:2, limited:false};
  const inventory = new Set(profile.files.map(f=>f.path));
  // Preserve explicit batch order: re-sorting can let supporting imports displace
  // the still-unreviewed file that seeded a whole-repository batch.
  const paths = requestedPaths ? [...requestedPaths] : [...inventory].sort((a,b)=> {
    const rank = (p: string) => p.startsWith('src/') ? 0 : /^(?:test|tests)\//.test(p) ? 1 : 2;
    return rank(a)-rank(b) || (a<b ? -1 : a>b ? 1 : 0);
  });
  const requested = new Set(paths);
  const visited = new Set<string>();
  const dependencies: NonNullable<AiResult['preview']['dependencies']> = [];
  for (const path of paths) {
    if (visited.has(path)) continue;
    visited.add(path);
    let reason: string | undefined;
    if (!inventory.has(path)) reason = 'not-in-inventory';
    else if (!allowed(path) || isExcluded(path, profile.excluded)) reason = 'excluded-or-not-source';
    else if (files.length >= settings.maxFiles) { reason = 'file-count-limit'; preview.limited = true; }
    if (reason) { preview.skipped.push({path, reason}); continue; }
    let content: string;
    try { content = await readSource(root,path,settings.maxFileBytes,profile.excluded); }
    catch (error) {
      const known = ['symlink','excluded','non-regular','file-size-limit','non-text'];
      const message = error instanceof Error ? error.message : '';
      reason = known.includes(message) ? message : 'unreadable-or-invalid-utf8';
      preview.skipped.push({path, reason}); preview.limited = true; continue;
    }
    if (looksSensitive.test(content)) { preview.skipped.push({path, reason:'sensitive-content'}); preview.limited = true; continue; }
    if (!content.trim()) { preview.skipped.push({path, reason:'empty'}); continue; }
    const next = {path,content};
    const size = Buffer.byteLength(JSON.stringify([...files,next]),'utf8');
    if (size > settings.maxContextBytes) { preview.skipped.push({path,reason:'context-size-limit'}); preview.limited = true; continue; }
    files.push(next);
    preview.serializedBytes = size;
    preview.files.push({path, bytes:Buffer.byteLength(content), lines:content.split(/\r\n|\n|\r/).length,
      sha256:createHash('sha256').update(content).digest('hex')});
    const related:string[]=[];
    for (const specifier of localImports(content)) {
      const dependency=resolveLocalImport(path,specifier,inventory);
      dependencies.push({from:path,specifier,path:dependency ?? null,status:dependency?'omitted':'unresolved'});
      if(dependency && !visited.has(dependency)) related.push(dependency);
    }
    // Visit local dependencies immediately after their importer. Reads still use
    // the same exclusions, credential checks and shared file/context budgets.
    paths.splice(paths.indexOf(path)+1,0,...related);
  }
  const included=new Set(files.map(file=>file.path));
  for(const dependency of dependencies) if(dependency.path && included.has(dependency.path)) dependency.status='included';
  preview.requestedPaths=[...requested];
  preview.supportingPaths=files.filter(file=>!requested.has(file.path)).map(file=>file.path);
  preview.dependencies=dependencies;
  if(dependencies.some(dependency=>dependency.status!=='included')) preview.limited=true;
  return {files,preview};
}
