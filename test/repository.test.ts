import fs from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { inspectRepository, MAX_FILE_BYTES, repositoryProfileSchema } from "../src/index.js";
import { classifyFile } from "../src/classify.js";

let root: string;
async function write(path: string, content: string | Uint8Array = "") {
  await fs.mkdir(dirname(join(root, path)), { recursive: true });
  await fs.writeFile(join(root, path), content);
}

beforeEach(async () => { root = await fs.mkdtemp(join(tmpdir(), "shipcheck-test-")); });
afterEach(async () => {
  vi.restoreAllMocks();
  // root comes directly from mkdtemp(), never from an inspected target.
  await fs.rm(root, { recursive: true, force: true });
});

describe("repository inspection", () => {
  it("profiles nested files, scripts, languages and exact marker locations deterministically", async () => {
    await write("src/main.ts", "// TODO: cover this\r\n// FIXME: handle input\r\nconst NOTODO = 1;\r\n");
    await write("README.md", "# Example");
    await write("package.json", JSON.stringify({ scripts: { test: "vitest", build: "tsc" } }));
    await write("packages/child/package.json", JSON.stringify({ scripts: { dev: "node app.js" } }));
    await write("test/main.test.ts", "");
    await write("tools/check.py", "");
    await write("Cargo.toml", "");
    await write("unknown.xyz", "");
    await write(".git/HEAD", "TODO ignored");
    await write("node_modules/library/index.js", "FIXME ignored");
    await write("packages/child/node_modules/library/index.js", "TODO ignored");

    const profile = await inspectRepository(root);
    expect(profile.files.map(file => file.path)).toEqual([
      "Cargo.toml", "README.md", "package.json", "packages/child/package.json",
      "src/main.ts", "test/main.test.ts", "tools/check.py", "unknown.xyz",
    ]);
    expect(profile.languages).toEqual({ TOML: 1, Markdown: 1, JSON: 2, TypeScript: 2, Python: 1 });
    expect(profile.manifests).toEqual([
      { path: "Cargo.toml", ecosystem: "Rust" },
      { path: "package.json", ecosystem: "Node.js" },
      { path: "packages/child/package.json", ecosystem: "Node.js" },
    ]);
    expect(profile.readmes).toEqual(["README.md"]);
    expect(profile.tests).toEqual(["test/main.test.ts"]);
    expect(profile.packageScripts).toEqual([
      { path: "package.json", scripts: { build: "tsc", test: "vitest" } },
      { path: "packages/child/package.json", scripts: { dev: "node app.js" } },
    ]);
    expect(profile.markers).toEqual([
      { path: "src/main.ts", line: 1, kind: "TODO", excerpt: "// TODO: cover this" },
      { path: "src/main.ts", line: 2, kind: "FIXME", excerpt: "// FIXME: handle input" },
    ]);
    expect(profile.warnings).toEqual([]);
    expect(repositoryProfileSchema.safeParse(profile).success).toBe(true);
    expect(await inspectRepository(root)).toEqual(profile);
    expect(await fs.readFile(join(root, "src/main.ts"), "utf8")).toBe(
      "// TODO: cover this\r\n// FIXME: handle input\r\nconst NOTODO = 1;\r\n",
    );
  });

  it("supports empty directories and rejects missing or file targets", async () => {
    expect((await inspectRepository(root)).files).toEqual([]);
    await expect(inspectRepository(join(root, "missing"))).rejects.toThrow();
    await write("file.txt");
    await expect(inspectRepository(join(root, "file.txt"))).rejects.toThrow("must be a directory");
  });

  it("keeps malformed manifests as observations and reports warnings", async () => {
    await write("package.json", "{broken");
    await write("child/package.json", '{"scripts":{"test":123}}');
    await write("valid/package.json", '{"name":"valid"}');
    const profile = await inspectRepository(root);
    expect(profile.manifests).toHaveLength(3);
    expect(profile.packageScripts).toEqual([{ path: "valid/package.json", scripts: {} }]);
    expect(profile.warnings.map(w => [w.path, w.code])).toEqual([
      ["child/package.json", "invalid-manifest"], ["package.json", "invalid-manifest"],
    ]);
  });

  it("skips binary, invalid UTF-8 and oversized content but enumerates the files", async () => {
    await write("binary.bin", Buffer.from([0, 84, 79, 68, 79]));
    await write("invalid.txt", Buffer.from([255, 254, 84, 79, 68, 79]));
    await write("large.txt", "TODO" + " ".repeat(MAX_FILE_BYTES));
    await write("boundary.txt", "TODO" + " ".repeat(MAX_FILE_BYTES - 4));
    const profile = await inspectRepository(root);
    expect(profile.files).toHaveLength(4);
    expect(profile.markers.map(m => m.path)).toEqual(["boundary.txt"]);
    expect(profile.warnings.map(w => [w.path, w.code])).toEqual([
      ["binary.bin", "non-text-file"], ["invalid.txt", "non-text-file"], ["large.txt", "file-too-large"],
    ]);
  });

  it("does not traverse directory links or accept linked roots", async () => {
    await write("actual/a.ts", "TODO real file");
    // Windows junctions do not require the file-symlink developer privilege.
    await fs.symlink(join(root, "actual"), join(root, "linked"), "junction");
    const profile = await inspectRepository(root);
    expect(profile.files.map(f => f.path)).toEqual(["actual/a.ts"]);
    expect(profile.warnings.map(w => [w.path, w.code])).toEqual([["linked", "symlink-skipped"]]);
    await expect(inspectRepository(join(root, "linked"))).rejects.toThrow("must be a directory");
  });

  it("continues past unreadable files and subdirectories", async () => {
    await write("blocked.txt", "TODO unavailable");
    await write("blocked/hidden.ts", "TODO unavailable");
    await write("ok.ts", "FIXME visible");
    const realOpen = fs.open;
    const realReaddir = fs.readdir;
    const canonicalRoot = await fs.realpath(root);
    vi.spyOn(fs, "open").mockImplementation(async (...args) => {
      if (args[0] === join(canonicalRoot, "blocked.txt")) throw new Error("EACCES");
      return realOpen(...args);
    });
    vi.spyOn(fs, "readdir").mockImplementation((...args: Parameters<typeof fs.readdir>) => {
      if (args[0] === join(canonicalRoot, "blocked")) return Promise.reject(new Error("EACCES"));
      return realReaddir(...args);
    });
    const profile = await inspectRepository(root);
    expect(profile.markers.map(m => m.path)).toEqual(["ok.ts"]);
    expect(profile.warnings.map(w => [w.path, w.code])).toEqual([
      ["blocked", "unreadable-directory"], ["blocked.txt", "unreadable-file"],
    ]);
  });

  it("rejects an unreadable root instead of returning an empty successful profile", async () => {
    vi.spyOn(fs, "readdir").mockRejectedValue(new Error("EACCES"));
    await expect(inspectRepository(root)).rejects.toThrow("EACCES");
  });

  it("rejects invalid evidence line numbers through the public schema", async () => {
    const profile = await inspectRepository(root);
    expect(repositoryProfileSchema.safeParse({
      ...profile,
      markers: [{ path: "a.ts", line: 0, kind: "TODO", excerpt: "TODO" }],
    }).success).toBe(false);
  });
});

it("recognizes common conventions without treating ordinary source as tests", () => {
  for (const path of ["src/a.spec.ts", "test_a.py", "a_test.py", "a_test.go", "__tests__/a.js"]) {
    expect(classifyFile(path).isTest).toBe(true);
  }
  expect(classifyFile("src/latest.ts").isTest).toBe(false);
  expect(classifyFile("test/a.test.js.map").isTest).toBe(false);
  expect(classifyFile("test/README.md").isTest).toBe(false);
  expect(classifyFile("docs/readme.rst").isReadme).toBe(true);
  expect(classifyFile("api/App.csproj").ecosystem).toBe(".NET");
  expect(classifyFile("pyproject.toml").ecosystem).toBe("Python");
  expect(classifyFile("go.mod").ecosystem).toBe("Go");
  expect(classifyFile("constructor").ecosystem).toBeNull();
});
