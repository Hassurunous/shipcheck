import type { RepositoryProfile } from "./repository-profile.js";

/** Only recognize literal targets, never interpret a shell command. */
export function packageReferences(path: string, content: string): RepositoryProfile["packageReferences"] {
  let value: unknown;
  try { value = JSON.parse(content); } catch { return []; }
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  const data = value as Record<string, unknown>;
  const references: RepositoryProfile["packageReferences"] = [];
  for (const field of ["dependencies", "devDependencies", "optionalDependencies"]) {
    const entries = data[field];
    if (!entries || typeof entries !== "object" || Array.isArray(entries)) continue;
    for (const [name, target] of Object.entries(entries)) {
      if (typeof target === "string" && target.startsWith("file:") && target.length > 5) {
        references.push({ path, field: `${field}.${name}`, target: target.slice(5), kind: "dependency" });
      }
    }
  }
  const scripts = data.scripts;
  if (scripts && typeof scripts === "object" && !Array.isArray(scripts)) {
    for (const [name, command] of Object.entries(scripts)) {
      if (typeof command !== "string") continue;
      const match = /^(?:node|tsx)\s+([a-zA-Z0-9_./-]+\.(?:[cm]?js|[cm]?ts))\s*$/.exec(command);
      if (match) references.push({ path, field: `scripts.${name}`, target: match[1]!, kind: "script" });
    }
  }
  for (const field of ["main", "module", "types", "typings"]) {
    if (typeof data[field] === "string") references.push({ path, field, target: data[field], kind: "entry" });
  }
  if (typeof data.bin === "string") references.push({ path, field: "bin", target: data.bin, kind: "entry" });
  else if (data.bin && typeof data.bin === "object" && !Array.isArray(data.bin)) {
    for (const [name, target] of Object.entries(data.bin)) {
      if (typeof target === "string") references.push({ path, field: `bin.${name}`, target, kind: "entry" });
    }
  }
  return references;
}
