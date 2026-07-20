# Project Memory

## Scope

This file records project-specific facts, user corrections, invalidated assumptions, and current task state needed to continue work after context compaction.

## Confirmed Project Facts

- [2026-07-10] Local checkout baseline
  Value: Branch `dev` now tracks official `origin/dev` at `5c795d27b`, with the existing local skill-discovery changes restored cleanly after the update.
  Source: Verified after `git fetch origin dev`, fast-forward update, and restoration of a temporary including-untracked stash.
  Status: superseded by the 2026-07-13 v4.17.1 baseline below.

- [2026-07-13] v4.17.1 adaptation baseline
  Value: Active branch `local/v4.17.1-adapted` is based directly on tag `v4.17.1` at `ed0241d1af225d38de55fdbcf0baa0abc9a1465a`; the local legacy-skill opt-in adaptation reapplied without Git conflicts.
  Source: Verified with `git rev-parse HEAD`, tag ancestry, targeted skill-discovery tests, and the current worktree diff.
  Status: active, pending full build and live OpenCode QA.

## User Corrections

- [2026-07-20] Local upgrade workflow
  Previous wrong assumption: Upgrade a dirty local adaptation first, then reconstruct or preserve its history afterward.
  Correct value: Before each local OMO version upgrade, commit and push all existing local changes; then upgrade, build, and verify startup; finally commit and push the version upgrade separately.
  Future rule: Keep upgrades to this two-commit workflow and run only the validation needed for the changed surface unless broader failures point to the upgrade.
  Source: user correction
  Status: active

## Invalidated Assumptions

- [2026-07-10] Do not assume:
  Reason: The checkout is intentionally dirty because it preserves local skill-discovery adaptations on top of `v4.16.2`.
  Superseded by: Confirmed local checkout baseline above; the preserved change makes Claude Code and `.agents` skill discovery opt-in through `claude_code.skills`.
  Status: active

## Current Task State

- Current goal: Complete and verify the local skill-discovery adaptation on the fixed `v4.17.1` release baseline.
- Last verified: The adaptation reapplied without conflicts; 149 targeted tests passed across default/opt-in discovery, cache isolation, git-master precedence, skill context, command registration, delegation fallback, and auto slash-command behavior.
- Next step: Run diagnostics, full typecheck/build, isolated OpenCode QA, then remove the temporary migration stash.
- Blockers: None.
- [2026-07-10] Local OpenCode missing agent diagnosis
  Resolved: `origin/dev` adds the GPT-5.6 Hephaestus prompt and allow-list. The configured `openai/gpt-5.6-terra` now registers Hephaestus successfully after rebuild and service restart.
  Scope: `/root/.config/opencode/oh-my-openagent.jsonc` with the server process running as `root`; observed 2026-07-10.
  Status: diagnosed, no configuration or code change applied.
- [2026-07-10] OpenCode message disconnect diagnosis
  Verified cause: Recent disconnected sessions selected `openai/gpt-5.6-luna-pro`. The provider resolves that request to `gpt-5.6-luna` and returns `AI_APICallError: Model not found gpt-5.6-luna`; OpenCode then cancels the session. The OpenCode service and FRP-facing server remain active. A session using `openai/gpt-5.6-terra` did not emit this provider error.
  Scope: server log entries for sessions created after the dev adaptation; no configuration change applied.
- [2026-07-13] VERL command path check
  Verified: `/root/.config/opencode/commands/verl-subagent-union-workflow.md` loads the controller contract from the active OpenCode config directory and does not contain the previously suspected stale adapter path.
  Scope: The external adapter skill remains under `/home/l30002999/source_code/oh-my-openagent-subagent-adapter`; no command-file repair is required.
- [2026-07-13] Legacy skill directories removed after migration
  Verified cause: OpenCode 1.17.18 scans `~/.agents/skills` independently of OMO, so `claude_code.skills: false` cannot suppress host-native legacy copies by itself.
  Applied: Verified every skill under `/root/.agents/skills` and `/home/l30002999/.agents/skills` was byte-identical to its `/root/.config/opencode/skills` replacement, then removed both legacy `skills` directories.
  Result: Isolated real `opencode agent list` retained an official `skills.paths` sentinel and no longer exposed the legacy sentinel.
  Status: active.

## Evidence Pointers

- Relevant files: `packages/skills-loader-core/src/features/opencode-skill-loader/`; `packages/omo-opencode/src/plugin/` and related command/delegation integration files.
- Relevant commands: `git fetch --tags origin`; `git stash apply`; `bun install --frozen-lockfile`; `bun run typecheck`; `bun test`; `bun run build`.
- Saved outputs or logs: `.omo/evidence/20260710-gpt56-hephaestus-dev-adaptation/verification.md`.

## Archive Candidates

- Cross-project incident, runbook, or knowledge worth considering for Experience Vault: None.
