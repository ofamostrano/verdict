# Model Conventions

## Formula discipline

Every computed cell references the Assumptions tab or another computed cell. No literal numbers appear outside Assumptions, with the single exception of the month index row. This rule is what makes the model usable in a live meeting: a partner changes one cell and every dependent figure moves. A model with buried constants cannot survive that test, and being unable to survive it reads as either carelessness or concealment.

Name the ranges. `Assumptions!$B$4` is fragile under edits and unreadable in review; a defined name such as `price_monthly` survives insertion of rows and communicates intent.

## Definitions used

These specific definitions are used throughout. Investors will ask which convention was applied, and inconsistency between the pitch and the workbook is a credibility problem rather than a rounding problem.

**CAC** is fully loaded customer acquisition cost: all sales and marketing spend in a period, including salaries and tooling, divided by new customers acquired in that period. Excluding salaries produces a flattering number that will be corrected in diligence.

**Gross margin** is revenue less cost of revenue, where cost of revenue includes hosting, inference, third-party per-transaction fees, payment processing, and any human-in-the-loop labor required to deliver the service. Support labor for delivery belongs in COGS; general customer success belongs in operating expense.

**LTV** is average revenue per account multiplied by gross margin, divided by monthly logo churn. Computing LTV from revenue rather than gross profit overstates it by the inverse of the margin, which for an AI product with a 60% margin means a 67% overstatement.

**CAC payback** is CAC divided by monthly gross profit per account, expressed in months. Not revenue per account.

**Net revenue retention** is beginning-period revenue from a cohort, plus expansion, less contraction and churn, divided by beginning-period revenue. Report it alongside logo churn, since a product can retain revenue while losing logos, and the two tell different stories about the business.

**Burn multiple** is net burn divided by net new ARR for the same period. It is the fastest single read on capital efficiency and is increasingly asked for directly.

## Cost per successful task

For AI products this replaces naive per-call costing.

Let `C_total` be all inference, tool-call, and retrieval spend in a period. Let `T_success` be tasks completed correctly without human correction, and `T_attempted` be all attempts. Then cost per successful task equals `C_total / T_success`, which necessarily exceeds `C_total / T_attempted` whenever the failure rate is above zero.

Add the fallback labor term. If `r` is the human-intervention rate and `L` the fully loaded labor cost of one intervention, then the delivered cost per successful task is `C_total / T_success + r * L`. This term is why an agent product's gross margin is a function of its reliability, and why reliability improvements are margin improvements rather than merely quality improvements. Model it explicitly so that the connection is visible.

Two further terms matter at scale. Retry amplification: if a task retries an average of `k` times before success, inference cost per success scales roughly with `k`. And context growth: cost per call tends to rise as conversation or document context grows within a task, so cost per task is not linear in task count for long-running workflows.

## Sensitivity construction

Build a one-variable-at-a-time tornado. For each input, hold all others at base and swing the tested input by a stated relative amount, conventionally minus 30% and plus 30%, recording the resulting swing in the chosen output metric. Rank inputs by absolute swing, largest first. Two-way data tables are useful for the top two variables but do not replace the ranked tornado, whose purpose is to identify which single number the business actually depends on.

Choose the output metric deliberately. Month-36 EBITDA answers a different question than minimum cash or LTV/CAC. For a pre-seed or seed model, minimum cash is usually the output that matters, because it determines the size of the raise.

Always report the breakeven value of the dominant variable: the churn rate, CAC, or price at which the business stops working. A model that states its own breaking point is far more persuasive than one that only projects success, because it demonstrates the founder has looked for the failure mode.

## Scenario triggers

A scenario without a named trigger is an arithmetic exercise. Each of base, bear, and bull names the event that would produce it, and the leading indicator that would show it happening early.

A workable pattern: the bear case is triggered by a named competitor shipping the wedge feature, or by a regulatory delay, with a leading indicator of win-rate decline in competitive deals. The bull case is triggered by a channel partnership or a regulatory deadline pulling demand forward, with a leading indicator of inbound volume. The base case assumes neither and is the one against which hiring is planned.

## Assumption grading

Grade every assumption cell and show the key on the README tab.

GREEN means the figure comes from a named external source or from the venture's own measured data, with the citation recorded in a comment or an adjacent column. AMBER means it is a founder estimate that is reasonable but untested. RED means it is a placeholder that must be replaced before the model is shown to anyone.

Grade honestly. A model with several AMBER cells and an explicit list of the cheapest tests to resolve them is more credible than a model that presents every input as fact. The disclosure signals that the founder knows which numbers are load-bearing, and volunteering the weak points removes the diligence pleasure of discovering them.

## Diligence questions each tab answers

| Tab | The question it exists to answer |
|---|---|
| Assumptions | What do you believe, and how do you know it? |
| Unit Economics | Does each customer pay back the cost of acquiring them, and how fast? |
| AI Cost | Does the gross margin survive real usage and real failure rates? |
| P&L | When does this stop losing money, and on what revenue? |
| Cash | How much do you need, and what happens if the raise slips a quarter? |
| Sensitivity | Which single number is the business actually betting on? |
| Scenarios | What has to happen for this to work, and what would tell you early that it will not? |

## Presentation

Format currency with no decimal places, percentages to one decimal, and ratios to two. Freeze panes below the header row. Keep a single column of row labels and never merge cells, since merged cells break sorting and downstream parsing. Print-fit each tab to one page wide; a workbook that prints badly is read badly.
