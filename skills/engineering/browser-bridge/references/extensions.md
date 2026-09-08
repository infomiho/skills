# Extending the starter

The [source gist](https://gist.github.com/infomiho/184a6c011d226878188acd8496fa5f9f) includes a broader implementation prompt. These are extension requirements, not claims about the bundled starter.

## Transport and controller invariants

- Share one DOM driver and command protocol between popup and direct modes. Authenticate popup handshakes with an injection nonce and validate both message origin and source window.
- Bind only to loopback. Keep controller and browser credentials separate, rotate them on startup, and write secret files with mode 0600.
- Validate Host, Origin, and WebSocket upgrades. Reject browser-origin controller requests. Scope browser messages to their socket's session so one tab cannot read or control another.
- Bound per-tab state and payloads. Use unique command IDs, approximately 25-second expiry, one outstanding command per session, and at-most-once delivery. Lost acknowledgement means possibly executed.
- Reinjection replaces the previous tab instance. Disconnect cancels pending work and closes owned transports. Preserve existing instances when starting another runtime.
- If adding a CORS-fetch fallback, retain authentication and session isolation. It is useful only where browser policy permits it.
- Keep the protocol limited to DOM operations. Do not add arbitrary evaluation or shell execution endpoints.

## DOM extensions

- Traverse same-origin iframes and open shadow roots, recording inaccessible frames. Resolve selectors within explicit roots and reject ambiguous or stale targets.
- Include URL, title, timestamp, viewport, scroll position, visible text, labels, roles, control state, ordinary values, and select options. Exclude bridge UI and password, hidden, and file values.
- Bound traversal and output, prune detached nodes, and throttle mutation updates.
- Add `read`, `focus`, `hover`, `key`, or `submit` only as needed. Use native value setters with bubbling input/change events for form controls, explicit boolean state for checks, and option values for selects.
- Implement submit through `requestSubmit` so browser validation runs. Preserve the distinction between command acknowledgement and verified application success.

## Verification

Use local fixtures and the CLI to exercise both transports through snapshot, fill/select/check, validated submission, and readback. Check credential isolation, omitted sensitive input values, stale and ambiguous targets, command expiry, disconnect, and reinjection.

COOP tests need different origins for the page and relay. A same-origin popup does not exercise opener isolation. Test only the extensions implemented and distinguish current test results from the gist author's reported coverage.
