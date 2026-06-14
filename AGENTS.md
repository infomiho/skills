# AGENTS.md

## Skill Authoring

Use the Agent Skills format: one directory per skill, with a required `SKILL.md` file.

The skill directory name and frontmatter `name` must match. Use lowercase kebab-case names.

Keep `description` specific. It should explain what the skill does and when to use it.

Keep `SKILL.md` concise. Put detailed guidance in nearby reference files and link to them from the skill.

Validate discovery before committing:

```bash
npx skills add . --list
```
