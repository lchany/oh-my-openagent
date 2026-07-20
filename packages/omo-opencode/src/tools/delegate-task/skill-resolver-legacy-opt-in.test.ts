/// <reference types="bun-types" />

import { afterEach, beforeEach, describe, expect, it } from "bun:test"
import { mkdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { clearSkillCache } from "../../features/opencode-skill-loader/skill-discovery"
import { resolveSkillContent } from "./skill-resolver"

const TEST_DIR = join(tmpdir(), `skill-resolver-legacy-opt-in-${Date.now()}`)

beforeEach(() => {
  clearSkillCache()
  const skillDir = join(TEST_DIR, ".claude", "skills", "legacy-delegate-only")
  mkdirSync(skillDir, { recursive: true })
  writeFileSync(
    join(skillDir, "SKILL.md"),
    "---\nname: legacy-delegate-only\ndescription: Legacy delegate skill\n---\nLEGACY_DELEGATE_BODY",
  )
})

afterEach(() => {
  clearSkillCache()
  rmSync(TEST_DIR, { recursive: true, force: true })
})

describe("delegate legacy skill fallback", () => {
  it("requires explicit opt-in to resolve a legacy-only disk skill", async () => {
    const defaultResult = await resolveSkillContent(["legacy-delegate-only"], {
      directory: TEST_DIR,
      getLoadedSkills: async () => [],
    })
    const enabledResult = await resolveSkillContent(["legacy-delegate-only"], {
      directory: TEST_DIR,
      getLoadedSkills: async () => [],
      includeClaudeCodePaths: true,
    })

    expect(defaultResult.content).toBeUndefined()
    expect(defaultResult.error).toContain("Skills not found: legacy-delegate-only")
    expect(enabledResult.error).toBeNull()
    expect(enabledResult.content).toContain("LEGACY_DELEGATE_BODY")
  })
})
