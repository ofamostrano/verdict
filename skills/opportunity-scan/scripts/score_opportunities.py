#!/usr/bin/env python3
"""Score venture opportunities on the weighted six-axis rubric.

Input: a JSON array or a CSV with one row/object per candidate.

Required fields per candidate:
    name        str   the opportunity name
    pain        int   1-5  pain intensity          (weight 25%)
    moat        int   1-5  moat durability         (weight 20%)
    reach       int   1-5  buyer reachability      (weight 15%)
    velocity    int   1-5  evidence velocity       (weight 20%)
    capital     int   1-5  capital efficiency      (weight 10%)
    grant       int   1-5  non-dilutive fit        (weight 10%)

Optional fields:
    kill        str   a manual kill reason; forces a Killed verdict
    note        str   short rationale carried into the output table

Kill rules applied automatically:
    pain == 1   -> killed (no willingness to pay)
    moat == 1   -> killed (no defensibility)
    any manual `kill` string -> killed with that reason

Verdicts on surviving candidates:
    weighted >= 3.75  -> Pursue
    weighted >= 3.00  -> Hold
    otherwise         -> Pass

Usage:
    python score_opportunities.py candidates.json
    python score_opportunities.py candidates.csv --csv-out scored.csv
    python score_opportunities.py candidates.json --md-out register.md
    python score_opportunities.py --template          # print an input template
"""

import argparse
import csv
import json
import sys
from pathlib import Path

WEIGHTS = {
    "pain": 0.25,
    "moat": 0.20,
    "reach": 0.15,
    "velocity": 0.20,
    "capital": 0.10,
    "grant": 0.10,
}

AXIS_LABELS = {
    "pain": "Pain",
    "moat": "Moat",
    "reach": "Reach",
    "velocity": "Velocity",
    "capital": "Capital",
    "grant": "Grant",
}

PURSUE_THRESHOLD = 3.75
HOLD_THRESHOLD = 3.00

TEMPLATE = [
    {
        "name": "AI prevailing-wage payroll compliance for public-works contractors",
        "pain": 5,
        "moat": 5,
        "reach": 4,
        "velocity": 4,
        "capital": 4,
        "grant": 3,
        "note": "Davis-Bacon penalties quantified; per-employee SaaS; reachable via contractor associations",
    },
    {
        "name": "AI personal brand content generator",
        "pain": 2,
        "moat": 1,
        "reach": 4,
        "velocity": 3,
        "capital": 5,
        "grant": 1,
        "note": "Saturated; no defensibility",
    },
]


def load_candidates(path: Path):
    text = path.read_text(encoding="utf-8")
    if path.suffix.lower() == ".csv":
        rows = list(csv.DictReader(text.splitlines()))
    else:
        rows = json.loads(text)
        if isinstance(rows, dict):
            rows = rows.get("candidates", [])
    if not isinstance(rows, list) or not rows:
        raise SystemExit("No candidates found in input.")
    return rows


def coerce_axis(value, field, name):
    try:
        score = int(str(value).strip())
    except (TypeError, ValueError):
        raise SystemExit(f"Candidate '{name}': field '{field}' is not an integer (got {value!r}).")
    if not 1 <= score <= 5:
        raise SystemExit(f"Candidate '{name}': field '{field}' must be 1-5 (got {score}).")
    return score


def score_candidate(raw):
    name = str(raw.get("name") or raw.get("opportunity") or "").strip()
    if not name:
        raise SystemExit("Every candidate needs a 'name' field.")

    axes = {}
    for field in WEIGHTS:
        if field not in raw or raw[field] in ("", None):
            raise SystemExit(f"Candidate '{name}' is missing required field '{field}'.")
        axes[field] = coerce_axis(raw[field], field, name)

    weighted = round(sum(axes[f] * w for f, w in WEIGHTS.items()), 3)

    kills = []
    manual = str(raw.get("kill") or "").strip()
    if manual:
        kills.append(manual)
    if axes["pain"] == 1:
        kills.append("pain intensity 1: no willingness to pay")
    if axes["moat"] == 1:
        kills.append("moat durability 1: no defensibility")

    if kills:
        verdict = "Killed"
        reason = "; ".join(kills)
    else:
        reason = ""
        if weighted >= PURSUE_THRESHOLD:
            verdict = "Pursue"
        elif weighted >= HOLD_THRESHOLD:
            verdict = "Hold"
        else:
            verdict = "Pass"

    return {
        "name": name,
        **axes,
        "weighted": weighted,
        "verdict": verdict,
        "reason": reason,
        "note": str(raw.get("note") or "").strip(),
    }


def sort_key(row):
    # Killed candidates always sort to the bottom, then by weighted score descending.
    return (row["verdict"] == "Killed", -row["weighted"], row["name"].lower())


def to_markdown(rows):
    header = ["Rank", "Opportunity"] + [AXIS_LABELS[a] for a in WEIGHTS] + ["Weighted", "Verdict"]
    lines = ["| " + " | ".join(header) + " |", "|" + "---|" * len(header)]

    rank = 0
    for row in rows:
        if row["verdict"] == "Killed":
            rank_cell = "—"
            verdict_cell = f"Killed ({row['reason']})"
        else:
            rank += 1
            rank_cell = str(rank)
            verdict_cell = row["verdict"]
        cells = [rank_cell, row["name"]] + [str(row[a]) for a in WEIGHTS]
        cells += [f"{row['weighted']:.2f}", verdict_cell]
        lines.append("| " + " | ".join(cells) + " |")

    surviving = [r for r in rows if r["verdict"] != "Killed"]
    killed = [r for r in rows if r["verdict"] == "Killed"]
    lines.append("")
    lines.append(
        f"{len(rows)} candidates scored: {len(surviving)} surviving, {len(killed)} killed. "
        f"Thresholds: Pursue >= {PURSUE_THRESHOLD:.2f}, Hold >= {HOLD_THRESHOLD:.2f}."
    )

    notes = [r for r in rows if r["note"]]
    if notes:
        lines.append("")
        lines.append("Notes:")
        for row in notes:
            lines.append(f"- **{row['name']}** — {row['note']}")

    return "\n".join(lines)


def write_csv(rows, path):
    fields = ["name"] + list(WEIGHTS) + ["weighted", "verdict", "reason", "note"]
    with open(path, "w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        for row in rows:
            writer.writerow({f: row[f] for f in fields})


def main():
    parser = argparse.ArgumentParser(
        description="Score venture opportunities on the weighted six-axis rubric.",
        epilog="Axis weights: pain 25%, moat 20%, velocity 20%, reach 15%, capital 10%, grant 10%.",
    )
    parser.add_argument("input", nargs="?", help="Path to candidates JSON or CSV.")
    parser.add_argument("--csv-out", help="Write the scored register to this CSV path.")
    parser.add_argument("--md-out", help="Write the Markdown table to this path.")
    parser.add_argument("--template", action="store_true", help="Print an input template and exit.")
    args = parser.parse_args()

    if args.template:
        print(json.dumps(TEMPLATE, indent=2))
        return

    if not args.input:
        parser.error("an input path is required (or use --template)")

    path = Path(args.input)
    if not path.exists():
        raise SystemExit(f"Input not found: {path}")

    rows = [score_candidate(raw) for raw in load_candidates(path)]
    rows.sort(key=sort_key)

    markdown = to_markdown(rows)
    print(markdown)

    if args.md_out:
        Path(args.md_out).write_text(markdown + "\n", encoding="utf-8")
        print(f"\nMarkdown written to {args.md_out}", file=sys.stderr)
    if args.csv_out:
        write_csv(rows, args.csv_out)
        print(f"CSV written to {args.csv_out}", file=sys.stderr)


if __name__ == "__main__":
    main()
