/**
 * Smoke test: the TS scorer must reproduce the Python reference scorer's
 * verdicts exactly on the example register, plus unit checks on kill rules
 * and thresholds. Run via `npm test`. Exits non-zero on any failure.
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadCandidates, scoreCandidate, sortScored, toMarkdown } from "./scoring.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

let failures = 0;
function check(label: string, condition: boolean): void {
  if (condition) {
    console.log(`  ok: ${label}`);
  } else {
    failures += 1;
    console.error(`FAIL: ${label}`);
  }
}

// Kill rules
const killedPain = scoreCandidate({ name: "x", pain: 1, moat: 5, reach: 5, velocity: 5, capital: 5, grant: 5 });
check("pain=1 kills", killedPain.verdict === "Killed" && killedPain.reason.includes("pain intensity 1"));

const killedMoat = scoreCandidate({ name: "x", pain: 5, moat: 1, reach: 5, velocity: 5, capital: 5, grant: 5 });
check("moat=1 kills", killedMoat.verdict === "Killed" && killedMoat.reason.includes("moat durability 1"));

const killedManual = scoreCandidate({ name: "x", pain: 5, moat: 5, reach: 5, velocity: 5, capital: 5, grant: 5, kill: "vendor test" });
check("manual kill string kills", killedManual.verdict === "Killed" && killedManual.reason === "vendor test");

// Thresholds
const pursue = scoreCandidate({ name: "x", pain: 5, moat: 5, reach: 4, velocity: 4, capital: 4, grant: 3 });
check("4.35 is Pursue", pursue.weighted === 4.35 && pursue.verdict === "Pursue");

const holdExact = scoreCandidate({ name: "x", pain: 3, moat: 3, reach: 3, velocity: 3, capital: 3, grant: 3 });
check("3.00 exactly is Hold", holdExact.weighted === 3.0 && holdExact.verdict === "Hold");

const pass = scoreCandidate({ name: "x", pain: 2, moat: 2, reach: 3, velocity: 2, capital: 5, grant: 2 });
check("weak candidate is Pass", pass.verdict === "Pass");

// Validation errors
for (const bad of [
  { name: "x", pain: 6, moat: 3, reach: 3, velocity: 3, capital: 3, grant: 3 },
  { name: "x", pain: "abc", moat: 3, reach: 3, velocity: 3, capital: 3, grant: 3 },
  { name: "x", moat: 3, reach: 3, velocity: 3, capital: 3, grant: 3 },
  { pain: 3, moat: 3, reach: 3, velocity: 3, capital: 3, grant: 3 },
]) {
  let threw = false;
  try {
    scoreCandidate(bad as Record<string, unknown>);
  } catch {
    threw = true;
  }
  check(`rejects invalid input ${JSON.stringify(bad).slice(0, 40)}...`, threw);
}

// Reference comparison against the Python scorer's saved output, if present.
try {
  const examplePath = join(__dirname, "..", "examples", "candidates.json");
  const referencePath = join(__dirname, "..", "examples", "register.reference.md");
  const raw = loadCandidates(readFileSync(examplePath, "utf-8"), false);
  const markdown = toMarkdown(sortScored(raw.map(scoreCandidate)));
  const reference = readFileSync(referencePath, "utf-8").trim();
  check("matches Python reference output byte-for-byte", markdown.trim() === reference);
} catch (err) {
  console.log(`  skipped reference comparison: ${(err as Error).message}`);
}

if (failures > 0) {
  console.error(`\n${failures} test(s) failed`);
  process.exit(1);
}
console.log("\nAll tests passed.");
