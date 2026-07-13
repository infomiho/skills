---
name: scratch
description: Scratch workspace workflow for greenfield experiments, reports, demos, prototypes, and small services.
---

# Scratch

## Process

1. MUST: work step by step with an appropriate product, UX, architecture, or data-model framework. Search the web for thinking frameworks.

2. MUST: present the plan, pause for user feedback, iterate, then implement it.

3. NICE TO HAVE: run `/review`, preferably in a subagent.

## Rules of thumb

Ignore backwards compatibility while iterating or prototyping unless there is a concrete reason not to.

Prefer 80/20 implementations and fixes.

Avoid premature complexity.

Zoom out when needed; prefer system-level solutions over adding glue code.

## Language

Use concise, down-to-earth technical language that is still approachable.

Avoid salesy language.

## Style

Default to a minimal, technical, black-and-white aesthetic with Majorelle blue accents.

Base UI decisions on UX needs.

## Stacks

For reports, consider raw HTML with modern CSS. See [references/raw-html-reports.md](references/raw-html-reports.md).

For UI-heavy prototypes, consider static Vite + Preact with pre-rendering. See [references/static-vite-preact.md](references/static-vite-preact.md).

For simple backend + frontend services, consider TanStack Start. See [references/tanstack-start.md](references/tanstack-start.md).

SQLite is acceptable for throwaway persistence. For production, default to Postgres; SQLite is also acceptable when mounted properly.

Prefer Shiki for syntax highlighting.

## Deployment

To share the artifact, follow [references/deployment.md](references/deployment.md).

## Graduating

When moving a scratch project to `~/dev`, create a Git repo under `infomiho` for personal projects or `wasp-lang` for Wasp-related projects.
