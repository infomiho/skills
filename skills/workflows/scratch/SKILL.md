---
name: scratch
description: Scratch workspace workflow for greenfield experiments, reports, demos, prototypes, and small services.
---

# Scratch

Apply these conventions to the current scratch project. This is scratch work where we try stuff out.

## Process

1. Do not jump straight to the solution. Think through problems step by step, using an appropriate product, UX, architecture, or data-model framework - while documenting it.

2. Do the same for the UX flow of apps, demos, and reports.

3. After something is implemented, prefer using the `/review` skill, ideally in a subagent so the main agent is not biased.

## Rules of thumb

Most work is greenfield. While iterating or prototyping, do not worry about backwards compatibility unless there is a concrete reason.

Prefer 80/20 implementation and fixes. Do not complicate things too early.

Sometimes zoom out and think about the system as a whole. Prefer a better system-level solution over adding more glue code.

## Language

Use concise, down-to-earth technical language that is still approachable.

Avoid salesy language. Most work here is not built to sell.

## Style

Unless told otherwise use: minimal technical engineering, black and white, with Majorelle blue accents.

UI should be based on UX needs, not just a design aesthetic.

## Stacks

For reports, raw HTML with modern CSS is often a good fit. See [references/raw-html-reports.md](references/raw-html-reports.md).

For UI-heavy prototypes, consider static Vite + Preact with pre-rendering because JSX makes component breakdown efficient. See [references/static-vite-preact.md](references/static-vite-preact.md).

For simple backend + frontend services, consider TanStack Start. See [references/tanstack-start.md](references/tanstack-start.md).

For throwaway persistence, SQLite is fine. For production persistence, Postgres is the default alternative, but SQLite can also work in production if mounted properly.

Syntax highlighting is usually done with Shiki.

## Deployment

When it comes time to share the artifact, follow [references/deployment.md](references/deployment.md).

## Graduating

Some things may graduate from scratch to `~/dev` and get a new Git repo. Use the `infomiho` org for personal projects and the `wasp-lang` org for Wasp-related projects.
