/// <reference types="bun-types" />

import { afterEach, beforeEach, describe, expect, it } from "bun:test"
import { mkdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { clearSkillCache, getAllSkills } from "./skill-discovery"
import { resolveSkillContentAsync } from "./skill-template-resolver"
import { discoverSkills } from "./loader"

const TEST_DIR = join(tmpdir(), `legacy-skill-opt-in-${Date.now()}`)
const CLAUDE_CONFIG_DIR = join(TEST_DIR, "claude-config")
const OPENCODE_CONFIG_DIR = join(TEST_DIR, "opencode-config")
const LEGACY_SKILL = "legacy-only-skill"

const originalClaudeConfigDir = process.env.CLAUDE_CONFIG_DIR
const originalOpenCodeConfigDir = process.env.OPENCODE_CONFIG_DIR

function writeSkill(root: string, name: string, body: string): void {
  const skillDir = join(root, "skills", name)
  mkdirSync(skillDir, { recursive: true })
  writeFileSync(
    join(skillDir, "SKILL.md"),
    `---\nname: ${name}\ndescription: test skill\n---\n${body}`,
  )
}

beforeEach(() => {
  clearSkillCache()
  mkdirSync(OPENCODE_CONFIG_DIR, { recursive: true })
  process.env.CLAUDE_CONFIG_DIR = CLAUDE_CONFIG_DIR
  process.env.OPENCODE_CONFIG_DIR = OPENCODE_CONFIG_DIR
  writeSkill(CLAUDE_CONFIG_DIR, LEGACY_SKILL, "LEGACY_ONLY_BODY")
})

afterEach(() => {
  clearSkillCache()
  rmSync(TEST_DIR, { recursive: true, force: true })
  if (originalClaudeConfigDir === undefined) delete process.env.CLAUDE_CONFIG_DIR
  else process.env.CLAUDE_CONFIG_DIR = originalClaudeConfigDir
  if (originalOpenCodeConfigDir === undefined) delete process.env.OPENCODE_CONFIG_DIR
  else process.env.OPENCODE_CONFIG_DIR = originalOpenCodeConfigDir
})

describe("legacy skill discovery opt-in", () => {
  it("excludes legacy skills by default and includes them when explicitly enabled", async () => {
    const defaultSkills = await discoverSkills({ directory: TEST_DIR })
    const enabledSkills = await discoverSkills({ directory: TEST_DIR, includeClaudeCodePaths: true })

    expect(defaultSkills.some((skill) => skill.name === LEGACY_SKILL)).toBe(false)
    expect(enabledSkills.some((skill) => skill.name === LEGACY_SKILL)).toBe(true)
  })

  it("keeps disabled and enabled discovery results in separate cache entries", async () => {
    const defaultSkills = await getAllSkills({ directory: TEST_DIR })
    const enabledSkills = await getAllSkills({ directory: TEST_DIR, includeClaudeCodePaths: true })

    expect(defaultSkills.some((skill) => skill.name === LEGACY_SKILL)).toBe(false)
    expect(enabledSkills.some((skill) => skill.name === LEGACY_SKILL)).toBe(true)
  })

  it("uses a legacy git-master override only when explicitly enabled", async () => {
    writeSkill(CLAUDE_CONFIG_DIR, "git-master", "LEGACY_GIT_MASTER_BODY")

    const defaultResult = await resolveSkillContentAsync("git-master", { directory: TEST_DIR })
    const enabledResult = await resolveSkillContentAsync("git-master", {
      directory: TEST_DIR,
      includeClaudeCodePaths: true,
    })

    expect(defaultResult).not.toContain("LEGACY_GIT_MASTER_BODY")
    expect(enabledResult).toContain("LEGACY_GIT_MASTER_BODY")
  })
})
