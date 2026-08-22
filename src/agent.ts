/**
 * Runs a pipeline stage agentically by shelling out to the local `claude` CLI,
 * with the stage's SKILL.md injected as an appended system prompt. This uses
 * the user's existing Claude subscription — no separate API key or spend.
 */

import { spawn } from "node:child_process";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** skills/ ships inside the repo, one level up from dist/. */
export function skillsRoot(): string {
  return join(__dirname, "..", "skills");
}

export function listSkills(): string[] {
  const root = skillsRoot();
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(root, entry.name, "SKILL.md")))
    .map((entry) => entry.name)
    .sort();
}

export function loadSkill(name: string): string {
  const path = join(skillsRoot(), name, "SKILL.md");
  if (!existsSync(path)) {
    const available = listSkills();
    throw new Error(`Unknown stage '${name}'. Available: ${available.join(", ") || "(none — skills/ directory missing)"}`);
  }
  return readFileSync(path, "utf-8");
}

export interface RunStageOptions {
  stage: string;
  task: string;
  projectDir: string;
}

/**
 * Streams the claude CLI's output straight to the terminal. The project
 * directory is the working directory, so the agent reads and writes the
 * project's state files directly.
 */
export function runStage(opts: RunStageOptions): Promise<number> {
  const skill = loadSkill(opts.stage);
  const referencesDir = join(skillsRoot(), opts.stage, "references");
  const referencesNote = existsSync(referencesDir)
    ? `\n\nThis stage's reference files are at: ${referencesDir} — read them before producing output.`
    : "";

  const systemPrompt =
    `You are running the '${opts.stage}' stage of the Verdict venture pipeline. ` +
    `Follow this methodology exactly, including its output structure and style rules:\n\n${skill}${referencesNote}\n\n` +
    `The current venture project lives in the working directory. Read its files for context ` +
    `and write this stage's output document into it as ${opts.stage}.md.`;

  return new Promise((resolve, reject) => {
    const child = spawn("claude", ["-p", opts.task, "--append-system-prompt", systemPrompt], {
      cwd: opts.projectDir,
      stdio: "inherit",
    });
    child.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "ENOENT") {
        reject(
          new Error(
            "The `claude` CLI was not found. Install Claude Code (https://claude.com/claude-code) — Verdict runs its agentic stages through it, using your existing subscription."
          )
        );
      } else {
        reject(err);
      }
    });
    child.on("close", (code) => resolve(code ?? 1));
  });
}
