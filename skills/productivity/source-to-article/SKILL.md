---
name: source-to-article
description: Manual-only workflow that converts supplied chapters, excerpts, notes, PDFs, local files, or links into a grounded, readable, self-contained HTML article. Use only when the user explicitly invokes source-to-article.
disable-model-invocation: true
---

# Source to Article

Create an article based strictly on the supplied source material.

## Intake

Identify:

1. Title, author, and edition when relevant
2. Chapters or sections to cover
3. Available source material: pasted text, notes, PDFs, local files, or links
4. Desired reading length
5. Output location

Inspect supplied files and links. If the material is insufficient, ask for more. Do not fill gaps from memory.

## Grounding

- Support every substantive claim with the source.
- Preserve the author's terminology, argument, examples, qualifications, and conclusions.
- Distinguish the author's claims from neutral explanation.
- Do not add opinions, generic advice, invented metaphors, or unrelated examples.
- Paraphrase rather than reproduce long passages. Keep quotations short and attribute them.
- State uncertainty rather than guessing.

Before drafting, create a source map:

| Article section | Source location | Claims | Examples |
| --- | --- | --- | --- |

Remove any section that cannot be mapped to the source.

## Structure

Follow the source's logical order:

1. State the problem addressed by the selected material.
2. Define central concepts using the author's terminology.
3. Explain the argument step by step.
4. Present the strongest source-supported examples.
5. Include tradeoffs, limitations, and qualifications.
6. Connect the selected sections' conclusions without inventing a new one.

Use plain language, short paragraphs, and concrete explanations. Explain unfamiliar terms on first use. Name the relevant chapter or section beneath each heading. Identify the title, author, edition, and covered sections in the footer.

## Examples

- Preserve code behavior, API names, and relevant formatting.
- Do not modernize, improve, complete, or extend examples.
- Present contrasted designs side by side and explain what the comparison demonstrates according to the author.
- When there is no code, prefer a source-grounded table, diagram, timeline, or short quotation.
- Label and caption every example with its source location.

## HTML Output

Create one self-contained `index.html`.

- Use semantic HTML and modern CSS.
- Use a restrained editorial style similar to Medium.
- Keep prose within a 60-75 character measure.
- Use serif text for prose and sans-serif text for headings, labels, and metadata.
- Define design tokens as CSS custom properties in `:root`.
- Use strong contrast and one restrained accent color.
- Support desktop, mobile, print, and `prefers-reduced-motion`.
- Avoid navigation clutter, gradients, decorative cards, and unnecessary animation.

## Code Highlighting

When the source contains code, generate static highlighted HTML with Shiki using a readable light theme such as `github-light`. Do not require Shiki or JavaScript at runtime.

On wide screens, let comparisons extend beyond the prose column. Stack comparison panels on narrow screens and contain horizontal overflow within code blocks.

## Verification

Before finishing:

1. Check every claim and example against the source map.
2. Remove unsupported interpretation, repetition, and filler.
3. Confirm all chapter, section, quotation, and example references.
4. Open the page and inspect representative desktop and mobile viewports.
5. Check print styles, horizontal overflow, broken assets, and console errors.
6. Remove temporary generators, dependencies, and assets.

Report the output path, included chapters or sections, included examples, and source limitations.
