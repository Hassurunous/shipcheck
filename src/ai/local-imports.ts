import { posix } from 'node:path';

/** Conservative lexical hints, not a JS parser or general module resolver. */
export function localImports(content:string): string[] {
  const imports = new Set<string>();
  const pattern = /(?:^|\n)\s*(?:import|export)\s+(?:[^;\n]*?\s+from\s*)?["'](\.[^"'\r\n]+)["']/g;
  for (const match of content.matchAll(pattern)) imports.add(match[1]!);
  return [...imports].sort();
}
export function resolveLocalImport(from:string, specifier:string, inventory:ReadonlySet<string>):string | undefined {
  if (/[\\:\u0000-\u001f]/.test(specifier)) return undefined;
  const path=posix.normalize(posix.join(posix.dirname(from),specifier));
  if (path==='..' || path.startsWith('../') || posix.isAbsolute(path)) return undefined;
  const stem=path.replace(/\.(?:mjs|cjs|js|jsx)$/,'');
  const candidates=[path,...(stem!==path ? [stem+'.ts',stem+'.tsx',stem+'.mts',stem+'.cts'] : []),
    ...(!posix.extname(path)?['.ts','.tsx','.js','.jsx','.mts','.cts','/index.ts','/index.tsx','/index.js'].map(s=>path+s):[])];
  return candidates.find(candidate=>inventory.has(candidate));
}
