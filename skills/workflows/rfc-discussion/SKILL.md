---
name: rfc-discussion
description: Turn an RFC's review comments into researched reply drafts, a local HTML review tool for editing them, and a distilled list of committed changes. Use when the user wants to process RFC or design-doc review comments, draft replies to reviewers, or turn a comment discussion into an RFC change list.
user-invocable: true
---

# RFC Discussion

Turn an RFC's review comments into researched reply drafts the user edits in a local tool, then into a list of committed changes. The user decides everything; the agent generates text and finds gaps.

## Phase 1: Ingest

1. Fetch the RFC page and its comments. For Notion: `ntn pages get <page-id>`, then `ntn api v1/comments block_id==<id>` for the page id (page-level threads) and for every block id referenced in `discussion-urls` spans of the page Markdown (inline threads).
2. Build a thread list: each thread = source anchor text + its comments in order.
3. Split long multi-point comments into per-point chunks labeled `point N of M`; each chunk gets its own answer box.

## Phase 2: Build the review tool

1. Copy [assets/comments-template.html](assets/comments-template.html) to a working file named after the RFC.
2. Fill the `#thread-data` JSON block. The contract is documented in a comment above the block: `title`, `subtitle`, unique `storagePrefix`, `threads`.
3. Answer keys are localStorage identity: stable slugs derived from discussion ids, never positional. Regenerating with the same key preserves the user's edit (the new proposal stays reachable via "reset to proposed"); changing a key orphans the edit.
4. Send the file to the user to open in a browser. Edits autosave to localStorage; the Export button copies `{key: {text, edited}}` to the clipboard.

## Phase 3: Research, then draft

1. Before drafting any answer, fan out parallel research subagents against primary sources (official docs, specs), one per question domain. Require a source URL for every claim.
2. Write proposed answers grounded in the findings, links inline. When research contradicts a commenter's premise, say so in the draft with the source.
3. Answer what the comment asked, at its altitude. No essays.

## Phase 4: User edits, agent critiques

1. The user edits answers in the tool and exports them (Export button, then pastes or `pbpaste`).
2. Diff the export against the proposals. Report findings only, ordered by severity: gaps, contradictions between the user's answers, unanswered questions, weakened or unsupported claims. No edits, no fixes.
3. The user adjudicates each finding; their ruling is final. Do not re-litigate.

## Phase 5: Distill commitments

Produce the RFC change list from explicit commitments only: "I'll add", "I'll scope", findings the user accepted. A topic having been discussed is not a change having been promised.

## Optional: design deep-dive

For a contested design point raised in comments:

1. Enumerate the known constraints and confirm them with the user.
2. Spawn N (default 3) unprimed subagents: identical prompts containing only the constraints and the deliverable format, never prior candidates or preferences.
3. Pin the deliverable's abstraction level explicitly (e.g. "the data shape, as language-agnostic pseudocode; encapsulation and language mechanics out of scope"), otherwise agents spend their differences on mechanics instead of design.
4. Present results side by side, unranked. Convergence across unprimed agents is a finding; so is what none of them produced. The user picks.

## Rules

- Hold no favorites: when the user is deciding, present options neutrally.
- Every factual claim in a proposed answer carries a primary-source link.
- The user's edited text is the artifact of record; drafts are scaffolding to discard without sentiment.
