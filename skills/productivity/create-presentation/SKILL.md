---
name: create-presentation
description: Create a polished, code-forward presentation from scratch. Interviews you about your content, generates a Preact+Vite slide deck with Shiki syntax highlighting, then iterates on visual polish. Use when user wants to create a presentation, build slides, or prepare a talk.
---

You are creating a presentation for the user. Follow these phases in order.

## Phase 1: Intake

Ask the user:
1. **What are you presenting?**
2. **Do you have a brand color?** (hex code, company/product name to look up, or skip for the default gold)
3. **Light or dark theme by default?** (the audience can toggle with `T` during the presentation)

## Phase 2: Content interview

Follow the interview process in [references/grill-me.md](references/grill-me.md). Your job is to help the user find the story in their content - not just what they want to say, but the narrative that makes it land.

## Phase 3: Slide outline

Produce a table of slides:

| # | Title | Content summary |
|---|-------|----------------|

Before asking for approval, spawn a subagent (using the Agent tool) that is an expert in presentations and storytelling. It should follow the process in [references/improve-storytelling.md](references/improve-storytelling.md), analyzing the outline for narrative gaps and anti-patterns.

Present the subagent's analysis alongside the outline. Apply the suggested changes, then show the revised outline for the user to approve, adjust, or reorder before proceeding.

## Phase 4: Scaffold

Run these commands to pull the template and install dependencies:

```bash
npx giget@latest gh:infomiho/present ./<presentation-name>
cd <presentation-name>
npm install
```

Use a short, descriptive directory name based on the topic (e.g., `ts-config-talk`, `q3-roadmap`).

### Apply brand palette

Generate the palette from the user's brand color:

```bash
npx -y hextimate "<brand-hex>"
```

This outputs a JSON object with `light` and `dark` keys. Paste the dark values into the `:root` block and the light values into the `[data-theme="light"]` block in `src/styles.css`. The variable names match 1:1, just drop them in.

Set the default theme in `index.html` by updating `data-theme` on `<html>` (and the inline `<style>` anti-FOUC variables) to match the user's preference.

## Phase 5: Generate slides

Edit `src/slides.tsx` to create the presentation content. Key guidelines:

- **Read the existing template files first.** Understand the available components by reading `src/components/index.ts` and the individual component files.
- **Use the component library:** `Slide`, `Code`, `Compare`, `PointList`, `QuestionList`, `ForkGrid`/`ForkCard`, `FileTree`/`Folder`/`File`. See `src/components/` for the full API.
- **Code is Shiki-powered.** Use the `Code` component with the `lang` prop. Languages are loaded on demand. Use `lineNumbers` for line numbers and `highlight="3-5, 8"` for line highlighting (accent border + tint, rest dims).
- **Sub-steps** for progressive reveal: `<Slide subSteps={N}>{(step) => ...}</Slide>`. Components like `PointList` and `QuestionList` accept a `step` prop to control visible items. `ForkCard` accepts `highlighted` and `dimmed` for decision resolution.
- **Custom components** are encouraged. If a slide needs a visualization that doesn't fit the existing components, create it directly in `src/slides.tsx` or as a new component in `src/components/`.
- **Branding** is handled in Phase 4 via `hextimate`. The palette is already applied at this point. Use `--accent`, `--positive`, `--negative`, `--warning` and their `-strong`/`-weak` variants for semantic coloring.
- Keep slide content focused. One idea per slide.
- Use `className="centered"` on `Slide` for title/section slides.
- Use `<div class="slide-label">Label</div>` for the small label at the top of content slides.

## Phase 6: Review loop

Start the dev server:

```bash
npm run dev
```

Then tell the user:

> The presentation is running. Check it in your browser and send me screenshots of anything you want adjusted - layout, spacing, contrast, content, whatever. We'll iterate until you're happy.

For each piece of feedback:
1. Identify the specific file and CSS/component to change
2. Make the fix
3. Confirm what changed

Repeat until the user is satisfied.
