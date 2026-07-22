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
4. Exact topic and what is out of scope
5. Intended audience and what they already know
6. Desired voice, such as plain or formal, or a style reference
7. Why the subject exists or matters when the sources do not explain it
8. Desired reading length and output location
9. Concepts, flows, or interfaces that need a visual

Inspect supplied files and links. If the material is insufficient, ask for more. Do not fill gaps from memory.

Ask one concise set of questions for missing audience, voice, scope, purpose, or visual needs. If the user provides a style reference, inspect it before writing.

## Grounding

- Support every substantive claim with the source.
- Preserve the author's terminology, argument, examples, qualifications, and conclusions.
- Distinguish the author's claims from neutral explanation.
- Do not add opinions, generic advice, invented metaphors, or unrelated examples.
- Paraphrase rather than reproduce long passages. Keep quotations short and attribute them.
- State uncertainty rather than guessing.
- Treat code as evidence of how something works, not why it was designed that way. If purpose or motivation is not documented, ask the user and treat their answer as source material.

Before drafting, create a source map:

| Article section | Source location | Claims | Examples or visuals |
| --- | --- | --- | --- |

Remove any section that cannot be mapped to the source or does not directly explain the agreed topic. Exclude material that is merely related.

## Structure

Follow the source's logical order:

1. Briefly explain the main concept first when the intended audience may not know it.
2. State the problem addressed by the selected material.
3. Define central concepts using the author's terminology.
4. Explain the argument step by step.
5. Present the strongest source-supported examples.
6. Include tradeoffs, limitations, and qualifications.
7. Connect the selected sections' conclusions without inventing a new one.

Match the agreed voice. Use short paragraphs and concrete explanations. Explain unfamiliar terms on first use. Make every sentence add information; remove throat-clearing, redundant summaries, and repetitive comma-list rhythms. Name the relevant chapter or section beneath each heading. Identify the title, author, edition, and covered sections in the footer.

## Code and Visuals

- Preserve code behavior, API names, and relevant formatting.
- Do not modernize, improve, complete, or extend examples.
- Show only the source lines needed to demonstrate the point. Omit code that does not improve the explanation.
- Present contrasted designs side by side and explain what the comparison demonstrates according to the author.
- Plan visuals before drafting. Use simple black-and-white diagrams for flows or relationships when they explain the topic faster than prose.
- Show important real screens or objects when referring to them. If they cannot be shown accurately from the source, describe them concretely or remove the reference.
- When there is no code, prefer a source-grounded table, diagram, timeline, or short quotation.
- Label and caption every example or visual with its source location.

## HTML Output

Create one self-contained `index.html`.

- Use semantic HTML and modern CSS.
- Follow a supplied visual reference; otherwise use a restrained, readable layout.
- Keep prose within a 60-75 character measure.
- Unless the visual reference calls for otherwise, use serif text for prose and sans-serif text for headings, labels, and metadata.
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
2. Remove unsupported interpretation, off-topic material, repetition, filler, and code that does not earn its space.
3. When needed for the audience, confirm the opening defines the main concept. Show or clearly describe every important concrete reference.
4. Confirm all chapter, section, quotation, example, and visual references.
5. Open the page and inspect representative desktop and mobile viewports.
6. Check print styles, horizontal overflow, broken assets, and console errors.
7. Keep the working setup while iterating. Remove temporary generators, dependencies, and assets after final verification.

Report the output path, included chapters or sections, included examples and visuals, and source limitations.
