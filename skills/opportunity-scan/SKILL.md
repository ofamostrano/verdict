---
name: opportunity-scan
description: Research and score venture opportunities on a weighted six-axis rubric, producing a ranked opportunity register with kill rules, evidence-velocity estimates, and non-dilutive funding fit. Use when the user asks to find business or startup ideas, rank market gaps, evaluate which idea to build first, refresh an existing opportunity list, or asks "what should I build" or "which of these is fundable".
---

# Opportunity Scan

## Purpose

Turn a broad market question into a **ranked, scored, auditable opportunity register** that survives investor scrutiny. This is Stage 0 of the venture pipeline; its output feeds `discovery-gate`, then `spmp`.

An unranked list of ideas is a brainstorm. A register with weighted scores, named sources, and explicit kill rules is a decision instrument. Produce the latter.

## When to Activate

- "Find me startup ideas in X" or "where are the market gaps"
- "Rank these ideas" or "which one should I build first"
- "Refresh my opportunity list" or "rescore this against current conditions"
- The user supplies a prior list of ideas and wants it made rigorous
- Before any `spmp` run where the idea has not been scored

## Workflow

1. **Frame the search space.** Confirm sector, geography, buyer type, and capital constraint. Absent guidance, default to vertical B2B software in the user's home market under a solo-founder capital constraint.
2. **Research in waves.** Wave 1: market structure and adoption gaps. Wave 2: named demand signals carrying dates. Wave 3: incumbents, funding, and whitespace. Open sources rather than relying on search snippets.
3. **Draft candidates.** Aim for 20–50. Breadth first; scoring removes the weak ones.
4. **Score every candidate** on the six axes below, using `scripts/score_opportunities.py`.
5. **Apply kill rules** before ranking.
6. **Write the register** per "Output Structure".
7. **Recommend one** candidate, name the second and third as fallbacks, and state what new information would reverse the choice. Then hand off to `discovery-gate`.

## The Six-Axis Rubric

Score each axis 1–5. Weights are fixed; do not silently change them.

| Axis | Weight | What a 5 looks like | What a 1 looks like |
|---|---|---|---|
| **Pain intensity** | 25% | Quantified annual loss per buyer, in dollars or hours, from a named source | "Users find this annoying" |
| **Moat durability** | 20% | Regulatory specificity, proprietary data, or a domain ontology a horizontal tool cannot replicate | A prompt wrapper any competitor ships in a weekend |
| **Buyer reachability** | 15% | A solo founder reaches 20 real buyers within 30 days through a named channel | Buyer is an enterprise committee on a 12-month cycle |
| **Evidence velocity** | 20% | Credible path to roughly $10k MRR or 1,000 engaged users within 3 months of launch | Evidence needs a multi-year pilot or a clinical endpoint |
| **Capital efficiency** | 10% | First evidence achievable under $20k of build | Requires hardware, licenses, or a data acquisition budget |
| **Non-dilutive fit** | 10% | Matches a named grant, SBIR, or state program with an open call | No public funding pathway exists |

Pain and moat dominate because together they determine whether the business can exist at all. Evidence velocity carries heavy weight because launch speed correlates strongly with capital raised, and because the seed bar is now an evidence bar rather than an idea bar. `references/scoring_rubric.md` holds the sourced reasoning, per-level anchors for all six axes, and standing market findings to verify rather than re-derive.

### Hard Kill Rules

Apply before ranking. A candidate is killed outright, not merely down-ranked, when any of these hold.

1. Pain intensity scores 1. Nobody pays to fix mild irritation.
2. Moat durability scores 1. A horizontal incumbent or a weekend competitor takes the market.
3. The capability is one a vendor already sells off the shelf and the idea amounts to reselling it. Apply the vendor test from `build-vs-buy`.
4. Evidence requires a regulated approval unobtainable at the founder's current stage (clinical trial, banking charter, insurance license) with no interim wedge.
5. Willingness to pay is structurally near zero, such as volunteer-run nonprofits with no budget line, or consumers for a workflow tool.

State each kill explicitly with its reason. Killed ideas are evidence of rigor, not wasted work.

## Output Structure

### 1. Search Frame
One paragraph covering sector, geography, buyer, capital constraint, and the scan date. Scoring is time-sensitive; an undated register is worthless within months.

### 2. Market Context
Four to eight sourced findings that shape the whole register: adoption rates, failure rates, funding conditions, regulatory changes. Each names its source and year. This section is what makes the ranking defensible rather than opinionated.

### 3. Scored Register
A table sorted by weighted score, descending, with columns for rank, opportunity, each of the six axis scores, the weighted total, and a verdict of **Pursue**, **Hold**, or **Killed (reason)**.

### 4. Top Three, Expanded
For each of the top three, write a compact profile covering the quantified loss the buyer absorbs today with its source; the single workflow to attack first; the specific moat mechanism; the first evidence target with metric, date, and build cost; two or three named comparables and what each got right; and the funding pathways including any named non-dilutive program.

### 5. Killed Candidates
A brief table of kills with reasons.

### 6. Recommendation
One paragraph naming the pick, the runner-up, and the specific new information that would reverse the choice. Close by handing off: the next step is `discovery-gate` on the chosen candidate.

## Style Rules

1. Every number carries a named source and year. Never write "industry estimates."
2. When no published figure exists, build the number bottom-up and show the arithmetic. Never invent a figure or attribute one to a source not actually read.
3. Score the idea in front of you, not its best possible version. Optimism belongs in the pitch, not the register.
4. Prefer verticals with regulatory or data specificity over horizontal tools; horizontal AI tooling has a very high mortality rate.
5. Name the buyer as a job title, not a market segment. "VP of Compliance at a 200-person importer" beats "mid-market enterprises."
6. State what would change your mind. A register that cannot be falsified is marketing.

## Resources

- `scripts/score_opportunities.py` — computes weighted scores, applies kill rules, and emits a sorted Markdown table plus CSV. Accepts JSON or CSV candidate input; run with `--help` for the schema.
- `references/scoring_rubric.md` — sourced reasoning behind each axis and weight, scoring anchors at every level, and standing market-context findings. Read before scoring for the first time in a session.
- `references/research_sources.md` — source hierarchy for market sizing and demand signals, which publisher categories to trust for which claim type, and search patterns that surface dated demand signals rather than vendor content marketing.
