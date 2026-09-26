import { posix } from "node:path";
import { isExcluded, type Config } from "./config.js";
import type { Finding } from "./findings.js";
import type { RepositoryProfile } from "./repository-profile.js";

export function additionalFindings(profile: RepositoryProfile, config: Config): Finding[] {
  const findings: Finding[] = [];
  const excluded = [...profile.excluded, ...config.exclude];
  const files = new Set(profile.files.filter(f => !isExcluded(f.path, excluded)).map(f => f.path));
  const directories = new Set(profile.directories);
  const add = (ruleId: string, path: string, title: string, observation: string, action: string, key = "") => {
    findings.push({ id: `${ruleId}:${encodeURIComponent(path)}:${encodeURIComponent(key)}`,
      ruleId, severity: "warning", title, explanation: observation,
      evidence: [{ path, observation }], suggestedAction: action });
  };
  const lockManagers: Record<string, string> = {
    "package-lock.json": "npm", "npm-shrinkwrap.json": "npm", "yarn.lock": "Yarn",
    "pnpm-lock.yaml": "pnpm", "bun.lock": "Bun", "bun.lockb": "Bun",
  };
  for (const manifest of profile.manifests) {
    if (posix.basename(manifest.path) !== "package.json" || !files.has(manifest.path)) continue;
    const directory = posix.dirname(manifest.path);
    const locks = Object.keys(lockManagers).map(name => posix.join(directory, name)).filter(path => files.has(path)).sort();
    if (new Set(locks.map(path => lockManagers[posix.basename(path)])).size > 1) {
      add("package/conflicting-lockfiles", manifest.path, "Multiple package managers have lockfiles",
        `Lockfiles from different package managers exist in this package directory: ${locks.join(", ")}.`,
        "Choose the intended package manager, or suppress this rule if multiple lockfiles are intentional.");
      findings.at(-1)!.evidence.push(...locks.map(path => ({ path, observation: "Lockfile exists in the package directory." })));
    }
  }

  for (const reference of profile.packageReferences) {
    if (!files.has(reference.path)) continue;
    // Skip protocols, expansion, encoded paths, Windows paths and absolute/out-of-root references.
    if (!reference.target || /[:\\%$*?{}~]/.test(reference.target) || posix.isAbsolute(reference.target)) continue;
    const target = posix.normalize(posix.join(posix.dirname(reference.path), reference.target));
    if (target === ".." || target.startsWith("../") || target === ".") continue;
    if (target.split("/").some(part => part === ".git" || part === "node_modules")) continue;
    if (isExcluded(target, excluded) || files.has(target) || directories.has(target)) continue;
    if (profile.warnings.some(w => ["unreadable-directory", "symlink-skipped", "special-file-skipped"].includes(w.code)
      && (target === w.path || target.startsWith(`${w.path}/`)))) continue;
    if (reference.kind === "entry" && !reference.field.startsWith("bin") && !posix.extname(target)) continue;
    const ruleId = reference.kind === "dependency" ? "package/missing-local-dependency"
      : reference.kind === "script" ? "package/missing-script-target" : "package/missing-entry-point";
    add(ruleId, reference.path, "Declared local target was not found",
      `${reference.field} references ${reference.target}; no file or directory was found at ${target}.`,
      reference.kind === "entry" ? "Build the package first if this file is generated, or correct the declaration."
        : "Restore the local target or correct the manifest reference. If generated, build first or configure an override.",
      reference.field);
  }

  const incomplete = profile.warnings.some(w => ["unreadable-directory", "symlink-skipped", "special-file-skipped"].includes(w.code));
  if (!incomplete && !profile.readmes.some(path => files.has(path))) {
    add("repository/missing-readme", ".", "No README detected in inspected files",
      "No included filename matched the README conventions. Excluded paths were not checked.",
      "Add a README if repository documentation is required by your team.");
  }
  if (!incomplete && !profile.tests.some(path => files.has(path))) {
    add("repository/missing-tests", ".", "No test files detected in inspected files",
      "No included files matched Shipcheck's test filename conventions. This does not establish that tests are absent.",
      "Check the project's test conventions before deciding whether tests need to be added.");
  }
  const seen = new Set<string>();
  for (const marker of profile.markers) {
    if (marker.kind !== "FIXME" || !marker.path.startsWith("src/") || !/\.(?:[cm]?[jt]sx?|py|go|rs|java|cs|cpp|c)$/.test(marker.path)
      || !files.has(marker.path) || profile.tests.includes(marker.path)) continue;
    if (!/^\s*(?:\/\/|#|\/\*|\*)\s*FIXME\b/.test(marker.excerpt)) continue;
    const key = `${marker.path}:${marker.line}`;
    if (seen.has(key)) continue;
    seen.add(key);
    add("source/fixme", marker.path, "FIXME comment matches configured source policy",
      `Line ${marker.line} begins with a FIXME comment marker.`,
      "Review the comment and resolve it or document an intentional exception.", String(marker.line));
    findings.at(-1)!.evidence[0] = { path: marker.path, observation: "FIXME comment marker detected.", line: marker.line, excerpt: marker.excerpt };
  }
  return findings;
}
