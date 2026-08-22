---
name: validation-loop
description: Design and run the post-build evidence loop — instrumentation plan, validation method selection, cohort design, agent reliability metrics, and an evidence dossier measured against the seed funding bar. Use after a prototype or MVP is deployed, when the user asks how to test or validate a product, how to get traction or first users, what metrics to track, whether they are ready to raise, or how to prove an AI agent is reliable enough to trust.
---

# Validation Loop

## Purpose

Convert a deployed product into **evidence an investor accepts**. This is the stage the document-first workflows omit, and it is the stage that determines whether a raise happens. Approximately 78% of B2B seed deals present roughly $10,000 in monthly recurring revenue or 1,000 or more engaged users; a working demo without paying users does not clear that bar. The loop's job is to reach it, or to establish quickly that this product will not.

The loop also decides direction. Its output is one of three verdicts: **iterate** (the wedge works, sharpen it), **pivot** (the buyer is real but the wedge is wrong), or **stop** (the demand is not there). Routing that decision through measured evidence rather than founder conviction is the entire point.

## When to Activate

- A prototype, MVP, or landing page is live
- The user asks how to get first users, test the product, or prove traction
- The user asks whether they are ready to raise
- An AI agent needs to be shown reliable enough to hand tasks to
- Metrics exist but no one has decided what they mean

## Workflow

1. **Set the evidence target before collecting anything.** Name the metric, the threshold, and the date. Targets set afterward are always met.
2. **Write the instrumentation plan.** Retention and renewal instrumented from day one, not months in; without a baseline there is nothing to compare against, and renewal is the number that answers whether the subscription earned its place.
3. **Select validation methods** from the catalogue below, matched to the stage and the assumption under test.
4. **Design the cohort.** Narrow and paid beats broad and free.
5. **Run, then read the numbers against the pre-set thresholds.**
6. **Write the evidence dossier** per "Output Structure".
7. **Issue the verdict** — iterate, pivot, or stop — and route accordingly. A failed loop returns to `discovery-gate`, never straight to `pitch-deck`.

## Validation Method Catalogue

Match the method to the assumption, and prefer methods where the user's behavior costs them something.

| Method | Assumption tested | Signal strength | Notes |
|---|---|---|---|
| **Pre-sale or paid pilot** | Willingness to pay | Strongest | Money is the only unambiguous signal. Offer a discount for buying before availability, then deliver what was promised. |
| **Narrow paid cohort with renewal watch** | Retention and real value | Strongest | Renewal tells more than any volume of free signups. This is the method for a SaaS MVP. |
| **Waitlist with qualification** | Demand and reachability | Moderate | Qualify entries; an unqualified list measures curiosity, not demand. |
| **Landing page with a specific offer** | Message and demand | Moderate | A/B test the offer, not the button color. Track conversion to a costly action. |
| **Customer interviews** | Problem shape and language | Moderate, qualitative | Fewer responses than surveys but far richer. Ask about past behavior, not future intentions. |
| **Clickable prototype walkthrough** | Flow comprehension | Moderate | Watch where the user hesitates rather than asking whether they like it. |
| **Hallway testing** | Usability for first-time users | Weak but cheap | Give a task, watch silently, count completions. |
| **Surveys and PMF survey** | Aggregate sentiment | Weak alone | Useful for segmenting, misleading as a demand proxy. |
| **Crowdsourced launch (Product Hunt, community)** | Distribution and message | Weak for demand | Produces a spike, not a trend. Measure week-two retention, not launch-day signups. |
| **Crowdfunding campaign** | Demand plus capital | Strong where the product suits it | Distinct from crowdsourcing: this raises money and validates simultaneously. |

Two rules govern selection. Prefer methods where saying yes costs the respondent something — money, calendar time, a public commitment. And validation is not confined to post-launch: waitlists, landing pages, pre-sales, and interviews all run before a line of product code exists, which is where they are cheapest.

## Instrumentation Plan

Instrument these from the first deploy. Adding them later loses the baseline permanently.

**Activation:** the sequence of actions leading to first value, with a drop-off count at each step. Define "activated" as a specific completed action, not a signup. New users should reach first success within minutes through a guided sequence rather than landing in an empty dashboard.

**Engagement:** the meaningful recurring action, counted per account per week. "Engaged" means consistent completed workflows, not one-time signups; a thousand engaged users only counts as evidence under that definition.

**Retention and renewal:** weekly and monthly cohort retention, plus renewal and churn from the first billing cycle. This is the instrumentation most often skipped and most often needed.

**Revenue:** MRR, new versus expansion versus churned, and conversion from trial to paid.

**Billing edge states:** failed payments, plan changes, cancellations. These are part of the MVP rather than a follow-up sprint, and they break in front of the first real customer who tries to upgrade.

**Qualitative capture:** a standing mechanism for user comments tied to the account, so quantitative anomalies can be explained.

## Agent Reliability Metrics

For products where an AI agent completes multi-step tasks, four numbers govern, and none substitutes for another.

**Task completion rate** — the share of attempts finished correctly without a human correcting or redoing the work. Track per task type; a blended average hides which specific case is failing.

**Human intervention rate** — how often a person steps in, whether through the designed fallback or an unplanned correction. A high but stable rate on a hard task can be acceptable; a rising rate on a task that used to work reliably signals an upstream change in a tool API, an input pattern, or the model itself.

**Cost per successful task** — not cost per call. An agent that is cheap per call but fails half the time costs more per completed task than an expensive one that rarely fails. This figure feeds `roi-model`.

**A trust signal** — evidence a user relied on the output instead of re-verifying it: repeat usage, a decline in reopened tickets, a task completed without step-by-step checking. A technically accurate agent nobody trusts enough to use unsupervised has validated nothing.

Two structural cautions. Errors compound: a step that is right 95% of the time, chained five times, succeeds end to end only about 77% of the time, which is why an agent that looks reliable in a demo fails regularly on real input. And a pre-launch test suite only covers anticipated failure modes; the ones that matter surface from live traffic, so launch narrow — roughly 20 to 50 users — with every step instrumented, and expect a week of real usage to surface more edge cases than months of internal testing.

## Cohort Design

Recruit against the buyer profile named in `opportunity-scan`, not whoever is easiest to reach. A cohort of convenient non-buyers produces confident, worthless data.

Keep the cohort small and paid. A handful of paying customers whose renewal can be watched provides more actionable information than thousands of free users who never intended to pay. Resist launching to everyone; the temptation costs the ability to talk to each user individually.

Set the cohort's success threshold before recruiting, and state the sample size at which the result becomes meaningful. Then define the observation window explicitly, covering at least one full billing cycle, because a subscription business cannot be validated inside a period shorter than its renewal interval.

## Output Structure

### 1. Evidence Target
The metric, threshold, and date, stated as it was set before collection began, with the account arithmetic shown. At $99 per month, $10,000 MRR is approximately 100 paying accounts; naming the account count converts an abstract target into a recruiting plan.

### 2. Instrumentation Status
A table of each metric, whether it is instrumented, and where it is read. Gaps are listed as gaps.

### 3. Results
Measured values against thresholds, with the observation window and sample size stated. Include the qualitative findings that explain the numbers.

### 4. Cohort Analysis
Retention by cohort, renewal outcomes, and the difference between the users who stayed and those who left, stated in terms of what they did rather than who they are.

### 5. Verdict
**Iterate**, **pivot**, or **stop**, with the specific evidence supporting it and the next action with an owner and date. Where the verdict is pivot, name the assumption that failed and hand back to `discovery-gate`.

### 6. Investor-Facing Evidence Summary
A short block quoting only measured numbers, formatted for direct reuse in `executive-summary` and `pitch-deck`. No projections in this block; projections belong in `roi-model` where their assumptions are graded.

## Style Rules

1. Set thresholds before collecting data. Always.
2. Report the sample size and observation window alongside every metric. A conversion rate without a denominator is not a finding.
3. Never present a projection as evidence. Keep measured and modeled figures in separate blocks.
4. Renewal outranks signups; paid outranks free; behavior outranks stated intent.
5. Report the numbers that disappoint. A dossier containing only favorable metrics tells an experienced investor which metrics were omitted.
6. Track agent metrics per task type, never blended.
7. A failed loop routes to `discovery-gate`, not to the deck. Fundraising on unvalidated evidence converts a recoverable product problem into a burned relationship.
