import type { BrowserAutomationProvider, GitMasterConfig } from "../../types"

export interface SkillResolutionOptions {
	gitMasterConfig?: GitMasterConfig
	browserProvider?: BrowserAutomationProvider
	disabledSkills?: Set<string>
	teamModeEnabled?: boolean
	/** Include legacy Claude Code and ~/.agents skill directories. Defaults to false for OpenCode. */
	includeClaudeCodePaths?: boolean
	/** Project directory to discover project-level skills from. Falls back to process.cwd() if not provided. */
	directory?: string
}
