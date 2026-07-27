import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

test("#given synced GBrain shared skills #when inspected for Codex #then CLI and human-gate contracts are machine-readable", async () => {
	// given
	const captureRoot = join(root, "skills", "gbrain-capture");
	const reviewRoot = join(root, "skills", "gbrain-review");

	// when
	const captureSkill = await readFile(join(captureRoot, "SKILL.md"), "utf8");
	const reviewSkill = await readFile(join(reviewRoot, "SKILL.md"), "utf8");
	const captureMetadata = await readFile(join(captureRoot, "agents", "openai.yaml"), "utf8");
	const reviewMetadata = await readFile(join(reviewRoot, "agents", "openai.yaml"), "utf8");

	// then
	assert.match(captureSkill, /^---\r?\nname: gbrain-capture\r?\n/m);
	assert.match(reviewSkill, /^---\r?\nname: gbrain-review\r?\n/m);
	assert.match(captureSkill, /## Codex GBrain Compatibility/);
	assert.match(reviewSkill, /## Codex GBrain Compatibility/);
	assert.match(captureSkill, /`gbrain capture`/);
	assert.match(captureSkill, /`gbrain capture retry`/);
	assert.match(reviewSkill, /`gbrain review`/);
	assert.match(reviewSkill, /PROMOTE <target-slug>/);
	assert.doesNotMatch(captureSkill, /^gbrain-capture </m);
	assert.doesNotMatch(reviewSkill, /^gbrain-review </m);
	assert.match(captureMetadata, /display_name: "\(OmO\) gbrain-capture"/);
	assert.match(reviewMetadata, /display_name: "\(OmO\) gbrain-review"/);
});
