# Principles

Each principle gives the rule, why the reviewer cares, how to detect a violation in a diff, whether it is typically blocking, and verbatim evidence from one reviewer's comments on `wasp-lang/wasp`. "RAW" means "resolve at will", the team's marker for a non-blocking comment.

Frequency counts come from a study of 14 PRs with 454 review comments (#2989, #3018, #3038, #3157, #3159, #3501, #3618, #3651, #4004, #4049, #4067, #4439, #4444, #4504).

## Scope and intent

### 1. Only the changes the purpose needs

**Rule.** A PR contains the changes needed to make its title true. Refactors, renames, moves, and API improvements go in their own PR, and within a refactor, pure moves are separated from functional changes. Small adjacent polish on lines already in the diff is fine and is marked RAW.

**Why.** Unrelated changes pollute the diff and spin off unrelated discussions. Git treats moved code as new, so a logic change hidden inside a move is easy to miss. Mixed PRs get a shallow review of both halves.

**Check.** For each hunk: if it were reverted, would the feature in the title still work? If yes, it is incidental. Look for renames, file moves, quote or indent changes, argument-order flips, new null checks, lockfile churn, and constants turned into functions.

**Blocking?** Conditional. Blocking when a refactor or behavior change hides inside a complex feature PR. Otherwise stated as a principle for next time, and the small change stays.

> Please don't rename and move around stuff that's not necessary, especially in complex PRs. They pollute the diff and spin off unrelated discussions/changes (like this one). Write the stuff you want to refactor in a note, and give the note to Claude after you're done with the feature, or before. [...] Since this is a conversation we often find ourselves in, and I usually let it slide, I'll have to insist you split it up this time. This PR should contain only the changes necessary to make its title a reality. (#4049)

> Things get difficult to follow with large changes such as this one. We want to move only along a single axis and keep everything else as an invariant. That said, this is an excellent change and very minor, so let's keep it. I just wanted to emphasize that doing so should be an exception, not a rule. (#2989)

> It seems we're changing more stuff than strictly necessary for the migration (some of it is refactoring, other parts are even behavioral changes). Not sure if that's intentional or not. (#4004)

### 2. Every change has an articulable reason

**Rule.** For any change whose motivation is not obvious from the diff, ask for the concrete reason, ideally with an example of the alternative. Before replacing or deleting an existing construct, understand why it existed. "Cleaner", "industry standard", and "TS compiles it out" are not answers until they are concrete.

**Why.** An unexplained change is either unnecessary or hiding a reason that should be in the code. Removing something whose purpose you do not understand is how regressions happen.

**Check.** For every non-trivial hunk, can you state in one sentence why it had to change for this PR? If not, ask "How come?". For every deletion, ask "Where was this used? Why did it exist?". When the answer is a slogan, ask a sharper question.

**Blocking?** He keeps asking until the answer is concrete. Appeared in 12 of 14 PRs.

> It seems to me like it's not a problem but please dig in and understand why they were functions in the first place - Chesterton's fence and all. If you can't understand it from the code/PRs, contact the original author. (#4049)

> How come? Can you give an example of how could it have looked like otherwise? (#4049)

> If I got it right, `tsdown` is a build tool, and `create-tsdown` is just a boilerplate to get started with a project that uses `tsdown` as its build tool. So, why use that as an authority on our TS compiler options? It seems unrelated. Am I missing something? (#2989)

### 3. Silent deletions are red flags

**Rule.** When a comment, version pin, export, function, error class, shared handler, or check disappears, ask whether it was intentional, where it went, and whether behavior changes. Intentional behavior changes are disclosed in the PR. When a comment disappears, ask whether the knowledge it carried is obsolete. If part of it is still true, keep the correct part.

**Why.** A refactor is behavior-preserving unless the change is called out. Dropped notes and pins are usually accidents a self-review would have caught.

**Check.** Scan the red side of the diff. For every removal: is there a matching addition, a re-export, or an explanation?

**Blocking?** The question is always asked. "It is self-evident now" or "that situation no longer exists" is accepted.

> We lost this pinning and the note. Was that intentional? (#3157)

> Also, we kicked out `WaspHttpError`, how come? As far as I undertand, that's unrelated to `axios` vs `ky`. (#4004)

> Mentioned this before, but... are we sure we didn't lose some functionality by kicking this out? (#4004)

### 4. Sunk cost does not settle a design question

**Rule.** If a fundamental choice was never argued on its merits (thread buried, decided by default, the linked issue asked for something else), reopen it even late, flip the burden of proof, state your own bias, and take the conclusion to a call.

**Check.** Does the PR do what the issue asked? Was the core design decision discussed anywhere, or did it just happen?

> I unresolved this one because it seemed... well, unresolved :) [...] Anyway, I want to flip the question - What's the main reason for using tarballs instead of uncompressed local packages (aka Symlinks)? [...] It's unfortunate we're discussing this so late in the process after so much work on the tarball modules. The discussion got resolved and buried, and I guess everyone forgot about it. (#2989)

> Hmm, I started reviewing the PR but then stopped. I'm not sure I agree with this decision [...] I could be wrong, and perhaps this was the only way to do it. But the amount of new (and, for this context, complicated) bash imperative code makes me wary. [...] We can discuss it over a call tomorrow. (#3157)

### 5. The description matches the code

**Rule.** The PR description describes what the code does now, names every intentional behavior change, and does not claim behavior the code lacks. Moved blocks are annotated ("just moved from X, no changes"). In a PR chain, a fix goes to the PR that owns the concept, and each PR carries only its own snapshot diffs.

**Check.** Read the description after the diff, not before. For each claim, find the code. For each behavior change in the code, find the sentence.

**Blocking?** Fixing the description is requested but framed as easy.

> PR description is wrong. No big deal, you can just delete the env var stuff. (#4439)

> The PR description says it's supposed to handle _comments and quotes_, but I don't believe it handles comments and I'm not sure what you mean by quotes [...] Did you test out the differences? (#3157)

> If so, please leave a PR comment explaining the change in the future, since this PR reads like it's only supposed to be a refactor. (#4004)

## Simplicity

### 6. Prefer the simplest, most vanilla option

**Rule.** Before introducing a tool, dependency, script, monad transformer, hand-rolled mechanism, or layer of indirection, ask what it does that the existing stack or the dumbest version cannot. Check whether the library already solves it. Check what the codebase and comparable projects do and copy them. For any workaround that "works", ask which tool is violating the standard and whether we are relying on luck.

**Why.** Every mechanism must be documented, remembered, reasoned about on every change, and understood by newcomers. AI made adding code cheap, so the amount of code no longer proves alternatives were explored.

**Check.** For each new dependency, config file, script, or abstraction: what can `tsc`, `curl`, the library built-in, or a plain value not do here? Would the author go down this path without AI? Does the amount of new code match the problem? Could the team have written this by hand and can they read it?

**Blocking?** Blocking only when the author cannot name a concrete inadequacy of the simple version (#4444, #4504). A demonstrated need or a follow-up commitment is accepted (#2989, #3157, #3501).

> Why not just TSC, can't we just build the library? Do we need to bundle it? I might be out of the loop but isn't TSC the most vanilla/standard approach for building TypeScript? (#2989)

> Do we seriously need to take care of this ourselves? Does the library not offer proper utf8 decoding? It seems like table stakes in this day and age. (#4444)

> Would I go down this path if I didn't have AI. Or would I do something shorter and simpler, perhaps do some more reserach? (#3157)

> Please check whether other frameworks have a single file or multiple files. I don't know whether it makes a difference but let's just copy them. (#4049)

> Why use `ExceptT` here? Isn't the alternative without the monad transformer clearer? (#4504)

### 7. Scripts and automation stay minimal

**Rule.** Use the platform's native mechanisms (CI jobs, outputs) before custom scripts. Scripts consumed only by CI are silent on success and let the underlying command's error speak. Do not guard against states that cannot occur or against someone editing the code later. Prefer built-in features (`curl --retry`) over hand-rolled loops. If something is done the brittle way because a tool is "not in CI", ask whether installing it is actually costly.

**Check.** Count `echo` lines and precondition checks and ask what each adds over the command's own failure output. Does the CI use jobs and outputs, or bash conditionals scattered through steps?

**Blocking?** Non-blocking except the native-mechanisms point, which he did insist on (#3157). Argument checks and logging were kept once the author argued for them.

> As bad as GH actions are, we should try to make full use of their native mechanism and only resort to custom scripts as a last resort. (#3157)

> Check what the command outputs when it fails and decide whether you'd like to see something extra on top of that. If not, just let it fail. (#3501)

> In my mind, the code should not have safeguards against someone changing it. (#2989)

### 8. Type assertions and casts are justified

**Rule.** Every `as X`, `as any`, non-null `!`, or `fromJust` is a smell until explained. Ask whether the boundary function could accept `unknown` instead. Accept the cast once the author can say why it is needed in this PR.

**Check.** Grep the diff for `as `, `any`, `!.`, `fromJust`. Ask "Do you know why this assertion is necessary?" for each.

**Blocking?** Non-blocking after an explanation or a screenshot of the type error.

> Do you know why this assertion is necessary? Assertions in these cases are completely fine, as long as we understand why we need them. (#4049)

> Hm, another suspicious `any` assertion. Doesn't `deserialize` work with unknown? (#4004)

## Structure and types

### 9. One source of truth, judged by the footprint of the next change

**Rule.** A fact (path segment, module name, default value, list of variants) lives in one place and everything else derives from it. Evaluate a design by simulating the next change: adding one variant or renaming one thing should touch one place. Do not delete shared constants because they are underused.

**Why.** Duplicated strings make typos newly possible and turn a one-line rename into an N-place hunt.

**Check.** Grep the diff for repeated literals and near-identical lines. Ask "If I add a new X, how many places do I hardcode it?". Check whether a hardcoded value already has a definition elsewhere.

**Blocking?** The core is blocking. Deferral is accepted when a real constraint (circular deps) blocks extraction, as long as constants are not deleted. Unification is a hypothesis to re-evaluate: after asking for it in #4049 he asked "What do you think about the new code compared to the old inconsistent one?" and accepted reverting.

> If I add a new module that needs to work through this registry. What's the code footprint of that? It seems too large. [...] Ideally I want one list where we list all the data and that's it. (#4067)

> When we want to reallocate providers, we now need to change the same string in 4 places. Before, it was one. It's now possible to make a typo in the path when defining a new provider, which also wasn't the case before. (#3651)

> `5432` is defined somewhere else. Let's keep the code DRY and reference that here. (#4439)

### 10. Invariants live in types, not in vigilance

**Rule.** If two configurations are mutually exclusive, model them in the data type rather than as parallel functions. If a property is common to all instances, extract it out of the type so no instance can change it. Keep exhaustive pattern matches as compile-time safety nets. Make dependencies explicit so coupled things vary together.

**Check.** Look for sibling functions that differ only by a mode flag. Look for enum dispatch collapsed into a hardcoded case and ask what ensures the code is updated when a new variant is added. Look for re-spelled signatures where `typeof` or `User["id"]` would tie them together.

**Blocking?** The core is blocking. Precision that costs a phantom type per instance was conceded as boilerplate (#3651).

> I think these two shouldn't even be different functions [...] The type `JsImport` should model type imports. [...] This way, it's impossible to call `getJSRuntimeDynamicImport` on a type import and vice versa. (#4049)

> We want to add a new JobExecutor, for example `Redis`. What do we do and what ensures we don't forget to update the code in all necessary places? (#3651)

> A datatype has no business being able to change something it shouldn't be allowed to change. (#3651)

### 11. Modules hide implementation details, helpers live where they are used

**Rule.** Callers pass the conceptual thing (the project dir), not an internal location (the lock file path). A library knows about runtimes, not about which project consumes it. Swapping an implementation must not change the API, the name, or the location of a function. A helper used in one place is local. `Common` and `Utils` hold only things shared by several consumers. Imports point from specific modules to general ones, never the reverse. Before adding a helper, grep for an existing one and merge near-duplicates.

**Check.** For each public parameter: does the caller need to know this? For each rename accompanying an implementation swap: was it necessary? For each new top-level helper: are there other callers? For each new import: which direction does it point?

**Blocking?** The core is blocking. Over-generalized shared scripts and `Common` cleanups were left as non-blocking suggestions (#3157, #3159).

> Hm, this seems like an abstraction leak. Why must this function's caller know about the virtual module ID? [...] I wouldn't expect any changes in the API for converting ext imports to JSON. (#4067)

> Libraries shouldn't know about the outside world. Runtimes are fair game because they are a thing that exists within the library. (#2989)

> We already have a very similar function. I think yours is a little more informative, which is good. But see if you can merge them and reuse, after putting it in the appropriate module, of course :) (#4439)

> Doesn't this mean we're importing from the SDK generator to the server? Is this on purpose? (#4067)

### 12. Simple signatures, callers adapt

**Rule.** Leaf functions return the plainest honest type (`IO (Either e a)`, a list) and callers lift into `ExceptT` or `Maybe` as they need. Nested wrappers and transformers introduced inside a helper are a smell. Types that model an external file mirror the file as it is (arrays stay arrays, field names as spelled). Derived forms are built in the code that needs them.

> `ExceptT ProjectLockError IO (Maybe WaspProcessId)` - something is off in this type. There's a `Maybe` nested inside an `Either`, and it's all wrapped in an `ExceptT` at the top of the function. [...] Function type signatures should be clean and as simple as possible. The caller is the one in charge. (#4504)

> How come we went with a set here? This structure should mirror how the file works, not how we want it to work. So I believe this should be an array. If we need the set, we should introduce it in the processing. (#3159)

## Naming

### 13. Names reveal purpose and contents

**Rule.** Name things after their purpose or what they produce, not their implementation. A reader must be able to tell what values a variable can hold without reading the code that produces it. A getter's name matches the slot its result fills. A binding earns its place by adding information: inline aliases that only restate the argument, and keep names that tell the reader something the type does not. Types and type parameters follow the same rules as values (`Payload` over `T`, no `TFoo` prefixes). Public API tidiness is the first criterion, even when it makes internal code harder.

**Check.** For each new identifier: can you say what it holds from the name alone? Does `getX` produce something assignable to `x`? Is it named after an implementation detail? Does an intermediate name add anything?

**Blocking?** Usually not. He states what he cares about (clarity, one axis, public API) and lets the author pick the actual word.

> This variable name is confusing me. I can't tell what's inside without looking at the code. [...] The reader should have no trouble figuring out the values that can occupy this variable without looking at the Haskell code. (#4049)

> The name should answer the question "What's the purpose of this?" The current name is too heavy on the implementation detail. (#4049)

> The names `tmplFile` and `tmplData` don't tell us anything new compared to the functions arguments, so why not just call the function directly? Why introduce indirection with no extra information? (#3651)

> `Payload` is a much better name than `T` in most cases. We wouldn't call a variable holding a payload `v`. (#2989)

### 14. Sibling names share one axis

**Rule.** Names in a hierarchy contrast along the same axis (Type vs Value, not Type vs Runtime). Order words from general to specific so siblings share prefixes and sort together. A prefix means one thing across the codebase.

**Blocking?** Blocking only when sibling names actively mislead (one reads as a subset of the other). The word order itself is deferred to the author.

> The names are not consistent: `getJsType...` `getJsRuntime...` I'd expect `Type` and `Value`. (#4049)

> What's up with the naming here? WaspVirtualUserModulesPluginG vs WaspVirtualModulesPluginG? Something is not right. Why is one a subsequence of the other? How did the word user get crammed between virtual and module? (#4067)

### 15. Consistency beats preference, then gets re-evaluated

**Rule.** Match sibling modules and the codebase: prefixes, argument order, singular vs plural, terminology, help-text wording, changelog style. If a convention deserves changing, change it everywhere in a dedicated PR, never partially in a feature PR. After a rename, a newcomer should see no trace of the old name. Then ask whether the consistent version is actually better, and revert if not.

**Check.** Compare every new function, module, and command with its nearest siblings. After any rename, `rg -i --hidden <old>` and share the command.

**Blocking?** Blocking. Appeared in 11 of 14 PRs.

> It seems like this function also changes the convention (`Dst` to `Dest`, flips argument order). Let's try to keep things consistent with the existing system. I'm no fan of these names myself, but consistency is more important. (#3618)

> The rule of thumb is this: If a new person started working on Wasp, they should never see any indication that snapshot tests were ever called e2e tests. (#3018)

> Let's call the flag `--db-port`. I know it's a little redundant, but it will clear things up because we now also have `--client-port` and `--server-port`. (#4439)

## Correctness

### 16. Tests fail for wrong implementations

**Rule.** A test that a hardcoded return would pass is not a test. A test labelled regression is shown to fail on the old code. Read each expectation against the domain: two tests that look identical but assert opposite things, or an expectation that contradicts the concept, mean the test or the understanding is wrong. Descriptions match what is asserted. A new feature needs a way to verify the user-visible behavior.

**Blocking?** Blocking when a test claims coverage it does not provide. New tests are requested "if simple enough" with an offer to help, and stated manual testing is accepted.

> For example, if the function just returned `"x"` every time, this testing function (and all tests that rely on it) would pass. We should do the classic "expect this output for this input." (#2989)

> These are allegedly regression tests, but do they actually fail with the old code? (#4444)

> Shouldn't this test be the exact opposite of what it is? A hash should be a consistent one-way operation. We're not specifying the salt, so where is it coming from? (#2989)

> Please add some tests if it's simple enough. I can help here if needed. (#4439)

### 17. Users first

**Rule.** The product's observable behavior does not change on account of development workflows. Anything a user can see (types on hover, error messages, config files, generated artifacts) is public API and is named and documented for them. Never push operational burden onto users. Prefer that the tool degrades or breaks. Any marker that tells a reviewer to trust or skip something must be truthful.

**Blocking?** Split. Blocking: telling users to do the tool's housekeeping, and untruthful public-facing names or markers. A strong vote, not a block: design choices that shape observable behavior for developer-experience reasons (#3501, #3038).

> In most cases, the product's observable behaviors shouldn't change on account of our development workflows. The user should always come first. (#3501)

> We went from "`wasp clean` solves all issues" to "`wasp clean` won't always work and you'll have to dig through hidden folders/files and clean them up yourself." Can we avoid this? (#4504)

> I'd rather wasp ignores the lock and breaks than tell users to deal with the lock themselves. (#4504)

### 18. Secrets are public forever

**Rule.** Any ID, token, or generated secret that lands in CI config, logs, or docs is public forever. Ask whether it is safe, move it to a secret even when it is "useless without a token", and rotate anything already in history.

> Also, is this safe, can this file be publically visible if our workflow is? (#3157)

> I think we should, yes. But then we also need a new one because this one is already in Github history :D (#3157)

## Documentation

### 19. Comments explain why, for the uninitiated reader

**Rule.** Comments say why something exists and what it enables, not what the next line does. Write them for someone who did not build the system. Any rationale given in a PR thread lands in the code. A long GitHub comment needed to explain a code comment proves the code comment is unclear. Keep one copy and point to it. Prefer stating the constraint plus a link over narrating trial and error. Remove AI leftovers.

**Check.** For each new comment: does it restate the code? Would a teammate with no context understand it? For each explanation in a review reply: is it now in the code?

> If you need a large GH comment to explain something a code comment says, then the code comment is not clear enough. (#4049)

> I'm missing the "why" from this comment (or at least a pointer to the explanation). In its current form, the comment is just a plain text representation of the if expression that follows it. (#2989)

> Leave this comment in the code please. (#4049)

### 20. Docs are self-contained and complete for the change

**Rule.** A README lets a reader with no context diagnose and fix the thing. Use the canonical entrypoint and correct relative paths. Do not enumerate what the source of truth already lists. When a user-facing command or generated artifact changes, search the whole repo for every mention and consider the migration guide.

**Blocking?** Split. Blocking: the no-context-reader test, every mention of a changed command updated, no lists that duplicate a source of truth. Non-blocking: titles, callout severity, verb choice, filler ("Some suggestions, take what you like", then Grammarly).

> The core question we should ask ourselves is: _If Miho forgets everything he knows about this, and it turns out that `--profile esm-only` is the wrong flag to use, will we know how to fix it and choose the right flag?_ And the answer still seems to be "no." (#2989)

> Not sure if necessary to list _all_ the tests we have here. It's just another list that can go out of date :) (#3018)

> Please do a thorough search and find all these places. You can ask your agent to do this, or do it manually by searching for strings `start db` and `db start`. (#4439)

## Process

### 21. The author understands and self-reviews, especially agent-written code

**Rule.** The author must be able to explain every unusual construct. Reviewer illegibility is a signal to ask, not a veto: if the author personally understands it, it can stand. Self-review before requesting review: check snapshots and generated output, remove AI leftovers, keep the description in sync, disclose behavior changes. Delegate consistency sweeps, repo-wide searches, and post-feature refactors to an agent, but any agent-written logic is re-read and, if the author cannot walk through it, rewritten by hand.

**Check.** Indicators of missing self-review: silently dropped comments or functionality, untested claims in the description, redundant obvious comments, lots of new code with little reasoning, a stale description of an abandoned design.

> I believe that, the harder the code is for us to write, the more important it is we understand it. Please go through the file, ensure you understand the API calls, possible return values, and how all those affect the calling code. (#4504)

> I don't understand this code. If you do, that's fine, I guess it's my skill issue. But I want to avoid agents writing stuff we couldn't write ourselves. (#4504)

> I think this PR should have spent some more time in the self-review cycle, the main indicators being: It drops several comment notes and even some functionality. I don't think most of it was done on purpose. (#3157)

> AI reduced the friction of adding new code much more than the friction of reviewing and maintaining it, making us less likely to think twice about adding new code and pushing back on the reviewer's suggestion. (#3157)

### 22. Verify claims against reality

**Rule.** When the author says a change is equivalent, conventional, handles X, or is needed, check it: render the output, read the CI logs, grep for the claimed precedent, run the test against old code. Ask "Where?" when told something matches existing patterns. Be honest about how deep your own check went.

> Where? Where in our Haskell codebase do we have anything resembling this? (#4444)

> What about the streaming responses API? I didn't check all the details, but I have a feeling that Wasp's public API relied on Axios more than what we've covered here. (#4004)

> What's with all these package-lock.json changes? We didn't touch anything that would cause this, so what's up? (#4444)

### 23. Deferred work gets a concrete commitment

**Rule.** An out-of-scope improvement is either done now in a separate PR or captured in a dedicated issue, ideally with a time commitment. Resolve a thread only after verifying the change. On every follow-up pass, re-check earlier threads and call out what did not land. Every TODO, debug toggle, temporary CI trigger, or self-note is resolved, linked to an issue, or deleted before merge.

> Ok, will you have time to do it in this sprint? If not, I fear it will get forgotten. (#4067)

> This thread was resolved and no one linked an issue. So, just to double check - did we create one? (#2989)

> Was this todo supposed to be gone by now or are we still debugging? (#3157)

### 24. Consolidate recurring feedback

**Rule.** When the same issue appears in many places, explain it once, reference it briefly elsewhere, and announce you will stop repeating it. Functionality-loss concerns are the exception and get raised at each site.

> I'll stop commenting on them to avoid creating a thousand threads and let's dicuss it here. (#3651)

> Same naming problem as mentioned above. I won't repeat it anymore to avoid noise, but it applies to many variables and types. (#3618)

### 25. Stuck disagreements move to a call

**Rule.** If you disagree with a fundamental design decision, stop the line-by-line review, state the disagreement and your uncertainty, and propose a call. If a written explanation is not landing after two rounds, switch to a call and record the conclusion in the thread.

> Let's discuss this in person in the office and write the conclusion here. (#2989)

> You know what might help, unironically? Some snapshot differences, so I can see the final product. I can't believe I'm saying this but please commit them. (#4067)
