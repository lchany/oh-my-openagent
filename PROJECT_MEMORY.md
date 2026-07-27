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
  Status: superseded by the 2026-07-27 v4.19.2 baseline below.

- [2026-07-27] v4.19.2 adaptation baseline
  Value: Branch `local/v4.19.2-adapted` merges official tag `v4.19.2` at `3f917a94c4bc425de94ec8cc6223cda95328021c` with the committed local legacy-skill opt-in adaptation and local shared-skill additions.
  Source: Merge commit `e399086e4ca6df266a60101d25e990bb1d9acd46`; successful build; 11 targeted legacy-skill tests; isolated `opencode agent list`; live service health and agent endpoint checks.
  Evidence: `.omo/evidence/20260727-v4192-local-upgrade/verification.md`.
  Status: active and verified.

## User Corrections

- [2026-07-27] OMO upgrade scope
  Previous wrong assumption: Apply the general GBrain recall/capture workflow while upgrading the local OMO plugin.
  Correct value: A local OMO plugin upgrade on this machine is an OMO repository, fork, build, QA, and OpenCode service task; it does not involve querying or operating GBrain unless the user explicitly asks for GBrain work.
  Future rule: Keep OMO upgrades scoped to the local OMO repository and OpenCode surfaces. Do not add GBrain operations merely because unrelated GBrain changes are present in the OMO worktree.
  Source: user correction
  Status: active

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

- [2026-07-27] GBrain no-hook capture plan: COMPLETE 17/17
  State: plan `gbrain-no-hook-capture-implementation` fully complete. Todos 1-12 and Final Wave F1-F5 all verified/APPROVE.
  Resolution: production `/opt/gbrain` was deployed with the plan's files and `gbrain-serve-http.service` restarted (service-only); F5 final reviewer confirmed live default inbox exclusion and read-token write denial. VERDICT: APPROVE.
  Archive: complete project archived to `github.com/lchany/GBrain-self-evolution` (main = de031d3): gbrain + omo patches, docs, skills, rules, README, EVIDENCE.
  Source repos: all changes remain uncommitted working-tree state per the no-commit rule; the archive repo is the distribution vehicle.
  Evidence: `.omo/evidence/20260726-gbrain-no-hook-capture/` (todo-12 INDEX, final-wave reports, deploy/).
  Status: complete.
- [2026-07-27] GBrain deployment package plan: COMPLETE 12/12
  State: plan `gbrain-self-evolution-deployment-package` fully complete. Todos 1-7 and Final Wave F1-F5 all APPROVE (F1/F4 required one fix+re-review round each).
  Delivered: `docs/deployment/` (README entry, new-machine-bootstrap, client-onboarding, agent-rules, verification-checklist), `deploy/` (6 systemd + 5 env templates + 3 dry-run scripts), README/EVIDENCE final-state repair, broken cross-doc links fixed repo-wide (109 links, 0 broken), `__VG_` redaction tokens removed from published content.
  Published: commit `cf225946a2b66d4aaaaec9e80a925651ac550019` (`docs: add GBrain deployment package guide`) pushed to `github.com/lchany/GBrain-self-evolution` main; remote verified (SHA match, 19 new files, clean tree).
  Notes: commit author email is the machine git config `__VG_EMAIL_` placeholder, consistent across all repo history (privacy-safe, not a leak). Source repos (gbrain, oh-my-openagent) untouched by this plan; their dirty state is the pre-existing patch source.
  Evidence: `.omo/evidence/20260727-gbrain-self-evolution-deployment-package/` (final-local-qa, final-f1..f5, publication-proof).
  Status: complete.
- Current goal: Keep the local OMO plugin on the verified v4.19.2 baseline while preserving explicit legacy-skill opt-in behavior and the committed local shared skills.
- Last verified: The v4.19.2 build completed; 11 targeted adaptation tests passed; isolated and live OpenCode surfaces registered the expected primary and subagents; `opencode.service` is healthy after restart.
- Next step: Use `local/v4.19.2-adapted` as the active upgrade branch for future work.
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
