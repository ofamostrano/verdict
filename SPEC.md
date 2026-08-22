# Verdict — v1 Spec

*Working title: Verdict (was VentureForge). One-line pitch: an open-source app that runs your startup idea through a venture pipeline and hands you a verdict — scored register, assumption ledger, ROI model — not vibes.*

**Date:** 2026-08-22 · **Owner:** solo founder · **Budget:** $0 beyond existing Claude plan

## What v1 is

A local-first TypeScript app wrapping the **Claude Agent SDK**, with the 7 existing SKILL.md pipelines (opportunity-scan → discovery-gate → build-vs-buy → roi-model → validation-loop → trust-pack → investor-targeting) as the built-in methodology. Users bring their own Anthropic API key. The GUI's core insight: **gate questions become forms the user fills in**, instead of prompts they have to know to ask.

## The finish line (definition of done)

> A stranger clones the repo, adds an API key, runs one idea from opportunity-scan to a discovery-gate verdict, and exports the register as PDF — in under 15 minutes, with no docs beyond the README.

When that sentence is true, v1 ships. Nothing else blocks launch.

## v1 features (all five, nothing more)

1. **Project workspace** — one folder per venture idea; all state is plain Markdown/JSON files in that folder (git-friendly, transparent, no database).
2. **Pipeline runner** — the 7 stages shown as a visual pipeline; each stage is a guided flow. Discovery-gate's five questions and scoring inputs are **forms**, not chat.
3. **Chat pane** — Claude Agent SDK session with the skills loaded, for freeform work inside a stage.
4. **Document viewer + export** — registers, ledgers, and verdict docs rendered as clean documents; export to Markdown and PDF.
5. **BYO key** — Anthropic API key in local config. No accounts, no server, no telemetry.

## Explicitly NOT in v1

Multi-provider routing (litellm/OpenRouter), hosted/SaaS version, Supabase, user accounts, self-learning/RSI claims, mobile, collaboration. Each of these is a v2 debate that costs v1 weeks.

## Stack

- **TypeScript + Vite + React**, running as a local web app served by a small Node process (`npx verdict` opens the browser). Electron only if local-web proves painful.
- **Claude Agent SDK** for the agent loop; skills loaded from the repo's `skills/` directory.
- **Files as state** (Markdown + JSON per project). SQLite only if file-state breaks.
- **PDF export** via headless print of the document view.

## Build order

1. **Week 1 — CLI harness:** `verdict scan ideas.json`, `verdict gate` working end-to-end wrapping the Agent SDK + existing skills and `score_opportunities.py` logic ported to TS. Proves the core before any UI.
2. **Week 2 — GUI shell:** project sidebar, pipeline view, chat pane wired to the harness.
3. **Week 3 — forms + documents:** gate/scoring forms, document rendering, PDF export, README with demo GIF.
4. **Launch:** GitHub + Show HN + Product Hunt. The demo is the real register this system already produced (`opportunity_register_2026-08-22.md`).

Estimate: evenings/part-time, ~3 weeks to launchable v0. Full-time, ~10 days.

## Success metric (validation-loop, pre-set)

300 GitHub stars or 25 people who run a full pipeline (shown by an opt-in "share your register" issue template) within 30 days of launch. Below that: the verdict on Verdict is pivot, per its own rules.

## Monetization (later, written down so it stops occupying headspace)

Open core. Free: local app, all 7 skills. Paid later: hosted version, custom skill packs (vertical-specific pipelines), team workspaces. None of this is built until the star/usage threshold is hit.
