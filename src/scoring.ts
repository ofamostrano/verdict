/**
 * Six-axis weighted opportunity scoring — TypeScript port of
 * opportunity-scan/scripts/score_opportunities.py. The weights, kill rules,
 * and thresholds are the methodology; changing them here without changing
 * the SKILL.md is a bug.
 */

export const WEIGHTS = {
  pain: 0.25,
  moat: 0.2,
  reach: 0.15,
  velocity: 0.2,
  capital: 0.1,
  grant: 0.1,
} as const;

export type Axis = keyof typeof WEIGHTS;

export const AXIS_LABELS: Record<Axis, string> = {
  pain: "Pain",
  moat: "Moat",
  reach: "Reach",
  velocity: "Velocity",
  capital: "Capital",
  grant: "Grant",
};

export const PURSUE_THRESHOLD = 3.75;
export const HOLD_THRESHOLD = 3.0;

export type Verdict = "Pursue" | "Hold" | "Pass" | "Killed";

export interface Candidate {
  name: string;
  pain: number;
  moat: number;
  reach: number;
  velocity: number;
  capital: number;
  grant: number;
  kill?: string;
  note?: string;
}

export interface ScoredCandidate extends Candidate {
  weighted: number;
  verdict: Verdict;
  reason: string;
  note: string;
}

const AXES = Object.keys(WEIGHTS) as Axis[];

function coerceAxis(value: unknown, field: string, name: string): number {
  const score = parseInt(String(value).trim(), 10);
  if (Number.isNaN(score)) {
    throw new Error(`Candidate '${name}': field '${field}' is not an integer (got ${JSON.stringify(value)}).`);
  }
  if (score < 1 || score > 5) {
    throw new Error(`Candidate '${name}': field '${field}' must be 1-5 (got ${score}).`);
  }
  return score;
}

export function scoreCandidate(raw: Record<string, unknown>): ScoredCandidate {
  const name = String(raw.name ?? raw.opportunity ?? "").trim();
  if (!name) throw new Error("Every candidate needs a 'name' field.");

  const axes = {} as Record<Axis, number>;
  for (const field of AXES) {
    const value = raw[field];
    if (value === undefined || value === null || value === "") {
      throw new Error(`Candidate '${name}' is missing required field '${field}'.`);
    }
    axes[field] = coerceAxis(value, field, name);
  }

  const weighted = Math.round(AXES.reduce((sum, f) => sum + axes[f] * WEIGHTS[f], 0) * 1000) / 1000;

  const kills: string[] = [];
  const manual = String(raw.kill ?? "").trim();
  if (manual) kills.push(manual);
  if (axes.pain === 1) kills.push("pain intensity 1: no willingness to pay");
  if (axes.moat === 1) kills.push("moat durability 1: no defensibility");

  let verdict: Verdict;
  let reason = "";
  if (kills.length > 0) {
    verdict = "Killed";
    reason = kills.join("; ");
  } else if (weighted >= PURSUE_THRESHOLD) {
    verdict = "Pursue";
  } else if (weighted >= HOLD_THRESHOLD) {
    verdict = "Hold";
  } else {
    verdict = "Pass";
  }

  return { name, ...axes, weighted, verdict, reason, note: String(raw.note ?? "").trim() };
}

export function sortScored(rows: ScoredCandidate[]): ScoredCandidate[] {
  // Killed candidates always sort to the bottom, then by weighted score descending.
  return [...rows].sort((a, b) => {
    const killA = a.verdict === "Killed" ? 1 : 0;
    const killB = b.verdict === "Killed" ? 1 : 0;
    if (killA !== killB) return killA - killB;
    if (a.weighted !== b.weighted) return b.weighted - a.weighted;
    return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
  });
}

export function toMarkdown(rows: ScoredCandidate[]): string {
  const header = ["Rank", "Opportunity", ...AXES.map((a) => AXIS_LABELS[a]), "Weighted", "Verdict"];
  const lines = [
    "| " + header.join(" | ") + " |",
    "|" + "---|".repeat(header.length),
  ];

  let rank = 0;
  for (const row of rows) {
    let rankCell: string;
    let verdictCell: string;
    if (row.verdict === "Killed") {
      rankCell = "—";
      verdictCell = `Killed (${row.reason})`;
    } else {
      rank += 1;
      rankCell = String(rank);
      verdictCell = row.verdict;
    }
    const cells = [rankCell, row.name, ...AXES.map((a) => String(row[a])), row.weighted.toFixed(2), verdictCell];
    lines.push("| " + cells.join(" | ") + " |");
  }

  const surviving = rows.filter((r) => r.verdict !== "Killed").length;
  const killed = rows.length - surviving;
  lines.push("");
  lines.push(
    `${rows.length} candidates scored: ${surviving} surviving, ${killed} killed. ` +
      `Thresholds: Pursue >= ${PURSUE_THRESHOLD.toFixed(2)}, Hold >= ${HOLD_THRESHOLD.toFixed(2)}.`
  );

  const notes = rows.filter((r) => r.note);
  if (notes.length > 0) {
    lines.push("");
    lines.push("Notes:");
    for (const row of notes) {
      lines.push(`- **${row.name}** — ${row.note}`);
    }
  }

  return lines.join("\n");
}

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? '"' + value.replace(/"/g, '""') + '"' : value;
}

export function toCsv(rows: ScoredCandidate[]): string {
  const fields = ["name", ...AXES, "weighted", "verdict", "reason", "note"] as const;
  const lines = [fields.join(",")];
  for (const row of rows) {
    lines.push(fields.map((f) => csvEscape(String(row[f]))).join(","));
  }
  return lines.join("\n") + "\n";
}

/** Minimal CSV parser for candidate input: header row + simple quoted fields. */
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((c) => c !== "")) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    if (row.some((c) => c !== "")) rows.push(row);
  }
  if (rows.length < 2) return [];
  const header = rows[0];
  return rows.slice(1).map((r) => Object.fromEntries(header.map((h, idx) => [h.trim(), r[idx] ?? ""])));
}

export function loadCandidates(text: string, isCsv: boolean): Record<string, unknown>[] {
  let rows: unknown;
  if (isCsv) {
    rows = parseCsv(text);
  } else {
    rows = JSON.parse(text);
    if (rows && typeof rows === "object" && !Array.isArray(rows)) {
      rows = (rows as Record<string, unknown>).candidates ?? [];
    }
  }
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("No candidates found in input.");
  }
  return rows as Record<string, unknown>[];
}
