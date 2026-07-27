# OMO v4.19.2 Upgrade Project-Close Review Draft

Status: pending-human-review

## Project outcome

- The local OMO plugin was upgraded from the v4.19.0 adapted baseline to official v4.19.2.
- Existing local changes were committed and pushed before the official tag merge.
- The active branch is `local/v4.19.2-adapted`, and the fork points to the verified final commit.
- The local OpenCode service was restarted and is healthy on the upgraded build.

## Verification

- `bun install --frozen-lockfile`: passed.
- `bun run build`: passed and generated v4.19.2 artifacts.
- Legacy-skill opt-in gate: 11 tests passed, 0 failed.
- Isolated OpenCode `agent list`: passed; real session count unchanged.
- Live OpenCode health and agent endpoints: passed after restart.
- Oracle post-implementation review: READY, no blocking findings.

## Project-specific lessons

- This fork intentionally keeps legacy Claude Code and `.agents` skill discovery disabled unless `claude_code.skills` explicitly enables it.
- Local shared skills and Codex synchronization changes must be committed before future upstream merges.
- The service can take longer than 60 seconds to expose HTTP after systemd reports it active; health readiness and process activation are distinct states on this machine.
- Local OMO upgrades are scoped to the OMO repository, fork, build, QA, and OpenCode service. They do not require GBrain operations.

## Proposed general lessons

- For a locally adapted plugin, commit and push dirty local work before merging an official release tag, then keep the upstream merge as one auditable baseline commit.
- Verify upgrades through both an isolated host surface and the actual long-running service.
- Treat a fixed readiness timeout as a probe limit, not proof that a successful systemd restart failed; follow with direct service and application-level checks.

These are proposals only. They must not be promoted to shared knowledge or runbooks without explicit project-user review.

## Exclusions

- No full repository test suite was run; the project rule uses build plus focused startup and adaptation checks for routine upgrades.
- No real model-provider conversation was invoked.
- No FRP service was restarted, stopped, or reconfigured.
- No GBrain query, capture, review, or promotion is part of the completed upgrade path.

## Residual risks

- `frpc-opencode.service` remains in the same pre-existing `activating` state observed before the OpenCode restart; the upgrade did not touch it.
- The local branch name `local/v4.19.0-adapted` still points at the upgrade merge because ordinary deletion was safely refused. The remote v4.19.0 branch still points at the true pre-upgrade commit.
- The initial restart helper timed out at 60 seconds, while the later direct health and agent probes passed.

## Human review requested

Please review:

1. Whether the project-specific lessons above accurately describe this machine and fork.
2. Whether any proposed general lesson should become a future shared candidate.
3. Whether the residual risks are acceptable or require follow-up.
