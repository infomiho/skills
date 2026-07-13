---
name: review
description: Review code changes for correctness, clarity, and potential issues. Use when the user asks for a review, code review, PR review, or wants feedback on a diff or file.
argument-hint: [PR-number-or-file]
allowed-tools: Read, Grep, Glob, Bash(git *), Bash(gh pr diff *)
user-invocable: true
---

# Code Review

Review the code changes and provide actionable feedback.

## What to review

If a PR number is provided, fetch it with `gh pr diff $ARGUMENTS`. Otherwise, review the staged/unstaged diff with `git diff` or read the specified files.

## Review focus

1. Clean Code the naming
2. DRY up the code
3. Look into Effective TypeScript issues
4. Remove AI slop comments if any
5. If it's a shell script, use `shellcheck`

## Output format

For each issue found, include:
- The file and line reference (`file:line`)
- What's wrong
- A suggested fix (code snippet when helpful)

End with a brief summary. If no issues are found, say that explicitly and mention any residual risks or testing gaps.

## Target

$ARGUMENTS
