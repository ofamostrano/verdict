---
name: investor-targeting
description: Build a ranked, thesis-matched capital target list across pre-seed to growth equity, angel groups, accelerators, and non-dilutive grant programs, with per-firm evidence requirements, warm-path mapping, and outreach sequencing. Use when the user asks who to pitch, which VCs or angels fit their company, how to approach a specific firm, what evidence a firm expects, or asks about grants, SBIR, accelerators, or a fundraising plan.
---

# Investor Targeting

## Purpose

Turn a finished pitch into a **ranked, sequenced capital plan**. A deck sent to a list of famous firms is a lottery ticket. A deck sent to twelve firms whose stated thesis matches the company's stage, sector, geography, and check size — each with the specific evidence that firm requires — is a process.

This runs after `validation-loop` produces evidence and alongside `executive-summary` and `pitch-deck`. Targeting before evidence exists wastes the one first impression each firm affords.

## When to Activate

- "Who should I pitch" / "which VCs fit us" / "build me an investor list"
- The user names a specific firm and asks how to approach it
- The user asks about grants, SBIR, accelerators, or non-dilutive funding
- After `validation-loop` returns an iterate verdict with evidence at or near the stage bar
- The user is planning a raise and needs sequencing

## Workflow

1. **Fix the company's coordinates.** Stage, sector, geography, round size, current evidence, and any conflicts (competing portfolio companies, prior conversations, existing investors' preferences).
2. **Determine the honest stage.** Match evidence to stage rather than aspiration; pitching a seed-stage firm with pre-seed evidence produces a polite pass that closes the door for the round that would have fit.
3. **Build the target list by tier**, working outward from the strongest geographic and thesis fit. See `references/capital_landscape.md` for the standing landscape, with Boston and Cambridge mapped in depth.
4. **Score thesis fit** for each firm on the five factors below.
5. **Map warm paths.** Every target gets a named path or is explicitly marked cold.
6. **Run the non-dilutive track in parallel.** Grants and SBIR operate on their own calendars and do not compete with equity.
7. **Sequence outreach** so the lowest-information conversations happen first.
8. **Deliver the plan** per "Output Structure".

## Thesis Fit Scoring

Score each firm 1–5 on five factors, then rank by the total.

| Factor | A 5 looks like |
|---|---|
| **Stage fit** | The firm leads at this exact stage and check size; the company's evidence matches what its recent deals showed |
| **Sector thesis** | The firm has published a thesis, request-for-startups, or several investments in this specific vertical |
| **Geography** | The firm invests actively in the company's metro, or has a local partner |
| **Portfolio adjacency** | Portfolio companies are adjacent enough to signal understanding, without a direct competitor creating a conflict |
| **Warm path** | A named person can make a credible introduction |

Ranking rules. Portfolio adjacency cuts both ways: adjacency without conflict is the strongest positive signal available, while a direct competitor in portfolio is close to disqualifying and should be verified before outreach. A firm with a 5 on warm path and 3s elsewhere generally outranks a firm with 5s elsewhere and a cold approach, because the introduction determines whether the material is read at all. Check size discipline matters more than brand: a firm whose minimum check exceeds the round size cannot participate regardless of enthusiasm.

## Per-Firm Evidence Requirements

For each target, state what that firm needs to see, not what the company happens to have. Different capital types read different signals.

Institutional seed funds want the evidence bar met — roughly $10,000 MRR or 1,000 engaged users for the large majority of B2B seed deals — plus a defensible market size and a credible path to a Series A metric. Pre-seed and micro funds will engage on a sharp wedge, founder-market fit, and early usage before revenue exists. Angel groups and syndicates weight the founder's story and personal credibility more heavily and generally run a formal screening then a presentation cycle, which takes weeks and should be started early. Accelerators select on team and rate of progress rather than traction, and operate on fixed batch deadlines that must be worked backward from. Growth and multistage funds require durable unit economics and retention data, and are irrelevant to a first raise, though naming them as the intended next round demonstrates a plan. Banks and revenue-based lenders read revenue history, margins, and repayment capacity rather than growth narrative. Grant programs read public benefit, technical merit, and alignment to stated program objectives, and generally require the ask to be framed as impact rather than return.

Adapt the packaging accordingly: `executive-summary` and `pitch-deck` both carry audience variations for VC, grant, bank, and angel readers. Sending the VC version to a grant reviewer signals that the program's objectives were not read.

## Non-Dilutive Track

Run this in parallel, always. Non-dilutive capital extends runway without changing the cap table, and an awarded grant is third-party validation that costs no equity.

Assess fit against federal programs (SBIR and STTR across NSF, NIH, DoE, DoD, and others, which fund research-and-development risk rather than commercial traction), state and regional programs, sector-specific foundations and challenge prizes, and corporate or platform credit programs that reduce burn without being capital at all. `references/capital_landscape.md` names the Massachusetts programs specifically.

Two disciplines. Verify the call is actually open and note the deadline before recommending a program; a closed program is not a pathway. And match the product to the program's stated objectives in the program's own language, because reviewers score against published criteria rather than against commercial merit.

## Warm Path Mapping

For every target, identify the path: a portfolio founder, a shared operator, a university or accelerator affiliation, an existing angel who can vouch, a customer who knows the partner, or a scout. Where no path exists, mark the target cold and decide deliberately whether to approach anyway.

Cold outreach is not futile but it is a different instrument. It works when the message names a specific thesis the firm published and connects it to a specific measured result, in under 150 words. It fails as a generic deck attachment.

Order the paths by strength: a portfolio founder's introduction, a co-investor's introduction, a customer or domain expert's introduction, then cold outreach referencing published work.

## Output Structure

### 1. Company Coordinates
Stage, sector, geography, round size and structure, current evidence stated in measured numbers, and known conflicts. One short block.

### 2. Ranked Target List

| Rank | Firm | Type | Stage | Typical check | Thesis fit | Evidence they need | Warm path | Status |
|---|---|---|---|---|---|---|---|---|

Cap the list at fifteen to twenty-five names. A longer list is not a plan; it is an admission that no targeting occurred.

### 3. Tier Rationale
Two or three sentences per tier explaining why those firms are grouped and what would move a firm between tiers.

### 4. Non-Dilutive Pipeline

| Program | Award size | Deadline | Fit rationale | Effort estimate | Owner |
|---|---|---|---|---|---|

### 5. Outreach Sequence
A week-by-week sequence. Open with the lowest-information conversations — firms where a pass costs least — to refine the narrative before approaching the highest-value targets. Batch outreach so that a round has momentum rather than trickling across months, and note that a firm's process length, particularly for angel groups and accelerators with fixed cycles, determines when it must be contacted rather than when it is preferred.

### 6. Materials Checklist
Which artifact each target type receives, mapped to the audience variations in `executive-summary` and `pitch-deck`, plus the data room contents: the ROI workbook from `roi-model`, the evidence dossier from `validation-loop`, and the trust pack from `trust-pack`.

## Style Rules

1. Never recommend a firm without stating its stage and check size. Brand is not fit.
2. State the evidence each firm needs, then state honestly whether the company has it. Where it does not, say what would close the gap and how long it takes.
3. Verify grant calls are open and name the deadline.
4. Check for portfolio conflicts before recommending outreach.
5. Cap the list. Focus is the deliverable.
6. Recommend the audience-appropriate variant of each document rather than one universal deck.
7. Do not advise pitching before the evidence bar is met unless the purpose is explicitly to build a relationship ahead of the round, in which case label it as such so it is not mistaken for a raise.

## Resources

- `references/capital_landscape.md` — the standing capital landscape: Boston and Cambridge firms mapped by tier with sector focus and stage, national pre-seed and seed funds, angel groups and syndicates, accelerators, university-affiliated funds, multistage firms, and Massachusetts plus federal non-dilutive programs. Read when building any target list; verify current stage focus and check sizes before delivering, since funds drift.
