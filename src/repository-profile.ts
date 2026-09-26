import { z } from "zod";

const relativePath = z.string().min(1);

export const repositoryProfileSchema = z.object({
  root: z.string().min(1),
  files: z.array(z.object({
    path: relativePath,
    language: z.string().nullable(),
  })),
  languages: z.record(z.string(), z.number().int().nonnegative()),
  manifests: z.array(z.object({ path: relativePath, ecosystem: z.string() })),
  readmes: z.array(relativePath),
  tests: z.array(relativePath),
  packageScripts: z.array(z.object({
    path: relativePath,
    scripts: z.record(z.string(), z.string()),
  })),
  markers: z.array(z.object({
    path: relativePath,
    line: z.number().int().positive(),
    kind: z.enum(["TODO", "FIXME"]),
    excerpt: z.string(),
  })),
  warnings: z.array(z.object({
    path: relativePath,
    code: z.enum([
      "unreadable-directory", "unreadable-file", "invalid-manifest",
      "file-too-large", "non-text-file", "symlink-skipped", "special-file-skipped",
    ]),
    message: z.string(),
  })),
});

export type RepositoryProfile = z.infer<typeof repositoryProfileSchema>;
