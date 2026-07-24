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
  Status: superseded by the 2026-07-20 v4.19.0 baseline below.

- [2026-07-20] v4.19.0 adaptation baseline
  Value: The local legacy-skill opt-in commit was merged with official tag `v4.19.0` at `14083b89f1cbf4680be13493a6c4afd67c957e8a` without restoring the removed `shared/<skill>` alias machinery.
  Source: Verified by a successful v4.19.0 build and isolated `opencode agent list` startup.
  Status: active and verified.

## User Corrections

- [2026-07-20] Model selection objective
  Previous wrong assumption: Infer a quality-first model choice by independently replacing official Mini, Luna, or K2.6 recommendations with larger models.
  Correct value: The local OMO model configuration should use the best role-compatible choice explicitly recommended by official v4.19.0 routing and model-matching guidance within the user's available providers; cost is not the goal, but unofficial substitutions are not allowed.
  Future rule: Follow official role matching, tuned prompt support, and official fallback order. Do not substitute a model merely because it appears larger or newer unless official guidance explicitly recommends that override.
  Source: user correction
  Status: active

- [2026-07-20] Local upgrade workflow
  Previous wrong assumption: Upgrade a dirty local adaptation first, then reconstruct or preserve its history afterward.
  Correct value: Before each local OMO version upgrade, commit and push all existing local changes; then upgrade, build, and verify startup; finally commit and push the version upgrade separately.
  Future rule: Keep upgrades to this two-commit workflow. By default, only build and perform a simple startup check; do not run tests unless startup fails or the user explicitly requests tests.
  Source: user correction
  Status: active

## Invalidated Assumptions

- [2026-07-10] Do not assume:
  Reason: The checkout is intentionally dirty because it preserves local skill-discovery adaptations on top of `v4.16.2`.
  Superseded by: Confirmed local checkout baseline above; the preserved change makes Claude Code and `.agents` skill discovery opt-in through `claude_code.skills`.
  Status: active

## Current Task State

- Current goal: Keep the local OMO plugin on the verified v4.19.0 baseline while preserving explicit legacy-skill opt-in behavior.
- Last verified: The v4.19.0 build completed and isolated `opencode agent list` registered the expected OMO primary and subagents.
- Next step: Commit and push the v4.19.0 upgrade branch.
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
- Upgrade evidence: `.omo/evidence/20260720-v419-local-upgrade/verification.md`.

## Archive Candidates

- Cross-project incident, runbook, or knowledge worth considering for Experience Vault: None.
