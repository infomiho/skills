---
name: ux-review
description: Reviews websites, apps, UI code, screenshots, and product flows for usability issues using Nielsen Norman Group heuristics and related UX principles. Use when the user asks for a UX review, usability review, heuristic evaluation, product critique, flow critique, or feedback on a page, app screen, form, onboarding, checkout, dashboard, settings, or error state.
user-invocable: true
---

# UX Review

## Intake

Ask only for missing essentials:

1. URL, route, screenshot, component, PR, or files to review
2. Target user and primary task
3. Critical flow, if any
4. Required viewport or device context

## Inspection

- For live sites/apps: use the browser, exercise the flow, check desktop and mobile when relevant.
- For code: inspect components, routes, states, labels, validation, loading, empty, success, and error handling.
- For screenshots only: review visible evidence only and mark assumptions.
- For forms and transactional flows: test validation, recovery, defaults, destructive actions, and confirmation steps.

## Evaluation

Map issues to Jakob Nielsen's 10 usability heuristics:

1. Visibility of system status: users can tell what is happening and what changed.
2. Match between system and real world: language, concepts, ordering, and mappings fit the user's mental model.
3. User control and freedom: users can cancel, undo, leave, recover, and avoid dead ends.
4. Consistency and standards: labels, patterns, layout, platform conventions, and terminology are coherent.
5. Error prevention: the design prevents likely slips and mistakes before they happen.
6. Recognition rather than recall: options, context, requirements, and previous choices are visible when needed.
7. Flexibility and efficiency of use: frequent users have shortcuts, defaults, bulk actions, or personalization where useful.
8. Aesthetic and minimalist design: every visible element supports the user's task or decision.
9. Help users recognize, diagnose, and recover from errors: errors are visible, plain-language, specific, and actionable.
10. Help and documentation: support is searchable, task-focused, contextual, and concise.

Check when relevant:

- Accessibility: keyboard access, focus states, labels, contrast, target size, error announcement, reduced motion.
- Information architecture: navigation, grouping, hierarchy, findability, progressive disclosure.
- Forms: labels, input constraints, defaults, validation timing, required/optional clarity, recovery.
- Trust and risk: destructive actions, privacy, payment, permissions, irreversible operations.
- Mobile ergonomics: reachability, tap targets, viewport constraints, orientation, interruptions.
- Empty/loading/success states: explain what happened, what is possible, and what to do next.

## Findings

Each finding must include:

- Location: URL, route, file, component, screen, element, interaction, or state
- Heuristic or UX principle
- User impact
- Concrete fix
- Severity

Rules:

- Order findings by severity.
- Ground findings in observed behavior or code.
- Separate usability issues from visual taste.
- Prefer small fixes over broad redesigns.
- Include file references, routes, selectors, or component names when available.
- If no serious issues are found, say so and list residual risks.

## Severity

- Critical: blocks task completion, causes data loss, security/privacy risk, or severe accessibility failure.
- High: likely causes mistakes, abandonment, major confusion, or repeated support burden.
- Medium: slows users down, increases cognitive load, or affects a meaningful minority of users.
- Low: polish issue, minor inconsistency, or improvement with limited task impact.

## Output Format

```md
## Findings

1. [Severity] Short finding title
Location: URL/route/file/component/screen/element
Heuristic: # and name
Problem: what users experience
Impact: why it matters
Fix: concrete change

## Open Questions

- Only questions that materially affect the review
```

Omit sections that are not useful. Never bury findings below summary prose.
