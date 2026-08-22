---
name: build-vs-buy
description: Decide component by component whether to build, buy, or partner, using the vendor differentiation test and a cost-shape comparison, producing a decision matrix that prevents custom-building commodity infrastructure. Use when choosing a tech stack, deciding whether to build a custom AI capability or license one, evaluating whether to hire versus contract, or reviewing an SPMP's stack choices before development starts.
---

# Build vs Buy

## Purpose

Produce a **component-level decision matrix** stating, for every part of the product, whether it will be built, bought, or partnered — and why. This runs after `spmp` and before `sprint-backlog`, because a backlog written against the wrong build-or-buy calls schedules months of work that should have been a subscription.

The expensive mistake is rarely picking the wrong option for a component. It is building custom capability before anyone confirmed users want that behavior. Buying or partnering for a faster first version is usually the cheaper way to find out, and it keeps the option to build open rather than closing it.

## When to Activate

- After an `spmp` has proposed a technology stack
- The user asks whether to build or license an AI capability
- The user is choosing between hiring an engineer, contracting a team, or buying a tool
- A backlog contains tickets for authentication, billing, or other commodity infrastructure
- The user asks "should we build our own model"

## The Vendor Test

The single question that resolves most components:

> **Could a vendor plausibly sell you this exact capability?**

If yes, it is infrastructure, and infrastructure should generally be bought. If no — because the capability depends on data only you hold, on a workflow specific to your industry, or on behavior that is the reason a customer chooses you over a competitor — it is differentiation, and differentiation should be built.

Two corollaries follow. First, if buying a capability would hand a competitor the same advantage for the price of a subscription, that capability was never a moat. Second, if a vendor already refined the capability across thousands of customers, building it yourself means paying real engineering time to re-learn lessons that vendor learned years ago.

## The Three Options and Their Cost Shapes

The paths differ less in total spend than in how the spend behaves. The correct comparison is not which option is cheapest but which cost shape the runway can absorb.

| | Buy | Partner | Build in-house |
|---|---|---|---|
| Upfront cost | Roughly $10k–$20k setup | From roughly $20k for a scoped MVP | Roughly $150k–$300k per engineer per year before infrastructure |
| Time to working version | Days to weeks | Roughly 10–16 weeks for a scoped build | Weeks of hiring, then months of building |
| Ownership | The capability is rented | Full code ownership, confirmed before signing | Full ownership by default |
| Customization | Bounded by the vendor's roadmap | Built to the specified behavior | Bounded only by engineering time |
| Ongoing cost | License fees, roughly $1k–$10k per year | Scoped per project or sprint | Salary, benefits, and tooling regardless of usage |
| Best for | Commodity capability | Custom behavior without a full-time hire | AI or platform work as a sustained core competency |

Read the ongoing-cost row carefully. Buying and partnering scale with usage; an in-house team costs the same in a quiet quarter as in a busy one. In-house only makes financial sense when the roadmap contains enough sustained work to justify the second and third project, not merely the first.

Partnering is the option most build-versus-buy analysis omits, because most such analysis is written for organizations that already have an engineering department to receive a build. For a founder choosing between a $150k–$300k annual hire and a $10k tool, the fitting answer is often neither.

## Workflow

1. **Decompose the product into components.** Typical set: authentication and identity, billing and subscription management, database and hosting, file storage, transactional email and SMS, the core domain logic, the AI or model layer, document generation, integrations with systems of record, analytics and instrumentation, observability and error tracking, and the compliance or audit layer.
2. **Apply the vendor test to each.**
3. **Classify each as commodity, adjacent, or differentiating.** Commodity is bought without further debate. Differentiating is built or partnered. Adjacent components are the genuinely arguable ones, and they are where this analysis earns its keep.
4. **For every build decision, state the maintenance obligation.** Ownership means model updates, retraining, drift monitoring, and dependency upgrades. A team that builds a capability it cannot maintain holds a liability, not an asset.
5. **For every buy decision, state the exit cost.** Buy-side risk rarely appears on day one; it appears when the product outgrows the vendor's assumptions and every customization becomes a support ticket instead of a pull request. Record the migration path.
6. **Write the matrix**, then flag any component whose decision contradicts the stack proposed in the `spmp` so the plan can be corrected before the backlog is written.

## Output Structure

### 1. Decision Matrix

| Component | Vendor test | Class | Decision | Named option | First-year cost | Rationale | Exit or maintenance obligation |
|---|---|---|---|---|---|---|---|

Name actual products and prices rather than categories. "Managed auth provider" is not a decision; a named provider with its pricing tier is.

### 2. The Differentiating Core
One short section naming the components that constitute the moat, with one sentence each on why a vendor cannot sell it. If this section is empty, the product has no moat and the finding belongs in front of the user immediately, before any code is written.

### 3. Cost Shape Summary
Total first-year cost by path, presented as upfront versus recurring, with the resulting monthly burn. This figure feeds directly into `roi-model`.

### 4. Sequencing Note
Which decisions are reversible and which are not. Multi-tenancy and the account or billing model are the two decisions worth getting right at MVP stage rather than deferring, because retrofitting tenant isolation into a data model built for a single customer is a rebuild, not a refactor. Everything else can generally start bought and be brought in-house later once it has earned the right to be owned.

## AI-Specific Guidance

At startup scale, "building AI" almost never means training a model from scratch. It means writing custom logic on top of a foundation model reached through an API, where the engineering effort goes into product-specific behavior rather than general reasoning. Switching the underlying model later, once the task-specific logic is proven, is a far smaller job than building that logic in the first place — so the model choice is rarely the decision worth agonizing over.

Buy the commodities: transcription, translation, basic sentiment tagging, a chatbot answering the same handful of questions every product in the category fields. Build the parts trained on or shaped by data only you hold, and the agent behavior specific to your industry's workflow.

Before committing engineering time, test the vendor's free tier or trial. Testing a real working example converts a guess about fit into an answer, and it costs a day.

Two cautions belong in every AI build decision. Roughly 95% of generative AI pilots produce no measurable P&L impact, and in the same body of research, buying from specialized vendors or partnering with an outside team succeeded roughly 67% of the time while internal builds succeeded about a third as often. Separately, the share of organizations abandoning most of their AI initiatives before production rose from 17% to 42% in a single year. These are not arguments against building; they are arguments against building before the behavior has been shown to matter to a user.

## Style Rules

1. Every decision names a specific product and a specific price. Categories are not decisions.
2. No component is left unclassified. An unexamined component defaults to a build, which is the expensive default.
3. State the maintenance obligation on every build and the exit cost on every buy.
4. When the differentiating core is thin, say so plainly rather than padding the matrix.
5. Reversibility is a first-class criterion. Prefer the reversible choice when the analysis is close.
6. Flag contradictions with the `spmp` stack explicitly rather than quietly overriding them.
