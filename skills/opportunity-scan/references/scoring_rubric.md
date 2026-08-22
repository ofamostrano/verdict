# Scoring Rubric — anchors, reasoning, and standing findings

## Why these six axes and these weights

The rubric encodes four empirical regularities about early-stage software ventures. Each is stated with its source so the weighting can be argued with rather than merely accepted.

**Vertical specificity beats horizontal breadth.** Horizontal AI tooling has an exceptionally high mortality rate, while vertical applications aimed at one industry, one workflow, and one buyer have absorbed the surviving share of the market. This is why moat durability carries 20% and why "a prompt wrapper" is an automatic 1.

**The seed bar is an evidence bar.** Bessemer's State of the Cloud research places the bar for the large majority of B2B seed deals at roughly $10,000 in monthly recurring revenue or 1,000 or more engaged users. A working demo without paying users does not clear it. Evidence velocity therefore carries 20%: an opportunity whose evidence cannot be produced quickly is worth less than one whose evidence can, independent of market size.

**Launch speed correlates with capital raised.** Startups launching an MVP in under three months raise materially more investment on average than those taking longer, chiefly because a fast launch buys months of usage data before fundraising conversations begin. This reinforces evidence velocity and is the reason capital efficiency is scored separately from market size.

**Most failures are demand failures, not technical ones.** Analyses of startup post-mortems attribute roughly 42% of failures to misreading market demand and about 29% to cash exhaustion, together more than 70% of shutdowns. Pain intensity carries the single largest weight at 25% because it is the axis most directly predictive of that dominant failure mode.

Two further findings shape the kill rules rather than the weights. Roughly 95% of generative AI pilots deliver no measurable P&L impact, and Gartner expects more than 40% of agentic AI projects to be canceled by the end of 2027 on grounds of cost, unclear value, or weak risk controls. Both argue for killing candidates whose value cannot be stated as a dollar figure per buyer per year.

## Axis anchors

Score the candidate as it actually stands, not as it might stand after favorable assumptions.

### Pain intensity (25%)

| Score | Anchor |
|---|---|
| 5 | Named source quantifies loss per buyer per year in dollars, and the loss exceeds plausible annual price by 10x or more. Penalties, litigation, or lost revenue are involved. |
| 4 | Quantified loss in hours per week per buyer, convertible to dollars at a defensible wage, exceeding price by 5x or more. |
| 3 | Pain is documented qualitatively by multiple independent sources but not quantified; a bottom-up estimate is possible. |
| 2 | Pain is asserted by vendors selling into the space, with no independent corroboration. |
| 1 | Pain is inferred from first principles or personal annoyance. Hard kill. |

### Moat durability (20%)

| Score | Anchor |
|---|---|
| 5 | Jurisdiction-specific regulatory logic, or a proprietary dataset that accrues from usage, or a domain ontology requiring expert construction. A general-purpose model cannot substitute. |
| 4 | Deep workflow integration with systems of record that are painful to displace once installed. |
| 3 | Accumulated domain content or templates that take real time to reproduce but no structural barrier. |
| 2 | Execution and design quality only. |
| 1 | A thin layer over a public API. Hard kill. |

### Buyer reachability (15%)

| Score | Anchor |
|---|---|
| 5 | A named channel reaches 20 qualified buyers within 30 days: a trade association list, a professional licensing roster, an active forum, a conference, or an existing relationship. |
| 4 | Reachable through cold outbound with a defensible list source and a plausible reply rate. |
| 3 | Reachable through paid acquisition at an unknown but bounded cost. |
| 2 | Requires a channel partner or reseller relationship to reach at all. |
| 1 | Buyer is an enterprise or public committee with a procurement cycle longer than the runway. |

### Evidence velocity (20%)

| Score | Anchor |
|---|---|
| 5 | Roughly $10k MRR or 1,000 engaged users is credible within 3 months of launch, with the arithmetic shown (accounts needed at stated price). |
| 4 | Same threshold credible within 6 months. |
| 3 | Credible within 12 months. |
| 2 | Requires a pilot cycle tied to an annual budget or season. |
| 1 | Requires regulatory approval, clinical endpoint, or multi-year deployment before any evidence exists. |

Always show the account arithmetic. At $99 per month, $10k MRR is approximately 100 paying accounts; at $499, approximately 20. A high price point lowers the account count needed for the same evidence and often raises this score.

### Capital efficiency (10%)

Anchor to build-cost bands: a single-workflow prototype around $10k and under a month; a single-role production MVP roughly $20k–$35k over about three months; a multi-tenant B2B MVP with several integrations and permissions roughly $35k–$65k over three to four months. Score 5 when first evidence lands in the prototype band, 3 in the single-role band, 1 when it requires the top band or beyond.

Note the dominant cost driver: billing-logic complexity, not the core feature. Trial conversion, failed payments, upgrades, downgrades, and cancellations add substantial overhead that early estimates routinely omit. Penalize candidates whose pricing model implies complex billing states at MVP.

### Non-dilutive fit (10%)

| Score | Anchor |
|---|---|
| 5 | A named program with an open or recurring call whose stated objectives match the product, with the award size stated. |
| 3 | A plausible program family exists but eligibility or timing is unverified. |
| 1 | No public funding pathway. |

Verify calls are actually open before scoring 5. A closed program is a 1.

## Standing market-context findings

Verify these are still current at scan time, then cite them rather than re-deriving them. Each is attached to the claim it supports.

| Finding | Use it to support |
|---|---|
| Roughly 78% of B2B seed deals present about $10k+ MRR or 1,000+ engaged users (Bessemer, State of the Cloud) | The evidence bar; the MVP definition of done |
| Sub-three-month MVP launches raise roughly 2.5x more investment on average | Evidence velocity weighting; scope discipline |
| Demand misreads cause ~42% of failures; cash exhaustion ~29% | Pain intensity weighting; the discovery gate |
| ~95% of generative AI pilots show no measurable P&L impact (MIT NANDA, 300 deployments) | Requiring dollar-denominated ROI; kill rule 5 |
| Buying from specialized vendors or partnering succeeded ~67% of the time versus internal builds about one third as often (same study) | Build-vs-buy discipline; kill rule 3 |
| Gartner expects >40% of agentic AI projects canceled by end of 2027 | Guardrail and ROI requirements for agent products |
| Organizations abandoning most AI initiatives before production rose from 17% to 42% in one year (S&P Global, 1,000+ orgs) | Preference for narrow, provable scope |
| Large IT projects skipping validation run 45% over budget and deliver 56% less value (McKinsey/Oxford) | The discovery gate |

## Scoring discipline

Score independently per axis before computing the total; anchoring one axis to another inflates the register. When two candidates land within two points of each other, treat them as tied and break the tie on buyer reachability, since the founder's ability to talk to buyers this month determines whether anything is learned at all.
