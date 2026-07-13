---
name: review
description: Review code changes for correctness, clarity, and potential issues. Use when the user asks for a review, code review, PR review, or wants feedback on a diff or file.
argument-hint: [PR-number-or-file]
allowed-tools: Read, Grep, Glob, Bash(git *), Bash(gh pr diff *)
user-invocable: true
---

# Code Review

## What to review

If a PR number is provided, fetch it with `gh pr diff $ARGUMENTS`. Otherwise, review the staged/unstaged diff with `git diff` or read the specified files.

## Review focus

1. Clean up naming using Clean Code principles.
2. DRY up the code.
3. Check for Effective TypeScript issues.
4. Remove AI slop comments.
5. Run `shellcheck` on shell scripts.

## Output format

For each issue found, include:
- The file and line reference (`file:line`)
- What's wrong
- A suggested fix (code snippet when helpful)

End with a brief summary. If no issues are found, say that explicitly and mention any residual risks or testing gaps.

## Target

$ARGUMENTS
