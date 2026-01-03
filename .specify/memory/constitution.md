<!--
Sync Impact Report
- Version change: N/A (template) -> 1.0.0
- Modified principles:
  - Template PRINCIPLE_1_NAME -> I. Sync-First Content Source of Truth
  - Template PRINCIPLE_2_NAME -> II. Hugo Build Integrity Gate
  - Template PRINCIPLE_3_NAME -> III. Theme Compatibility and Responsive UX
  - Template PRINCIPLE_4_NAME -> IV. Spec-Driven Change Management
  - Template PRINCIPLE_5_NAME -> V. Deployment Pipeline Stability
- Added sections: None (filled template section names)
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅ updated
  - .specify/templates/spec-template.md ✅ updated
  - .specify/templates/tasks-template.md ✅ updated
  - .specify/templates/commands/*.md ⚠ not present
- Follow-up TODOs: None
-->
# Investment Insights Blog Constitution

## Core Principles

### I. Sync-First Content Source of Truth
Content in `content/posts/` is synced from `gemini-cli-git` and is the runtime
output of the publishing pipeline. Manual edits are ONLY allowed for emergency
build fixes and MUST be followed by an upstream fix in `gemini-cli-git` plus
documentation of the incident. Do not hand-edit generated posts for design or
copy changes; adjust templates, shortcodes, or pipeline sources instead.

### II. Hugo Build Integrity Gate
Every change MUST keep `hugo --minify` passing without errors. New or modified
content MUST have valid YAML frontmatter and use only supported shortcodes.
Breaking the build is a release blocker.

### III. Theme Compatibility and Responsive UX
UI changes MUST extend PaperMod patterns, use its CSS variables where possible,
and preserve responsive behavior at <=768px. Avoid overrides that depend on
fragile theme internals; prefer explicit layout partials and documented CSS
hooks.

### IV. Spec-Driven Change Management
Non-trivial changes MUST be specified in `specs/` using the `.specify` templates
(spec -> plan -> tasks). Each change MUST map to user stories and measurable
success criteria before implementation.

### V. Deployment Pipeline Stability
Changes that affect deployment (Hugo version, `vercel.json`, theme submodules,
sync behavior) MUST be documented in `docs/` and validated in a local build.
Pipeline stability is a first-class requirement.

## Content & Data Standards

- Posts MUST include `title` and `date` in frontmatter and keep YAML valid.
- `description` MUST be a single-line quoted string with no line breaks.
- Nested frontmatter fields MUST be indented with two spaces.
- Use `author.role` (not `author.title`) to avoid key conflicts.
- Shortcodes MUST exist in `layouts/shortcodes` before use.
- Emergency post removal is allowed ONLY to unblock builds and MUST be recorded
  in docs with an upstream fix plan.

## Development Workflow & Quality Gates

- Run `hugo --minify` before merge; fix or remove invalid posts only as an
  emergency exception with upstream follow-up.
- For UI/layout work, validate mobile behavior (<=768px) and avoid horizontal
  overflow.
- If changing pipeline or config, update `docs/ARCHITECTURE.md` and
  `docs/SETUP_GUIDE.md` as needed.
- Prefer changes in `layouts/` and `assets/` over manual content edits for UX
  improvements.

## Governance

This constitution supersedes all other guidance. Amendments require a documented
rationale, an updated Sync Impact Report, and a version bump using semantic
versioning (MAJOR for breaking governance changes, MINOR for new principles,
PATCH for clarifications). All PRs must confirm compliance with the principles
and the build gate before merge.

**Version**: 1.0.0 | **Ratified**: 2026-01-03 | **Last Amended**: 2026-01-03
