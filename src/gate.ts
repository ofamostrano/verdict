/**
 * Discovery gate: the five readiness questions, asked interactively,
 * answers recorded verbatim, interpreted per discovery-gate/SKILL.md.
 * "Unclear" counts as "no" — founders hedge where they are weakest.
 */

import * as readline from "node:readline";
import { stdin, stdout } from "node:process";

/**
 * readline's promise-based question() drops lines that arrive while no
 * question is pending, which breaks piped input (all answers arrive in one
 * chunk). This reader buffers every line as it arrives and hands them out
 * in order, so both interactive and piped stdin behave identically.
 */
class AnswerReader {
  private queue: string[] = [];
  private waiters: ((line: string) => void)[] = [];
  private closed = false;
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({ input: stdin, output: stdout, terminal: stdin.isTTY === true });
    this.rl.on("line", (line) => {
      const waiter = this.waiters.shift();
      if (waiter) waiter(line);
      else this.queue.push(line);
    });
    this.rl.on("close", () => {
      this.closed = true;
      // EOF: unblock pending questions with an empty answer (reads as unclear).
      for (const waiter of this.waiters.splice(0)) waiter("");
    });
  }

  ask(prompt: string): Promise<string> {
    stdout.write(prompt);
    const buffered = this.queue.shift();
    if (buffered !== undefined) {
      stdout.write(`${buffered}\n`);
      return Promise.resolve(buffered);
    }
    if (this.closed) return Promise.resolve("");
    return new Promise((resolve) => this.waiters.push(resolve));
  }

  close(): void {
    this.rl.close();
  }
}

export const QUESTIONS = [
  "Have you talked to at least a handful of target users about THIS specific problem, not just the general space it sits in?",
  "Does the product involve integrations, compliance requirements, or technical decisions the current team cannot confidently make alone?",
  "Do co-founders and investors currently share the same picture of what \"finished\" looks like for version one?",
  "Can you describe the core feature set in two or three sentences without qualifying half of it with \"maybe\" or \"we'll figure that out\"?",
  "Is runway tight enough that a two-to-four week scoping engagement would meaningfully change the risk if the answers above lean toward \"no\"?",
] as const;

export type Leaning = "yes" | "no" | "unclear";

export interface GateAnswer {
  question: string;
  verbatim: string;
  leaning: Leaning;
}

export interface GateResult {
  idea: string;
  answers: GateAnswer[];
  buyerNamed: string | null;
  verdict: "Build now" | "Scope first" | "Focused scope pass" | "Kill or return to scan";
  reasoning: string;
  date: string;
}

export function classifyAnswer(text: string): Leaning {
  const t = text.trim().toLowerCase();
  if (/^(y|yes|yep|yeah|definitely|absolutely)\b/.test(t)) return "yes";
  if (/^(n|no|nope|not yet|never)\b/.test(t)) return "no";
  return "unclear";
}

/** Interpretation table from discovery-gate/SKILL.md. Unclear counts as no. */
export function interpret(leanings: Leaning[], buyerNamed: string | null): Pick<GateResult, "verdict" | "reasoning"> {
  const yes = (i: number) => leanings[i] === "yes";
  const no = (i: number) => leanings[i] !== "yes"; // unclear counts as no

  if (no(0) && !buyerNamed) {
    return {
      verdict: "Kill or return to scan",
      reasoning:
        "No user conversations and no nameable prospective buyer: there is no idea yet, only a hypothesis about a hypothesis. Return to opportunity-scan.",
    };
  }
  if (yes(0) && yes(2) && yes(3) && no(1)) {
    return {
      verdict: "Build now",
      reasoning:
        "Users have been talked to, the finish line is shared, the scope is stateable, and there is no technical unknown the team cannot resolve. A separate scoping phase would slow this down without improving the odds.",
    };
  }
  const misses: string[] = [];
  if (no(0)) misses.push("no direct user conversations on this specific problem (Q1)");
  if (yes(1)) misses.push("technical/integration/compliance unknowns the team cannot confidently resolve alone (Q2)");
  if (no(2)) misses.push("no shared picture of what finished looks like (Q3)");
  if (no(3)) misses.push("the core feature set cannot be stated without hedging (Q4)");

  if (misses.length >= 2) {
    return {
      verdict: "Scope first",
      reasoning: `Multiple gate failures: ${misses.join("; ")}. Scope before code — these are the failures that surface mid-sprint after code is written around a wrong assumption.`,
    };
  }
  return {
    verdict: "Focused scope pass",
    reasoning: `One specific unknown: ${misses.join("; ") || "answers land in the messy middle"}. Treat the gate as a dimmer, not a switch: scope only that unknown, then build.`,
  };
}

export async function runGate(idea: string): Promise<GateResult> {
  const reader = new AnswerReader();
  const answers: GateAnswer[] = [];

  console.log(`\nDiscovery gate: ${idea}`);
  console.log("Answer honestly. Hedged answers count as no — that is the point of the gate.\n");

  for (let i = 0; i < QUESTIONS.length; i++) {
    const verbatim = await reader.ask(`Q${i + 1}. ${QUESTIONS[i]}\n> `);
    answers.push({ question: QUESTIONS[i], verbatim: verbatim.trim(), leaning: classifyAnswer(verbatim) });
    console.log("");
  }

  let buyerNamed: string | null = null;
  if (answers[0].leaning !== "yes") {
    const buyer = await reader.ask(
      "Follow-up: name ONE real prospective buyer (a person or company you could contact this week), or press Enter if you cannot.\n> "
    );
    buyerNamed = buyer.trim() || null;
    console.log("");
  }

  reader.close();

  const { verdict, reasoning } = interpret(
    answers.map((a) => a.leaning),
    buyerNamed
  );

  return { idea, answers, buyerNamed, verdict, reasoning, date: new Date().toISOString().slice(0, 10) };
}

export function gateToMarkdown(result: GateResult): string {
  const lines: string[] = [];
  lines.push(`# Discovery Gate — ${result.idea}`);
  lines.push("");
  lines.push(`*Date: ${result.date}*`);
  lines.push("");
  lines.push(`## Verdict`);
  lines.push("");
  lines.push(`**${result.verdict}.** ${result.reasoning}`);
  lines.push("");
  lines.push(`## The Five Answers (verbatim)`);
  lines.push("");
  result.answers.forEach((a, i) => {
    lines.push(`**Q${i + 1}. ${a.question}**`);
    lines.push("");
    lines.push(`> ${a.verbatim || "(no answer)"}`);
    lines.push("");
    lines.push(`Read as: **${a.leaning}**${a.leaning === "unclear" ? " (counts as no)" : ""}`);
    lines.push("");
  });
  if (result.answers[0].leaning !== "yes") {
    lines.push(`**Named prospective buyer:** ${result.buyerNamed ?? "none named"}`);
    lines.push("");
  }
  lines.push(`## Assumption Ledger`);
  lines.push("");
  lines.push(`Order by cost of being wrong, descending. Every kill test must be able to return "no".`);
  lines.push("");
  lines.push(`| # | Assumption | Type | If wrong, what breaks | Kill test | Cost / time to test | Status |`);
  lines.push(`|---|---|---|---|---|---|---|`);
  lines.push(`| 1 |  | demand |  |  |  | Untested |`);
  lines.push(`| 2 |  | willingness to pay |  |  |  | Untested |`);
  lines.push(`| 3 |  | feasibility |  |  |  | Untested |`);
  lines.push(`| 4 |  | access |  |  |  | Untested |`);
  lines.push(`| 5 |  | economics |  |  |  | Untested |`);
  lines.push("");
  lines.push(`## Next Action`);
  lines.push("");
  lines.push(`One named action, an owner, a date, and a pass/fail threshold stated BEFORE the test runs.`);
  lines.push("");
  lines.push(`- Action:`);
  lines.push(`- Owner:`);
  lines.push(`- Date:`);
  lines.push(`- Pass/fail threshold:`);
  lines.push("");
  lines.push(`## What Would Change the Verdict`);
  lines.push("");
  lines.push(`- `);
  lines.push(`- `);
  lines.push("");
  return lines.join("\n");
}
