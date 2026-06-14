# Raw HTML Reports

Use raw HTML for reports when the output should be static, easy to deploy, and easy to inspect.

Prefer modern CSS where it keeps the file smaller and clearer:

- custom properties
- cascade layers
- container queries
- grid and subgrid
- `clamp()` for fluid type and spacing
- modern color functions like `color-mix()`
- `:has()` for state and structure selectors

Keep the report self-contained unless assets or generated data make that awkward.
