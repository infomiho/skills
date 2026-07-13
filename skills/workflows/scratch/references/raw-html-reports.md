# Raw HTML Reports

Use raw HTML for reports intended to be static, easy to deploy, and easy to inspect.

Prefer modern CSS when it reduces file size or improves clarity:

- custom properties
- cascade layers
- container queries
- grid and subgrid
- `clamp()` for fluid type and spacing
- modern color functions like `color-mix()`
- `:has()` for state and structure selectors

Keep reports self-contained unless assets or generated data make that awkward.
