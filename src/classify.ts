import { posix } from "node:path";

const languages: Record<string, string> = {
  ".ts": "TypeScript", ".tsx": "TypeScript", ".mts": "TypeScript", ".cts": "TypeScript",
  ".js": "JavaScript", ".jsx": "JavaScript", ".mjs": "JavaScript", ".cjs": "JavaScript",
  ".py": "Python", ".rs": "Rust", ".go": "Go", ".java": "Java", ".kt": "Kotlin",
  ".c": "C", ".h": "C", ".cpp": "C++", ".hpp": "C++", ".cs": "C#",
  ".rb": "Ruby", ".php": "PHP", ".swift": "Swift", ".sh": "Shell", ".ps1": "PowerShell",
  ".html": "HTML", ".css": "CSS", ".scss": "SCSS", ".vue": "Vue", ".svelte": "Svelte",
  ".json": "JSON", ".yaml": "YAML", ".yml": "YAML", ".toml": "TOML",
  ".md": "Markdown", ".mdx": "MDX", ".sql": "SQL",
};

const manifests: Record<string, string> = {
  "package.json": "Node.js", "pyproject.toml": "Python", "requirements.txt": "Python",
  "setup.py": "Python", "setup.cfg": "Python", "cargo.toml": "Rust", "go.mod": "Go",
  "pom.xml": "Java", "build.gradle": "JVM", "build.gradle.kts": "JVM",
  "gemfile": "Ruby", "composer.json": "PHP", "package.swift": "Swift",
};

const testExtensions = new Set([
  ".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs",
  ".py", ".rs", ".go", ".java", ".kt", ".c", ".cpp", ".cs", ".rb", ".php", ".swift", ".sh", ".ps1",
]);

/** Paths must use repository-relative forward slashes. Detection is heuristic. */
export function classifyFile(path: string) {
  const name = posix.basename(path).toLowerCase();
  const extension = posix.extname(name);
  return {
    language: languages[extension] ?? null,
    ecosystem: Object.hasOwn(manifests, name) ? manifests[name]! :
      [".csproj", ".fsproj", ".vbproj"].includes(extension) ? ".NET" : null,
    isReadme: /^readme(?:\..+)?$/i.test(name),
    isTest: testExtensions.has(extension) && (/(?:^|\/)(?:tests?|__tests__)\//i.test(path)
      || /(?:^test_.+|.+_test)\.py$/.test(name)
      || /\.(?:test|spec)\.[^.]+$/.test(name)
      || /_test\.go$/.test(name)),
  };
}
