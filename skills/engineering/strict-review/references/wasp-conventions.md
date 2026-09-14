# Wasp-specific conventions

Conventions observed in `wasp-lang/wasp` reviews that do not transfer to other codebases. Apply these only when reviewing Wasp.

## Team vocabulary

- `RAW` (resolve at will) marks a non-blocking comment.
- A rocket emoji on a PR annotation means "nothing changed here, trust me" and must be accurate. "When I see a rocket, I should trust the author enough to not look at the code again."
- `// PUBLIC API` and `// PRIVATE API` markers in SDK templates must match reality. Public API changes update the public API table and docs.

## Haskell generator

- Generator functions are prefixed `gen*`, not `get*`.
- Copy helpers take the template file first and the destination second. `Dst`, not `Dest`.
- Singular module names (`WebSocketGenerator`). Non-exported declarations go below exported ones. Functions are ordered top-down so the file reads like a story. Type signatures above bindings.
- Avoid nested `where`. When the function name is long and one argument is matched, a `case` beats multi-clause matching.
- Templates do not construct import paths. The Haskell generator owns path resolution and dynamic names, templates hold static content.
- Two top-level generators writing into one output directory should become one parent generator.

Personal style preferences he states once as subjective and never insists on: guards over if-expressions, `map` over `fmap` when the signature is already list-specific, qualified imports when the name is too general or many things are imported.

## StrongPath

- Use quasi-quoters (`[reldir|...|]`) instead of runtime parsing with `fromJust`.
- Distinct directories get distinct phantom types. `Dir a` means "any directory", `Dir'` means "a specific one I don't care to name". Phantom type names describe what the directory is, not where it sits.
- Once a value is a glob it is a `String`, not a path.

## Naming vocabulary

- The `User` prefix means "defined by the user", not "for the user".
- Internal `RegisteredX` names must not leak into user-visible types.
- Virtual modules are an implementation detail, so switching to them must not rename `extImportToJsImport`.
- CRUD is on its way out, so new comments should not reference it.

## Libs (`waspc/libs`)

- Entry points split by runtime (node, browser, neutral), never by consuming project (sdk, server, web-app).
- Libs are versioned with the Wasp version. No content hashes in the product. Dev-only cache busting lives in the `./run` script.
- Generated projects must not reference the compiler's data dir.
- Minimize SDK exports the server consumes so the SDK stays decoupled from framework code.

## `./run` scripts

- `./run` is the canonical entrypoint for scripts, CI, and docs.
- Each prefix segment answers "what". `build:` holds only build actions. A group command exists when its children do (`test:waspc` if `test:waspc:unit` and `test:waspc:e2e` exist).
- Windows `.ps1` parity when the existing mechanism has it. Run shellcheck.

## Tests and snapshots

- The author reviews snapshot diffs, not the reviewer. Each PR in a chain carries its own snapshot changes.
- Commit snapshot diffs so reviewers can see the generated product.
- Kitchen-sink type tests are where RPC types get compared against main.
- Test terminology follows the technically correct hierarchy (e2e snapshot, e2e headless) after debate. After any rename, `rg -i --hidden <old>` for stragglers and share the command.

## Docs and process

- `web/versioned_docs` are frozen snapshots of past versions. Old strings there are correct, not stragglers.
- Markdown snapshots and `llms-full.txt` are generated and CI-checked. Regenerate them, do not review them.

- Consider the migration guide for any change to the generated Dockerfile, tsconfig, or package.json.
- Changelog entries and help text match sibling entries (`--client-port`, `--server-port`, `--db-port`).
- Rationale produced in a PR thread goes to Notion or the README.
- Martin is the uninitiated-reader test. Grammarly does the final polish.
- Stalled discussions move to Discord or an in-office call, with the conclusion written back into the GitHub thread.

## Product invariants

- `wasp clean` must always give users a clean slate.
- The CLI decides ports so URL env vars can be auto-filled in `wasp build start`.
- Dev and production behavior must not diverge.
