#!/usr/bin/env node
/**
 * verdict — run your startup idea through a venture pipeline and leave with
 * a verdict, not vibes.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadCandidates, scoreCandidate, sortScored, toMarkdown, toCsv } from "./scoring.js";
import { runGate, gateToMarkdown } from "./gate.js";
import { listSkills, runStage } from "./agent.js";
import { initProject, projectDir } from "./project.js";
import { startServer, openBrowser } from "./server.js";

const HELP = `verdict — venture pipeline CLI (v0.1)

Usage:
  verdict init "<idea name>"           Create a venture workspace under ./ventures/
  verdict scan <candidates.json|csv>   Score candidates on the six-axis rubric
      [--md-out FILE] [--csv-out FILE]
  verdict gate <project-slug>          Run the five-question discovery gate
  verdict run <stage> <project-slug> "<task>"
                                       Run a pipeline stage agentically (via claude CLI)
  verdict stages                       List available pipeline stages
  verdict gui [--port N]               Open the Verdict GUI (default port 5317)
  verdict help                         Show this help

Pipeline: opportunity-scan → discovery-gate → build-vs-buy → roi-model
          → validation-loop → trust-pack → investor-targeting

Scan input fields per candidate: name, pain, moat, reach, velocity, capital,
grant (each 1-5), optional kill (string) and note. Kill rules: pain=1 or
moat=1 kills outright. Verdicts: >=3.75 Pursue, >=3.00 Hold, else Pass.`;

function fail(message: string): never {
  console.error(`verdict: ${message}`);
  process.exit(1);
}

function getFlag(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag);
  if (idx === -1) return undefined;
  const value = args[idx + 1];
  if (!value) fail(`${flag} requires a value`);
  args.splice(idx, 2);
  return value;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args.shift();

  switch (command) {
    case "init": {
      const name = args.join(" ").trim();
      if (!name) fail('usage: verdict init "<idea name>"');
      const dir = initProject(name);
      console.log(`Created ${dir}`);
      console.log(`Next: edit idea.md, then run the scan or gate.`);
      break;
    }

    case "scan": {
      const mdOut = getFlag(args, "--md-out");
      const csvOut = getFlag(args, "--csv-out");
      const input = args[0];
      if (!input) fail("usage: verdict scan <candidates.json|csv> [--md-out FILE] [--csv-out FILE]");
      const text = readFileSync(input, "utf-8");
      const raw = loadCandidates(text, input.toLowerCase().endsWith(".csv"));
      const rows = sortScored(raw.map(scoreCandidate));
      const markdown = toMarkdown(rows);
      console.log(markdown);
      if (mdOut) {
        writeFileSync(mdOut, markdown + "\n", "utf-8");
        console.error(`\nMarkdown written to ${mdOut}`);
      }
      if (csvOut) {
        writeFileSync(csvOut, toCsv(rows), "utf-8");
        console.error(`CSV written to ${csvOut}`);
      }
      break;
    }

    case "gate": {
      const slug = args[0];
      if (!slug) fail("usage: verdict gate <project-slug>");
      const dir = projectDir(slug);
      const idea = slug.replace(/-/g, " ");
      const result = await runGate(idea);
      const doc = gateToMarkdown(result);
      const outPath = join(dir, "discovery-gate.md");
      writeFileSync(outPath, doc, "utf-8");
      console.log(`\nVerdict: ${result.verdict}`);
      console.log(result.reasoning);
      console.log(`\nFull gate document written to ${outPath}`);
      console.log(`Fill in the assumption ledger and the next action — the doc has the empty tables.`);
      break;
    }

    case "run": {
      const [stage, slug, ...taskParts] = args;
      const task = taskParts.join(" ").trim();
      if (!stage || !slug || !task) fail('usage: verdict run <stage> <project-slug> "<task>"');
      const dir = projectDir(slug);
      const code = await runStage({ stage, task, projectDir: dir });
      process.exit(code);
      break;
    }

    case "stages": {
      const skills = listSkills();
      if (skills.length === 0) {
        console.log("No stages found — the skills/ directory is missing from this install.");
      } else {
        for (const s of skills) console.log(s);
      }
      break;
    }

    case "gui": {
      const port = parseInt(getFlag(args, "--port") ?? "5317", 10);
      const address = await startServer(port);
      console.log(`Verdict GUI running at ${address}  (Ctrl+C to stop)`);
      openBrowser(address);
      break;
    }

    case "help":
    case "--help":
    case "-h":
    case undefined:
      console.log(HELP);
      break;

    default:
      fail(`unknown command '${command}'. Run: verdict help`);
  }
}

main().catch((err: Error) => fail(err.message));
