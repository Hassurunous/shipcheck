import fs from "node:fs/promises";
import { join } from "node:path";
import { MAX_FILE_BYTES, validateRoot } from "./filesystem-policy.js";
import { referenceExistence } from "./reference-existence.js";
import { classifyFile } from "./classify.js";
import { inspectPackage } from "./inspect-package.js";
import { packageReferences } from "./package-references.js";
import { configSchema, isExcluded } from "./config.js";
import { repositoryProfileSchema, type RepositoryProfile } from "./repository-profile.js";

export { MAX_FILE_BYTES } from "./filesystem-policy.js";
const ignoredNames = new Set([".git", "node_modules"]);
const compare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;

/** Read local repository facts. Never executes scripts or writes to the target. */
export async function inspectRepository(target = ".", options: { exclude?: string[] } = {}): Promise<RepositoryProfile> {
  const { exclude } = configSchema.parse({ exclude: options.exclude ?? [] });
  const root = await validateRoot(target);
  const profile: RepositoryProfile = {
    root, directories: [], excluded: exclude, packageReferences: [], files: [], languages: {}, manifests: [], readmes: [], tests: [],
    packageScripts: [], packageIssues: [], markers: [], warnings: [],
  };
  const warn = (path: string, code: RepositoryProfile["warnings"][number]["code"], message: string) => {
    profile.warnings.push({ path, code, message });
  };

  async function inspectFile(path: string): Promise<void> {
    const facts = classifyFile(path);
    profile.files.push({ path, language: facts.language });
    if (facts.language) profile.languages[facts.language] = (profile.languages[facts.language] ?? 0) + 1;
    if (facts.ecosystem) profile.manifests.push({ path, ecosystem: facts.ecosystem });
    if (facts.isReadme) profile.readmes.push(path);
    if (facts.isTest) profile.tests.push(path);

    let bytes: Buffer;
    try {
      const handle = await fs.open(join(root, path), "r");
      try {
        const stat = await handle.stat();
        if (!stat.isFile()) {
          warn(path, "special-file-skipped", "Entry is no longer a regular file.");
          return;
        }
        if (stat.size > MAX_FILE_BYTES) {
          warn(path, "file-too-large", `Content exceeds the ${MAX_FILE_BYTES}-byte read limit.`);
          return;
        }
        // Read at most limit + 1 even if a file grows after stat().
        const buffer = Buffer.alloc(MAX_FILE_BYTES + 1);
        let length = 0;
        while (length < buffer.length) {
          const { bytesRead } = await handle.read(buffer, length, buffer.length - length, null);
          if (bytesRead === 0) break;
          length += bytesRead;
        }
        if (length > MAX_FILE_BYTES) {
          warn(path, "file-too-large", `Content exceeds the ${MAX_FILE_BYTES}-byte read limit.`);
          return;
        }
        bytes = buffer.subarray(0, length);
      } finally {
        await handle.close();
      }
    } catch {
      warn(path, "unreadable-file", "Could not read file content.");
      return;
    }

    let content: string;
    try {
      if (bytes.includes(0)) throw new Error("NUL byte");
      content = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      warn(path, "non-text-file", "Content is binary or not valid UTF-8; content inspection skipped.");
      return;
    }

    if (path.split("/").at(-1) === "package.json") {
      profile.packageReferences.push(...packageReferences(path, content));
      const result = inspectPackage(path, content);
      if (result.issue) {
        profile.packageIssues.push(result.issue);
        warn(path, "invalid-manifest", "package.json must be a JSON object with optional string-valued scripts.");
      } else {
        profile.packageScripts.push({ path, scripts: result.scripts });
      }
    }
    content.split(/\r\n|\n|\r/).forEach((excerpt, index) => {
      for (const match of excerpt.matchAll(/\b(TODO|FIXME)\b/g)) {
        profile.markers.push({ path, line: index + 1, kind: match[0] as "TODO" | "FIXME", excerpt });
      }
    });
  }

  // Iterative traversal avoids exhausting the call stack on deeply nested trees.
  const pending = [""];
  while (pending.length > 0) {
    const directory = pending.pop()!;
    let entries;
    try {
      entries = await fs.readdir(join(root, directory), { withFileTypes: true });
    } catch (error) {
      if (directory === "") throw error;
      warn(directory, "unreadable-directory", "Could not enumerate directory.");
      continue;
    }
    entries.sort((a, b) => compare(a.name, b.name));
    for (const entry of entries) {
      if (ignoredNames.has(entry.name)) continue;
      const path = directory ? `${directory}/${entry.name}` : entry.name;
      if (isExcluded(path, exclude)) continue;
      if (entry.isSymbolicLink()) warn(path, "symlink-skipped", "Symbolic links are not followed.");
      else if (entry.isDirectory()) { profile.directories.push(path); pending.push(path); }
      else if (entry.isFile()) await inspectFile(path);
      else warn(path, "special-file-skipped", "Only regular files and directories are inspected.");
    }
  }

  for (const reference of profile.packageReferences) {
    reference.existence = await referenceExistence(root, reference, exclude);
  }
  profile.files.sort((a, b) => compare(a.path, b.path));
  profile.directories.sort(compare);
  profile.packageReferences.sort((a, b) => compare(a.path, b.path) || compare(a.field, b.field));
  profile.manifests.sort((a, b) => compare(a.path, b.path));
  profile.readmes.sort(compare);
  profile.tests.sort(compare);
  profile.packageScripts.sort((a, b) => compare(a.path, b.path));
  profile.packageIssues.sort((a, b) => compare(a.path, b.path) || compare(a.code, b.code));
  profile.markers.sort((a, b) => compare(a.path, b.path) || a.line - b.line);
  profile.warnings.sort((a, b) => compare(a.path, b.path) || compare(a.code, b.code));
  profile.languages = Object.fromEntries(Object.entries(profile.languages).sort(([a], [b]) => compare(a, b)));
  return repositoryProfileSchema.parse(profile);
}
