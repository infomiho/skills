---
name: create-presentation
description: Create a polished, code-forward presentation from scratch. Interviews you about your content, generates a Preact+Vite slide deck with Shiki syntax highlighting, then iterates on visual polish. Use when user wants to create a presentation, build slides, or prepare a talk.
---

Follow these phases in order.

## Phase 1: Intake

Ask the user:
1. **What are you presenting?**
2. **Do you have a brand color?** (hex code, company/product name to look up, or skip for the default gold)
3. **Light or dark theme by default?** (the audience can toggle with `T` during the presentation)

## Phase 2: Content interview

Follow [references/grill-me.md](references/grill-me.md) to uncover the narrative in the user's content.

## Phase 3: Slide outline

Produce a table of slides:

| # | Title | Content summary |
|---|-------|----------------|

Before asking for approval, spawn a presentation-and-storytelling subagent (using the Agent tool) to analyze the outline for narrative gaps and anti-patterns by following [references/improve-storytelling.md](references/improve-storytelling.md).

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

Paste the JSON output's `dark` values into the `:root` block and `light` values into the `[data-theme="light"]` block in `src/styles.css`; the variable names match 1:1.

Set the default theme in `index.html` by updating `data-theme` on `<html>` (and the inline `<style>` anti-FOUC variables) to match the user's preference.

## Phase 5: Generate slides

Create the presentation in `src/slides.tsx`:

- **Read the template first:** `src/components/index.ts` and the individual component files.
- **Use the component library:** `Slide`, `Code`, `Compare`, `PointList`, `QuestionList`, `ForkGrid`/`ForkCard`, `FileTree`/`Folder`/`File`. See `src/components/` for the full API.
- **Code:** Use the `Code` component with `lang`. Add `lineNumbers` for line numbers and `highlight="3-5, 8"` for highlighted lines (accent border + tint; other lines dim). Languages load on demand.
- **Sub-steps** for progressive reveal: `<Slide subSteps={N}>{(step) => ...}</Slide>`. Components like `PointList` and `QuestionList` accept a `step` prop to control visible items. `ForkCard` accepts `highlighted` and `dimmed` for decision resolution.
- **Custom components:** Create them as needed in `src/slides.tsx` or `src/components/`, especially when a visualization doesn't fit the library.
- Use `--accent`, `--positive`, `--negative`, `--warning` and their `-strong`/`-weak` variants for semantic coloring.
- Use one idea per slide.
- Use `className="centered"` on `Slide` for title/section slides.
- Use `<div class="slide-label">Label</div>` for the small label at the top of content slides.

## Phase 6: Review loop

Start the dev server:

```bash
npm run dev
```

Ask the user to review it in the browser and send screenshots of anything to adjust, such as layout, spacing, contrast, or content.

For each piece of feedback:
1. Identify the specific file and CSS/component to change
2. Make the fix
3. Confirm what changed

Repeat until the user is satisfied.
