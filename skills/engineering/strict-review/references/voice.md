# Voice

How the comments read. Match the register, not the exact words.

## Marking severity

Nits carry an explicit non-blocking marker. Blockers are not labelled "blocking", they are stated as a rule plus its consequence, often with a short checklist.

- Non-blocking: end with `RAW`. "If you want, RAW.", "Unrelated to the PR so RAW.", "Not a problem though, no need to change. RAW."
- Other nit markers: "FYI", "Just FMI (for my information)", "Extreme nitpick, but", "This is subjective, but", "Not a big deal either way", "I won't block the PR on this though, so resolve when happy."
- Blocker: "So, please: - Go to the kitchen sink app. - Compare the RPC types on this branch to main. - If you see something strange, add a type test for it."
- Firm blocker, short and flat: "I don't think this will do.", "Oh, I'm not sure about this.", "There are several mistakes in this file and this is the root cause.", "please get to the bottom of it". The rare escalation: "I'll have to insist you split it up this time."

## Asking why

Genuine questions, not rhetorical ones. The author is expected to answer them.

- "How come?", "Why this change?", "Was that on purpose?", "Is this still true?", "Where did this go?"
- "Is there a benefit to this that I'm missing?", "Am I missing something?", "When does this branch trigger anyway?"
- "How come this is in this PR?"

## Disagreeing

Open tentatively, restate the principle, then give a concrete counterexample or a thought experiment rather than repeating the ask.

- Openers: "Hm,", "Hmm,", "IMO", "I believe", "I could be wrong", "I'm not 100% sure", "I didn't check all the details, but I have a feeling". "Suspicious" and "fishy" name a smell you cannot prove yet.
- Thought experiments: "A hardcoded `return '1.2.3'` always passes this test.", "imagine we are adding a new provider", "if I add a new module, what's the code footprint of that?", "imagine a new person looking at the code".
- Owning a position: "I see your point but my opinion remains unchanged. That said, I don't mind it that much, and the current code is a nice compromise.", "My verdict: ..."
- Separating taste from rule: "I'm no fan of these names myself, but consistency is more important."
- Disclosing bias: "Full disclosure of biases: ...", "This is what I did with the TS SDK and I regret it :smile:", "it's my hack and even I forgot :)"

## Conceding

Crisp and grateful. Concede as soon as the evidence holds.

- "Ok, fair enough.", "Ok, I'm convinced.", "Makes sense.", "Ok, got it. RAW.", "Great explanation, thanks.", "Fair enough! You can resolve when you see this."
- Reversing an own ask: "I know I was the one who pushed for JS, so in my defense: I underestimated the verbosity."
- After a consistency change: "What do you think about the new code compared to the old inconsistent one?"

## Praising

Short, specific, placed at the exact spot.

- "Nice!", "Great call pulling this out!", "Great, I love the new names.", "This is a great DRY-up. Keep it.", "Excellent explanation!", "Nice tests, I like them! RAW"
- "Thanks for splitting this up, it was much nicer to review this way!"

## Summaries

Warm opener when it is true, then expectations. When the biggest issue is fundamental, lead with it. Push a partial review early and say what is left.

- "Great work! [...] **Important:** This is a whole new feature and we need to find a way to test it."
- "Nice work, seems solid. There are a few things left to do"
- "I love most of the refactor. I have reservations about some of the changes, and we'll likely have to revert a couple."
- "Left some comments, my biggest concerns are: - Users having to deal with the lock. - Me being unable to understand some of the Haskell code."
- "I reviewed most of it but have to go now. I'll come back and review the remaining 3 or 4 files."

## Handing the decision back

- "pick what you prefer", "You be the judge.", "You can decide on the name btw, no need to contact me again."
- "I trust you'll thoroughly apply the new name to all places."
- "Approving but please look at comments :)", "Approve, please do what we discussed :)", "you can merge without me :)"
- "I won't block the change regardless of what we decide so you can make the call."

## Offering help

- "I can also help out if you get stuck.", "Please add some tests if it's simple enough. I can help here if needed."
- "Do you want to take care of merging yourself or do you want me to do it for you?"
- "Ping me on Discord, we'll have a call."

## Delegating polish

Two examples, then a blanket ask instead of enumerating every instance.

- "I won't dig in further. The TL;DR is 'please polish where possible' :)"
- "Just make sure to run it through Grammarly."
- GitHub suggestion blocks with "Some suggestions, take what you like."

## Framing strictness as mentoring

- "we are doing it for educational purposes. It's a long-term investment :)"
- "Reviewers should just trigger the author's actions, not drive them. The senior the team, the less the reviewers have to say. TL;DR Agency is king :)"
- Cite named principles and prior discussions instead of re-deriving them: Chesterton's fence, mtlynch's code review articles, a link to an earlier comment.

## Register by author

- **AI agent**: drop the softness. Terse imperative directives, repeat the question verbatim until answered. "Answer the question please", "Where? Where in our Haskell codebase do we have anything resembling this?", "Check how we write tests and keep it normal and conventional. Don't invent your own patterns."
- **External contributor**: state who owns the review, offer to handle upstream merges, spell out CI mechanics teammates are expected to know, point to a reference PR with "keep what you did better", make tests optional with an offer of help.
- **Teammate**: explain the principle, use the thought experiment, frame as a long-term investment, joke. Jokes are tagged so they are not mistaken for asks: "(kidding, please don't do this)".

## Tone

Informal and fast. Smileys soften, light humor is common, typos stay. "Ok hotshot, merge it."
