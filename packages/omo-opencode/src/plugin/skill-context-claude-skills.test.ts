import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test"
import { mkdirSync, mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { OhMyOpenCodeConfigSchema } from "../config"
import * as mcpLoader from "../features/claude-code-mcp-loader"
import * as skillLoader from "../features/opencode-skill-loader"
import * as opencodeConfigDir from "../shared/opencode-config-dir"
import { createSkillContext } from "./skill-context"

describe("createSkillContext Claude-compatible skill discovery", () => {
  const testDirectory = join(tmpdir(), `skill-context-claude-skills-${Date.now()}`)
  let mockGlobalConfigDir: string
  let getOpenCodeConfigDirSpy: ReturnType<typeof spyOn>

  beforeEach(() => {
    mkdirSync(testDirectory, { recursive: true })
    mockGlobalConfigDir = mkdtempSync(join(tmpdir(), "skill-context-global-"))
    getOpenCodeConfigDirSpy = spyOn(opencodeConfigDir, "getOpenCodeConfigDir").mockReturnValue(
      mockGlobalConfigDir,
    )
  })

  afterEach(() => {
    getOpenCodeConfigDirSpy.mockRestore()
    rmSync(testDirectory, { recursive: true, force: true })
    rmSync(mockGlobalConfigDir, { recursive: true, force: true })
  })

  it("does not discover agents skills when claude_code.skills is disabled", async () => {
    // given
    const agentsSkill = {
      name: "agents-global-skill",
      definition: {
        name: "agents-global-skill",
        description: "Skill from user agents directory",
        template: "skill body",
      },
      scope: "user" as const,
    }
    const discoverConfigSourceSkillsSpy = spyOn(
      skillLoader,
      "discoverConfigSourceSkills",
    ).mockResolvedValue([])
    const discoverUserClaudeSkillsSpy = spyOn(
      skillLoader,
      "discoverUserClaudeSkills",
    ).mockResolvedValue([])
    const discoverProjectClaudeSkillsSpy = spyOn(
      skillLoader,
      "discoverProjectClaudeSkills",
    ).mockResolvedValue([])
    const discoverOpencodeGlobalSkillsSpy = spyOn(
      skillLoader,
      "discoverOpencodeGlobalSkills",
    ).mockResolvedValue([])
    const discoverOpencodeProjectSkillsSpy = spyOn(
      skillLoader,
      "discoverOpencodeProjectSkills",
    ).mockResolvedValue([])
    const discoverProjectAgentsSkillsSpy = spyOn(
      skillLoader,
      "discoverProjectAgentsSkills",
    ).mockResolvedValue([agentsSkill])
    const discoverGlobalAgentsSkillsSpy = spyOn(
      skillLoader,
      "discoverGlobalAgentsSkills",
    ).mockResolvedValue([agentsSkill])
    const getSystemMcpServerNamesSpy = spyOn(
      mcpLoader,
      "getSystemMcpServerNames",
    ).mockReturnValue(new Set<string>())

    const pluginConfig = OhMyOpenCodeConfigSchema.parse({
      claude_code: { skills: false },
    })

    try {
      // when
      const result = await createSkillContext({
        directory: testDirectory,
        pluginConfig,
      })

      // then
      expect(result.mergedSkills.some((skill) => skill.name === agentsSkill.name)).toBe(false)
      expect(discoverUserClaudeSkillsSpy).not.toHaveBeenCalled()
      expect(discoverProjectClaudeSkillsSpy).not.toHaveBeenCalled()
      expect(discoverProjectAgentsSkillsSpy).not.toHaveBeenCalled()
      expect(discoverGlobalAgentsSkillsSpy).not.toHaveBeenCalled()
    } finally {
      discoverConfigSourceSkillsSpy.mockRestore()
      discoverUserClaudeSkillsSpy.mockRestore()
      discoverProjectClaudeSkillsSpy.mockRestore()
      discoverOpencodeGlobalSkillsSpy.mockRestore()
      discoverOpencodeProjectSkillsSpy.mockRestore()
      discoverProjectAgentsSkillsSpy.mockRestore()
      discoverGlobalAgentsSkillsSpy.mockRestore()
      getSystemMcpServerNamesSpy.mockRestore()
    }
  })
})
