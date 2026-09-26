import fs from "node:fs/promises";
import { join, resolve } from "node:path";
import { z } from "zod";
import { classifyFile } from "./classify.js";
import { repositoryProfileSchema, type RepositoryProfile } from "./repository-profile.js";

export const MAX_FILE_BYTES = 1024 * 1024;
const ignoredNames = new Set([".git", "node_modules"]);
const packageSchema = z.object({ scripts: z.record(z.string(), z.string()).optional() });
const compare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;

/** Read local repository facts. Never executes scripts or writes to the target. */
export async function inspectRepository(target = "."): Promise<RepositoryProfile> {
  const root = resolve(target);
  // Reject root links too: inspection must not silently switch to another target.
  const rootStat = await fs.lstat(root);
  if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) {
    throw new Error(`Repository target must be a directory, not a file or symlink: ${root}`);
  }
  const profile: RepositoryProfile = {
    root, files: [], languages: {}, manifests: [], readmes: [], tests: [],
    packageScripts: [], markers: [], warnings: [],
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
      try {
        const parsed = packageSchema.parse(JSON.parse(content));
        const scripts = Object.fromEntries(Object.entries(parsed.scripts ?? {}).sort(([a], [b]) => compare(a, b)));
        profile.packageScripts.push({ path, scripts });
      } catch {
        warn(path, "invalid-manifest", "package.json must be a JSON object with optional string-valued scripts.");
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
      if (entry.isSymbolicLink()) warn(path, "symlink-skipped", "Symbolic links are not followed.");
      else if (entry.isDirectory()) pending.push(path);
      else if (entry.isFile()) await inspectFile(path);
      else warn(path, "special-file-skipped", "Only regular files and directories are inspected.");
    }
  }

  profile.files.sort((a, b) => compare(a.path, b.path));
  profile.manifests.sort((a, b) => compare(a.path, b.path));
  profile.readmes.sort(compare);
  profile.tests.sort(compare);
  profile.packageScripts.sort((a, b) => compare(a.path, b.path));
  profile.markers.sort((a, b) => compare(a.path, b.path) || a.line - b.line);
  profile.warnings.sort((a, b) => compare(a.path, b.path) || compare(a.code, b.code));
  profile.languages = Object.fromEntries(Object.entries(profile.languages).sort(([a], [b]) => compare(a, b)));
  return repositoryProfileSchema.parse(profile);
}
