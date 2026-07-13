Evaluate the slide outline using Nancy Duarte's Sparkline, Steve Jobs' reveal structure, Hans Rosling's data narration, and Gary Bernhardt's comedic-tension lightning talks. Prescribe specific changes before generating slides.

## Narrative spine tests

**Duarte Sparkline test:** Does the outline alternate at least 3-4 times between "what is" (the current painful reality) and "what could be" (the better future), building tension toward a climactic "new bliss"? Flag a flatline of all problem, all solution, or all feature-tour.

**Tension test:** Does a real problem the audience recognizes create discomfort, curiosity, or suspense? If the outline never makes them think "oh no, I do that too" or "wait, how does that work?" it lacks tension.

**Surprise test:** Is the audience's expectation violated at least once, as when Steve Jobs says "these are not three devices -- it is one device" or Gary Bernhardt shows `[] + [] === ""`? If not, flag surprise as the single biggest gap.

**Resolution test:** Does the audience get a satisfying payoff? Not just "here is the API" but a moment where the solution clicks and the earlier tension dissolves.

**"One Thing" test:** If you had to compress the entire outline into one sentence the audience would repeat at lunch, what would it be? If you cannot find one, the outline lacks a thesis.

## Anti-patterns to flag

- **Projected RFC:** Organized by topic, not by narrative arc. Symptoms: headings like "Overview," "Architecture," "API Reference," "Configuration."
- **Bullet-Riddled Corpse** (Neal Ford): Slides dominated by bulleted lists. The audience reads ahead and disengages.
- **The Feature Tour:** Capabilities one by one without establishing why the audience should care.
- **Missing Stakes:** Explains what something is but never what is at risk.
- **Premature Solution:** The solution is revealed before the audience has felt the problem.
- **No Callback:** The ending does not reference the beginning.
- **Monotone Pacing:** Every slide has the same density and energy. No breathing room, no crescendo.

## Output format

Structure your analysis exactly like this:

**The Big Problem:** One sentence naming the single largest narrative failure. Be direct.

**Top 5-7 Actionable Changes:** Number specific changes by slide title or number and state how to make each one. Each must apply to the outline in one edit; do not give generic advice.

Examples:
- "Move slide X before Y to establish the problem before revealing the solution."
- "Replace the 8-bullet list on slide N with a single before/after showing the pain vs. the fix."
- "Open with the end result first, then rewind to show how you got there."
- "Name the pattern memorably instead of using the API name."
- "End by calling back to the opening."

**Suggested Reorder:** A numbered list of the new slide order if restructuring is needed. If the order works, say so.

**The "One Thing":** The single sentence the audience should remember. Concrete, not abstract. "Type safety is not a tax -- it is a time machine" not "Types are important."

Deliver a sharp diagnosis and clear fixes without encouragement or caveats.
