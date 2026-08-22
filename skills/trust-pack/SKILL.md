---
name: trust-pack
description: Produce a diligence-ready ethics, security, privacy, and compliance package — data inventory, AI model risk and guardrails, audit logging, subprocessor list, incident response, and applicable regime mapping (SOC 2, GDPR, HIPAA, state privacy, EU AI Act tiering) — sized to the venture's actual stage. Use when preparing for investor or customer diligence, when a product handles personal or regulated data, when an AI feature makes consequential decisions, or when the user asks about security, privacy, compliance, ethics, or "what do we need before we can sell to enterprises".
---

# Trust Pack

## Purpose

Produce the package that removes the stall point. In enterprise sales and investor diligence, the security questionnaire arrives after interest is established and before money moves; teams without answers lose weeks at exactly the moment momentum matters. A trust pack written in advance converts that stall into a document exchange.

Frame this as **a diligence accelerator, not a compliance chore**. The pack also serves an internal purpose: writing down what data is held and what the model is allowed to decide surfaces design flaws while they are still cheap to fix.

## When to Activate

- Preparing for investor diligence or an enterprise security review
- The product touches personal data, health data, financial data, or minors
- An AI component makes or materially influences consequential decisions about people
- Before `executive-summary` or `pitch-deck` for a regulated vertical, since compliance posture is a slide in those contexts
- The user asks what is needed to sell to enterprise, government, or healthcare buyers

## Stage Sizing

Match depth to stage. A pre-seed company claiming a completed SOC 2 audit is either lying or has misallocated its runway; one with no answer at all is unsellable to a mid-market buyer.

| Stage | What is expected | What is not expected |
|---|---|---|
| Prototype / pre-revenue | A written data inventory, a stated minimization posture, encryption in transit and at rest, no production data in development | Formal audits, a named DPO, penetration testing |
| MVP with first paying customers | The full pack below, a subprocessor list, incident response with named owners, access control documented, SOC 2 readiness assessment (not certification) | Completed SOC 2 Type II, ISO 27001 |
| MMP / scaling | SOC 2 Type I or II in progress or complete, penetration test conducted, DPA template ready, security questionnaire answers library | Certifications irrelevant to the buyer base |

State the stage explicitly at the top of the pack, and state what is planned rather than implying it exists. Overclaiming is the single fastest way to fail diligence, because one disproven claim invites scrutiny of every other.

## Required Sections

### 1. Scope and Stage
The product, the stage, the data classes handled, the buyer types, and the jurisdictions of operation. One paragraph.

### 2. Data Inventory and Minimization
A table of every data class: what is collected, why, the lawful basis or business justification, where it is stored, retention period, and who can access it. Then a minimization statement naming data deliberately *not* collected. The list of what a product refuses to collect is often more persuasive than the list of controls around what it does collect.

### 3. Security Controls
Encryption in transit and at rest, authentication and session handling, authorization model including tenant isolation, secret management, dependency and vulnerability management, backup and recovery with a stated recovery objective, and the development-versus-production data boundary. State what is implemented today and what is planned with a date; do not blend the two.

### 4. AI and Model Risk
The section most AI ventures omit and most diligence now probes.

Cover the model inventory: which models, accessed how, and whether customer data trains them. State plainly whether customer data is used for training and how that is enforced with the provider.

Treat error as a rate to design around rather than a defect to eliminate before launch. No available model eliminates hallucination, so state the measured or target error rate, the consequence of an error in this specific product, and the mechanism that catches it. Then document the guardrails: the restricted action list, spending or magnitude caps, required confirmation steps for anything irreversible, and the named conditions that hand a task to a person. Note that the human-fallback path is a designed feature with the same attention as the primary flow, not an afterthought.

Document observability: every reasoning step and tool call logged, not merely final outputs, because reconstructing why a decision was made after the fact is impossible from outcome logs alone. Then state where the human review gate sits for high-stakes outputs, and confirm the AI is a reasoning stage inside a pipeline rather than the final arbiter.

For any product where the model influences decisions about people, add bias testing: the protected characteristics considered, the test method, the results, and the remediation. A stated method with imperfect results is more credible than silence.

### 5. Regime Mapping
A table of applicable regimes: the regime, why it applies or does not, current posture, and the gap with an owner and date. Cover as relevant SOC 2, GDPR and UK GDPR, US state privacy laws (California, Colorado, Connecticut, Texas, Virginia and successors), HIPAA where PHI is touched, GLBA or PCI DSS for financial and payment data, FERPA for education records, COPPA where minors are involved, and sector-specific regimes for the vertical.

For AI systems, add an EU AI Act risk tier assessment where any EU nexus exists: prohibited, high-risk, limited-risk with transparency obligations, or minimal. Naming the tier and the resulting obligations, even to conclude the obligations are light, demonstrates the analysis happened.

State the regimes that do **not** apply and why. Scoping out is as valuable as scoping in, and it prevents a buyer's questionnaire from assuming the worst.

### 6. Subprocessors and Vendors
Every third party touching customer data: the vendor, the purpose, the data shared, the location, and the security attestation relied on. Enterprise buyers require this list and will ask for it early; assembling it later is slower than maintaining it.

### 7. Incident Response
Detection method, severity levels, named owners at each level, notification timelines aligned to applicable regimes, and the customer communication template. A one-page runbook is sufficient at early stage, but it must name a human rather than a role that does not yet exist.

### 8. Ethics Positions
Three to five positions the company holds and will not trade away, each stated as a commitment with its enforcement mechanism. Useful examples: what the product will not automate without human sign-off; how users are told an AI produced an output; what the company will not do with customer data regardless of contractual permission; how the company handles a customer request the product could technically satisfy but should not.

Written positions matter commercially as well as ethically. Buyers in regulated sectors increasingly ask, and a considered answer differentiates against competitors who improvise one in the meeting.

### 9. Risk Register
Risk, severity, likelihood, mitigation, owner, and status. Every high-severity item carries a concrete mitigation with an owner and date; "we will monitor it" is not a mitigation. Unmitigated high-severity items block the gate and must be escalated to the user rather than smoothed over.

## Output

Deliver as a standalone Markdown document titled "Trust Pack — [Product]" with a version and date, structured for direct forwarding to a diligence contact. Add a one-page "Security Summary" at the front for the reader who will not read the whole pack: stage, data classes, key controls, applicable regimes, and named contact.

## Style Rules

1. Never claim a certification, audit, or test that has not occurred. Write "planned" with a date.
2. Separate implemented from planned in every section. Blending them is the most common integrity failure in these documents.
3. Name a human owner for every gap and every incident severity level.
4. Quantify AI error rates rather than asserting accuracy. An honest rate with a catch mechanism beats a claim of reliability.
5. Include what is deliberately not collected and which regimes do not apply.
6. Size to stage. Do not generate enterprise-scale documentation for a prototype; it wastes runway and signals inexperience.
7. Escalate unmitigated high-severity risks to the user directly rather than burying them in a table.
