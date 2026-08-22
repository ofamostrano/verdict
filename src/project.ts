/**
 * Files-as-state workspaces. One directory per venture idea under ./ventures,
 * plain Markdown and JSON only — transparent, git-friendly, no database.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

export const VENTURES_DIR = "ventures";

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function initProject(name: string, baseDir = "."): string {
  const slug = slugify(name);
  if (!slug) throw new Error("Project name must contain at least one letter or number.");
  const dir = resolve(baseDir, VENTURES_DIR, slug);
  if (existsSync(dir)) throw new Error(`Project already exists: ${dir}`);
  mkdirSync(dir, { recursive: true });

  const today = new Date().toISOString().slice(0, 10);
  writeFileSync(
    join(dir, "idea.md"),
    `# ${name}\n\n*Created: ${today} · Stage: opportunity-scan*\n\n## The idea\n\nOne paragraph. Who is the buyer (job title, not market segment), what do they lose today, what does this product do about it?\n\n## Pipeline state\n\n| Stage | Status | Output |\n|---|---|---|\n| opportunity-scan | pending | register.md |\n| discovery-gate | pending | discovery-gate.md |\n| build-vs-buy | pending | build-vs-buy.md |\n| roi-model | pending | roi-model.md |\n| validation-loop | pending | validation-loop.md |\n| trust-pack | pending | trust-pack.md |\n| investor-targeting | pending | investor-targeting.md |\n`,
    "utf-8"
  );
  return dir;
}

export function projectDir(slug: string, baseDir = "."): string {
  const dir = resolve(baseDir, VENTURES_DIR, slugify(slug));
  if (!existsSync(dir)) {
    throw new Error(`No project '${slug}' under ${resolve(baseDir, VENTURES_DIR)}. Run: verdict init "<idea name>"`);
  }
  return dir;
}
