# P15 — Automatic architecture policies

Configure `architecture` in `shipcheck.config.json`, then run `shipcheck audit .`.
No AI, network, compiler, dependency installation, or source rewriting is needed.
The optional `--run-checks` and AI flags retain their separate existing behavior.

```json
{
  "architecture": {
    "files": ["src/domain/**/*.ts", "src/domain/**/*.py"],
    "boundaries": [{
      "id": "domain-ui", "from": "src/domain", "to": "src/ui",
      "reason": "Domain code must not import UI code."
    }],
    "aliases": [{"prefix": "@ui/", "target": "src/ui"}],
    "conventions": [{
      "id": "domain-names", "within": "src/domain", "style": "snake_case",
      "reason": "Domain source filenames use snake case."
    }]
  }
}
```

`files` uses the existing slash-separated `*`/whole-segment `**` glob subset.
Selection is automatic from repository inventory, with configured exclusions.
Boundary `from`, `to`, and convention `within` are exact paths or directory
prefixes, not globs. Matching is case-sensitive and respects slash boundaries.
A boundary prohibits the declared dependency direction; it does not prohibit the
reverse direction. At least one boundary or convention is required; IDs must be
unique across both lists. There are at most 32 selection patterns, 100 boundaries,
100 conventions, and 100 aliases. All targets remain repository-relative.

Aliases are explicit user assertions about project layout. A prefix ending in
`/` or `.` maps the remaining module suffix beneath `target`; other prefixes
match an entire specifier. For example, `app.ui.` → `src/ui` maps the Python
module `app.ui.view` to `src/ui/view.py`, or Java `app.ui.View` to
`src/ui/View.java`. An exact Go alias `example.org/app/ui` → `src/ui` maps a
package directory. An exact C# alias `App.UI` → `src/ui` maps a namespace
directory. Overlapping applicable aliases are unresolved, even if one is longer.
Targets must name a file/directory beneath the root; `.` is not an alias target.

## Supported dependency observations

| Language | Extraction and local resolution |
| --- | --- |
| JS/TS | Static imports/re-exports, literal dynamic `import()`, direct literal `require()`, TS external import-equals. Relative imports and explicit aliases resolve against exact files, common JS/TS extensions, and directory index files. `.js`/`.mjs`/`.cjs` may map to `.ts`/`.mts`/`.cts`. Multiple candidate files are unresolved. |
| Python | `import module` and `from module import member`, including aliases and comma-separated imports. Explicit aliases resolve absolute modules; leading-dot relative modules resolve from the source directory. Candidates are `.py` or `/__init__.py`. `from . import member` is unresolved. The edge for a from-import targets the named module, not inferred member implementations. |
| Go | Import declarations map through explicit aliases to package directories. |
| Java | Ordinary explicit class imports map through aliases to `.java` files. Static and wildcard imports are unresolved. |
| C# | Ordinary `using Namespace;` maps through explicit aliases to directories. This is namespace visibility, not proof of type use. Alias, static, and global using directives are unresolved. |

Parsers distinguish comments and strings from declarations. No source evaluation
is performed. Non-relative imports without an alias are reported `external` and
excluded from the configured local graph. **Configure aliases for local package
names**: an unmapped local package otherwise remains outside the assessment.
Shipcheck does not infer mappings from tsconfig, package exports, Python paths,
go.mod, Java classpaths, C# projects, or build tools. Resolution uses exact
inventory casing even on case-insensitive filesystems.

This is a declaration graph, not compiler/type resolution or a complete runtime
dependency graph. Implicit same-package access, fully qualified type references,
reflection, Python runtime imports, JS loader aliases, TS import-type expressions,
generated code, conditional build variants, and transitive dependencies are not
assessed. C# namespace imports and Go package imports are directory-level edges.
Unsupported source languages and recognized unsupported syntax produce partial
coverage. JS `require` binding ambiguity is conservatively unresolved.
U+2028/U+2029 JavaScript/TypeScript line separators are explicitly unsupported
because parser line numbering differs from the CR/LF citation format.

## Naming conventions

`snake_case`, `kebab-case`, and `PascalCase` apply to the entire basename after
removing only its final extension. For example `order.test.ts` has stem
`order.test` and fails all three styles. Snake/kebab styles begin with a lowercase
ASCII letter and contain lowercase letters/digits separated by single `_`/`-`;
PascalCase begins with an uppercase ASCII letter and otherwise allows letters
and digits. These are deliberately precise filename checks, not inferred style.
Conventions alone work with any language. Select files narrowly to exempt special
names such as Python `__init__.py`; no implicit exemptions are applied.

## Coverage, evidence, and exit codes

`audit` selects all matching repository files; `diff` and `task` intersect this
selection with their workflow scope. Targets still resolve against the full safe
inventory. Empty diff retains its existing early skip. Other empty selections
are partial, not a successful assessment. Missing explicit files and missing
selected diff paths are reported. Glob patterns with no matches cannot enumerate
missing files. Exclusions are intentional scope restrictions.

Analysis is capped at 128 source files in sorted order and 128 imports per file,
with 10,000 imports total. Sources use the existing resource reader: 64 KiB per
file, 256 KiB per group of up to 32 files, at most four groups (1 MiB). Excerpts
are capped at 2,048 characters. Limits, invalid UTF-8, sensitive content,
unavailable files, parser errors, and unresolved local imports produce `partial`.
Unreadable directories and skipped links conservatively mark inventory coverage
partial, including links outside selected patterns. The inventory itself uses
the existing repository inspector and its limits. This is not an atomic snapshot
of concurrently changing files; hashes identify the bytes read.

Console, Markdown, and JSON reports include an `architecture` assessment, normalized
policy SHA-256, source hashes, extracted import text/lines, resolution outcomes,
boundary evidence, naming violations, and coverage issues. `violation` means the
observed declaration or filename conflicts with the configured rule.
`no-observed-violation` never proves architectural correctness. These assessments
are separate from the existing `findings` array; consumers must inspect both.

Exit 1 indicates an observed architecture violation; exit 2 takes precedence for
partial architecture coverage, retaining any observed violations. Exit 0 means
the configured bounded checks completed without violations, subject to the other
stages' existing exit behavior. AI cannot upgrade incomplete offline coverage.
Shipcheck never changes policy, code, or task expectations. Authorized developer
agents may do so; the policy hash identifies contents, not approval or intent.

Try the packaged example: `shipcheck audit fixtures/architecture --json`.
It intentionally exits 1 for an import from `core` into `ui`.
The exported `auditArchitecture(root, config, scope?)` provides the same bounded
assessment. P10's caller-supplied pure `assessIntentPolicy` API is unchanged;
natural-language task requirements continue through P11/P13.

## Verification

The milestone regression suite passes 409 tests, including 27 architecture tests.
Typecheck and build pass. An isolated local-package installation with install
scripts disabled exercised the actual CLI: the packaged example exits 1, five
language families produce five forbidden-import observations, an unresolved import
changes the exit to 2, and clean controls exit 0. No paid AI calls were used.

A source self-audit selected 55 Shipcheck files with a sample policy prohibiting
`src/ai` from importing `src/cli-command.ts`. It found no observed violation but
remained partial: existing sensitive-content filters excluded two files and the
custom `createRequire` binding was conservatively unresolved. This validates
coverage disclosure, not whole-repository architectural correctness. Native parser
installation was verified on Windows; other platforms retain the P18 release gate.
