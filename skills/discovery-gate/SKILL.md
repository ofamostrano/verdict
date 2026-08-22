---
name: discovery-gate
description: Decide whether an idea is ready to build or needs a scoping pass first, using a five-question readiness gate that produces a build/scope/kill verdict plus an assumption ledger with named falsification tests. Use before writing an SPMP or starting any build, when the user asks "should I just start building", when scope keeps shifting mid-project, or when deciding between a discovery phase and going straight to MVP.
---

# Discovery Gate

## Purpose

Stand between an idea and a build. The gate answers one question: **does the next dollar go into scoping or into building?** It produces a verdict, an assumption ledger, and a falsification plan.

Skipping a needed scoping pass does not save money; it defers the cost to the point where it is most expensive. Founders who skip discovery on an idea that needed it typically spend 30–50% more on re-scoping and rebuilding than the scoping would have cost upfront, and large projects that skip validation run roughly 45% over budget while delivering about 56% less value. The opposite error is equally real: paying to have a plan you already hold written down in nicer formatting wastes weeks an already-validated idea did not need to spend.

The gate exists so the choice is made deliberately, in minutes, rather than by default.

## When to Activate

- Immediately after `opportunity-scan` selects a candidate, and before `spmp`
- The user asks whether to run a discovery phase or go straight to an MVP
- The user says "let's just start building" on an idea with unexamined assumptions
- Scope is shifting mid-build and the cause is unclear
- A prior build stalled and the reason has not been diagnosed

## Workflow

1. **Ask the five questions.** Put them to the user directly; do not answer on their behalf. If the user cannot answer a question, that is itself the answer, and it counts as a "no".
2. **Record the answers verbatim** in the verdict document. Paraphrasing hides hedging, and hedging is signal.
3. **Apply the interpretation rules** to produce a verdict.
4. **Build the assumption ledger** — every load-bearing belief, its kill test, and its cost to test.
5. **Write the verdict document** per "Output Structure".
6. **Hand off**: Build now goes to `spmp` then `build-vs-buy`; Scope first goes to a named scoping pass with a fixed end date; Kill goes back to `opportunity-scan`.

## The Five Questions

Ask exactly these, in this order.

1. Have you talked to at least a handful of target users about **this specific problem**, not just the general space it sits in?
2. Does the product involve integrations, compliance requirements, or technical decisions the current team cannot confidently make alone?
3. Do co-founders and investors currently share the same picture of what "finished" looks like for version one?
4. Can you describe the core feature set in two or three sentences without qualifying half of it with "maybe" or "we'll figure that out"?
5. Is runway tight enough that a two-to-four week scoping engagement would meaningfully change the risk if the answers above lean toward "no"?

### Interpretation

| Pattern | Verdict | Meaning |
|---|---|---|
| Mostly yes on 1, 3, 4 and no on 2 | **Build now** | Validated and aligned; a separate scoping phase would slow you without improving the odds |
| Any no on 1, 3, or 4 — or a clear yes on 2 | **Scope first** | Missing user insight, internal misalignment, or non-trivial technical risk; scope before code |
| Answers land in the messy middle | **Focused scope pass** | Treat the gate as a dimmer, not a switch: scope only the specific unknown, then build |
| No on 1 and the user cannot name a single real prospective buyer | **Kill or return to scan** | There is no idea yet, only a hypothesis about a hypothesis |

Question 2 is deliberately weighted more heavily than the others. Integration, compliance, and architecture unknowns are the failures that surface mid-sprint after code has been written around a wrong assumption, and those are the ones that cost a rebuild rather than a rewrite.

## The Assumption Ledger

Every idea rests on beliefs presented as facts. List them and price the test.

| # | Assumption | Type | If wrong, what breaks | Kill test | Cost / time to test | Status |
|---|---|---|---|---|---|---|

Assumption types are **demand** (buyers want this), **willingness to pay** (at this price), **feasibility** (it can be built reliably), **access** (buyers can be reached), **economics** (unit economics hold), and **regulatory** (it is permitted).

Rules for the ledger:

1. Order by cost of being wrong, descending, not by ease of testing. The cheapest test of the most dangerous assumption is always the next action.
2. Every kill test must be capable of returning "no". A test that can only confirm is not a test.
3. Prefer tests that cost under a week and under a few hundred dollars: a landing page with a waitlist, a pre-sale offer, ten scheduled interviews, a clickable prototype walked through with five buyers, a technical spike against the hardest integration.
4. A pre-sale or paid pilot commitment outranks every other demand test. Money is the only unambiguous signal.
5. Mark each assumption **Untested**, **Testing**, **Supported**, or **Refuted**. Refuted assumptions trigger a return to `opportunity-scan` rather than a quiet edit to the plan.

## Output Structure

### 1. Verdict
The verdict in bold on the first line, followed by two or three sentences of reasoning that reference the specific answers given.

### 2. The Five Answers
The questions with the user's answers recorded verbatim, each marked yes, no, or unclear.

### 3. Assumption Ledger
The table above, fully populated. Aim for five to twelve assumptions; fewer means the analysis is shallow, more means the product is unscoped.

### 4. Next Action
A single named action with an owner, a date, and a pass/fail threshold stated before the test runs. Setting the threshold afterward guarantees the result is interpreted favorably.

### 5. Scope Pass Definition (only when the verdict is Scope first)
What the scoping pass will produce and when it ends. A scoping pass without a fixed end date becomes an indefinite planning phase. Standard outputs are wireframes for the core flow, one architecture decision record for the risky unknown, and a sprint-broken backlog with estimates. Nothing is built during the pass. Reference cost band: roughly $6,000 over two weeks for a straightforward scope, up to $15,000 over four weeks where integrations and stakeholder groups multiply.

### 6. What Would Change the Verdict
Two or three specific pieces of information that would flip the decision. This keeps the gate honest and makes revisiting it cheap.

## Style Rules

1. Do not answer the five questions on the user's behalf. The gate's value is in what the user cannot answer.
2. "Unclear" counts as "no". Founders hedge on the questions where they are weakest.
3. Never recommend a full discovery phase for a validated idea, and never recommend building on an idea whose buyer has never been contacted. Both errors are common; the second is far more expensive.
4. When mid-project, do not recommend starting over. Identify the specific assumption that failed and re-scope only that area. Discarding working code is almost never the correct response to a scoping failure.
5. State test thresholds before tests run.
6. Keep the verdict document under two pages. It is a gate, not a report.
