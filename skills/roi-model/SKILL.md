---
name: roi-model
description: Build an investor-grade financial model as a working Excel workbook with live formulas — unit economics, cost per successful AI task, 36-month P&L and cash, sensitivity tornado, and named scenarios — plus the buyer-side ROI case that justifies the price. Use when the user asks for unit economics, LTV/CAC, a financial model, revenue projections, runway, payback period, pricing justification, or "show the ROI".
---

# ROI Model

## Purpose

Produce the one artifact investors actually stress-test: a **workbook with live formulas**, not prose containing numbers. Two models live inside it. The **buyer-side ROI case** proves the customer saves more than the price. The **company-side model** proves the business compounds. A pitch that asserts ROI in a sentence loses to a pitch that lets a partner change the churn assumption and watch the outcome move.

Every unsourced cell will be found in diligence. Label it first.

## When to Activate

- "Show me the unit economics" / "what's the LTV/CAC" / "build a financial model"
- Pricing needs justification, or a price point must be chosen before build
- An investor asked for projections, runway, or a payback period
- After `build-vs-buy`, because cost shape is a model input
- Before `executive-summary` or `pitch-deck`, both of which quote this model

## Workflow

1. **Gather inputs.** Pull cost shape from `build-vs-buy`, pricing and segment from `spmp`, and buyer-side loss figures from `opportunity-scan`. Ask only for what is genuinely missing.
2. **Choose the pricing architecture before modeling.** Per seat, per workspace, per organization, per transaction, or tiered subscription. This decision drives the schema, permissions, and every downstream formula; changing it after customers exist requires migrations.
3. **Build the buyer-side ROI case first.** If the customer's savings do not exceed the price by a comfortable multiple, the company-side model is fiction.
4. **Generate the workbook** with `scripts/build_roi_model.py`, then adjust the assumptions tab to the specific venture.
5. **Run sensitivity and scenarios**, and record which variable dominates.
6. **Write the model memo** per "Output Structure", quoting figures from the workbook rather than restating them by hand.

## Buyer-Side ROI Case

State it as a single defensible sentence backed by arithmetic: the buyer currently loses a quantified amount per year; the product recovers a stated share of it; the price is a stated fraction of the recovery; payback arrives in a stated number of weeks.

Rules. Use the buyer's own cost basis, not a national average, whenever it is obtainable. Count only recovery the product actually causes, and discount claimed savings by a stated haircut for partial adoption. Where the loss is a penalty or a write-off rather than labor time, prefer it — avoided penalties are far more persuasive than hypothetical hours saved, because the buyer has already felt them.

## Company-Side Model: Required Tabs

The generator produces this structure. Do not collapse tabs; investors navigate by them.

| Tab | Contents | Non-obvious requirement |
|---|---|---|
| **README** | Model purpose, version, date, source key | Every assumption is marked GREEN (sourced), AMBER (founder estimate), or RED (placeholder) |
| **Assumptions** | Price, CAC by channel, conversion, churn, seat expansion, headcount, tooling | Single source of truth; every other tab references it and hard-codes nothing |
| **Unit Economics** | CAC, gross margin, LTV, LTV/CAC, payback months, contribution margin | LTV computed from gross margin and churn, never from revenue |
| **AI Cost** | Cost per successful task, task volume, failure rate, retry cost | Cost per *successful* task, not per call |
| **P&L** | 36 months of revenue, COGS, gross profit, operating expense, EBITDA | Monthly, not annual; annual granularity hides the cash trough |
| **Cash** | Opening cash, burn, closing cash, runway months, minimum cash point | Flags the month cash goes negative without a raise |
| **Sensitivity** | One-variable tornado on churn, CAC, price, conversion, AI cost | Ranked by output swing so the dominant variable is visible |
| **Scenarios** | Base, bear, bull with named triggers | Each scenario names the event that would cause it, not just a percentage |

## The AI Cost Tab

For any AI-powered product this tab is what separates an honest gross margin from an optimistic one.

Model cost per **successful** task rather than per API call. An agent costing little per call but failing half the time is more expensive per completed task than one costing more per call and rarely failing. Compute cost per successful task as total inference and tool cost divided by successfully completed tasks, including retries and abandoned attempts in the numerator.

Include the human-fallback cost. Every task routed to a person carries a labor cost, and the human-intervention rate is therefore a gross-margin input, not merely a quality metric. A product with a 30% intervention rate has a services business hiding inside it, and the model should show that rather than conceal it.

Model the cost curve, not a point. Inference prices fall while usage per account tends to rise; state both assumptions explicitly and let the sensitivity tab test them.

## Investor Thresholds

Benchmarks to compute and state plainly, with an explanation rather than a fudge when one is missed.

| Metric | Threshold | Notes |
|---|---|---|
| LTV/CAC | 3.0 or better | Below 3 at seed is acceptable if the trend is improving and the reason is named |
| CAC payback | 18 months or less | Under 12 for SMB motions; longer is tolerated only for enterprise contract sizes |
| Gross margin | 70%+ for software | AI inference and human fallback are the two things that break this |
| Net revenue retention | 100%+ | Below 100% means growth is a treadmill |
| Monthly logo churn | Under 3% for SMB, under 1% for mid-market | Churn dominates LTV more than any other variable |
| Evidence at seed | Roughly $10k MRR or 1,000 engaged users | Approximately 78% of B2B seed deals present one of these; at $99 per month that is about 100 accounts |
| Burn multiple | Under 2.0 | Net burn divided by net new ARR |

## Output Structure

### 1. Headline
Three sentences: the buyer-side ROI claim, the unit economics claim, and the ask with what it funds.

### 2. Buyer ROI Case
The arithmetic in a compact table, with the source for the loss figure named.

### 3. Unit Economics Table
Metric, value, threshold, verdict. Include the account arithmetic behind the evidence target.

### 4. Sensitivity Findings
The dominant variable named, with the breakeven value at which the business stops working. A model that cannot state its own breakeven has not been interrogated.

### 5. Scenarios
Base, bear, bull, each with its named trigger and resulting runway.

### 6. Assumption Register
Every AMBER and RED assumption listed, with the cheapest test that would turn it GREEN. This is the honest disclosure that earns credibility rather than costing it.

## Style Rules

1. The workbook is the deliverable; the memo quotes it. Never present a financial model as prose alone.
2. No hard-coded numbers outside the Assumptions tab.
3. Every assumption is color-graded. Unsourced optimism gets labeled before an investor labels it.
4. Compute LTV from gross margin and churn. Revenue-based LTV inflates every downstream ratio.
5. Monthly granularity for 36 months. Annual models hide the cash trough that determines the raise size.
6. State breakevens, not just outputs.
7. Never present a scenario without its trigger event.
8. When a threshold is missed, say so in the same sentence as the number.

## Resources

- `scripts/build_roi_model.py` — generates the eight-tab workbook with live formulas, color-graded assumptions, sensitivity tornado, and scenario switches. Driven by a JSON assumptions file; run with `--help` for the schema and `--template` to emit a starting assumptions file.
- `references/model_conventions.md` — formula conventions, the LTV and payback definitions used, AI cost-per-successful-task derivation, sensitivity construction, and the diligence questions each tab is built to answer. Read before modifying the generator's structure.
