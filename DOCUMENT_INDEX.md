# AI_Workflow Document Index

**Total documents scanned:** 2559
**Root:** `/home/dev/AI_Workflow`

> **Legend:** `[USER]` = for you (the user) to read. `[AGENT]` = for agent runtime (souls, logs, skills, pipelines, configs). `[SHARED]` = both may read.

## 📂 ASCII Tree (documents only — .git, node_modules, venv, dist, .next, .cache excluded)

```
├── agents/
│   ├── antigravity/
│   │   └── soul.md
│   ├── antigravity-cli/
│   │   └── soul.md
│   ├── architect/
│   │   ├── log.md
│   │   └── soul.md
│   ├── codex/
│   │   └── soul.md
│   ├── coordinator/
│   │   ├── log.md
│   │   └── soul.md
│   ├── developer/
│   │   └── soul.md
│   ├── gemini/
│   │   └── soul.md
│   ├── hermes-nous/
│   │   └── soul.md
│   ├── openclaw/
│   │   └── soul.md
│   ├── profiler/
│   │   ├── log.md
│   │   └── soul.md
│   ├── signal/
│   │   └── soul.md
│   ├── architect.md
│   ├── codex.md
│   ├── coordinator.md
│   ├── developer.md
│   ├── gemini.md
│   └── profiler.md
├── benchmarks/
│   ├── Benchmark_1_25-06-2026---21-00/
│   │   ├── gaps/
│   │   │   ├── gap-01-no-cycle-detection.md
│   │   │   ├── gap-02-no-DAG-validation.md
│   │   │   ├── gap-03-no-similarity-metrics.md
│   │   │   ├── gap-04-no-caching.md
│   │   │   ├── gap-05-no-concurrent-write-prevention.md
│   │   │   ├── gap-06-no-velocity-tracking.md
│   │   │   ├── gap-07-no-moving-averages.md
│   │   │   ├── gap-08-no-multi-variable-optimization.md
│   │   │   ├── gap-09-no-rate-limiting.md
│   │   │   ├── gap-10-no-CORS.md
│   │   │   ├── gap-11-no-authentication.md
│   │   │   ├── gap-12-no-CSRF.md
│   │   │   ├── gap-13-no-HTTPS-cookies.md
│   │   │   ├── gap-14-no-pagination.md
│   │   │   ├── gap-15-any-types.md
│   │   │   ├── gap-16-hardcoded-paths.md
│   │   │   ├── gap-17-no-memo.md
│   │   │   └── index.md
│   │   ├── README.md
│   │   ├── SRS-as-is.md
│   │   ├── SRS-to-be.md
│   │   ├── SWOT-Benchmark.md
│   │   ├── full-audit.md
│   │   ├── gaps.md
│   │   ├── implementation-plan.md
│   │   └── implementation.md
│   └── Benchmark_2_26-06-2026---12-49/
│       ├── gaps/
│       │   ├── gap-01-selectedSkills-not-set.md
│       │   ├── gap-02-no-dag-validation-on-read.md
│       │   ├── gap-03-no-moving-averages.md
│       │   ├── gap-04-any-types.md
│       │   └── index.md
│       ├── README.md
│       ├── SRS-as-is.md
│       └── full-audit.md
├── config/
│   ├── antigravity2/
│   │   └── README.md
│   ├── claude/
│   │   ├── cache/
│   │   │   └── changelog.md
│   │   ├── commands/
│   │   │   ├── PAOS-start.md
│   │   │   ├── antigravity.md
│   │   │   ├── pipeline-execute.md
│   │   │   ├── pipelines-view.md
│   │   │   ├── skill-creator.md
│   │   │   └── srs.md
│   │   ├── paste-cache/
│   │   │   └── 38a8a33d9d1ebe7b.txt
│   │   ├── plugins/
│   │   │   ├── cache/
│   │   │   │   └── ponytail/
│   │   │   │       └── ponytail/
│   │   │   │           └── 4.7.0/
│   │   │   │               ├── benchmarks/
│   │   │   │               │   ├── agentic/
│   │   │   │               │   │   └── README.md
│   │   │   │               │   ├── arms/
│   │   │   │               │   │   └── caveman-SKILL.md
│   │   │   │               │   ├── results/
│   │   │   │               │   │   ├── 2026-06-12-caveman-vs-ponytail.md
│   │   │   │               │   │   ├── 2026-06-12-v4-hardening-vs-caveman.md
│   │   │   │               │   │   ├── 2026-06-15-llama3.2-local.md
│   │   │   │               │   │   ├── 2026-06-16-correctness-gate-fix.md
│   │   │   │               │   │   ├── 2026-06-16-robustness-audit.md
│   │   │   │               │   │   ├── 2026-06-17-agentic-safety.md
│   │   │   │               │   │   ├── 2026-06-17-cost-verification.md
│   │   │   │               │   │   └── 2026-06-18-agentic.md
│   │   │   │               │   └── README.md
│   │   │   │               ├── docs/
│   │   │   │               │   ├── agent-portability.md
│   │   │   │               │   └── platform-native.md
│   │   │   │               ├── examples/
│   │   │   │               │   ├── README.md
│   │   │   │               │   ├── csv-sum.md
│   │   │   │               │   ├── debounce.md
│   │   │   │               │   ├── deep-clone.md
│   │   │   │               │   ├── email-validation.md
│   │   │   │               │   ├── group-by.md
│   │   │   │               │   ├── infinite-scroll.md
│   │   │   │               │   ├── modal-dialog.md
│   │   │   │               │   ├── number-formatting.md
│   │   │   │               │   ├── rate-limit.md
│   │   │   │               │   ├── react-countdown.md
│   │   │   │               │   └── url-params.md
│   │   │   │               ├── ponytail-mcp/
│   │   │   │               │   └── README.md
│   │   │   │               ├── skills/
│   │   │   │               │   ├── ponytail/
│   │   │   │               │   │   └── SKILL.md
│   │   │   │               │   ├── ponytail-audit/
│   │   │   │               │   │   └── SKILL.md
│   │   │   │               │   ├── ponytail-debt/
│   │   │   │               │   │   └── SKILL.md
│   │   │   │               │   ├── ponytail-gain/
│   │   │   │               │   │   └── SKILL.md
│   │   │   │               │   ├── ponytail-help/
│   │   │   │               │   │   └── SKILL.md
│   │   │   │               │   └── ponytail-review/
│   │   │   │               │       └── SKILL.md
│   │   │   │               ├── AGENTS.md
│   │   │   │               ├── README.es.md
│   │   │   │               └── README.md
│   │   │   └── marketplaces/
│   │   │       ├── claude-plugins-official/
│   │   │       │   ├── external_plugins/
│   │   │       │   │   ├── asana/
│   │   │       │   │   │   ├── commands/
│   │   │       │   │   │   │   └── asana-setup.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── context7/
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── discord/
│   │   │       │   │   │   ├── skills/
│   │   │       │   │   │   │   ├── access/
│   │   │       │   │   │   │   │   └── SKILL.md
│   │   │       │   │   │   │   └── configure/
│   │   │       │   │   │   │       └── SKILL.md
│   │   │       │   │   │   ├── ACCESS.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── fakechat/
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── greptile/
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── imessage/
│   │   │       │   │   │   ├── skills/
│   │   │       │   │   │   │   ├── access/
│   │   │       │   │   │   │   │   └── SKILL.md
│   │   │       │   │   │   │   └── configure/
│   │   │       │   │   │   │       └── SKILL.md
│   │   │       │   │   │   ├── ACCESS.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   └── telegram/
│   │   │       │   │       ├── skills/
│   │   │       │   │       │   ├── access/
│   │   │       │   │       │   │   └── SKILL.md
│   │   │       │   │       │   └── configure/
│   │   │       │   │       │       └── SKILL.md
│   │   │       │   │       ├── ACCESS.md
│   │   │       │   │       └── README.md
│   │   │       │   ├── plugins/
│   │   │       │   │   ├── agent-sdk-dev/
│   │   │       │   │   │   ├── agents/
│   │   │       │   │   │   │   ├── agent-sdk-verifier-py.md
│   │   │       │   │   │   │   └── agent-sdk-verifier-ts.md
│   │   │       │   │   │   ├── commands/
│   │   │       │   │   │   │   └── new-sdk-app.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── clangd-lsp/
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── claude-code-setup/
│   │   │       │   │   │   ├── skills/
│   │   │       │   │   │   │   └── claude-automation-recommender/
│   │   │       │   │   │   │       ├── references/
│   │   │       │   │   │   │       │   ├── hooks-patterns.md
│   │   │       │   │   │   │       │   ├── mcp-servers.md
│   │   │       │   │   │   │       │   ├── plugins-reference.md
│   │   │       │   │   │   │       │   ├── skills-reference.md
│   │   │       │   │   │   │       │   └── subagent-templates.md
│   │   │       │   │   │   │       └── SKILL.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── claude-md-management/
│   │   │       │   │   │   ├── commands/
│   │   │       │   │   │   │   └── revise-claude-md.md
│   │   │       │   │   │   ├── skills/
│   │   │       │   │   │   │   └── claude-md-improver/
│   │   │       │   │   │   │       ├── references/
│   │   │       │   │   │   │       │   ├── quality-criteria.md
│   │   │       │   │   │   │       │   ├── templates.md
│   │   │       │   │   │   │       │   └── update-guidelines.md
│   │   │       │   │   │   │       └── SKILL.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── claude-security/
│   │   │       │   │   │   ├── agents/
│   │   │       │   │   │   │   ├── claude-security.md
│   │   │       │   │   │   │   ├── explore.md
│   │   │       │   │   │   │   ├── patch-generator.md
│   │   │       │   │   │   │   ├── patch-verifier.md
│   │   │       │   │   │   │   ├── scan-inventory.md
│   │   │       │   │   │   │   ├── scan-loader.md
│   │   │       │   │   │   │   ├── scan-researcher.md
│   │   │       │   │   │   │   └── scan-verifier.md
│   │   │       │   │   │   ├── skills/
│   │   │       │   │   │   │   └── claude-security/
│   │   │       │   │   │   │       ├── jobs/
│   │   │       │   │   │   │       │   ├── scan-changes.md
│   │   │       │   │   │   │       │   ├── scan-codebase.md
│   │   │       │   │   │   │       │   └── suggest-patches.md
│   │   │       │   │   │   │       ├── specs/
│   │   │       │   │   │   │       │   ├── patch-spec.md
│   │   │       │   │   │   │       │   └── report-spec.md
│   │   │       │   │   │   │       ├── SKILL.md
│   │   │       │   │   │   │       └── role.md
│   │   │       │   │   │   ├── NOTICE.md
│   │   │       │   │   │   ├── README.md
│   │   │       │   │   │   └── SECURITY.md
│   │   │       │   │   ├── code-modernization/
│   │   │       │   │   │   ├── agents/
│   │   │       │   │   │   │   ├── architecture-critic.md
│   │   │       │   │   │   │   ├── business-rules-extractor.md
│   │   │       │   │   │   │   ├── legacy-analyst.md
│   │   │       │   │   │   │   ├── scaffolder.md
│   │   │       │   │   │   │   ├── security-auditor.md
│   │   │       │   │   │   │   ├── test-engineer.md
│   │   │       │   │   │   │   ├── uplift-migrator.md
│   │   │       │   │   │   │   └── version-delta-analyst.md
│   │   │       │   │   │   ├── commands/
│   │   │       │   │   │   │   ├── modernize-assess.md
│   │   │       │   │   │   │   ├── modernize-brief.md
│   │   │       │   │   │   │   ├── modernize-extract-rules.md
│   │   │       │   │   │   │   ├── modernize-harden.md
│   │   │       │   │   │   │   ├── modernize-map.md
│   │   │       │   │   │   │   ├── modernize-preflight.md
│   │   │       │   │   │   │   ├── modernize-reimagine.md
│   │   │       │   │   │   │   ├── modernize-status.md
│   │   │       │   │   │   │   ├── modernize-transform.md
│   │   │       │   │   │   │   └── modernize-uplift.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── code-review/
│   │   │       │   │   │   ├── commands/
│   │   │       │   │   │   │   └── code-review.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── code-simplifier/
│   │   │       │   │   │   └── agents/
│   │   │       │   │   │       └── code-simplifier.md
│   │   │       │   │   ├── commit-commands/
│   │   │       │   │   │   ├── commands/
│   │   │       │   │   │   │   ├── clean_gone.md
│   │   │       │   │   │   │   ├── commit-push-pr.md
│   │   │       │   │   │   │   └── commit.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── csharp-lsp/
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── cwc-makers/
│   │   │       │   │   │   ├── commands/
│   │   │       │   │   │   │   └── maker-setup.md
│   │   │       │   │   │   ├── skills/
│   │   │       │   │   │   │   ├── cardputer-buddy/
│   │   │       │   │   │   │   │   └── SKILL.md
│   │   │       │   │   │   │   └── m5-onboard/
│   │   │       │   │   │   │       └── SKILL.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── example-plugin/
│   │   │       │   │   │   ├── commands/
│   │   │       │   │   │   │   └── example-command.md
│   │   │       │   │   │   ├── skills/
│   │   │       │   │   │   │   ├── example-command/
│   │   │       │   │   │   │   │   └── SKILL.md
│   │   │       │   │   │   │   └── example-skill/
│   │   │       │   │   │   │       └── SKILL.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── explanatory-output-style/
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── feature-dev/
│   │   │       │   │   │   ├── agents/
│   │   │       │   │   │   │   ├── code-architect.md
│   │   │       │   │   │   │   ├── code-explorer.md
│   │   │       │   │   │   │   └── code-reviewer.md
│   │   │       │   │   │   ├── commands/
│   │   │       │   │   │   │   └── feature-dev.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── frontend-design/
│   │   │       │   │   │   ├── skills/
│   │   │       │   │   │   │   └── frontend-design/
│   │   │       │   │   │   │       ├── LICENSE.txt
│   │   │       │   │   │   │       └── SKILL.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── gopls-lsp/
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── hookify/
│   │   │       │   │   │   ├── agents/
│   │   │       │   │   │   │   └── conversation-analyzer.md
│   │   │       │   │   │   ├── commands/
│   │   │       │   │   │   │   ├── configure.md
│   │   │       │   │   │   │   ├── help.md
│   │   │       │   │   │   │   ├── hookify.md
│   │   │       │   │   │   │   └── list.md
│   │   │       │   │   │   ├── examples/
│   │   │       │   │   │   │   ├── console-log-warning.local.md
│   │   │       │   │   │   │   ├── dangerous-rm.local.md
│   │   │       │   │   │   │   ├── require-tests-stop.local.md
│   │   │       │   │   │   │   └── sensitive-files-warning.local.md
│   │   │       │   │   │   ├── skills/
│   │   │       │   │   │   │   └── writing-rules/
│   │   │       │   │   │   │       └── SKILL.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── jdtls-lsp/
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── kotlin-lsp/
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── learning-output-style/
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── lua-lsp/
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── math-olympiad/
│   │   │       │   │   │   ├── skills/
│   │   │       │   │   │   │   └── math-olympiad/
│   │   │       │   │   │   │       ├── references/
│   │   │       │   │   │   │       │   ├── adversarial_prompts.md
│   │   │       │   │   │   │       │   ├── attempt_agent.md
│   │   │       │   │   │   │       │   ├── known_constructions.md
│   │   │       │   │   │   │       │   ├── model_tier_defaults.md
│   │   │       │   │   │   │       │   ├── presentation_prompts.md
│   │   │       │   │   │   │       │   ├── solver_heuristics.md
│   │   │       │   │   │   │       │   └── verifier_patterns.md
│   │   │       │   │   │   │       └── SKILL.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── mcp-server-dev/
│   │   │       │   │   │   ├── skills/
│   │   │       │   │   │   │   ├── build-mcp-app/
│   │   │       │   │   │   │   │   ├── references/
│   │   │       │   │   │   │   │   │   ├── abuse-protection.md
│   │   │       │   │   │   │   │   │   ├── apps-sdk-messages.md
│   │   │       │   │   │   │   │   │   ├── directory-checklist.md
│   │   │       │   │   │   │   │   │   ├── iframe-sandbox.md
│   │   │       │   │   │   │   │   │   ├── payload-budgeting.md
│   │   │       │   │   │   │   │   │   └── widget-templates.md
│   │   │       │   │   │   │   │   └── SKILL.md
│   │   │       │   │   │   │   ├── build-mcp-server/
│   │   │       │   │   │   │   │   ├── references/
│   │   │       │   │   │   │   │   │   ├── auth.md
│   │   │       │   │   │   │   │   │   ├── deploy-cloudflare-workers.md
│   │   │       │   │   │   │   │   │   ├── elicitation.md
│   │   │       │   │   │   │   │   │   ├── remote-http-scaffold.md
│   │   │       │   │   │   │   │   │   ├── resources-and-prompts.md
│   │   │       │   │   │   │   │   │   ├── server-capabilities.md
│   │   │       │   │   │   │   │   │   ├── tool-design.md
│   │   │       │   │   │   │   │   │   └── versions.md
│   │   │       │   │   │   │   │   └── SKILL.md
│   │   │       │   │   │   │   └── build-mcpb/
│   │   │       │   │   │   │       ├── references/
│   │   │       │   │   │   │       │   ├── local-security.md
│   │   │       │   │   │   │       │   └── manifest-schema.md
│   │   │       │   │   │   │       └── SKILL.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── mcp-tunnels/
│   │   │       │   │   │   ├── commands/
│   │   │       │   │   │   │   └── create-docker-mcp-tunnel.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── php-lsp/
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── playground/
│   │   │       │   │   │   ├── skills/
│   │   │       │   │   │   │   └── playground/
│   │   │       │   │   │   │       ├── templates/
│   │   │       │   │   │   │       │   ├── code-map.md
│   │   │       │   │   │   │       │   ├── concept-map.md
│   │   │       │   │   │   │       │   ├── data-explorer.md
│   │   │       │   │   │   │       │   ├── design-playground.md
│   │   │       │   │   │   │       │   ├── diff-review.md
│   │   │       │   │   │   │       │   └── document-critique.md
│   │   │       │   │   │   │       └── SKILL.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── plugin-dev/
│   │   │       │   │   │   ├── agents/
│   │   │       │   │   │   │   ├── agent-creator.md
│   │   │       │   │   │   │   ├── plugin-validator.md
│   │   │       │   │   │   │   └── skill-reviewer.md
│   │   │       │   │   │   ├── commands/
│   │   │       │   │   │   │   └── create-plugin.md
│   │   │       │   │   │   ├── skills/
│   │   │       │   │   │   │   ├── agent-development/
│   │   │       │   │   │   │   │   ├── examples/
│   │   │       │   │   │   │   │   │   ├── agent-creation-prompt.md
│   │   │       │   │   │   │   │   │   └── complete-agent-examples.md
│   │   │       │   │   │   │   │   ├── references/
│   │   │       │   │   │   │   │   │   ├── agent-creation-system-prompt.md
│   │   │       │   │   │   │   │   │   ├── system-prompt-design.md
│   │   │       │   │   │   │   │   │   └── triggering-examples.md
│   │   │       │   │   │   │   │   └── SKILL.md
│   │   │       │   │   │   │   ├── command-development/
│   │   │       │   │   │   │   │   ├── examples/
│   │   │       │   │   │   │   │   │   ├── plugin-commands.md
│   │   │       │   │   │   │   │   │   └── simple-commands.md
│   │   │       │   │   │   │   │   ├── references/
│   │   │       │   │   │   │   │   │   ├── advanced-workflows.md
│   │   │       │   │   │   │   │   │   ├── documentation-patterns.md
│   │   │       │   │   │   │   │   │   ├── frontmatter-reference.md
│   │   │       │   │   │   │   │   │   ├── interactive-commands.md
│   │   │       │   │   │   │   │   │   ├── marketplace-considerations.md
│   │   │       │   │   │   │   │   │   ├── plugin-features-reference.md
│   │   │       │   │   │   │   │   │   └── testing-strategies.md
│   │   │       │   │   │   │   │   ├── README.md
│   │   │       │   │   │   │   │   └── SKILL.md
│   │   │       │   │   │   │   ├── hook-development/
│   │   │       │   │   │   │   │   ├── references/
│   │   │       │   │   │   │   │   │   ├── advanced.md
│   │   │       │   │   │   │   │   │   ├── migration.md
│   │   │       │   │   │   │   │   │   └── patterns.md
│   │   │       │   │   │   │   │   ├── scripts/
│   │   │       │   │   │   │   │   │   └── README.md
│   │   │       │   │   │   │   │   └── SKILL.md
│   │   │       │   │   │   │   ├── mcp-integration/
│   │   │       │   │   │   │   │   ├── references/
│   │   │       │   │   │   │   │   │   ├── authentication.md
│   │   │       │   │   │   │   │   │   ├── server-types.md
│   │   │       │   │   │   │   │   │   └── tool-usage.md
│   │   │       │   │   │   │   │   └── SKILL.md
│   │   │       │   │   │   │   ├── plugin-settings/
│   │   │       │   │   │   │   │   ├── examples/
│   │   │       │   │   │   │   │   │   ├── create-settings-command.md
│   │   │       │   │   │   │   │   │   └── example-settings.md
│   │   │       │   │   │   │   │   ├── references/
│   │   │       │   │   │   │   │   │   ├── parsing-techniques.md
│   │   │       │   │   │   │   │   │   └── real-world-examples.md
│   │   │       │   │   │   │   │   └── SKILL.md
│   │   │       │   │   │   │   ├── plugin-structure/
│   │   │       │   │   │   │   │   ├── examples/
│   │   │       │   │   │   │   │   │   ├── advanced-plugin.md
│   │   │       │   │   │   │   │   │   ├── minimal-plugin.md
│   │   │       │   │   │   │   │   │   └── standard-plugin.md
│   │   │       │   │   │   │   │   ├── references/
│   │   │       │   │   │   │   │   │   ├── component-patterns.md
│   │   │       │   │   │   │   │   │   └── manifest-reference.md
│   │   │       │   │   │   │   │   ├── README.md
│   │   │       │   │   │   │   │   └── SKILL.md
│   │   │       │   │   │   │   └── skill-development/
│   │   │       │   │   │   │       ├── references/
│   │   │       │   │   │   │       │   └── skill-creator-original.md
│   │   │       │   │   │   │       └── SKILL.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── pr-review-toolkit/
│   │   │       │   │   │   ├── agents/
│   │   │       │   │   │   │   ├── code-reviewer.md
│   │   │       │   │   │   │   ├── code-simplifier.md
│   │   │       │   │   │   │   ├── comment-analyzer.md
│   │   │       │   │   │   │   ├── pr-test-analyzer.md
│   │   │       │   │   │   │   ├── silent-failure-hunter.md
│   │   │       │   │   │   │   └── type-design-analyzer.md
│   │   │       │   │   │   ├── commands/
│   │   │       │   │   │   │   └── review-pr.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── project-artifact/
│   │   │       │   │   │   ├── skills/
│   │   │       │   │   │   │   └── project-artifact/
│   │   │       │   │   │   │       ├── SKILL.md
│   │   │       │   │   │   │       └── swe.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── pyright-lsp/
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── ralph-loop/
│   │   │       │   │   │   ├── commands/
│   │   │       │   │   │   │   ├── cancel-ralph.md
│   │   │       │   │   │   │   ├── help.md
│   │   │       │   │   │   │   └── ralph-loop.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── receipts/
│   │   │       │   │   │   ├── skills/
│   │   │       │   │   │   │   └── receipts/
│   │   │       │   │   │   │       └── SKILL.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── ruby-lsp/
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── rust-analyzer-lsp/
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── security-guidance/
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── session-report/
│   │   │       │   │   │   └── skills/
│   │   │       │   │   │       └── session-report/
│   │   │       │   │   │           └── SKILL.md
│   │   │       │   │   ├── skill-creator/
│   │   │       │   │   │   ├── skills/
│   │   │       │   │   │   │   └── skill-creator/
│   │   │       │   │   │   │       ├── agents/
│   │   │       │   │   │   │       │   ├── analyzer.md
│   │   │       │   │   │   │       │   ├── comparator.md
│   │   │       │   │   │   │       │   └── grader.md
│   │   │       │   │   │   │       ├── references/
│   │   │       │   │   │   │       │   └── schemas.md
│   │   │       │   │   │   │       ├── LICENSE.txt
│   │   │       │   │   │   │       └── SKILL.md
│   │   │       │   │   │   └── README.md
│   │   │       │   │   ├── swift-lsp/
│   │   │       │   │   │   └── README.md
│   │   │       │   │   └── typescript-lsp/
│   │   │       │   │       └── README.md
│   │   │       │   └── README.md
│   │   │       └── ponytail/
│   │   │           ├── benchmarks/
│   │   │           │   ├── agentic/
│   │   │           │   │   └── README.md
│   │   │           │   ├── arms/
│   │   │           │   │   └── caveman-SKILL.md
│   │   │           │   ├── results/
│   │   │           │   │   ├── 2026-06-12-caveman-vs-ponytail.md
│   │   │           │   │   ├── 2026-06-12-v4-hardening-vs-caveman.md
│   │   │           │   │   ├── 2026-06-15-llama3.2-local.md
│   │   │           │   │   ├── 2026-06-16-correctness-gate-fix.md
│   │   │           │   │   ├── 2026-06-16-robustness-audit.md
│   │   │           │   │   ├── 2026-06-17-agentic-safety.md
│   │   │           │   │   ├── 2026-06-17-cost-verification.md
│   │   │           │   │   └── 2026-06-18-agentic.md
│   │   │           │   └── README.md
│   │   │           ├── docs/
│   │   │           │   ├── agent-portability.md
│   │   │           │   └── platform-native.md
│   │   │           ├── examples/
│   │   │           │   ├── README.md
│   │   │           │   ├── csv-sum.md
│   │   │           │   ├── debounce.md
│   │   │           │   ├── deep-clone.md
│   │   │           │   ├── email-validation.md
│   │   │           │   ├── group-by.md
│   │   │           │   ├── infinite-scroll.md
│   │   │           │   ├── modal-dialog.md
│   │   │           │   ├── number-formatting.md
│   │   │           │   ├── rate-limit.md
│   │   │           │   ├── react-countdown.md
│   │   │           │   └── url-params.md
│   │   │           ├── ponytail-mcp/
│   │   │           │   └── README.md
│   │   │           ├── skills/
│   │   │           │   ├── ponytail/
│   │   │           │   │   └── SKILL.md
│   │   │           │   ├── ponytail-audit/
│   │   │           │   │   └── SKILL.md
│   │   │           │   ├── ponytail-debt/
│   │   │           │   │   └── SKILL.md
│   │   │           │   ├── ponytail-gain/
│   │   │           │   │   └── SKILL.md
│   │   │           │   ├── ponytail-help/
│   │   │           │   │   └── SKILL.md
│   │   │           │   └── ponytail-review/
│   │   │           │       └── SKILL.md
│   │   │           ├── AGENTS.md
│   │   │           ├── README.es.md
│   │   │           └── README.md
│   │   ├── rules/
│   │   │   └── context7.md
│   │   ├── skills/
│   │   │   └── context7-mcp/
│   │   │       └── SKILL.md
│   │   └── CLAUDE.md
│   ├── codex/
│   │   ├── plugins/
│   │   │   └── cache/
│   │   │       └── openai-curated-remote/
│   │   │           └── github/
│   │   │               └── 0.1.2/
│   │   │                   └── skills/
│   │   │                       ├── gh-address-comments/
│   │   │                       │   ├── LICENSE.txt
│   │   │                       │   └── SKILL.md
│   │   │                       ├── gh-fix-ci/
│   │   │                       │   ├── LICENSE.txt
│   │   │                       │   └── SKILL.md
│   │   │                       ├── github/
│   │   │                       │   └── SKILL.md
│   │   │                       └── yeet/
│   │   │                           ├── LICENSE.txt
│   │   │                           └── SKILL.md
│   │   └── instructions.md
│   ├── copilot/
│   │   └── session-state/
│   │       └── f0296c44-8221-4d43-8fd8-88b39d4f89f3/
│   │           └── checkpoints/
│   │               └── index.md
│   ├── gemini/
│   │   └── README.md
│   ├── hermes-nous/
│   │   └── instructions.md
│   ├── ollama/
│   │   └── system-prompt.md
│   ├── openclaw/
│   │   └── README.md
│   ├── opencode/
│   │   └── AGENTS.md
│   └── signal/
│       └── instructions.md
├── dashboard/
│   ├── app/
│   │   └── pipelines/
│   │       └── builder/
│   │           └── IMPLEMENTATION_PLAN.md
│   ├── clickhouse/
│   │   └── DESIGN.md
│   ├── supabase/
│   │   └── DESIGN.md
│   ├── DESIGN.md
│   └── README.md
├── docker/
│   └── README.md
├── docs/
│   ├── screenshots/
│   │   └── README.md
│   ├── PIPELINES.md
│   ├── README.md
│   ├── api.md
│   ├── architecture.md
│   ├── examples.md
│   ├── pipelines.md
│   └── workspace-format.md
├── hermes/
│   ├── cache/
│   │   ├── exec/
│   │   │   ├── stdout-a35aaeba0c59.txt
│   │   │   └── stdout-e610231faa6b.txt
│   │   └── web/
│   │       ├── github.com-08fbf6f2e5d407c8.cache.md
│   │       ├── github.com-0ef94bbe6b.md
│   │       ├── github.com-26de699d3e.md
│   │       ├── github.com-da72684332ab2308.cache.md
│   │       ├── hermes-agent.nousresearch.com-04399f5e69a626ec.cache.md
│   │       ├── hermes-agent.nousresearch.com-c62c073895.md
│   │       ├── hermes-agent.nousresearch.com-c88367adf8.md
│   │       ├── hermes-agent.nousresearch.com-d44266cf53f2cbef.cache.md
│   │       ├── pricepertoken.com-719818b282.md
│   │       ├── pricepertoken.com-7fc19c7a76b34f3b.cache.md
│   │       ├── raw.githubusercontent.com-6c8959931ad11bde.cache.md
│   │       ├── raw.githubusercontent.com-8b4806adc6.md
│   │       ├── raw.githubusercontent.com-f0f36b1953a1e0ea.cache.md
│   │       ├── tailscale.com-2915acd75340a274.cache.md
│   │       ├── tailscale.com-49fde707b3075ccc.cache.md
│   │       ├── tailscale.com-b3d7c3a9c71beaaa.cache.md
│   │       └── www.tbench.ai-57f629bd9736c7af.cache.md
│   ├── cron/
│   │   └── output/
│   │       ├── 1a96ce892dd1/
│   │       │   └── 2026-06-26_11-40-06.md
│   │       ├── 6ef21d9e95f3/
│   │       │   └── 2026-09-03_02-46-24.md
│   │       ├── 8aa048b02938/
│   │       │   └── 2026-08-11_18-23-19.md
│   │       ├── ea7cadcda726/
│   │       │   └── 2026-06-26_12-03-57.md
│   │       └── ea7cadcda726_20260626_120357.txt
│   ├── hermes-agent/
│   │   ├── apps/
│   │   │   └── desktop/
│   │   │       ├── scripts/
│   │   │       │   ├── perf/
│   │   │       │   │   └── README.md
│   │   │       │   └── profile-typing-lag.md
│   │   │       ├── src/
│   │   │       │   ├── debug/
│   │   │       │   │   └── README.md
│   │   │       │   └── plugins/
│   │   │       │       └── README.md
│   │   │       ├── AGENTS.md
│   │   │       ├── DESIGN.md
│   │   │       └── README.md
│   │   ├── contributors/
│   │   │   └── README.md
│   │   ├── docker/
│   │   │   └── SOUL.md
│   │   ├── docs/
│   │   │   ├── design/
│   │   │   │   ├── multiplexing-gateway.md
│   │   │   │   └── profile-builder.md
│   │   │   ├── kanban/
│   │   │   │   └── multi-gateway.md
│   │   │   ├── middleware/
│   │   │   │   └── README.md
│   │   │   ├── observability/
│   │   │   │   ├── README.md
│   │   │   │   ├── monitoring.md
│   │   │   │   └── relay-shared-metrics.md
│   │   │   ├── rfcs/
│   │   │   │   ├── 2026-07-plugin-architecture-lessons-pi-opencode.md
│   │   │   │   └── plugin-config-state-bridge.md
│   │   │   ├── security/
│   │   │   │   └── network-egress-isolation.md
│   │   │   ├── ADR.md
│   │   │   ├── billing-lifecycle.md
│   │   │   ├── chronos-managed-cron-contract.md
│   │   │   ├── cron-doctor-spec.md
│   │   │   ├── hermes-kanban-v1-spec.pdf
│   │   │   ├── micro-compaction.md
│   │   │   ├── profile-routing.md
│   │   │   ├── rca-ssl-cacert-post-git-pull.md
│   │   │   ├── relay-connector-contract.md
│   │   │   ├── session-lifecycle.md
│   │   │   ├── state-db-recovery.md
│   │   │   └── streaming-tts.md
│   │   ├── evals/
│   │   │   ├── browser_use/
│   │   │   │   └── README.md
│   │   │   ├── compaction/
│   │   │   │   ├── results/
│   │   │   │   │   └── SCORECARD-2026-08-15.md
│   │   │   │   └── README.md
│   │   │   ├── core_tool_deferral/
│   │   │   │   ├── results/
│   │   │   │   │   └── SUMMARY.md
│   │   │   │   └── README.md
│   │   │   ├── readtool/
│   │   │   │   ├── results/
│   │   │   │   │   └── SUMMARY.md
│   │   │   │   └── README.md
│   │   │   └── session_search_schema/
│   │   │       └── README.md
│   │   ├── gateway/
│   │   │   └── platforms/
│   │   │       └── ADDING_A_PLATFORM.md
│   │   ├── hermes_agent.egg-info/
│   │   │   ├── SOURCES.txt
│   │   │   ├── dependency_links.txt
│   │   │   ├── entry_points.txt
│   │   │   ├── requires.txt
│   │   │   └── top_level.txt
│   │   ├── native/
│   │   │   └── fts5_cjk/
│   │   │       └── README.md
│   │   ├── optional-skills/
│   │   │   ├── autonomous-ai-agents/
│   │   │   │   ├── agent-merge-conflict-arbiter/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── antigravity-cli/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── cli-docs.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── blackbox/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── grok/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── honcho/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── openhands/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── blockchain/
│   │   │   │   ├── evm/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── hyperliquid/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── solana/
│   │   │   │       └── SKILL.md
│   │   │   ├── communication/
│   │   │   │   ├── one-three-one-rule/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── creative/
│   │   │   │   ├── ascii-art/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── audiocraft-audio-generation/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── advanced-usage.md
│   │   │   │   │   │   └── troubleshooting.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── baoyu-article-illustrator/
│   │   │   │   │   ├── prompts/
│   │   │   │   │   │   └── system.md
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── palettes/
│   │   │   │   │   │   │   ├── macaron.md
│   │   │   │   │   │   │   ├── mono-ink.md
│   │   │   │   │   │   │   ├── neon.md
│   │   │   │   │   │   │   └── warm.md
│   │   │   │   │   │   ├── styles/
│   │   │   │   │   │   │   ├── blueprint.md
│   │   │   │   │   │   │   ├── chalkboard.md
│   │   │   │   │   │   │   ├── editorial.md
│   │   │   │   │   │   │   ├── elegant.md
│   │   │   │   │   │   │   ├── fantasy-animation.md
│   │   │   │   │   │   │   ├── flat-doodle.md
│   │   │   │   │   │   │   ├── flat.md
│   │   │   │   │   │   │   ├── ink-notes.md
│   │   │   │   │   │   │   ├── intuition-machine.md
│   │   │   │   │   │   │   ├── minimal.md
│   │   │   │   │   │   │   ├── nature.md
│   │   │   │   │   │   │   ├── notion.md
│   │   │   │   │   │   │   ├── pixel-art.md
│   │   │   │   │   │   │   ├── playful.md
│   │   │   │   │   │   │   ├── retro.md
│   │   │   │   │   │   │   ├── scientific.md
│   │   │   │   │   │   │   ├── screen-print.md
│   │   │   │   │   │   │   ├── sketch-notes.md
│   │   │   │   │   │   │   ├── sketch.md
│   │   │   │   │   │   │   ├── vector-illustration.md
│   │   │   │   │   │   │   ├── vintage.md
│   │   │   │   │   │   │   ├── warm.md
│   │   │   │   │   │   │   └── watercolor.md
│   │   │   │   │   │   ├── prompt-construction.md
│   │   │   │   │   │   ├── style-presets.md
│   │   │   │   │   │   ├── styles.md
│   │   │   │   │   │   ├── usage.md
│   │   │   │   │   │   └── workflow.md
│   │   │   │   │   ├── PORT_NOTES.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── baoyu-comic/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── art-styles/
│   │   │   │   │   │   │   ├── chalk.md
│   │   │   │   │   │   │   ├── ink-brush.md
│   │   │   │   │   │   │   ├── ligne-claire.md
│   │   │   │   │   │   │   ├── manga.md
│   │   │   │   │   │   │   ├── minimalist.md
│   │   │   │   │   │   │   └── realistic.md
│   │   │   │   │   │   ├── layouts/
│   │   │   │   │   │   │   ├── cinematic.md
│   │   │   │   │   │   │   ├── dense.md
│   │   │   │   │   │   │   ├── four-panel.md
│   │   │   │   │   │   │   ├── mixed.md
│   │   │   │   │   │   │   ├── splash.md
│   │   │   │   │   │   │   ├── standard.md
│   │   │   │   │   │   │   └── webtoon.md
│   │   │   │   │   │   ├── presets/
│   │   │   │   │   │   │   ├── concept-story.md
│   │   │   │   │   │   │   ├── four-panel.md
│   │   │   │   │   │   │   ├── ohmsha.md
│   │   │   │   │   │   │   ├── shoujo.md
│   │   │   │   │   │   │   └── wuxia.md
│   │   │   │   │   │   ├── tones/
│   │   │   │   │   │   │   ├── action.md
│   │   │   │   │   │   │   ├── dramatic.md
│   │   │   │   │   │   │   ├── energetic.md
│   │   │   │   │   │   │   ├── neutral.md
│   │   │   │   │   │   │   ├── romantic.md
│   │   │   │   │   │   │   ├── vintage.md
│   │   │   │   │   │   │   └── warm.md
│   │   │   │   │   │   ├── analysis-framework.md
│   │   │   │   │   │   ├── auto-selection.md
│   │   │   │   │   │   ├── base-prompt.md
│   │   │   │   │   │   ├── character-template.md
│   │   │   │   │   │   ├── ohmsha-guide.md
│   │   │   │   │   │   ├── partial-workflows.md
│   │   │   │   │   │   ├── storyboard-template.md
│   │   │   │   │   │   └── workflow.md
│   │   │   │   │   ├── PORT_NOTES.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── comfyui/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── official-cli.md
│   │   │   │   │   │   ├── rest-api.md
│   │   │   │   │   │   ├── template-integrity.md
│   │   │   │   │   │   └── workflow-format.md
│   │   │   │   │   ├── tests/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── workflows/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── concept-diagrams/
│   │   │   │   │   ├── examples/
│   │   │   │   │   │   ├── apartment-floor-plan-conversion.md
│   │   │   │   │   │   ├── automated-password-reset-flow.md
│   │   │   │   │   │   ├── autonomous-llm-research-agent-flow.md
│   │   │   │   │   │   ├── banana-journey-tree-to-smoothie.md
│   │   │   │   │   │   ├── commercial-aircraft-structure.md
│   │   │   │   │   │   ├── cpu-ooo-microarchitecture.md
│   │   │   │   │   │   ├── electricity-grid-flow.md
│   │   │   │   │   │   ├── feature-film-production-pipeline.md
│   │   │   │   │   │   ├── hospital-emergency-department-flow.md
│   │   │   │   │   │   ├── ml-benchmark-grouped-bar-chart.md
│   │   │   │   │   │   ├── place-order-uml-sequence.md
│   │   │   │   │   │   ├── smart-city-infrastructure.md
│   │   │   │   │   │   ├── smartphone-layer-anatomy.md
│   │   │   │   │   │   ├── sn2-reaction-mechanism.md
│   │   │   │   │   │   └── wind-turbine-structure.md
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── dashboard-patterns.md
│   │   │   │   │   │   ├── infrastructure-patterns.md
│   │   │   │   │   │   └── physical-shape-cookbook.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── creative-ideation/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── methods/
│   │   │   │   │   │   │   ├── affinity-diagrams.md
│   │   │   │   │   │   │   ├── analogy-and-blending.md
│   │   │   │   │   │   │   ├── biomimicry.md
│   │   │   │   │   │   │   ├── chance-and-remix.md
│   │   │   │   │   │   │   ├── compression-progress.md
│   │   │   │   │   │   │   ├── creative-discipline.md
│   │   │   │   │   │   │   ├── defamiliarization.md
│   │   │   │   │   │   │   ├── derive-and-mapping.md
│   │   │   │   │   │   │   ├── first-principles.md
│   │   │   │   │   │   │   ├── jobs-to-be-done.md
│   │   │   │   │   │   │   ├── lateral-provocations.md
│   │   │   │   │   │   │   ├── leverage-points.md
│   │   │   │   │   │   │   ├── oblique-strategies.md
│   │   │   │   │   │   │   ├── oulipo.md
│   │   │   │   │   │   │   ├── pataphysics.md
│   │   │   │   │   │   │   ├── pattern-languages.md
│   │   │   │   │   │   │   ├── polya.md
│   │   │   │   │   │   │   ├── premortem-and-inversion.md
│   │   │   │   │   │   │   ├── scamper.md
│   │   │   │   │   │   │   ├── story-skeletons.md
│   │   │   │   │   │   │   ├── triz-principles.md
│   │   │   │   │   │   │   └── volume-generation.md
│   │   │   │   │   │   ├── anti-slop.md
│   │   │   │   │   │   ├── exercises.md
│   │   │   │   │   │   ├── full-prompt-library.md
│   │   │   │   │   │   ├── heuristics.md
│   │   │   │   │   │   └── method-catalog.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── draw-your-font/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── troubleshooting.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── excalidraw/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── colors.md
│   │   │   │   │   │   ├── dark-mode.md
│   │   │   │   │   │   └── examples.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── heartmula/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── hyperframes/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── cli.md
│   │   │   │   │   │   ├── composition.md
│   │   │   │   │   │   ├── features.md
│   │   │   │   │   │   ├── gsap.md
│   │   │   │   │   │   ├── troubleshooting.md
│   │   │   │   │   │   └── website-to-video.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── impeccable/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── kanban-video-orchestrator/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── examples.md
│   │   │   │   │   │   ├── intake.md
│   │   │   │   │   │   ├── kanban-setup.md
│   │   │   │   │   │   ├── monitoring.md
│   │   │   │   │   │   ├── role-archetypes.md
│   │   │   │   │   │   └── tool-matrix.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── meme-generation/
│   │   │   │   │   ├── EXAMPLES.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── pixel-art/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── palettes.md
│   │   │   │   │   ├── ATTRIBUTION.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── pretext/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── patterns.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── simple-english/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── checklist.md
│   │   │   │   │   │   └── use-cases.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── sketch/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── social-media-content-calendar/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── tldraw-offline/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── touchdesigner-mcp/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── 3d-scene.md
│   │   │   │   │   │   ├── animation.md
│   │   │   │   │   │   ├── audio-reactive.md
│   │   │   │   │   │   ├── dat-scripting.md
│   │   │   │   │   │   ├── external-data.md
│   │   │   │   │   │   ├── geometry-comp.md
│   │   │   │   │   │   ├── glsl.md
│   │   │   │   │   │   ├── layout-compositor.md
│   │   │   │   │   │   ├── mcp-tools.md
│   │   │   │   │   │   ├── midi-osc.md
│   │   │   │   │   │   ├── network-patterns.md
│   │   │   │   │   │   ├── operator-tips.md
│   │   │   │   │   │   ├── operators.md
│   │   │   │   │   │   ├── panel-ui.md
│   │   │   │   │   │   ├── particles.md
│   │   │   │   │   │   ├── pitfalls.md
│   │   │   │   │   │   ├── postfx.md
│   │   │   │   │   │   ├── projection-mapping.md
│   │   │   │   │   │   ├── python-api.md
│   │   │   │   │   │   ├── replicator.md
│   │   │   │   │   │   └── troubleshooting.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── unreal-mcp/
│   │   │   │       ├── references/
│   │   │   │       │   ├── advanced-workflows.md
│   │   │   │       │   ├── pitfalls.md
│   │   │   │       │   ├── recipes.md
│   │   │   │       │   ├── scene-craft.md
│   │   │   │       │   └── tool-surface.md
│   │   │   │       └── SKILL.md
│   │   │   ├── data-science/
│   │   │   │   ├── jupyter-notebook/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── devops/
│   │   │   │   ├── actual-setup/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── opencode.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── docker-management/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── hermes-s6-container-supervision/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── inference-sh-cli/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── app-discovery.md
│   │   │   │   │   │   ├── authentication.md
│   │   │   │   │   │   ├── cli-reference.md
│   │   │   │   │   │   └── running-apps.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── pinggy-tunnel/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── setup-wizard-generator/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── watchers/
│   │   │   │       └── SKILL.md
│   │   │   ├── dogfood/
│   │   │   │   ├── adversarial-ux-test/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── email/
│   │   │   │   └── agentmail/
│   │   │   │       ├── references/
│   │   │   │       │   ├── core.md
│   │   │   │       │   ├── mcp.md
│   │   │   │       │   ├── signup.md
│   │   │   │       │   ├── webhooks.md
│   │   │   │       │   └── websockets.md
│   │   │   │       └── SKILL.md
│   │   │   ├── finance/
│   │   │   │   ├── 3-statement-model/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── formatting.md
│   │   │   │   │   │   ├── formulas.md
│   │   │   │   │   │   └── sec-filings.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── comps-analysis/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── dcf-model/
│   │   │   │   │   ├── SKILL.md
│   │   │   │   │   ├── TROUBLESHOOTING.md
│   │   │   │   │   └── requirements.txt
│   │   │   │   ├── excel-author/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── lbo-model/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── merger-model/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── polymarket/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── api-endpoints.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── pptx-author/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── stocks/
│   │   │   │       └── SKILL.md
│   │   │   ├── gaming/
│   │   │   │   ├── minecraft-modpack-server/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── pokemon-player/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── health/
│   │   │   │   ├── fitness-nutrition/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── FORMULAS.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── neuroskill-bci/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── api.md
│   │   │   │   │   │   ├── metrics.md
│   │   │   │   │   │   └── protocols.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── mcp/
│   │   │   │   ├── fastmcp/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── fastmcp-cli.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── mcp-oauth-remote-gateway/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── stripe-mcp-oauth-revocation.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── mcporter/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── migration/
│   │   │   │   ├── openclaw-migration/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── mlops/
│   │   │   │   ├── accelerate/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── custom-plugins.md
│   │   │   │   │   │   ├── megatron-integration.md
│   │   │   │   │   │   └── performance.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── chroma/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── integration.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── clip/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── applications.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── evaluation/
│   │   │   │   │   ├── evaluating-llms-harness/
│   │   │   │   │   │   ├── references/
│   │   │   │   │   │   │   ├── api-evaluation.md
│   │   │   │   │   │   │   ├── benchmark-guide.md
│   │   │   │   │   │   │   ├── custom-tasks.md
│   │   │   │   │   │   │   └── distributed-eval.md
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── weights-and-biases/
│   │   │   │   │   │   ├── references/
│   │   │   │   │   │   │   ├── artifacts.md
│   │   │   │   │   │   │   ├── integrations.md
│   │   │   │   │   │   │   └── sweeps.md
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   └── DESCRIPTION.md
│   │   │   │   ├── faiss/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── index_types.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── flash-attention/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── benchmarks.md
│   │   │   │   │   │   └── transformers-integration.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── guidance/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── backends.md
│   │   │   │   │   │   ├── constraints.md
│   │   │   │   │   │   └── examples.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── huggingface-tokenizers/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── algorithms.md
│   │   │   │   │   │   ├── integration.md
│   │   │   │   │   │   ├── pipeline.md
│   │   │   │   │   │   └── training.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── inference/
│   │   │   │   │   ├── llama-cpp/
│   │   │   │   │   │   ├── references/
│   │   │   │   │   │   │   ├── advanced-usage.md
│   │   │   │   │   │   │   ├── hub-discovery.md
│   │   │   │   │   │   │   ├── optimization.md
│   │   │   │   │   │   │   ├── quantization.md
│   │   │   │   │   │   │   ├── server.md
│   │   │   │   │   │   │   └── troubleshooting.md
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── outlines/
│   │   │   │   │   │   ├── references/
│   │   │   │   │   │   │   ├── backends.md
│   │   │   │   │   │   │   ├── examples.md
│   │   │   │   │   │   │   └── json_generation.md
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── serving-llms-vllm/
│   │   │   │   │   │   ├── references/
│   │   │   │   │   │   │   ├── optimization.md
│   │   │   │   │   │   │   ├── quantization.md
│   │   │   │   │   │   │   ├── server-deployment.md
│   │   │   │   │   │   │   └── troubleshooting.md
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   └── DESCRIPTION.md
│   │   │   │   ├── instructor/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── examples.md
│   │   │   │   │   │   ├── providers.md
│   │   │   │   │   │   └── validation.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── lambda-labs/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── advanced-usage.md
│   │   │   │   │   │   └── troubleshooting.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── llava/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── training.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── modal/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── advanced-usage.md
│   │   │   │   │   │   └── troubleshooting.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── models/
│   │   │   │   │   ├── huggingface-hub/
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── segment-anything-model/
│   │   │   │   │   │   ├── references/
│   │   │   │   │   │   │   ├── advanced-usage.md
│   │   │   │   │   │   │   └── troubleshooting.md
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   └── DESCRIPTION.md
│   │   │   │   ├── nemo-curator/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── deduplication.md
│   │   │   │   │   │   └── filtering.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── obliteratus/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── analysis-modules.md
│   │   │   │   │   │   └── methods-guide.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── peft/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── advanced-usage.md
│   │   │   │   │   │   └── troubleshooting.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── pinecone/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── deployment.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── pytorch-fsdp/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── common-patterns.md
│   │   │   │   │   │   ├── index.md
│   │   │   │   │   │   └── other.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── pytorch-lightning/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── callbacks.md
│   │   │   │   │   │   ├── distributed.md
│   │   │   │   │   │   └── hyperparameter-tuning.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── qdrant/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── advanced-usage.md
│   │   │   │   │   │   └── troubleshooting.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── research/
│   │   │   │   │   ├── dspy/
│   │   │   │   │   │   ├── references/
│   │   │   │   │   │   │   ├── examples.md
│   │   │   │   │   │   │   ├── modules.md
│   │   │   │   │   │   │   └── optimizers.md
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   └── DESCRIPTION.md
│   │   │   │   ├── saelens/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── README.md
│   │   │   │   │   │   ├── api.md
│   │   │   │   │   │   └── tutorials.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── simpo/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── datasets.md
│   │   │   │   │   │   ├── hyperparameters.md
│   │   │   │   │   │   └── loss-functions.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── slime/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── api-reference.md
│   │   │   │   │   │   └── troubleshooting.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── stable-diffusion/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── advanced-usage.md
│   │   │   │   │   │   └── troubleshooting.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── tensorrt-llm/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── multi-gpu.md
│   │   │   │   │   │   ├── optimization.md
│   │   │   │   │   │   └── serving.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── torchtitan/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── checkpoint.md
│   │   │   │   │   │   ├── custom-models.md
│   │   │   │   │   │   ├── float8.md
│   │   │   │   │   │   └── fsdp.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── training/
│   │   │   │   │   ├── axolotl/
│   │   │   │   │   │   ├── references/
│   │   │   │   │   │   │   ├── api.md
│   │   │   │   │   │   │   ├── dataset-formats.md
│   │   │   │   │   │   │   ├── index.md
│   │   │   │   │   │   │   └── other.md
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── trl-fine-tuning/
│   │   │   │   │   │   ├── references/
│   │   │   │   │   │   │   ├── dpo-variants.md
│   │   │   │   │   │   │   ├── grpo-training.md
│   │   │   │   │   │   │   ├── online-rl.md
│   │   │   │   │   │   │   ├── reward-modeling.md
│   │   │   │   │   │   │   └── sft-training.md
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   └── unsloth/
│   │   │   │   │       ├── references/
│   │   │   │   │       │   ├── index.md
│   │   │   │   │       │   ├── llms-full.md
│   │   │   │   │       │   ├── llms-txt.md
│   │   │   │   │       │   └── llms.md
│   │   │   │   │       └── SKILL.md
│   │   │   │   └── whisper/
│   │   │   │       ├── references/
│   │   │   │       │   └── languages.md
│   │   │   │       └── SKILL.md
│   │   │   ├── payments/
│   │   │   │   ├── mpp-agent/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── stripe-link-cli/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── stripe-projects/
│   │   │   │       └── SKILL.md
│   │   │   ├── productivity/
│   │   │   │   ├── canvas/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── decision-questionnaire/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── here-now/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── memento-flashcards/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── shop/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── catalog-mcp.md
│   │   │   │   │   │   ├── direct-api.md
│   │   │   │   │   │   ├── legal.md
│   │   │   │   │   │   └── safety.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── shopify/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── siyuan/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── telephony/
│   │   │   │       └── SKILL.md
│   │   │   ├── research/
│   │   │   │   ├── bioinformatics/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── blogwatcher/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── darwinian-evolver/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── domain-intel/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── drug-discovery/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── ADMET_REFERENCE.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── duckduckgo-search/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── gitnexus-explorer/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── osint-investigation/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── sources/
│   │   │   │   │   │       ├── courtlistener.md
│   │   │   │   │   │       ├── gdelt.md
│   │   │   │   │   │       ├── icij-offshore.md
│   │   │   │   │   │       ├── nyc-acris.md
│   │   │   │   │   │       ├── ofac-sdn.md
│   │   │   │   │   │       ├── opencorporates.md
│   │   │   │   │   │       ├── sec-edgar.md
│   │   │   │   │   │       ├── senate-ld.md
│   │   │   │   │   │       ├── usaspending.md
│   │   │   │   │   │       ├── wayback.md
│   │   │   │   │   │       └── wikipedia.md
│   │   │   │   │   ├── templates/
│   │   │   │   │   │   └── source-template.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── parallel-cli/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── pinecone-research/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── qmd/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── research-paper-writing/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── autoreason-methodology.md
│   │   │   │   │   │   ├── checklists.md
│   │   │   │   │   │   ├── citation-workflow.md
│   │   │   │   │   │   ├── experiment-patterns.md
│   │   │   │   │   │   ├── human-evaluation.md
│   │   │   │   │   │   ├── paper-types.md
│   │   │   │   │   │   ├── phase5-paper-drafting.md
│   │   │   │   │   │   ├── reviewer-guidelines.md
│   │   │   │   │   │   ├── sources.md
│   │   │   │   │   │   └── writing-guide.md
│   │   │   │   │   ├── templates/
│   │   │   │   │   │   ├── aaai2026/
│   │   │   │   │   │   │   └── README.md
│   │   │   │   │   │   ├── acl/
│   │   │   │   │   │   │   ├── README.md
│   │   │   │   │   │   │   ├── anthology.bib.txt
│   │   │   │   │   │   │   └── formatting.md
│   │   │   │   │   │   ├── colm2025/
│   │   │   │   │   │   │   ├── README.md
│   │   │   │   │   │   │   └── colm2025_conference.pdf
│   │   │   │   │   │   ├── iclr2026/
│   │   │   │   │   │   │   └── iclr2026_conference.pdf
│   │   │   │   │   │   ├── icml2026/
│   │   │   │   │   │   │   ├── example_paper.pdf
│   │   │   │   │   │   │   └── icml_numpapers.pdf
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── scrapling/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── searxng-search/
│   │   │   │       └── SKILL.md
│   │   │   ├── security/
│   │   │   │   ├── 1password/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── cli-examples.md
│   │   │   │   │   │   └── get-started.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── godmode/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── jailbreak-templates.md
│   │   │   │   │   │   └── refusal-detection.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── oss-forensics/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── evidence-types.md
│   │   │   │   │   │   ├── github-archive-guide.md
│   │   │   │   │   │   ├── investigation-templates.md
│   │   │   │   │   │   └── recovery-techniques.md
│   │   │   │   │   ├── templates/
│   │   │   │   │   │   ├── forensic-report.md
│   │   │   │   │   │   └── malicious-package-report.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── sherlock/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── unbroker/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── legal/
│   │   │   │   │   │   │   ├── ccpa.md
│   │   │   │   │   │   │   ├── drop.md
│   │   │   │   │   │   │   └── gdpr.md
│   │   │   │   │   │   ├── methods.md
│   │   │   │   │   │   ├── site-playbooks.md
│   │   │   │   │   │   └── state-machine.md
│   │   │   │   │   ├── templates/
│   │   │   │   │   │   ├── consent/
│   │   │   │   │   │   │   └── authorization.md
│   │   │   │   │   │   └── emails/
│   │   │   │   │   │       ├── ccpa-authorized-agent.txt
│   │   │   │   │   │       ├── ccpa-deletion.txt
│   │   │   │   │   │       ├── ccpa-indirect-deletion.txt
│   │   │   │   │   │       ├── gdpr-erasure.txt
│   │   │   │   │   │       └── generic-optout.txt
│   │   │   │   │   ├── README.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── web-pentest/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── bypass-techniques.md
│   │   │   │   │   │   ├── exploitation-techniques.md
│   │   │   │   │   │   ├── scope-enforcement.md
│   │   │   │   │   │   └── vuln-taxonomy.md
│   │   │   │   │   ├── templates/
│   │   │   │   │   │   ├── authorization.md
│   │   │   │   │   │   └── pentest-report.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── smart-home/
│   │   │   │   ├── openhue/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── software-development/
│   │   │   │   ├── ast-grep/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── cli.md
│   │   │   │   │   │   ├── install.md
│   │   │   │   │   │   ├── patterns.md
│   │   │   │   │   │   ├── pitfalls.md
│   │   │   │   │   │   ├── recipes.md
│   │   │   │   │   │   ├── sgconfig.md
│   │   │   │   │   │   └── yaml-rules.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── code-wiki/
│   │   │   │   │   ├── templates/
│   │   │   │   │   │   ├── README.md
│   │   │   │   │   │   ├── architecture.md
│   │   │   │   │   │   ├── getting-started.md
│   │   │   │   │   │   └── module.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── grill-me/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── rest-graphql-debug/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── subagent-driven-development/
│   │   │   │       ├── references/
│   │   │   │       │   ├── context-budget-discipline.md
│   │   │   │       │   └── gates-taxonomy.md
│   │   │   │       └── SKILL.md
│   │   │   ├── web-development/
│   │   │   │   ├── cloudflare-temporary-deploy/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── har-derived-api-client/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── page-agent/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── publish-site/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── yuanbao/
│   │   │   │   └── SKILL.md
│   │   │   └── DESCRIPTION.md
│   │   ├── plugins/
│   │   │   ├── disk-cleanup/
│   │   │   │   └── README.md
│   │   │   ├── google_meet/
│   │   │   │   ├── README.md
│   │   │   │   └── SKILL.md
│   │   │   ├── hermes-achievements/
│   │   │   │   └── README.md
│   │   │   ├── memory/
│   │   │   │   ├── byterover/
│   │   │   │   │   └── README.md
│   │   │   │   ├── hindsight/
│   │   │   │   │   └── README.md
│   │   │   │   ├── holographic/
│   │   │   │   │   └── README.md
│   │   │   │   ├── honcho/
│   │   │   │   │   └── README.md
│   │   │   │   ├── mem0/
│   │   │   │   │   └── README.md
│   │   │   │   ├── openviking/
│   │   │   │   │   └── README.md
│   │   │   │   ├── retaindb/
│   │   │   │   │   └── README.md
│   │   │   │   └── supermemory/
│   │   │   │       └── README.md
│   │   │   ├── model-providers/
│   │   │   │   └── README.md
│   │   │   ├── observability/
│   │   │   │   └── langfuse/
│   │   │   │       └── README.md
│   │   │   ├── platforms/
│   │   │   │   ├── a2a/
│   │   │   │   │   ├── DESIGN.md
│   │   │   │   │   └── README.md
│   │   │   │   └── photon/
│   │   │   │       ├── sidecar/
│   │   │   │       │   └── README.md
│   │   │   │       └── README.md
│   │   │   └── security-guidance/
│   │   │       └── README.md
│   │   ├── providers/
│   │   │   └── README.md
│   │   ├── scripts/
│   │   │   ├── toolperf_abeval/
│   │   │   │   └── README.md
│   │   │   └── LIVETEST_README.md
│   │   ├── skills/
│   │   │   ├── apple/
│   │   │   │   ├── apple-notes/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── apple-reminders/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── findmy/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── imessage/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── autonomous-ai-agents/
│   │   │   │   ├── claude-code/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── codex/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── computer-use/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── hermes-agent/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── background-systems.md
│   │   │   │   │   │   ├── cli-reference.md
│   │   │   │   │   │   ├── configuration.md
│   │   │   │   │   │   ├── contributor-guide.md
│   │   │   │   │   │   ├── delegate-task-concurrency-diagnosis.md
│   │   │   │   │   │   ├── desktop-plugins.md
│   │   │   │   │   │   ├── native-mcp.md
│   │   │   │   │   │   ├── petdex.md
│   │   │   │   │   │   ├── portal-auth-for-third-party-apps.md
│   │   │   │   │   │   ├── project-context-files.md
│   │   │   │   │   │   ├── providers-and-models.md
│   │   │   │   │   │   ├── security-privacy.md
│   │   │   │   │   │   ├── slash-commands.md
│   │   │   │   │   │   ├── themes.md
│   │   │   │   │   │   ├── troubleshooting.md
│   │   │   │   │   │   ├── tui-widgets.md
│   │   │   │   │   │   ├── webhooks.md
│   │   │   │   │   │   └── windows-quirks.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── opencode/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── creative/
│   │   │   │   ├── architecture-diagram/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── ascii-video/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── architecture.md
│   │   │   │   │   │   ├── composition.md
│   │   │   │   │   │   ├── effects.md
│   │   │   │   │   │   ├── inputs.md
│   │   │   │   │   │   ├── optimization.md
│   │   │   │   │   │   ├── scenes.md
│   │   │   │   │   │   ├── shaders.md
│   │   │   │   │   │   └── troubleshooting.md
│   │   │   │   │   ├── README.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── baoyu-infographic/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── layouts/
│   │   │   │   │   │   │   ├── bento-grid.md
│   │   │   │   │   │   │   ├── binary-comparison.md
│   │   │   │   │   │   │   ├── bridge.md
│   │   │   │   │   │   │   ├── circular-flow.md
│   │   │   │   │   │   │   ├── comic-strip.md
│   │   │   │   │   │   │   ├── comparison-matrix.md
│   │   │   │   │   │   │   ├── dashboard.md
│   │   │   │   │   │   │   ├── dense-modules.md
│   │   │   │   │   │   │   ├── funnel.md
│   │   │   │   │   │   │   ├── hierarchical-layers.md
│   │   │   │   │   │   │   ├── hub-spoke.md
│   │   │   │   │   │   │   ├── iceberg.md
│   │   │   │   │   │   │   ├── isometric-map.md
│   │   │   │   │   │   │   ├── jigsaw.md
│   │   │   │   │   │   │   ├── linear-progression.md
│   │   │   │   │   │   │   ├── periodic-table.md
│   │   │   │   │   │   │   ├── story-mountain.md
│   │   │   │   │   │   │   ├── structural-breakdown.md
│   │   │   │   │   │   │   ├── tree-branching.md
│   │   │   │   │   │   │   ├── venn-diagram.md
│   │   │   │   │   │   │   └── winding-roadmap.md
│   │   │   │   │   │   ├── styles/
│   │   │   │   │   │   │   ├── aged-academia.md
│   │   │   │   │   │   │   ├── bold-graphic.md
│   │   │   │   │   │   │   ├── chalkboard.md
│   │   │   │   │   │   │   ├── claymation.md
│   │   │   │   │   │   │   ├── corporate-memphis.md
│   │   │   │   │   │   │   ├── craft-handmade.md
│   │   │   │   │   │   │   ├── cyberpunk-neon.md
│   │   │   │   │   │   │   ├── hand-drawn-edu.md
│   │   │   │   │   │   │   ├── ikea-manual.md
│   │   │   │   │   │   │   ├── kawaii.md
│   │   │   │   │   │   │   ├── knolling.md
│   │   │   │   │   │   │   ├── lego-brick.md
│   │   │   │   │   │   │   ├── morandi-journal.md
│   │   │   │   │   │   │   ├── origami.md
│   │   │   │   │   │   │   ├── pixel-art.md
│   │   │   │   │   │   │   ├── pop-laboratory.md
│   │   │   │   │   │   │   ├── retro-pop-grid.md
│   │   │   │   │   │   │   ├── storybook-watercolor.md
│   │   │   │   │   │   │   ├── subway-map.md
│   │   │   │   │   │   │   ├── technical-schematic.md
│   │   │   │   │   │   │   └── ui-wireframe.md
│   │   │   │   │   │   ├── analysis-framework.md
│   │   │   │   │   │   ├── base-prompt.md
│   │   │   │   │   │   └── structured-content-template.md
│   │   │   │   │   ├── PORT_NOTES.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── claude-design/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── design-md/
│   │   │   │   │   ├── templates/
│   │   │   │   │   │   └── starter.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── humanizer/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── manim-video/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── animation-design-thinking.md
│   │   │   │   │   │   ├── animations.md
│   │   │   │   │   │   ├── camera-and-3d.md
│   │   │   │   │   │   ├── decorations.md
│   │   │   │   │   │   ├── equations.md
│   │   │   │   │   │   ├── graphs-and-data.md
│   │   │   │   │   │   ├── mobjects.md
│   │   │   │   │   │   ├── paper-explainer.md
│   │   │   │   │   │   ├── production-quality.md
│   │   │   │   │   │   ├── rendering.md
│   │   │   │   │   │   ├── scene-planning.md
│   │   │   │   │   │   ├── troubleshooting.md
│   │   │   │   │   │   ├── updaters-and-trackers.md
│   │   │   │   │   │   └── visual-design.md
│   │   │   │   │   ├── README.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── p5js/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── animation.md
│   │   │   │   │   │   ├── color-systems.md
│   │   │   │   │   │   ├── core-api.md
│   │   │   │   │   │   ├── export-pipeline.md
│   │   │   │   │   │   ├── interaction.md
│   │   │   │   │   │   ├── shapes-and-geometry.md
│   │   │   │   │   │   ├── troubleshooting.md
│   │   │   │   │   │   ├── typography.md
│   │   │   │   │   │   ├── visual-effects.md
│   │   │   │   │   │   └── webgl-and-3d.md
│   │   │   │   │   ├── README.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── popular-web-designs/
│   │   │   │   │   ├── templates/
│   │   │   │   │   │   ├── airbnb.md
│   │   │   │   │   │   ├── airtable.md
│   │   │   │   │   │   ├── apple.md
│   │   │   │   │   │   ├── bmw.md
│   │   │   │   │   │   ├── cal.md
│   │   │   │   │   │   ├── claude.md
│   │   │   │   │   │   ├── clay.md
│   │   │   │   │   │   ├── clickhouse.md
│   │   │   │   │   │   ├── cohere.md
│   │   │   │   │   │   ├── coinbase.md
│   │   │   │   │   │   ├── composio.md
│   │   │   │   │   │   ├── cursor.md
│   │   │   │   │   │   ├── elevenlabs.md
│   │   │   │   │   │   ├── expo.md
│   │   │   │   │   │   ├── figma.md
│   │   │   │   │   │   ├── framer.md
│   │   │   │   │   │   ├── hashicorp.md
│   │   │   │   │   │   ├── ibm.md
│   │   │   │   │   │   ├── intercom.md
│   │   │   │   │   │   ├── kraken.md
│   │   │   │   │   │   ├── linear.app.md
│   │   │   │   │   │   ├── lovable.md
│   │   │   │   │   │   ├── minimax.md
│   │   │   │   │   │   ├── mintlify.md
│   │   │   │   │   │   ├── miro.md
│   │   │   │   │   │   ├── mistral.ai.md
│   │   │   │   │   │   ├── mongodb.md
│   │   │   │   │   │   ├── notion.md
│   │   │   │   │   │   ├── nvidia.md
│   │   │   │   │   │   ├── ollama.md
│   │   │   │   │   │   ├── opencode.ai.md
│   │   │   │   │   │   ├── pinterest.md
│   │   │   │   │   │   ├── posthog.md
│   │   │   │   │   │   ├── raycast.md
│   │   │   │   │   │   ├── replicate.md
│   │   │   │   │   │   ├── resend.md
│   │   │   │   │   │   ├── revolut.md
│   │   │   │   │   │   ├── runwayml.md
│   │   │   │   │   │   ├── sanity.md
│   │   │   │   │   │   ├── sentry.md
│   │   │   │   │   │   ├── spacex.md
│   │   │   │   │   │   ├── spotify.md
│   │   │   │   │   │   ├── stripe.md
│   │   │   │   │   │   ├── supabase.md
│   │   │   │   │   │   ├── superhuman.md
│   │   │   │   │   │   ├── together.ai.md
│   │   │   │   │   │   ├── uber.md
│   │   │   │   │   │   ├── vercel.md
│   │   │   │   │   │   ├── voltagent.md
│   │   │   │   │   │   ├── warp.md
│   │   │   │   │   │   ├── webflow.md
│   │   │   │   │   │   ├── wise.md
│   │   │   │   │   │   ├── x.ai.md
│   │   │   │   │   │   └── zapier.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── songwriting-and-ai-music/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── devops/
│   │   │   │   └── sdlc-review/
│   │   │   │       └── SKILL.md
│   │   │   ├── email/
│   │   │   │   ├── email-inbox-triage/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── himalaya/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── configuration.md
│   │   │   │   │   │   └── message-composition.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── media/
│   │   │   │   ├── gif-search/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── songsee/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── youtube-content/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── output-formats.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── note-taking/
│   │   │   │   ├── obsidian/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── productivity/
│   │   │   │   ├── airtable/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── box/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── bulk-operations.md
│   │   │   │   │   │   ├── cli-guide.md
│   │   │   │   │   │   ├── content-workflows.md
│   │   │   │   │   │   ├── hubs.md
│   │   │   │   │   │   ├── oauth-setup.md
│   │   │   │   │   │   ├── rest-api.md
│   │   │   │   │   │   ├── sdk-development.md
│   │   │   │   │   │   ├── search-and-ai.md
│   │   │   │   │   │   ├── troubleshooting.md
│   │   │   │   │   │   └── webhooks-and-events.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── document-to-action-items/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── docx/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── revisions-and-comments.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── google-workspace/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── daily-brief.md
│   │   │   │   │   │   └── gmail-search-syntax.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── maps/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── meeting-action-items/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── notion/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── block-types.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── pdf/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── forms.md
│   │   │   │   │   │   ├── nano-pdf-editing.md
│   │   │   │   │   │   └── ocr-extraction.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── powerpoint/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── product-price-monitor/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── teams-meeting-pipeline/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── weekly-review-planning/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── xlsx/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── restructuring.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── research/
│   │   │   │   ├── arxiv/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── competitor-news-monitor/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── grounded-citations/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── citation-formats.md
│   │   │   │   │   │   └── grounding-rationale.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── llm-wiki/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── social-media/
│   │   │   │   ├── xurl/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── software-development/
│   │   │   │   ├── codebase-inspection/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── dogfood/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   └── issue-taxonomy.md
│   │   │   │   │   ├── templates/
│   │   │   │   │   │   └── dogfood-report-template.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── github/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── auth.md
│   │   │   │   │   │   ├── ci-troubleshooting.md
│   │   │   │   │   │   ├── code-review.md
│   │   │   │   │   │   ├── conventional-commits.md
│   │   │   │   │   │   ├── github-api-cheatsheet.md
│   │   │   │   │   │   ├── issue-to-pr.md
│   │   │   │   │   │   ├── issues.md
│   │   │   │   │   │   ├── pr-workflow.md
│   │   │   │   │   │   ├── repo-management.md
│   │   │   │   │   │   └── review-output-template.md
│   │   │   │   │   ├── templates/
│   │   │   │   │   │   ├── bug-report.md
│   │   │   │   │   │   ├── feature-request.md
│   │   │   │   │   │   ├── pr-body-bugfix.md
│   │   │   │   │   │   └── pr-body-feature.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── hermes-agent-skill-authoring/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── inspecting-hermes-desktop-dom/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── node-inspect-debugger/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── python-debugpy/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── requesting-code-review/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── simplify-code/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── spike/
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── systematic-debugging/
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── test-driven-development/
│   │   │   │       └── SKILL.md
│   │   │   └── web/
│   │   │       ├── blocked-page-recovery/
│   │   │       │   └── SKILL.md
│   │   │       └── DESCRIPTION.md
│   │   ├── tests/
│   │   │   ├── conformance/
│   │   │   │   └── persistence/
│   │   │   │       └── README.md
│   │   │   └── e2e/
│   │   │       └── matrix_xsign_bootstrap/
│   │   │           └── README.md
│   │   ├── tools/
│   │   │   ├── neutts_samples/
│   │   │   │   └── jo.txt
│   │   │   └── wakewords/
│   │   │       └── README.md
│   │   ├── ui-tui/
│   │   │   └── README.md
│   │   ├── web/
│   │   │   └── README.md
│   │   ├── website/
│   │   │   ├── docs/
│   │   │   │   ├── developer-guide/
│   │   │   │   │   ├── plugins/
│   │   │   │   │   │   └── index.md
│   │   │   │   │   ├── acp-internals.md
│   │   │   │   │   ├── adding-platform-adapters.md
│   │   │   │   │   ├── adding-providers.md
│   │   │   │   │   ├── adding-tools.md
│   │   │   │   │   ├── agent-loop.md
│   │   │   │   │   ├── architecture.md
│   │   │   │   │   ├── browser-provider-plugin.md
│   │   │   │   │   ├── browser-supervisor.md
│   │   │   │   │   ├── codebase-ownership.md
│   │   │   │   │   ├── context-compression-and-caching.md
│   │   │   │   │   ├── context-engine-plugin.md
│   │   │   │   │   ├── contributing.md
│   │   │   │   │   ├── creating-skills.md
│   │   │   │   │   ├── cron-internals.md
│   │   │   │   │   ├── desktop-plugin-sdk.md
│   │   │   │   │   ├── egress-internals.md
│   │   │   │   │   ├── extending-the-cli.md
│   │   │   │   │   ├── gateway-internals.md
│   │   │   │   │   ├── image-gen-provider-plugin.md
│   │   │   │   │   ├── memory-provider-plugin.md
│   │   │   │   │   ├── model-provider-plugin.md
│   │   │   │   │   ├── plugin-llm-access.md
│   │   │   │   │   ├── programmatic-integration.md
│   │   │   │   │   ├── prompt-assembly.md
│   │   │   │   │   ├── provider-runtime.md
│   │   │   │   │   ├── secret-source-plugin.md
│   │   │   │   │   ├── session-storage.md
│   │   │   │   │   ├── subagent-lifecycle-api.md
│   │   │   │   │   ├── terminal-environment-plugin.md
│   │   │   │   │   ├── tools-runtime.md
│   │   │   │   │   ├── trajectory-format.md
│   │   │   │   │   ├── video-gen-provider-plugin.md
│   │   │   │   │   ├── web-search-provider-plugin.md
│   │   │   │   │   └── worktree-ui-dev.md
│   │   │   │   ├── getting-started/
│   │   │   │   │   ├── installation.md
│   │   │   │   │   ├── learning-path.md
│   │   │   │   │   ├── nix-setup.md
│   │   │   │   │   ├── platform-support.md
│   │   │   │   │   ├── quickstart.md
│   │   │   │   │   ├── termux.md
│   │   │   │   │   └── updating.md
│   │   │   │   ├── guides/
│   │   │   │   │   ├── agent-email-address.md
│   │   │   │   │   ├── automate-with-cron.md
│   │   │   │   │   ├── automation-blueprints.md
│   │   │   │   │   ├── aws-bedrock.md
│   │   │   │   │   ├── azure-foundry.md
│   │   │   │   │   ├── cron-script-only.md
│   │   │   │   │   ├── cron-troubleshooting.md
│   │   │   │   │   ├── daily-briefing-bot.md
│   │   │   │   │   ├── delegation-patterns.md
│   │   │   │   │   ├── desktop-native-signin.md
│   │   │   │   │   ├── github-pr-review-agent.md
│   │   │   │   │   ├── google-gemini.md
│   │   │   │   │   ├── google-vertex.md
│   │   │   │   │   ├── local-llm-on-mac.md
│   │   │   │   │   ├── local-ollama-setup.md
│   │   │   │   │   ├── manage-hermes-cloud-with-mcp.md
│   │   │   │   │   ├── microsoft-graph-app-registration.md
│   │   │   │   │   ├── migrate-from-openclaw.md
│   │   │   │   │   ├── minimax-oauth.md
│   │   │   │   │   ├── oauth-over-ssh.md
│   │   │   │   │   ├── operate-teams-meeting-pipeline.md
│   │   │   │   │   ├── pipe-script-output.md
│   │   │   │   │   ├── python-library.md
│   │   │   │   │   ├── run-hermes-with-nous-portal.md
│   │   │   │   │   ├── run-nemotron-3-ultra-free.md
│   │   │   │   │   ├── secure-hermes-on-a-work-machine.md
│   │   │   │   │   ├── team-telegram-assistant.md
│   │   │   │   │   ├── tips.md
│   │   │   │   │   ├── troubleshooting-agent-quality.md
│   │   │   │   │   ├── use-mcp-with-hermes.md
│   │   │   │   │   ├── use-soul-with-hermes.md
│   │   │   │   │   ├── use-voice-mode-with-hermes.md
│   │   │   │   │   ├── webhook-github-pr-review.md
│   │   │   │   │   ├── work-with-skills.md
│   │   │   │   │   └── xai-grok-oauth.md
│   │   │   │   ├── integrations/
│   │   │   │   │   ├── buzz.md
│   │   │   │   │   ├── index.md
│   │   │   │   │   ├── nous-portal.md
│   │   │   │   │   └── providers.md
│   │   │   │   ├── reference/
│   │   │   │   │   ├── cli-commands.md
│   │   │   │   │   ├── cli-symbols.md
│   │   │   │   │   ├── environment-variables.md
│   │   │   │   │   ├── faq.md
│   │   │   │   │   ├── mcp-config-reference.md
│   │   │   │   │   ├── model-catalog.md
│   │   │   │   │   ├── optional-skills-catalog.md
│   │   │   │   │   ├── profile-commands.md
│   │   │   │   │   ├── skills-catalog.md
│   │   │   │   │   ├── slash-commands.md
│   │   │   │   │   ├── tools-reference.md
│   │   │   │   │   └── toolsets-reference.md
│   │   │   │   └── user-guide/
│   │   │   │       ├── egress/
│   │   │   │       │   ├── index.md
│   │   │   │       │   └── iron-proxy.md
│   │   │   │       ├── features/
│   │   │   │       │   ├── acp.md
│   │   │   │       │   ├── api-server.md
│   │   │   │       │   ├── batch-processing.md
│   │   │   │       │   ├── browser.md
│   │   │   │       │   ├── built-in-plugins.md
│   │   │   │       │   ├── code-execution.md
│   │   │   │       │   ├── codex-app-server-runtime.md
│   │   │   │       │   ├── computer-use.md
│   │   │   │       │   ├── context-files.md
│   │   │   │       │   ├── context-references.md
│   │   │   │       │   ├── credential-pools.md
│   │   │   │       │   ├── cron.md
│   │   │   │       │   ├── curator.md
│   │   │   │       │   ├── delegation.md
│   │   │   │       │   ├── deliverable-mode.md
│   │   │   │       │   ├── document-extraction.md
│   │   │   │       │   ├── extending-the-dashboard.md
│   │   │   │       │   ├── fallback-providers.md
│   │   │   │       │   ├── goals.md
│   │   │   │       │   ├── heartbeat.md
│   │   │   │       │   ├── honcho.md
│   │   │   │       │   ├── hooks.md
│   │   │   │       │   ├── image-generation.md
│   │   │   │       │   ├── kanban-tutorial.md
│   │   │   │       │   ├── kanban-worker-lanes.md
│   │   │   │       │   ├── kanban.md
│   │   │   │       │   ├── loops.md
│   │   │   │       │   ├── lsp.md
│   │   │   │       │   ├── mcp.md
│   │   │   │       │   ├── memory-providers.md
│   │   │   │       │   ├── memory.md
│   │   │   │       │   ├── mixture-of-agents.md
│   │   │   │       │   ├── overview.md
│   │   │   │       │   ├── personality.md
│   │   │   │       │   ├── pets.md
│   │   │   │       │   ├── plugins.md
│   │   │   │       │   ├── provider-routing.md
│   │   │   │       │   ├── skills.md
│   │   │   │       │   ├── skins.md
│   │   │   │       │   ├── spotify.md
│   │   │   │       │   ├── subscription-proxy.md
│   │   │   │       │   ├── tool-gateway.md
│   │   │   │       │   ├── tool-search.md
│   │   │   │       │   ├── tools.md
│   │   │   │       │   ├── tts.md
│   │   │   │       │   ├── vision.md
│   │   │   │       │   ├── voice-mode.md
│   │   │   │       │   ├── wake-word.md
│   │   │   │       │   ├── web-dashboard.md
│   │   │   │       │   ├── web-search.md
│   │   │   │       │   └── x-search.md
│   │   │   │       ├── messaging/
│   │   │   │       │   ├── a2a.md
│   │   │   │       │   ├── bluebubbles.md
│   │   │   │       │   ├── buzz.md
│   │   │   │       │   ├── dingtalk.md
│   │   │   │       │   ├── discord.md
│   │   │   │       │   ├── email.md
│   │   │   │       │   ├── feishu.md
│   │   │   │       │   ├── google_chat.md
│   │   │   │       │   ├── homeassistant.md
│   │   │   │       │   ├── index.md
│   │   │   │       │   ├── irc.md
│   │   │   │       │   ├── line.md
│   │   │   │       │   ├── matrix.md
│   │   │   │       │   ├── mattermost.md
│   │   │   │       │   ├── msgraph-webhook.md
│   │   │   │       │   ├── ntfy.md
│   │   │   │       │   ├── open-webui.md
│   │   │   │       │   ├── photon.md
│   │   │   │       │   ├── qqbot.md
│   │   │   │       │   ├── raft.md
│   │   │   │       │   ├── relay.md
│   │   │   │       │   ├── signal.md
│   │   │   │       │   ├── simplex.md
│   │   │   │       │   ├── slack.md
│   │   │   │       │   ├── sms.md
│   │   │   │       │   ├── teams-meetings.md
│   │   │   │       │   ├── teams.md
│   │   │   │       │   ├── telegram.md
│   │   │   │       │   ├── webhooks.md
│   │   │   │       │   ├── wecom-callback.md
│   │   │   │       │   ├── wecom.md
│   │   │   │       │   ├── weixin.md
│   │   │   │       │   ├── whatsapp-cloud.md
│   │   │   │       │   ├── whatsapp.md
│   │   │   │       │   └── yuanbao.md
│   │   │   │       ├── secrets/
│   │   │   │       │   ├── bitwarden.md
│   │   │   │       │   ├── command.md
│   │   │   │       │   ├── index.md
│   │   │   │       │   └── onepassword.md
│   │   │   │       ├── skills/
│   │   │   │       │   ├── bundled/
│   │   │   │       │   │   ├── apple/
│   │   │   │       │   │   │   ├── apple-apple-notes.md
│   │   │   │       │   │   │   ├── apple-apple-reminders.md
│   │   │   │       │   │   │   ├── apple-findmy.md
│   │   │   │       │   │   │   └── apple-imessage.md
│   │   │   │       │   │   ├── autonomous-ai-agents/
│   │   │   │       │   │   │   ├── autonomous-ai-agents-claude-code.md
│   │   │   │       │   │   │   ├── autonomous-ai-agents-codex.md
│   │   │   │       │   │   │   ├── autonomous-ai-agents-computer-use.md
│   │   │   │       │   │   │   ├── autonomous-ai-agents-hermes-agent.md
│   │   │   │       │   │   │   ├── autonomous-ai-agents-merge-reconciler.md
│   │   │   │       │   │   │   └── autonomous-ai-agents-opencode.md
│   │   │   │       │   │   ├── creative/
│   │   │   │       │   │   │   ├── creative-architecture-diagram.md
│   │   │   │       │   │   │   ├── creative-ascii-art.md
│   │   │   │       │   │   │   ├── creative-ascii-video.md
│   │   │   │       │   │   │   ├── creative-baoyu-infographic.md
│   │   │   │       │   │   │   ├── creative-claude-design.md
│   │   │   │       │   │   │   ├── creative-comfyui.md
│   │   │   │       │   │   │   ├── creative-design-md.md
│   │   │   │       │   │   │   ├── creative-excalidraw.md
│   │   │   │       │   │   │   ├── creative-humanizer.md
│   │   │   │       │   │   │   ├── creative-manim-video.md
│   │   │   │       │   │   │   ├── creative-p5js.md
│   │   │   │       │   │   │   ├── creative-popular-web-designs.md
│   │   │   │       │   │   │   ├── creative-pretext.md
│   │   │   │       │   │   │   ├── creative-sketch.md
│   │   │   │       │   │   │   ├── creative-songwriting-and-ai-music.md
│   │   │   │       │   │   │   └── creative-touchdesigner-mcp.md
│   │   │   │       │   │   ├── devops/
│   │   │   │       │   │   │   └── devops-sdlc-review.md
│   │   │   │       │   │   ├── email/
│   │   │   │       │   │   │   ├── email-email-inbox-triage.md
│   │   │   │       │   │   │   └── email-himalaya.md
│   │   │   │       │   │   ├── github/
│   │   │   │       │   │   │   ├── github-codebase-inspection.md
│   │   │   │       │   │   │   ├── github-github-auth.md
│   │   │   │       │   │   │   ├── github-github-code-review.md
│   │   │   │       │   │   │   ├── github-github-issue-to-pr.md
│   │   │   │       │   │   │   ├── github-github-issues.md
│   │   │   │       │   │   │   ├── github-github-pr-workflow.md
│   │   │   │       │   │   │   └── github-github-repo-management.md
│   │   │   │       │   │   ├── media/
│   │   │   │       │   │   │   ├── media-gif-search.md
│   │   │   │       │   │   │   ├── media-songsee.md
│   │   │   │       │   │   │   └── media-youtube-content.md
│   │   │   │       │   │   ├── mlops/
│   │   │   │       │   │   │   ├── mlops-evaluation-evaluating-llms-harness.md
│   │   │   │       │   │   │   ├── mlops-evaluation-weights-and-biases.md
│   │   │   │       │   │   │   ├── mlops-huggingface-hub.md
│   │   │   │       │   │   │   ├── mlops-inference-llama-cpp.md
│   │   │   │       │   │   │   └── mlops-inference-serving-llms-vllm.md
│   │   │   │       │   │   ├── note-taking/
│   │   │   │       │   │   │   └── note-taking-obsidian.md
│   │   │   │       │   │   ├── productivity/
│   │   │   │       │   │   │   ├── productivity-airtable.md
│   │   │   │       │   │   │   ├── productivity-box.md
│   │   │   │       │   │   │   ├── productivity-document-to-action-items.md
│   │   │   │       │   │   │   ├── productivity-docx.md
│   │   │   │       │   │   │   ├── productivity-google-workspace.md
│   │   │   │       │   │   │   ├── productivity-maps.md
│   │   │   │       │   │   │   ├── productivity-meeting-action-items.md
│   │   │   │       │   │   │   ├── productivity-nano-pdf.md
│   │   │   │       │   │   │   ├── productivity-notion.md
│   │   │   │       │   │   │   ├── productivity-ocr-and-documents.md
│   │   │   │       │   │   │   ├── productivity-pdf.md
│   │   │   │       │   │   │   ├── productivity-powerpoint.md
│   │   │   │       │   │   │   ├── productivity-product-price-monitor.md
│   │   │   │       │   │   │   ├── productivity-session-librarian.md
│   │   │   │       │   │   │   ├── productivity-teams-meeting-pipeline.md
│   │   │   │       │   │   │   ├── productivity-weekly-review-planning.md
│   │   │   │       │   │   │   └── productivity-xlsx.md
│   │   │   │       │   │   ├── research/
│   │   │   │       │   │   │   ├── research-arxiv.md
│   │   │   │       │   │   │   ├── research-blocked-page-recovery.md
│   │   │   │       │   │   │   ├── research-blogwatcher.md
│   │   │   │       │   │   │   ├── research-competitor-news-monitor.md
│   │   │   │       │   │   │   ├── research-grounded-citations.md
│   │   │   │       │   │   │   ├── research-llm-wiki.md
│   │   │   │       │   │   │   └── research-research-paper-writing.md
│   │   │   │       │   │   ├── smart-home/
│   │   │   │       │   │   │   └── smart-home-openhue.md
│   │   │   │       │   │   ├── social-media/
│   │   │   │       │   │   │   └── social-media-xurl.md
│   │   │   │       │   │   ├── software-development/
│   │   │   │       │   │   │   ├── software-development-codebase-inspection.md
│   │   │   │       │   │   │   ├── software-development-dogfood.md
│   │   │   │       │   │   │   ├── software-development-github.md
│   │   │   │       │   │   │   ├── software-development-hermes-agent-skill-authoring.md
│   │   │   │       │   │   │   ├── software-development-inspecting-hermes-desktop-dom.md
│   │   │   │       │   │   │   ├── software-development-node-inspect-debugger.md
│   │   │   │       │   │   │   ├── software-development-python-debugpy.md
│   │   │   │       │   │   │   ├── software-development-requesting-code-review.md
│   │   │   │       │   │   │   ├── software-development-simplify-code.md
│   │   │   │       │   │   │   ├── software-development-spike.md
│   │   │   │       │   │   │   ├── software-development-systematic-debugging.md
│   │   │   │       │   │   │   └── software-development-test-driven-development.md
│   │   │   │       │   │   └── web/
│   │   │   │       │   │       └── web-blocked-page-recovery.md
│   │   │   │       │   ├── optional/
│   │   │   │       │   │   ├── autonomous-ai-agents/
│   │   │   │       │   │   │   ├── autonomous-ai-agents-antigravity-cli.md
│   │   │   │       │   │   │   ├── autonomous-ai-agents-blackbox.md
│   │   │   │       │   │   │   ├── autonomous-ai-agents-grok.md
│   │   │   │       │   │   │   ├── autonomous-ai-agents-honcho.md
│   │   │   │       │   │   │   └── autonomous-ai-agents-openhands.md
│   │   │   │       │   │   ├── blockchain/
│   │   │   │       │   │   │   ├── blockchain-evm.md
│   │   │   │       │   │   │   ├── blockchain-hyperliquid.md
│   │   │   │       │   │   │   └── blockchain-solana.md
│   │   │   │       │   │   ├── communication/
│   │   │   │       │   │   │   └── communication-one-three-one-rule.md
│   │   │   │       │   │   ├── creative/
│   │   │   │       │   │   │   ├── creative-ascii-art.md
│   │   │   │       │   │   │   ├── creative-audiocraft-audio-generation.md
│   │   │   │       │   │   │   ├── creative-baoyu-article-illustrator.md
│   │   │   │       │   │   │   ├── creative-baoyu-comic.md
│   │   │   │       │   │   │   ├── creative-comfyui.md
│   │   │   │       │   │   │   ├── creative-concept-diagrams.md
│   │   │   │       │   │   │   ├── creative-creative-ideation.md
│   │   │   │       │   │   │   ├── creative-draw-your-font.md
│   │   │   │       │   │   │   ├── creative-excalidraw.md
│   │   │   │       │   │   │   ├── creative-heartmula.md
│   │   │   │       │   │   │   ├── creative-hyperframes.md
│   │   │   │       │   │   │   ├── creative-impeccable.md
│   │   │   │       │   │   │   ├── creative-kanban-video-orchestrator.md
│   │   │   │       │   │   │   ├── creative-meme-generation.md
│   │   │   │       │   │   │   ├── creative-pixel-art.md
│   │   │   │       │   │   │   ├── creative-pretext.md
│   │   │   │       │   │   │   ├── creative-simple-english.md
│   │   │   │       │   │   │   ├── creative-sketch.md
│   │   │   │       │   │   │   ├── creative-social-media-content-calendar.md
│   │   │   │       │   │   │   ├── creative-tldraw-offline.md
│   │   │   │       │   │   │   ├── creative-touchdesigner-mcp.md
│   │   │   │       │   │   │   └── creative-unreal-mcp.md
│   │   │   │       │   │   ├── data-science/
│   │   │   │       │   │   │   └── data-science-jupyter-notebook.md
│   │   │   │       │   │   ├── devops/
│   │   │   │       │   │   │   ├── devops-actual-setup.md
│   │   │   │       │   │   │   ├── devops-docker-management.md
│   │   │   │       │   │   │   ├── devops-hermes-s6-container-supervision.md
│   │   │   │       │   │   │   ├── devops-inference-sh-cli.md
│   │   │   │       │   │   │   ├── devops-pinggy-tunnel.md
│   │   │   │       │   │   │   ├── devops-setup-wizard-generator.md
│   │   │   │       │   │   │   └── devops-watchers.md
│   │   │   │       │   │   ├── dogfood/
│   │   │   │       │   │   │   └── dogfood-adversarial-ux-test.md
│   │   │   │       │   │   ├── email/
│   │   │   │       │   │   │   └── email-agentmail.md
│   │   │   │       │   │   ├── finance/
│   │   │   │       │   │   │   ├── finance-3-statement-model.md
│   │   │   │       │   │   │   ├── finance-comps-analysis.md
│   │   │   │       │   │   │   ├── finance-dcf-model.md
│   │   │   │       │   │   │   ├── finance-excel-author.md
│   │   │   │       │   │   │   ├── finance-lbo-model.md
│   │   │   │       │   │   │   ├── finance-merger-model.md
│   │   │   │       │   │   │   ├── finance-polymarket.md
│   │   │   │       │   │   │   ├── finance-pptx-author.md
│   │   │   │       │   │   │   └── finance-stocks.md
│   │   │   │       │   │   ├── gaming/
│   │   │   │       │   │   │   ├── gaming-minecraft-modpack-server.md
│   │   │   │       │   │   │   └── gaming-pokemon-player.md
│   │   │   │       │   │   ├── health/
│   │   │   │       │   │   │   ├── health-fitness-nutrition.md
│   │   │   │       │   │   │   └── health-neuroskill-bci.md
│   │   │   │       │   │   ├── mcp/
│   │   │   │       │   │   │   ├── mcp-fastmcp.md
│   │   │   │       │   │   │   ├── mcp-mcp-oauth-remote-gateway.md
│   │   │   │       │   │   │   └── mcp-mcporter.md
│   │   │   │       │   │   ├── migration/
│   │   │   │       │   │   │   └── migration-openclaw-migration.md
│   │   │   │       │   │   ├── mlops/
│   │   │   │       │   │   │   ├── mlops-accelerate.md
│   │   │   │       │   │   │   ├── mlops-chroma.md
│   │   │   │       │   │   │   ├── mlops-clip.md
│   │   │   │       │   │   │   ├── mlops-evaluation-evaluating-llms-harness.md
│   │   │   │       │   │   │   ├── mlops-evaluation-weights-and-biases.md
│   │   │   │       │   │   │   ├── mlops-faiss.md
│   │   │   │       │   │   │   ├── mlops-flash-attention.md
│   │   │   │       │   │   │   ├── mlops-guidance.md
│   │   │   │       │   │   │   ├── mlops-huggingface-tokenizers.md
│   │   │   │       │   │   │   ├── mlops-inference-llama-cpp.md
│   │   │   │       │   │   │   ├── mlops-inference-outlines.md
│   │   │   │       │   │   │   ├── mlops-inference-serving-llms-vllm.md
│   │   │   │       │   │   │   ├── mlops-instructor.md
│   │   │   │       │   │   │   ├── mlops-lambda-labs.md
│   │   │   │       │   │   │   ├── mlops-llava.md
│   │   │   │       │   │   │   ├── mlops-modal.md
│   │   │   │       │   │   │   ├── mlops-models-huggingface-hub.md
│   │   │   │       │   │   │   ├── mlops-models-segment-anything-model.md
│   │   │   │       │   │   │   ├── mlops-nemo-curator.md
│   │   │   │       │   │   │   ├── mlops-obliteratus.md
│   │   │   │       │   │   │   ├── mlops-peft.md
│   │   │   │       │   │   │   ├── mlops-pinecone.md
│   │   │   │       │   │   │   ├── mlops-pytorch-fsdp.md
│   │   │   │       │   │   │   ├── mlops-pytorch-lightning.md
│   │   │   │       │   │   │   ├── mlops-qdrant.md
│   │   │   │       │   │   │   ├── mlops-research-dspy.md
│   │   │   │       │   │   │   ├── mlops-saelens.md
│   │   │   │       │   │   │   ├── mlops-simpo.md
│   │   │   │       │   │   │   ├── mlops-slime.md
│   │   │   │       │   │   │   ├── mlops-stable-diffusion.md
│   │   │   │       │   │   │   ├── mlops-tensorrt-llm.md
│   │   │   │       │   │   │   ├── mlops-torchtitan.md
│   │   │   │       │   │   │   ├── mlops-training-axolotl.md
│   │   │   │       │   │   │   ├── mlops-training-trl-fine-tuning.md
│   │   │   │       │   │   │   ├── mlops-training-unsloth.md
│   │   │   │       │   │   │   └── mlops-whisper.md
│   │   │   │       │   │   ├── payments/
│   │   │   │       │   │   │   ├── payments-mpp-agent.md
│   │   │   │       │   │   │   ├── payments-stripe-link-cli.md
│   │   │   │       │   │   │   └── payments-stripe-projects.md
│   │   │   │       │   │   ├── productivity/
│   │   │   │       │   │   │   ├── productivity-canvas.md
│   │   │   │       │   │   │   ├── productivity-decision-questionnaire.md
│   │   │   │       │   │   │   ├── productivity-here-now.md
│   │   │   │       │   │   │   ├── productivity-memento-flashcards.md
│   │   │   │       │   │   │   ├── productivity-shop.md
│   │   │   │       │   │   │   ├── productivity-shopify.md
│   │   │   │       │   │   │   ├── productivity-siyuan.md
│   │   │   │       │   │   │   └── productivity-telephony.md
│   │   │   │       │   │   ├── research/
│   │   │   │       │   │   │   ├── research-bioinformatics.md
│   │   │   │       │   │   │   ├── research-blogwatcher.md
│   │   │   │       │   │   │   ├── research-darwinian-evolver.md
│   │   │   │       │   │   │   ├── research-domain-intel.md
│   │   │   │       │   │   │   ├── research-drug-discovery.md
│   │   │   │       │   │   │   ├── research-duckduckgo-search.md
│   │   │   │       │   │   │   ├── research-gitnexus-explorer.md
│   │   │   │       │   │   │   ├── research-osint-investigation.md
│   │   │   │       │   │   │   ├── research-parallel-cli.md
│   │   │   │       │   │   │   ├── research-pinecone-research.md
│   │   │   │       │   │   │   ├── research-qmd.md
│   │   │   │       │   │   │   ├── research-research-paper-writing.md
│   │   │   │       │   │   │   ├── research-scrapling.md
│   │   │   │       │   │   │   └── research-searxng-search.md
│   │   │   │       │   │   ├── security/
│   │   │   │       │   │   │   ├── security-1password.md
│   │   │   │       │   │   │   ├── security-godmode.md
│   │   │   │       │   │   │   ├── security-oss-forensics.md
│   │   │   │       │   │   │   ├── security-sherlock.md
│   │   │   │       │   │   │   ├── security-unbroker.md
│   │   │   │       │   │   │   └── security-web-pentest.md
│   │   │   │       │   │   ├── smart-home/
│   │   │   │       │   │   │   └── smart-home-openhue.md
│   │   │   │       │   │   ├── software-development/
│   │   │   │       │   │   │   ├── software-development-ast-grep.md
│   │   │   │       │   │   │   ├── software-development-code-wiki.md
│   │   │   │       │   │   │   ├── software-development-grill-me.md
│   │   │   │       │   │   │   ├── software-development-rest-graphql-debug.md
│   │   │   │       │   │   │   └── software-development-subagent-driven-development.md
│   │   │   │       │   │   ├── web-development/
│   │   │   │       │   │   │   ├── web-development-cloudflare-temporary-deploy.md
│   │   │   │       │   │   │   ├── web-development-har-derived-api-client.md
│   │   │   │       │   │   │   ├── web-development-page-agent.md
│   │   │   │       │   │   │   └── web-development-publish-site.md
│   │   │   │       │   │   └── yuanbao/
│   │   │   │       │   │       └── yuanbao-yuanbao.md
│   │   │   │       │   └── google-workspace.md
│   │   │   │       ├── bot-mode.md
│   │   │   │       ├── checkpoints-and-rollback.md
│   │   │   │       ├── cli.md
│   │   │   │       ├── configuration.md
│   │   │   │       ├── configuring-models.md
│   │   │   │       ├── desktop.md
│   │   │   │       ├── docker.md
│   │   │   │       ├── git-worktrees.md
│   │   │   │       ├── import-from-other-agents.md
│   │   │   │       ├── local-models.md
│   │   │   │       ├── managed-scope.md
│   │   │   │       ├── multi-connection-desktop.md
│   │   │   │       ├── multi-profile-gateways.md
│   │   │   │       ├── profile-distributions.md
│   │   │   │       ├── profiles.md
│   │   │   │       ├── security.md
│   │   │   │       ├── sessions.md
│   │   │   │       ├── tui.md
│   │   │   │       ├── which-file-does-what.md
│   │   │   │       ├── windows-native.md
│   │   │   │       └── windows-wsl-quickstart.md
│   │   │   ├── i18n/
│   │   │   │   └── zh-Hans/
│   │   │   │       └── docusaurus-plugin-content-docs/
│   │   │   │           └── current/
│   │   │   │               ├── developer-guide/
│   │   │   │               │   ├── plugins/
│   │   │   │               │   │   └── index.md
│   │   │   │               │   ├── acp-internals.md
│   │   │   │               │   ├── adding-platform-adapters.md
│   │   │   │               │   ├── adding-providers.md
│   │   │   │               │   ├── adding-tools.md
│   │   │   │               │   ├── agent-loop.md
│   │   │   │               │   ├── architecture.md
│   │   │   │               │   ├── browser-supervisor.md
│   │   │   │               │   ├── context-compression-and-caching.md
│   │   │   │               │   ├── context-engine-plugin.md
│   │   │   │               │   ├── contributing.md
│   │   │   │               │   ├── creating-skills.md
│   │   │   │               │   ├── cron-internals.md
│   │   │   │               │   ├── extending-the-cli.md
│   │   │   │               │   ├── gateway-internals.md
│   │   │   │               │   ├── image-gen-provider-plugin.md
│   │   │   │               │   ├── memory-provider-plugin.md
│   │   │   │               │   ├── model-provider-plugin.md
│   │   │   │               │   ├── plugin-llm-access.md
│   │   │   │               │   ├── programmatic-integration.md
│   │   │   │               │   ├── prompt-assembly.md
│   │   │   │               │   ├── provider-runtime.md
│   │   │   │               │   ├── session-storage.md
│   │   │   │               │   ├── tools-runtime.md
│   │   │   │               │   ├── trajectory-format.md
│   │   │   │               │   ├── video-gen-provider-plugin.md
│   │   │   │               │   └── web-search-provider-plugin.md
│   │   │   │               ├── getting-started/
│   │   │   │               │   ├── installation.md
│   │   │   │               │   ├── learning-path.md
│   │   │   │               │   ├── nix-setup.md
│   │   │   │               │   ├── quickstart.md
│   │   │   │               │   ├── termux.md
│   │   │   │               │   └── updating.md
│   │   │   │               ├── guides/
│   │   │   │               │   ├── automate-with-cron.md
│   │   │   │               │   ├── automation-blueprints.md
│   │   │   │               │   ├── aws-bedrock.md
│   │   │   │               │   ├── azure-foundry.md
│   │   │   │               │   ├── cron-script-only.md
│   │   │   │               │   ├── cron-troubleshooting.md
│   │   │   │               │   ├── daily-briefing-bot.md
│   │   │   │               │   ├── delegation-patterns.md
│   │   │   │               │   ├── github-pr-review-agent.md
│   │   │   │               │   ├── google-gemini.md
│   │   │   │               │   ├── local-llm-on-mac.md
│   │   │   │               │   ├── local-ollama-setup.md
│   │   │   │               │   ├── microsoft-graph-app-registration.md
│   │   │   │               │   ├── migrate-from-openclaw.md
│   │   │   │               │   ├── minimax-oauth.md
│   │   │   │               │   ├── oauth-over-ssh.md
│   │   │   │               │   ├── operate-teams-meeting-pipeline.md
│   │   │   │               │   ├── pipe-script-output.md
│   │   │   │               │   ├── python-library.md
│   │   │   │               │   ├── run-hermes-with-nous-portal.md
│   │   │   │               │   ├── team-telegram-assistant.md
│   │   │   │               │   ├── tips.md
│   │   │   │               │   ├── use-mcp-with-hermes.md
│   │   │   │               │   ├── use-soul-with-hermes.md
│   │   │   │               │   ├── use-voice-mode-with-hermes.md
│   │   │   │               │   ├── webhook-github-pr-review.md
│   │   │   │               │   ├── work-with-skills.md
│   │   │   │               │   └── xai-grok-oauth.md
│   │   │   │               ├── integrations/
│   │   │   │               │   ├── buzz.md
│   │   │   │               │   ├── index.md
│   │   │   │               │   ├── nous-portal.md
│   │   │   │               │   └── providers.md
│   │   │   │               ├── reference/
│   │   │   │               │   ├── cli-commands.md
│   │   │   │               │   ├── environment-variables.md
│   │   │   │               │   ├── faq.md
│   │   │   │               │   ├── mcp-config-reference.md
│   │   │   │               │   ├── model-catalog.md
│   │   │   │               │   ├── optional-skills-catalog.md
│   │   │   │               │   ├── profile-commands.md
│   │   │   │               │   ├── skills-catalog.md
│   │   │   │               │   ├── slash-commands.md
│   │   │   │               │   ├── tools-reference.md
│   │   │   │               │   └── toolsets-reference.md
│   │   │   │               └── user-guide/
│   │   │   │                   ├── features/
│   │   │   │                   │   ├── acp.md
│   │   │   │                   │   ├── api-server.md
│   │   │   │                   │   ├── batch-processing.md
│   │   │   │                   │   ├── browser.md
│   │   │   │                   │   ├── built-in-plugins.md
│   │   │   │                   │   ├── code-execution.md
│   │   │   │                   │   ├── codex-app-server-runtime.md
│   │   │   │                   │   ├── computer-use.md
│   │   │   │                   │   ├── context-files.md
│   │   │   │                   │   ├── context-references.md
│   │   │   │                   │   ├── credential-pools.md
│   │   │   │                   │   ├── cron.md
│   │   │   │                   │   ├── curator.md
│   │   │   │                   │   ├── delegation.md
│   │   │   │                   │   ├── deliverable-mode.md
│   │   │   │                   │   ├── extending-the-dashboard.md
│   │   │   │                   │   ├── fallback-providers.md
│   │   │   │                   │   ├── goals.md
│   │   │   │                   │   ├── honcho.md
│   │   │   │                   │   ├── hooks.md
│   │   │   │                   │   ├── image-generation.md
│   │   │   │                   │   ├── kanban-tutorial.md
│   │   │   │                   │   ├── kanban-worker-lanes.md
│   │   │   │                   │   ├── kanban.md
│   │   │   │                   │   ├── lsp.md
│   │   │   │                   │   ├── mcp.md
│   │   │   │                   │   ├── memory-providers.md
│   │   │   │                   │   ├── memory.md
│   │   │   │                   │   ├── overview.md
│   │   │   │                   │   ├── personality.md
│   │   │   │                   │   ├── plugins.md
│   │   │   │                   │   ├── provider-routing.md
│   │   │   │                   │   ├── skills.md
│   │   │   │                   │   ├── skins.md
│   │   │   │                   │   ├── spotify.md
│   │   │   │                   │   ├── subscription-proxy.md
│   │   │   │                   │   ├── tool-gateway.md
│   │   │   │                   │   ├── tools.md
│   │   │   │                   │   ├── tts.md
│   │   │   │                   │   ├── vision.md
│   │   │   │                   │   ├── voice-mode.md
│   │   │   │                   │   ├── web-dashboard.md
│   │   │   │                   │   ├── web-search.md
│   │   │   │                   │   └── x-search.md
│   │   │   │                   ├── messaging/
│   │   │   │                   │   ├── bluebubbles.md
│   │   │   │                   │   ├── dingtalk.md
│   │   │   │                   │   ├── discord.md
│   │   │   │                   │   ├── email.md
│   │   │   │                   │   ├── feishu.md
│   │   │   │                   │   ├── google_chat.md
│   │   │   │                   │   ├── homeassistant.md
│   │   │   │                   │   ├── index.md
│   │   │   │                   │   ├── line.md
│   │   │   │                   │   ├── matrix.md
│   │   │   │                   │   ├── mattermost.md
│   │   │   │                   │   ├── msgraph-webhook.md
│   │   │   │                   │   ├── ntfy.md
│   │   │   │                   │   ├── open-webui.md
│   │   │   │                   │   ├── qqbot.md
│   │   │   │                   │   ├── signal.md
│   │   │   │                   │   ├── simplex.md
│   │   │   │                   │   ├── slack.md
│   │   │   │                   │   ├── sms.md
│   │   │   │                   │   ├── teams-meetings.md
│   │   │   │                   │   ├── teams.md
│   │   │   │                   │   ├── telegram.md
│   │   │   │                   │   ├── webhooks.md
│   │   │   │                   │   ├── wecom-callback.md
│   │   │   │                   │   ├── wecom.md
│   │   │   │                   │   ├── weixin.md
│   │   │   │                   │   ├── whatsapp.md
│   │   │   │                   │   └── yuanbao.md
│   │   │   │                   ├── secrets/
│   │   │   │                   │   ├── bitwarden.md
│   │   │   │                   │   └── index.md
│   │   │   │                   ├── skills/
│   │   │   │                   │   ├── bundled/
│   │   │   │                   │   │   ├── apple/
│   │   │   │                   │   │   │   ├── apple-apple-notes.md
│   │   │   │                   │   │   │   ├── apple-apple-reminders.md
│   │   │   │                   │   │   │   ├── apple-findmy.md
│   │   │   │                   │   │   │   ├── apple-imessage.md
│   │   │   │                   │   │   │   └── apple-macos-computer-use.md
│   │   │   │                   │   │   ├── autonomous-ai-agents/
│   │   │   │                   │   │   │   ├── autonomous-ai-agents-claude-code.md
│   │   │   │                   │   │   │   ├── autonomous-ai-agents-codex.md
│   │   │   │                   │   │   │   ├── autonomous-ai-agents-hermes-agent.md
│   │   │   │                   │   │   │   └── autonomous-ai-agents-opencode.md
│   │   │   │                   │   │   ├── creative/
│   │   │   │                   │   │   │   ├── creative-architecture-diagram.md
│   │   │   │                   │   │   │   ├── creative-ascii-art.md
│   │   │   │                   │   │   │   ├── creative-ascii-video.md
│   │   │   │                   │   │   │   ├── creative-baoyu-infographic.md
│   │   │   │                   │   │   │   ├── creative-claude-design.md
│   │   │   │                   │   │   │   ├── creative-comfyui.md
│   │   │   │                   │   │   │   ├── creative-design-md.md
│   │   │   │                   │   │   │   ├── creative-excalidraw.md
│   │   │   │                   │   │   │   ├── creative-humanizer.md
│   │   │   │                   │   │   │   ├── creative-manim-video.md
│   │   │   │                   │   │   │   ├── creative-p5js.md
│   │   │   │                   │   │   │   ├── creative-popular-web-designs.md
│   │   │   │                   │   │   │   ├── creative-pretext.md
│   │   │   │                   │   │   │   ├── creative-sketch.md
│   │   │   │                   │   │   │   ├── creative-songwriting-and-ai-music.md
│   │   │   │                   │   │   │   └── creative-touchdesigner-mcp.md
│   │   │   │                   │   │   ├── email/
│   │   │   │                   │   │   │   └── email-himalaya.md
│   │   │   │                   │   │   ├── github/
│   │   │   │                   │   │   │   ├── github-codebase-inspection.md
│   │   │   │                   │   │   │   ├── github-github-auth.md
│   │   │   │                   │   │   │   ├── github-github-code-review.md
│   │   │   │                   │   │   │   ├── github-github-issues.md
│   │   │   │                   │   │   │   ├── github-github-pr-workflow.md
│   │   │   │                   │   │   │   └── github-github-repo-management.md
│   │   │   │                   │   │   ├── media/
│   │   │   │                   │   │   │   ├── media-gif-search.md
│   │   │   │                   │   │   │   ├── media-songsee.md
│   │   │   │                   │   │   │   └── media-youtube-content.md
│   │   │   │                   │   │   ├── mlops/
│   │   │   │                   │   │   │   ├── mlops-evaluation-evaluating-llms-harness.md
│   │   │   │                   │   │   │   ├── mlops-evaluation-weights-and-biases.md
│   │   │   │                   │   │   │   ├── mlops-huggingface-hub.md
│   │   │   │                   │   │   │   ├── mlops-inference-llama-cpp.md
│   │   │   │                   │   │   │   └── mlops-inference-serving-llms-vllm.md
│   │   │   │                   │   │   ├── note-taking/
│   │   │   │                   │   │   │   └── note-taking-obsidian.md
│   │   │   │                   │   │   ├── productivity/
│   │   │   │                   │   │   │   ├── productivity-airtable.md
│   │   │   │                   │   │   │   ├── productivity-google-workspace.md
│   │   │   │                   │   │   │   ├── productivity-maps.md
│   │   │   │                   │   │   │   ├── productivity-nano-pdf.md
│   │   │   │                   │   │   │   ├── productivity-notion.md
│   │   │   │                   │   │   │   ├── productivity-ocr-and-documents.md
│   │   │   │                   │   │   │   ├── productivity-powerpoint.md
│   │   │   │                   │   │   │   └── productivity-teams-meeting-pipeline.md
│   │   │   │                   │   │   ├── research/
│   │   │   │                   │   │   │   ├── research-arxiv.md
│   │   │   │                   │   │   │   ├── research-blogwatcher.md
│   │   │   │                   │   │   │   ├── research-llm-wiki.md
│   │   │   │                   │   │   │   └── research-research-paper-writing.md
│   │   │   │                   │   │   ├── smart-home/
│   │   │   │                   │   │   │   └── smart-home-openhue.md
│   │   │   │                   │   │   ├── social-media/
│   │   │   │                   │   │   │   └── social-media-xurl.md
│   │   │   │                   │   │   └── software-development/
│   │   │   │                   │   │       ├── software-development-dogfood.md
│   │   │   │                   │   │       ├── software-development-hermes-agent-skill-authoring.md
│   │   │   │                   │   │       ├── software-development-node-inspect-debugger.md
│   │   │   │                   │   │       ├── software-development-python-debugpy.md
│   │   │   │                   │   │       ├── software-development-requesting-code-review.md
│   │   │   │                   │   │       ├── software-development-spike.md
│   │   │   │                   │   │       ├── software-development-systematic-debugging.md
│   │   │   │                   │   │       └── software-development-test-driven-development.md
│   │   │   │                   │   ├── optional/
│   │   │   │                   │   │   ├── autonomous-ai-agents/
│   │   │   │                   │   │   │   ├── autonomous-ai-agents-blackbox.md
│   │   │   │                   │   │   │   └── autonomous-ai-agents-honcho.md
│   │   │   │                   │   │   ├── blockchain/
│   │   │   │                   │   │   │   ├── blockchain-evm.md
│   │   │   │                   │   │   │   ├── blockchain-hyperliquid.md
│   │   │   │                   │   │   │   └── blockchain-solana.md
│   │   │   │                   │   │   ├── communication/
│   │   │   │                   │   │   │   └── communication-one-three-one-rule.md
│   │   │   │                   │   │   ├── creative/
│   │   │   │                   │   │   │   ├── creative-audiocraft-audio-generation.md
│   │   │   │                   │   │   │   ├── creative-concept-diagrams.md
│   │   │   │                   │   │   │   ├── creative-heartmula.md
│   │   │   │                   │   │   │   ├── creative-hyperframes.md
│   │   │   │                   │   │   │   ├── creative-kanban-video-orchestrator.md
│   │   │   │                   │   │   │   └── creative-meme-generation.md
│   │   │   │                   │   │   ├── data-science/
│   │   │   │                   │   │   │   └── data-science-jupyter-notebook.md
│   │   │   │                   │   │   ├── devops/
│   │   │   │                   │   │   │   ├── devops-docker-management.md
│   │   │   │                   │   │   │   ├── devops-inference-sh-cli.md
│   │   │   │                   │   │   │   ├── devops-pinggy-tunnel.md
│   │   │   │                   │   │   │   └── devops-watchers.md
│   │   │   │                   │   │   ├── dogfood/
│   │   │   │                   │   │   │   └── dogfood-adversarial-ux-test.md
│   │   │   │                   │   │   ├── email/
│   │   │   │                   │   │   │   └── email-agentmail.md
│   │   │   │                   │   │   ├── finance/
│   │   │   │                   │   │   │   ├── finance-3-statement-model.md
│   │   │   │                   │   │   │   ├── finance-comps-analysis.md
│   │   │   │                   │   │   │   ├── finance-dcf-model.md
│   │   │   │                   │   │   │   ├── finance-excel-author.md
│   │   │   │                   │   │   │   ├── finance-lbo-model.md
│   │   │   │                   │   │   │   ├── finance-merger-model.md
│   │   │   │                   │   │   │   ├── finance-polymarket.md
│   │   │   │                   │   │   │   ├── finance-pptx-author.md
│   │   │   │                   │   │   │   └── finance-stocks.md
│   │   │   │                   │   │   ├── health/
│   │   │   │                   │   │   │   ├── health-fitness-nutrition.md
│   │   │   │                   │   │   │   └── health-neuroskill-bci.md
│   │   │   │                   │   │   ├── mcp/
│   │   │   │                   │   │   │   ├── mcp-fastmcp.md
│   │   │   │                   │   │   │   └── mcp-mcporter.md
│   │   │   │                   │   │   ├── migration/
│   │   │   │                   │   │   │   └── migration-openclaw-migration.md
│   │   │   │                   │   │   ├── mlops/
│   │   │   │                   │   │   │   ├── mlops-accelerate.md
│   │   │   │                   │   │   │   ├── mlops-chroma.md
│   │   │   │                   │   │   │   ├── mlops-clip.md
│   │   │   │                   │   │   │   ├── mlops-faiss.md
│   │   │   │                   │   │   │   ├── mlops-flash-attention.md
│   │   │   │                   │   │   │   ├── mlops-guidance.md
│   │   │   │                   │   │   │   ├── mlops-huggingface-tokenizers.md
│   │   │   │                   │   │   │   ├── mlops-inference-outlines.md
│   │   │   │                   │   │   │   ├── mlops-instructor.md
│   │   │   │                   │   │   │   ├── mlops-lambda-labs.md
│   │   │   │                   │   │   │   ├── mlops-llava.md
│   │   │   │                   │   │   │   ├── mlops-modal.md
│   │   │   │                   │   │   │   ├── mlops-models-segment-anything-model.md
│   │   │   │                   │   │   │   ├── mlops-nemo-curator.md
│   │   │   │                   │   │   │   ├── mlops-peft.md
│   │   │   │                   │   │   │   ├── mlops-pinecone.md
│   │   │   │                   │   │   │   ├── mlops-pytorch-fsdp.md
│   │   │   │                   │   │   │   ├── mlops-pytorch-lightning.md
│   │   │   │                   │   │   │   ├── mlops-qdrant.md
│   │   │   │                   │   │   │   ├── mlops-saelens.md
│   │   │   │                   │   │   │   ├── mlops-simpo.md
│   │   │   │                   │   │   │   ├── mlops-slime.md
│   │   │   │                   │   │   │   ├── mlops-stable-diffusion.md
│   │   │   │                   │   │   │   ├── mlops-tensorrt-llm.md
│   │   │   │                   │   │   │   ├── mlops-torchtitan.md
│   │   │   │                   │   │   │   ├── mlops-training-axolotl.md
│   │   │   │                   │   │   │   ├── mlops-training-trl-fine-tuning.md
│   │   │   │                   │   │   │   ├── mlops-training-unsloth.md
│   │   │   │                   │   │   │   └── mlops-whisper.md
│   │   │   │                   │   │   ├── productivity/
│   │   │   │                   │   │   │   ├── productivity-canvas.md
│   │   │   │                   │   │   │   ├── productivity-here-now.md
│   │   │   │                   │   │   │   ├── productivity-memento-flashcards.md
│   │   │   │                   │   │   │   ├── productivity-shop.md
│   │   │   │                   │   │   │   ├── productivity-shopify.md
│   │   │   │                   │   │   │   ├── productivity-siyuan.md
│   │   │   │                   │   │   │   └── productivity-telephony.md
│   │   │   │                   │   │   ├── research/
│   │   │   │                   │   │   │   ├── research-bioinformatics.md
│   │   │   │                   │   │   │   ├── research-darwinian-evolver.md
│   │   │   │                   │   │   │   ├── research-domain-intel.md
│   │   │   │                   │   │   │   ├── research-drug-discovery.md
│   │   │   │                   │   │   │   ├── research-duckduckgo-search.md
│   │   │   │                   │   │   │   ├── research-gitnexus-explorer.md
│   │   │   │                   │   │   │   ├── research-osint-investigation.md
│   │   │   │                   │   │   │   ├── research-parallel-cli.md
│   │   │   │                   │   │   │   ├── research-qmd.md
│   │   │   │                   │   │   │   ├── research-scrapling.md
│   │   │   │                   │   │   │   └── research-searxng-search.md
│   │   │   │                   │   │   ├── security/
│   │   │   │                   │   │   │   ├── security-1password.md
│   │   │   │                   │   │   │   ├── security-oss-forensics.md
│   │   │   │                   │   │   │   └── security-sherlock.md
│   │   │   │                   │   │   ├── software-development/
│   │   │   │                   │   │   │   └── software-development-rest-graphql-debug.md
│   │   │   │                   │   │   ├── web-development/
│   │   │   │                   │   │   │   └── web-development-page-agent.md
│   │   │   │                   │   │   └── yuanbao/
│   │   │   │                   │   │       └── yuanbao-yuanbao.md
│   │   │   │                   │   └── google-workspace.md
│   │   │   │                   ├── checkpoints-and-rollback.md
│   │   │   │                   ├── cli.md
│   │   │   │                   ├── configuration.md
│   │   │   │                   ├── configuring-models.md
│   │   │   │                   ├── docker.md
│   │   │   │                   ├── git-worktrees.md
│   │   │   │                   ├── profile-distributions.md
│   │   │   │                   ├── profiles.md
│   │   │   │                   ├── security.md
│   │   │   │                   ├── sessions.md
│   │   │   │                   ├── tui.md
│   │   │   │                   ├── windows-native.md
│   │   │   │                   └── windows-wsl-quickstart.md
│   │   │   └── README.md
│   │   ├── AGENTS.md
│   │   ├── CONTRIBUTING.es.md
│   │   ├── CONTRIBUTING.md
│   │   ├── README.es.md
│   │   ├── README.md
│   │   ├── README.ur-pk.md
│   │   ├── README.zh-CN.md
│   │   ├── SECURITY.es.md
│   │   ├── SECURITY.md
│   │   ├── SOUL.md
│   │   └── constraints-termux.txt
│   ├── logs/
│   │   └── curator/
│   │       ├── 20260826-230327/
│   │       │   └── REPORT.md
│   │       └── 20260902-232246/
│   │           └── REPORT.md
│   ├── memories/
│   │   ├── MEMORY.md
│   │   └── USER.md
│   ├── pastes/
│   │   ├── paste_1_085548.txt
│   │   ├── paste_1_114924.txt
│   │   ├── paste_1_121838.txt
│   │   ├── paste_1_123131.txt
│   │   ├── paste_1_140835.txt
│   │   ├── paste_1_142645.txt
│   │   ├── paste_1_154207.txt
│   │   ├── paste_1_184541.txt
│   │   ├── paste_1_221905.txt
│   │   ├── paste_2_085816.txt
│   │   ├── paste_2_160157.txt
│   │   ├── paste_2_190802.txt
│   │   ├── paste_2_202714.txt
│   │   ├── paste_2_231234.txt
│   │   ├── paste_3_001649.txt
│   │   ├── paste_3_160202.txt
│   │   ├── paste_3_213322.txt
│   │   ├── paste_3_220842.txt
│   │   ├── paste_4_010612.txt
│   │   ├── paste_4_214622.txt
│   │   ├── paste_4_224433.txt
│   │   ├── paste_5_214920.txt
│   │   ├── paste_5_230244.txt
│   │   ├── paste_6_215412.txt
│   │   └── paste_7_215434.txt
│   ├── plans/
│   │   ├── 2026-06-26_093000-paos-remaining-work.md
│   │   ├── 2026-06-26_103000-paos-v2-enhancements.md
│   │   ├── 2026-06-26_120000-paos-enhancements-234.md
│   │   └── 2026-06-26_122000-brainstorm-implementation.md
│   ├── skills/
│   │   ├── agent-gateway-provider-config/
│   │   │   ├── references/
│   │   │   │   └── omniroute-gateway.md
│   │   │   └── SKILL.md
│   │   ├── apple/
│   │   │   ├── apple-notes/
│   │   │   │   └── SKILL.md
│   │   │   ├── apple-reminders/
│   │   │   │   └── SKILL.md
│   │   │   ├── findmy/
│   │   │   │   └── SKILL.md
│   │   │   ├── imessage/
│   │   │   │   └── SKILL.md
│   │   │   ├── macos-computer-use/
│   │   │   │   └── SKILL.md
│   │   │   └── DESCRIPTION.md
│   │   ├── autonomous-ai-agents/
│   │   │   ├── hermes-agent/
│   │   │   │   ├── references/
│   │   │   │   │   ├── background-systems.md
│   │   │   │   │   ├── cli-reference.md
│   │   │   │   │   ├── configuration.md
│   │   │   │   │   ├── contributor-guide.md
│   │   │   │   │   ├── delegate-task-concurrency-diagnosis.md
│   │   │   │   │   ├── desktop-plugins.md
│   │   │   │   │   ├── native-mcp.md
│   │   │   │   │   ├── petdex.md
│   │   │   │   │   ├── portal-auth-for-third-party-apps.md
│   │   │   │   │   ├── project-context-files.md
│   │   │   │   │   ├── providers-and-models.md
│   │   │   │   │   ├── security-privacy.md
│   │   │   │   │   ├── slash-commands.md
│   │   │   │   │   ├── themes.md
│   │   │   │   │   ├── troubleshooting.md
│   │   │   │   │   ├── tui-widgets.md
│   │   │   │   │   ├── webhooks.md
│   │   │   │   │   └── windows-quirks.md
│   │   │   │   └── SKILL.md
│   │   │   ├── merge-reconciler/
│   │   │   │   └── SKILL.md
│   │   │   └── DESCRIPTION.md
│   │   ├── creative/
│   │   │   ├── archify/
│   │   │   │   ├── archify/
│   │   │   │   │   ├── brand-marks/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── authoring-contract.md
│   │   │   │   │   │   ├── brand-marks.md
│   │   │   │   │   │   ├── delivery-contract.md
│   │   │   │   │   │   └── viewer-runtime.md
│   │   │   │   │   ├── renderers/
│   │   │   │   │   │   ├── dataflow/
│   │   │   │   │   │   │   └── README.md
│   │   │   │   │   │   ├── lifecycle/
│   │   │   │   │   │   │   └── README.md
│   │   │   │   │   │   ├── sequence/
│   │   │   │   │   │   │   └── README.md
│   │   │   │   │   │   └── workflow/
│   │   │   │   │   │       └── README.md
│   │   │   │   │   ├── schemas/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── THIRD_PARTY_NOTICES.md
│   │   │   │   │   └── UPSTREAM_SKILL.md
│   │   │   │   ├── benchmarks/
│   │   │   │   │   └── ordinary-model-floor/
│   │   │   │   │       ├── prompts/
│   │   │   │   │       │   ├── agent-run.lifecycle.md
│   │   │   │   │       │   ├── agent-tool-call.workflow.md
│   │   │   │   │       │   ├── cache-miss.sequence.md
│   │   │   │   │       │   ├── product-analytics.dataflow.md
│   │   │   │   │       │   └── web-runtime.architecture.md
│   │   │   │   │       └── README.md
│   │   │   │   ├── docs/
│   │   │   │   │   ├── issue-52-visual-evidence/
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── research/
│   │   │   │   │   │   └── skill-plugin-update-reminder-market-design.md
│   │   │   │   │   ├── article-archify.md
│   │   │   │   │   ├── artifact-install-v2-measurement.md
│   │   │   │   │   ├── authoring-cookbook.md
│   │   │   │   │   ├── authoring-cookbook.zh-CN.md
│   │   │   │   │   ├── cursor-acceptance-2026-07.md
│   │   │   │   │   ├── deployment-ownership-profile-acceptance-2026-07-23.md
│   │   │   │   │   ├── research-architecture-delta-pr-proof-2026-07-23.md
│   │   │   │   │   ├── research-authored-reachability-2026-07-23.md
│   │   │   │   │   ├── research-cursor-onboarding-2026-07.md
│   │   │   │   │   ├── research-editorial-preset-2026-07-23.md
│   │   │   │   │   ├── research-evidence-beacons-2026-07-23.md
│   │   │   │   │   ├── research-fireworks-tech-graph.md
│   │   │   │   │   ├── research-next-delight-slice-2026-07-22.md
│   │   │   │   │   ├── research-next-stability-delight-2026-07-23.md
│   │   │   │   │   ├── research-next-stability-delight-slice-2026-07-23.md
│   │   │   │   │   ├── research-next-stability-growth-slice-2026-07.md
│   │   │   │   │   ├── research-reach-share-card-2026-07-23.md
│   │   │   │   │   ├── research-repo-evidence-passport-2026-07-23.md
│   │   │   │   │   ├── research-trustworthy-first-diagram-slice.md
│   │   │   │   │   ├── research-visual-evolution-round-10.md
│   │   │   │   │   ├── research-visual-evolution-round-11.md
│   │   │   │   │   ├── research-visual-evolution-round-12.md
│   │   │   │   │   ├── research-visual-evolution-round-13.md
│   │   │   │   │   ├── research-visual-evolution-round-14.md
│   │   │   │   │   ├── research-visual-evolution-round-15.md
│   │   │   │   │   ├── research-visual-evolution-round-16.md
│   │   │   │   │   ├── research-visual-evolution-round-17.md
│   │   │   │   │   ├── research-visual-evolution-round-18.md
│   │   │   │   │   ├── research-visual-evolution-round-19.md
│   │   │   │   │   ├── research-visual-evolution-round-2.md
│   │   │   │   │   ├── research-visual-evolution-round-20.md
│   │   │   │   │   ├── research-visual-evolution-round-21.md
│   │   │   │   │   ├── research-visual-evolution-round-22.md
│   │   │   │   │   ├── research-visual-evolution-round-23.md
│   │   │   │   │   ├── research-visual-evolution-round-24.md
│   │   │   │   │   ├── research-visual-evolution-round-25.md
│   │   │   │   │   ├── research-visual-evolution-round-26.md
│   │   │   │   │   ├── research-visual-evolution-round-27.md
│   │   │   │   │   ├── research-visual-evolution-round-28.md
│   │   │   │   │   ├── research-visual-evolution-round-29.md
│   │   │   │   │   ├── research-visual-evolution-round-3.md
│   │   │   │   │   ├── research-visual-evolution-round-30.md
│   │   │   │   │   ├── research-visual-evolution-round-31.md
│   │   │   │   │   ├── research-visual-evolution-round-32.md
│   │   │   │   │   ├── research-visual-evolution-round-33.md
│   │   │   │   │   ├── research-visual-evolution-round-34.md
│   │   │   │   │   ├── research-visual-evolution-round-35.md
│   │   │   │   │   ├── research-visual-evolution-round-36.md
│   │   │   │   │   ├── research-visual-evolution-round-37.md
│   │   │   │   │   ├── research-visual-evolution-round-38.md
│   │   │   │   │   ├── research-visual-evolution-round-39.md
│   │   │   │   │   ├── research-visual-evolution-round-4.md
│   │   │   │   │   ├── research-visual-evolution-round-40.md
│   │   │   │   │   ├── research-visual-evolution-round-41.md
│   │   │   │   │   ├── research-visual-evolution-round-42.md
│   │   │   │   │   ├── research-visual-evolution-round-43.md
│   │   │   │   │   ├── research-visual-evolution-round-44.md
│   │   │   │   │   ├── research-visual-evolution-round-45.md
│   │   │   │   │   ├── research-visual-evolution-round-46.md
│   │   │   │   │   ├── research-visual-evolution-round-47.md
│   │   │   │   │   ├── research-visual-evolution-round-48.md
│   │   │   │   │   ├── research-visual-evolution-round-49.md
│   │   │   │   │   ├── research-visual-evolution-round-5.md
│   │   │   │   │   ├── research-visual-evolution-round-6.md
│   │   │   │   │   ├── research-visual-evolution-round-7.md
│   │   │   │   │   ├── research-visual-evolution-round-8.md
│   │   │   │   │   ├── research-visual-evolution-round-9.md
│   │   │   │   │   ├── research-visual-style-picker-2026-07-23.md
│   │   │   │   │   └── skill-embedded-optional-update-notifier-design.md
│   │   │   │   ├── experiments/
│   │   │   │   │   ├── v3-mermaid-validation/
│   │   │   │   │   │   ├── screenshots/
│   │   │   │   │   │   │   └── manifest.txt
│   │   │   │   │   │   ├── INDEX.md
│   │   │   │   │   │   └── RESULT.md
│   │   │   │   │   └── visual-evolution/
│   │   │   │   │       └── DECISION-MAP.md
│   │   │   │   ├── integrations/
│   │   │   │   │   └── deepseek-harness/
│   │   │   │   │       └── README.md
│   │   │   │   ├── CHANGELOG.md
│   │   │   │   ├── CONTRIBUTING.md
│   │   │   │   ├── DESIGN.md
│   │   │   │   ├── PRODUCT.md
│   │   │   │   ├── README.md
│   │   │   │   ├── README_EN.md
│   │   │   │   ├── README_ZH.md
│   │   │   │   ├── ROADMAP.md
│   │   │   │   ├── SECURITY.md
│   │   │   │   ├── SKILL.md
│   │   │   │   └── THIRD_PARTY_NOTICES.md
│   │   │   ├── architecture-diagram/
│   │   │   │   └── SKILL.md
│   │   │   ├── diagram-comparison/
│   │   │   │   ├── references/
│   │   │   │   │   └── paos-architecture-example.md
│   │   │   │   └── SKILL.md
│   │   │   └── DESCRIPTION.md
│   │   ├── data-science/
│   │   │   └── DESCRIPTION.md
│   │   ├── devops/
│   │   │   ├── docker-troubleshooting/
│   │   │   │   ├── references/
│   │   │   │   │   └── phantom-cache-investigation.md
│   │   │   │   └── SKILL.md
│   │   │   └── sdlc-review/
│   │   │       └── SKILL.md
│   │   ├── drawio-skill/
│   │   │   ├── README.md
│   │   │   ├── SKILL.md
│   │   │   └── skill-card.md
│   │   ├── email/
│   │   │   └── DESCRIPTION.md
│   │   ├── github/
│   │   │   ├── github-auth/
│   │   │   │   └── SKILL.md
│   │   │   ├── github-code-review/
│   │   │   │   ├── references/
│   │   │   │   │   └── review-output-template.md
│   │   │   │   └── SKILL.md
│   │   │   ├── github-issue-to-pr/
│   │   │   │   └── SKILL.md
│   │   │   ├── github-issues/
│   │   │   │   ├── templates/
│   │   │   │   │   ├── bug-report.md
│   │   │   │   │   └── feature-request.md
│   │   │   │   └── SKILL.md
│   │   │   ├── github-pr-workflow/
│   │   │   │   ├── references/
│   │   │   │   │   ├── ci-troubleshooting.md
│   │   │   │   │   └── conventional-commits.md
│   │   │   │   ├── templates/
│   │   │   │   │   ├── pr-body-bugfix.md
│   │   │   │   │   └── pr-body-feature.md
│   │   │   │   └── SKILL.md
│   │   │   ├── github-repo-management/
│   │   │   │   ├── references/
│   │   │   │   │   └── github-api-cheatsheet.md
│   │   │   │   └── SKILL.md
│   │   │   └── DESCRIPTION.md
│   │   ├── media/
│   │   │   └── DESCRIPTION.md
│   │   ├── messaging/
│   │   │   └── telegram-messaging/
│   │   │       ├── references/
│   │   │       │   └── file-delivery-workflow.md
│   │   │       └── SKILL.md
│   │   ├── mlops/
│   │   │   ├── evaluation/
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── inference/
│   │   │   │   ├── llama-cpp/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── advanced-usage.md
│   │   │   │   │   │   ├── hub-discovery.md
│   │   │   │   │   │   ├── optimization.md
│   │   │   │   │   │   ├── quantization.md
│   │   │   │   │   │   ├── server.md
│   │   │   │   │   │   └── troubleshooting.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── models/
│   │   │   │   ├── segment-anything/
│   │   │   │   │   ├── references/
│   │   │   │   │   │   ├── advanced-usage.md
│   │   │   │   │   │   └── troubleshooting.md
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── DESCRIPTION.md
│   │   │   └── DESCRIPTION.md
│   │   ├── note-taking/
│   │   │   └── DESCRIPTION.md
│   │   ├── paos/
│   │   │   ├── paos-agent-lifecycle/
│   │   │   │   └── SKILL.md
│   │   │   ├── paos-agent-management/
│   │   │   │   └── SKILL.md
│   │   │   ├── paos-dashboard-backend/
│   │   │   │   ├── references/
│   │   │   │   │   └── pipeline-visualization-fixes.md
│   │   │   │   └── SKILL.md
│   │   │   ├── paos-pipeline-commands/
│   │   │   │   ├── references/
│   │   │   │   │   ├── dashboard-integration-patterns.md
│   │   │   │   │   └── telegram-bot-patterns.md
│   │   │   │   └── SKILL.md
│   │   │   ├── paos-pipelines/
│   │   │   │   ├── references/
│   │   │   │   │   ├── dashboard-pages.md
│   │   │   │   │   ├── execute-modal-prompt-editing.md
│   │   │   │   │   ├── inbox-to-pipeline.md
│   │   │   │   │   ├── intervene-flow.md
│   │   │   │   │   ├── meta-phases-format.md
│   │   │   │   │   ├── paos-architecture.md
│   │   │   │   │   ├── pipeline-json-enrichment.md
│   │   │   │   │   ├── pipeline-visualization-implementation.md
│   │   │   │   │   ├── queue-system.md
│   │   │   │   │   ├── settings-and-theme.md
│   │   │   │   │   ├── theme-presets.md
│   │   │   │   │   └── visual-settings.md
│   │   │   │   └── SKILL.md
│   │   │   └── paos-tasks/
│   │   │       ├── references/
│   │   │       │   └── task-system-implementation.md
│   │   │       └── SKILL.md
│   │   ├── paos-pipeline-protocol/
│   │   │   ├── references/
│   │   │   │   ├── accordion-ux.md
│   │   │   │   ├── dashboard-dev.md
│   │   │   │   ├── dashboard-pipeline-ui.md
│   │   │   │   ├── queue-system.md
│   │   │   │   └── task-markdown-format.md
│   │   │   └── SKILL.md
│   │   ├── productivity/
│   │   │   ├── document-to-action-items/
│   │   │   │   └── SKILL.md
│   │   │   ├── notion/
│   │   │   │   ├── references/
│   │   │   │   │   └── block-types.md
│   │   │   │   └── SKILL.md
│   │   │   ├── ocr-and-documents/
│   │   │   │   └── DESCRIPTION.md
│   │   │   ├── session-librarian/
│   │   │   │   └── SKILL.md
│   │   │   ├── skills-audit/
│   │   │   │   ├── references/
│   │   │   │   │   ├── audit-2026-09-04.md
│   │   │   │   │   └── mcp-audit-2026-09-04.md
│   │   │   │   └── SKILL.md
│   │   │   ├── xlsx/
│   │   │   │   ├── references/
│   │   │   │   │   └── restructuring.md
│   │   │   │   └── SKILL.md
│   │   │   └── DESCRIPTION.md
│   │   ├── research/
│   │   │   ├── llm-wiki/
│   │   │   │   └── SKILL.md
│   │   │   └── DESCRIPTION.md
│   │   ├── smart-home/
│   │   │   └── DESCRIPTION.md
│   │   ├── social-media/
│   │   │   └── DESCRIPTION.md
│   │   ├── software-development/
│   │   │   ├── codebase-inspection/
│   │   │   │   └── SKILL.md
│   │   │   ├── github/
│   │   │   │   ├── references/
│   │   │   │   │   ├── auth.md
│   │   │   │   │   ├── ci-troubleshooting.md
│   │   │   │   │   ├── code-review.md
│   │   │   │   │   ├── conventional-commits.md
│   │   │   │   │   ├── github-api-cheatsheet.md
│   │   │   │   │   ├── issue-to-pr.md
│   │   │   │   │   ├── issues.md
│   │   │   │   │   ├── pr-workflow.md
│   │   │   │   │   ├── repo-management.md
│   │   │   │   │   └── review-output-template.md
│   │   │   │   ├── templates/
│   │   │   │   │   ├── bug-report.md
│   │   │   │   │   ├── feature-request.md
│   │   │   │   │   ├── pr-body-bugfix.md
│   │   │   │   │   └── pr-body-feature.md
│   │   │   │   └── SKILL.md
│   │   │   ├── hermes-agent-skill-authoring/
│   │   │   │   └── SKILL.md
│   │   │   ├── inspecting-hermes-desktop-dom/
│   │   │   │   └── SKILL.md
│   │   │   ├── mcp-server-dev/
│   │   │   │   ├── references/
│   │   │   │   │   └── search-server-pattern.md
│   │   │   │   └── SKILL.md
│   │   │   ├── node-inspect-debugger/
│   │   │   │   └── SKILL.md
│   │   │   ├── paos-code-benchmark/
│   │   │   │   ├── references/
│   │   │   │   │   ├── gap-closure-patterns.md
│   │   │   │   │   └── telegram-delivery.md
│   │   │   │   └── SKILL.md
│   │   │   ├── paos-dashboard-dev/
│   │   │   │   ├── references/
│   │   │   │   │   ├── 21st-dev-free-workflow.md
│   │   │   │   │   ├── 21st-dev-prompt-creation.md
│   │   │   │   │   ├── active-project.md
│   │   │   │   │   ├── api-security-middleware.md
│   │   │   │   │   ├── ask-before-implementing.md
│   │   │   │   │   ├── dark-mode-accessibility.md
│   │   │   │   │   ├── dashboard-ui-patterns.md
│   │   │   │   │   ├── diff-viewer-pattern.md
│   │   │   │   │   ├── environment-path-settings.md
│   │   │   │   │   ├── events-page-active-project.md
│   │   │   │   │   ├── events-system.md
│   │   │   │   │   ├── flow-builder-execution-cascade.md
│   │   │   │   │   ├── flow-builder-execution.md
│   │   │   │   │   ├── flow-builder-visual.md
│   │   │   │   │   ├── flow-builder.md
│   │   │   │   │   ├── handoff-edit.md
│   │   │   │   │   ├── import-system.md
│   │   │   │   │   ├── inbox-email-layout.md
│   │   │   │   │   ├── inbox-merge-pattern.md
│   │   │   │   │   ├── inbox-yaml-parsing.md
│   │   │   │   │   ├── ledger-sort-pattern.md
│   │   │   │   │   ├── ledger-view-all-pattern.md
│   │   │   │   │   ├── new-dashboard-features.md
│   │   │   │   │   ├── nextjs-hydration-debug.md
│   │   │   │   │   ├── per-project-filtering.md
│   │   │   │   │   ├── pipeline-artifact-enrichment.md
│   │   │   │   │   ├── pipeline-builder-architecture.md
│   │   │   │   │   ├── pipeline-builder-patterns.md
│   │   │   │   │   ├── pipeline-flow-builder.md
│   │   │   │   │   ├── pipeline-flow-schema.md
│   │   │   │   │   ├── playwright-responsive-audit.md
│   │   │   │   │   ├── project-auto-init.md
│   │   │   │   │   ├── react-flow-integration.md
│   │   │   │   │   ├── real-time-task-tracking.md
│   │   │   │   │   ├── responsive-design.md
│   │   │   │   │   ├── responsive-patterns.md
│   │   │   │   │   ├── scoped-agents.md
│   │   │   │   │   ├── secrets-system.md
│   │   │   │   │   ├── self-contained-agent-install.md
│   │   │   │   │   ├── shadcn-migration-patterns.md
│   │   │   │   │   ├── system-monitoring-pages.md
│   │   │   │   │   ├── tab-consolidation-pattern.md
│   │   │   │   │   ├── tailscale-serve-dashboard.md
│   │   │   │   │   ├── task-approval-workflow.md
│   │   │   │   │   ├── task-progress-tracking.md
│   │   │   │   │   ├── task-queue-system.md
│   │   │   │   │   ├── tasks-system.md
│   │   │   │   │   ├── theme-presets.md
│   │   │   │   │   ├── two-tier-task-execution.md
│   │   │   │   │   ├── ui-patterns-kanban-bulk-download.md
│   │   │   │   │   ├── ui-patterns-kanban-gitview.md
│   │   │   │   │   ├── ui-patterns.md
│   │   │   │   │   ├── ux-principles.md
│   │   │   │   │   ├── vault-system.md
│   │   │   │   │   ├── view-all-events-ledger.md
│   │   │   │   │   └── workspace-system.md
│   │   │   │   └── SKILL.md
│   │   │   ├── pipeline-builder/
│   │   │   │   ├── references/
│   │   │   │   │   ├── additional-patterns.md
│   │   │   │   │   ├── code-patterns.md
│   │   │   │   │   ├── flow-status-fallback.md
│   │   │   │   │   ├── queue-cleanup.md
│   │   │   │   │   └── topological-sort.md
│   │   │   │   └── SKILL.md
│   │   │   ├── plan/
│   │   │   │   └── SKILL.md
│   │   │   ├── project-enhancement/
│   │   │   │   ├── references/
│   │   │   │   │   └── session-2026-06-26.md
│   │   │   │   └── SKILL.md
│   │   │   ├── python-debugpy/
│   │   │   │   └── SKILL.md
│   │   │   ├── requesting-code-review/
│   │   │   │   └── SKILL.md
│   │   │   ├── simplify-code/
│   │   │   │   └── SKILL.md
│   │   │   ├── spike/
│   │   │   │   └── SKILL.md
│   │   │   ├── systematic-debugging/
│   │   │   │   └── SKILL.md
│   │   │   ├── test-driven-development/
│   │   │   │   └── SKILL.md
│   │   │   └── ui-ux-pro-max/
│   │   │       ├── references/
│   │   │       │   └── interactive-canvas-patterns.md
│   │   │       └── SKILL.md
│   │   ├── system-analysis-and-design/
│   │   │   └── benchmark-audit/
│   │   │       ├── references/
│   │   │       │   ├── agents-page-21stdev-snippet.md
│   │   │       │   ├── benchmark-documents.md
│   │   │       │   └── dashboard-new-features.md
│   │   │       └── SKILL.md
│   │   ├── vps-kit/
│   │   │   └── tailscale/
│   │   │       ├── references/
│   │   │       │   └── tailscale-serve-config.md
│   │   │       └── SKILL.md
│   │   └── web/
│   │       └── DESCRIPTION.md
│   └── SOUL.md
├── knowledge/
│   ├── books/
│   │   ├── pdfs/
│   │   │   ├── 2018_dowaward-giordano.pdf
│   │   │   ├── Data Structures and Algorithms in Python [Goodrich, Tamassia  Goldwasser 2013-03-18].pdf
│   │   │   ├── Introduction to Probability by Joseph K. Blitzstein, Jessica Hwang (z-lib.org).pdf
│   │   │   ├── SSRN-id2580551.pdf
│   │   │   └── qm11k.The_.Art_.of_.Problem.Solving.Vol_.1.The_.Basics.pdf
│   │   └── README.md
│   ├── docs/
│   │   ├── Tradingview.md
│   │   ├── _agent-conventions.md
│   │   ├── notes-done.md
│   │   ├── notes.md
│   │   ├── repos.md
│   │   ├── session-protocol.md
│   │   ├── user-questions-answered.md
│   │   └── user-questions.md
│   ├── paos/
│   │   └── constitution.md
│   ├── previous-projects/
│   │   └── README.md
│   ├── questions/
│   │   ├── PAOS.md
│   │   ├── index.md
│   │   └── test-project.md
│   ├── references/
│   │   └── books.md
│   ├── srs/
│   │   ├── SRS-1-PAOS-Current-State.md
│   │   ├── SRS-1-PAOS-Current-State.pdf
│   │   ├── SRS-2-Enterprise-Agentic-AI-Harness.md
│   │   └── SRS-2-Enterprise-Agentic-AI-Harness.pdf
│   ├── templates/
│   │   └── fullstack-monorepo/
│   │       ├── ai_model/
│   │       │   └── memories/
│   │       │       ├── learnings.md
│   │       │       └── system_status.md
│   │       ├── backend/
│   │       │   └── requirements.txt
│   │       ├── diagrams/
│   │       │   └── architecture.mermaid.md
│   │       ├── docs/
│   │       │   ├── SRS.md
│   │       │   ├── implementation_plan.md
│   │       │   ├── instructions.md
│   │       │   ├── setup.md
│   │       │   ├── skills_to_use.md
│   │       │   └── walkthrough.md
│   │       ├── README.md
│   │       ├── notes-done.md
│   │       └── tasks.md
│   ├── Models and AI subs.md
│   └── my brain.md
├── logs/
│   ├── antigravity/
│   │   └── events.md
│   ├── architect/
│   │   └── events.md
│   ├── claude/
│   │   └── events.md
│   ├── codex/
│   │   └── events.md
│   ├── coordinator/
│   │   └── events.md
│   ├── developer/
│   │   └── events.md
│   ├── gemini/
│   │   └── events.md
│   ├── gitkraken/
│   │   └── events.md
│   ├── hermes-nous/
│   │   └── events.md
│   ├── inbox/
│   │   └── claude.md
│   ├── memory/
│   │   └── inbox/
│   │       └── developer/
│   │           ├── 1782148123179-pipeline-hermes-nous.md
│   │           └── 1782150308174-pipeline-opencode-developer.md
│   ├── ollama/
│   │   └── events.md
│   ├── openclaw/
│   │   └── events.md
│   ├── opencode/
│   │   └── events.md
│   ├── opencode-architect/
│   │   └── events.md
│   ├── opencode-coordinator/
│   │   └── events.md
│   ├── pipelines/
│   │   ├── AI_Workflow-PIPE_1-26-08-2026---23-34/
│   │   │   ├── phases/
│   │   │   │   ├── executor/
│   │   │   │   │   ├── IMPLEMENTATION.md
│   │   │   │   │   ├── REASONING.md
│   │   │   │   │   ├── TASKS.md
│   │   │   │   │   └── WALKTHROUGH.md
│   │   │   │   ├── planner/
│   │   │   │   │   ├── IMPLEMENTATION.md
│   │   │   │   │   ├── REASONING.md
│   │   │   │   │   ├── TASKS.md
│   │   │   │   │   └── WALKTHROUGH.md
│   │   │   │   └── verifier/
│   │   │   │       ├── IMPLEMENTATION.md
│   │   │   │       ├── REASONING.md
│   │   │   │       ├── TASKS.md
│   │   │   │       └── WALKTHROUGH.md
│   │   │   ├── PLAN.md
│   │   │   ├── TASKS.md
│   │   │   ├── VERIFICATION.md
│   │   │   └── WALKTHROUGH.md
│   │   └── PAOS/
│   │       ├── events.md
│   │       ├── handoff.md
│   │       ├── ledger.md
│   │       └── shared-context.md
│   ├── projects/
│   │   ├── PAOS/
│   │   │   └── ledger.md
│   │   ├── _template.md
│   │   └── index.md
│   ├── prompts/
│   │   └── _template.md
│   ├── shared/
│   │   ├── HANDOFF.md
│   │   ├── context.md
│   │   └── swot_audit.md
│   ├── signal/
│   │   └── events.md
│   └── global_ledger.md
├── mcp/
│   └── README.md
├── projects/
│   └── PAOS/
│       ├── tasks/
│       │   └── test-second-task.md
│       ├── events.md
│       ├── handoff.md
│       ├── ledger.md
│       └── shared-context.md
├── research/
│   ├── langchain-integration.md
│   ├── multi-machine-paos.md
│   ├── qa-audit-supplement.md
│   └── storage-comparison.md
├── skills/
│   ├── antigravity-review-loop/
│   │   ├── references/
│   │   │   ├── implementation-plan-template.md
│   │   │   ├── task-list-template.md
│   │   │   └── walkthrough-template.md
│   │   └── SKILL.md
│   ├── context7-mcp/
│   │   └── SKILL.md
│   ├── ponytail/
│   │   └── SKILL.md
│   ├── ponytail-repo/
│   │   ├── benchmarks/
│   │   │   ├── agentic/
│   │   │   │   └── README.md
│   │   │   ├── arms/
│   │   │   │   └── caveman-SKILL.md
│   │   │   ├── results/
│   │   │   │   ├── 2026-06-12-caveman-vs-ponytail.md
│   │   │   │   ├── 2026-06-12-v4-hardening-vs-caveman.md
│   │   │   │   ├── 2026-06-15-llama3.2-local.md
│   │   │   │   ├── 2026-06-16-correctness-gate-fix.md
│   │   │   │   ├── 2026-06-16-robustness-audit.md
│   │   │   │   ├── 2026-06-17-agentic-safety.md
│   │   │   │   ├── 2026-06-17-cost-verification.md
│   │   │   │   └── 2026-06-18-agentic.md
│   │   │   └── README.md
│   │   ├── docs/
│   │   │   ├── agent-portability.md
│   │   │   └── platform-native.md
│   │   ├── examples/
│   │   │   ├── README.md
│   │   │   ├── csv-sum.md
│   │   │   ├── debounce.md
│   │   │   ├── deep-clone.md
│   │   │   ├── email-validation.md
│   │   │   ├── group-by.md
│   │   │   ├── infinite-scroll.md
│   │   │   ├── modal-dialog.md
│   │   │   ├── number-formatting.md
│   │   │   ├── rate-limit.md
│   │   │   ├── react-countdown.md
│   │   │   └── url-params.md
│   │   ├── ponytail-mcp/
│   │   │   └── README.md
│   │   ├── skills/
│   │   │   ├── ponytail/
│   │   │   │   └── SKILL.md
│   │   │   ├── ponytail-audit/
│   │   │   │   └── SKILL.md
│   │   │   ├── ponytail-debt/
│   │   │   │   └── SKILL.md
│   │   │   ├── ponytail-gain/
│   │   │   │   └── SKILL.md
│   │   │   ├── ponytail-help/
│   │   │   │   └── SKILL.md
│   │   │   └── ponytail-review/
│   │   │       └── SKILL.md
│   │   ├── AGENTS.md
│   │   ├── README.es.md
│   │   └── README.md
│   ├── system-analysis-and-design/
│   │   ├── assets/
│   │   │   └── elicitation-survey.md
│   │   ├── references/
│   │   │   ├── benchmark-dashboard.md
│   │   │   ├── coding-principles-benchmark.md
│   │   │   ├── coding-principles.md
│   │   │   ├── diagram-cookbook.md
│   │   │   ├── elicitation-workflow.md
│   │   │   ├── example-reachdog-srs.md
│   │   │   ├── example-reachdog-srs.pdf
│   │   │   ├── paos-code-audit-framework.md
│   │   │   ├── pdf-build-guide.md
│   │   │   ├── srs-template.md
│   │   │   └── swot-benchmark.md
│   │   ├── AGENTS.md
│   │   └── SKILL.md
│   └── INDEX.md
├── vault/
│   ├── chats/
│   │   └── _template.md
│   ├── daily/
│   │   └── 2026-06-22.md
│   ├── projects/
│   │   └── projects.md
│   └── dashboard.md
├── workflows/
│   └── workflow.md
├── .claude.md
├── AGENTS.md
├── ANTIGRAVITY.md
├── CLAUDE.md
├── Coding-Principles-Benchmark.md
├── Coding-Principles.md
├── DOCUMENT_INDEX.md
├── GEMINI.md
├── PAOS-Entities.md
├── PAOS-ULTIMATE-BRAINSTORM.md
├── PIPELINES.md
├── README.md
├── TASKS.md
├── projects.md
├── user-questions.md
├── user.md
├── walkthrough.md
└── workflow.md
```

## 📄 Root-Level Documents

- [AGENT/CONFIG] `.claude.md`  .md
- [USER] `AGENTS.md`  .md
- [USER] `ANTIGRAVITY.md`  .md
- [USER] `CLAUDE.md`  .md
- [USER] `Coding-Principles-Benchmark.md`  .md
- [USER] `Coding-Principles.md`  .md
- [AGENT/CONFIG] `DOCUMENT_INDEX.md`  .md
- [USER] `GEMINI.md`  .md
- [USER] `PAOS-Entities.md`  .md
- [USER] `PAOS-ULTIMATE-BRAINSTORM.md`  .md
- [USER] `PIPELINES.md`  .md
- [USER] `README.md`  .md
- [USER] `TASKS.md`  .md
- [USER] `projects.md`  .md
- [USER] `user-questions.md`  .md
- [USER] `user.md`  .md
- [USER] `walkthrough.md`  .md
- [USER] `workflow.md`  .md

## 📁 `agents/`
__20 document(s)__

### 📂 `antigravity/`

- [AGENT] `soul.md`  .md

### 📂 `antigravity-cli/`

- [AGENT] `soul.md`  .md

### 📂 `architect/`

- [AGENT] `log.md`  .md
- [AGENT] `soul.md`  .md

- [AGENT] `architect.md`  .md
- [AGENT] `codex.md`  .md
- [AGENT] `coordinator.md`  .md
- [AGENT] `developer.md`  .md
- [AGENT] `gemini.md`  .md
- [AGENT] `profiler.md`  .md

### 📂 `codex/`

- [AGENT] `soul.md`  .md

### 📂 `coordinator/`

- [AGENT] `log.md`  .md
- [AGENT] `soul.md`  .md

### 📂 `developer/`

- [AGENT] `soul.md`  .md

### 📂 `gemini/`

- [AGENT] `soul.md`  .md

### 📂 `hermes-nous/`

- [AGENT] `soul.md`  .md

### 📂 `openclaw/`

- [AGENT] `soul.md`  .md

### 📂 `profiler/`

- [AGENT] `log.md`  .md
- [AGENT] `soul.md`  .md

### 📂 `signal/`

- [AGENT] `soul.md`  .md


## 📁 `benchmarks/`
__34 document(s)__

### 📂 `Benchmark_1_25-06-2026---21-00/`

- [AGENT] `README.md`  .md
- [AGENT] `SRS-as-is.md`  .md
- [AGENT] `SRS-to-be.md`  .md
- [AGENT] `SWOT-Benchmark.md`  .md
- [AGENT] `full-audit.md`  .md
- [AGENT] `gaps.md`  .md
- [AGENT] `implementation-plan.md`  .md
- [AGENT] `implementation.md`  .md

### 📂 `Benchmark_1_25-06-2026---21-00/gaps/`

- [AGENT] `gap-01-no-cycle-detection.md`  .md
- [AGENT] `gap-02-no-DAG-validation.md`  .md
- [AGENT] `gap-03-no-similarity-metrics.md`  .md
- [AGENT] `gap-04-no-caching.md`  .md
- [AGENT] `gap-05-no-concurrent-write-prevention.md`  .md
- [AGENT] `gap-06-no-velocity-tracking.md`  .md
- [AGENT] `gap-07-no-moving-averages.md`  .md
- [AGENT] `gap-08-no-multi-variable-optimization.md`  .md
- [AGENT] `gap-09-no-rate-limiting.md`  .md
- [AGENT] `gap-10-no-CORS.md`  .md
- [AGENT] `gap-11-no-authentication.md`  .md
- [AGENT] `gap-12-no-CSRF.md`  .md
- [AGENT] `gap-13-no-HTTPS-cookies.md`  .md
- [AGENT] `gap-14-no-pagination.md`  .md
- [AGENT] `gap-15-any-types.md`  .md
- [AGENT] `gap-16-hardcoded-paths.md`  .md
- [AGENT] `gap-17-no-memo.md`  .md
- [AGENT] `index.md`  .md

### 📂 `Benchmark_2_26-06-2026---12-49/`

- [AGENT] `README.md`  .md
- [AGENT] `SRS-as-is.md`  .md
- [AGENT] `full-audit.md`  .md

### 📂 `Benchmark_2_26-06-2026---12-49/gaps/`

- [AGENT] `gap-01-selectedSkills-not-set.md`  .md
- [AGENT] `gap-02-no-dag-validation-on-read.md`  .md
- [AGENT] `gap-03-no-moving-averages.md`  .md
- [AGENT] `gap-04-any-types.md`  .md
- [AGENT] `index.md`  .md


## 📁 `config/`
__327 document(s)__

### 📂 `antigravity2/`

- [USER] `README.md`  .md

### 📂 `claude/`

- [SHARED] `CLAUDE.md`  .md

### 📂 `claude/cache/`

- [AGENT] `changelog.md`  .md

### 📂 `claude/commands/`

- [SHARED] `PAOS-start.md`  .md
- [SHARED] `antigravity.md`  .md
- [AGENT] `pipeline-execute.md`  .md
- [AGENT] `pipelines-view.md`  .md
- [AGENT] `skill-creator.md`  .md
- [USER] `srs.md`  .md

### 📂 `claude/paste-cache/`

- [SHARED] `38a8a33d9d1ebe7b.txt`  .txt

### 📂 `claude/plugins/cache/ponytail/ponytail/4.7.0/`

- [AGENT] `AGENTS.md`  .md
- [USER] `README.es.md`  .md
- [USER] `README.md`  .md

### 📂 `claude/plugins/cache/ponytail/ponytail/4.7.0/benchmarks/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/cache/ponytail/ponytail/4.7.0/benchmarks/agentic/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/cache/ponytail/ponytail/4.7.0/benchmarks/arms/`

- [AGENT] `caveman-SKILL.md`  .md

### 📂 `claude/plugins/cache/ponytail/ponytail/4.7.0/benchmarks/results/`

- [SHARED] `2026-06-12-caveman-vs-ponytail.md`  .md
- [SHARED] `2026-06-12-v4-hardening-vs-caveman.md`  .md
- [SHARED] `2026-06-15-llama3.2-local.md`  .md
- [SHARED] `2026-06-16-correctness-gate-fix.md`  .md
- [SHARED] `2026-06-16-robustness-audit.md`  .md
- [AGENT] `2026-06-17-agentic-safety.md`  .md
- [SHARED] `2026-06-17-cost-verification.md`  .md
- [AGENT] `2026-06-18-agentic.md`  .md

### 📂 `claude/plugins/cache/ponytail/ponytail/4.7.0/docs/`

- [AGENT] `agent-portability.md`  .md
- [SHARED] `platform-native.md`  .md

### 📂 `claude/plugins/cache/ponytail/ponytail/4.7.0/examples/`

- [USER] `README.md`  .md
- [SHARED] `csv-sum.md`  .md
- [SHARED] `debounce.md`  .md
- [SHARED] `deep-clone.md`  .md
- [SHARED] `email-validation.md`  .md
- [SHARED] `group-by.md`  .md
- [SHARED] `infinite-scroll.md`  .md
- [AGENT] `modal-dialog.md`  .md
- [SHARED] `number-formatting.md`  .md
- [SHARED] `rate-limit.md`  .md
- [SHARED] `react-countdown.md`  .md
- [SHARED] `url-params.md`  .md

### 📂 `claude/plugins/cache/ponytail/ponytail/4.7.0/ponytail-mcp/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/cache/ponytail/ponytail/4.7.0/skills/ponytail/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/cache/ponytail/ponytail/4.7.0/skills/ponytail-audit/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/cache/ponytail/ponytail/4.7.0/skills/ponytail-debt/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/cache/ponytail/ponytail/4.7.0/skills/ponytail-gain/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/cache/ponytail/ponytail/4.7.0/skills/ponytail-help/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/cache/ponytail/ponytail/4.7.0/skills/ponytail-review/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/external_plugins/asana/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/external_plugins/asana/commands/`

- [SHARED] `asana-setup.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/external_plugins/context7/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/external_plugins/discord/`

- [SHARED] `ACCESS.md`  .md
- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/external_plugins/discord/skills/access/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/external_plugins/discord/skills/configure/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/external_plugins/fakechat/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/external_plugins/greptile/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/external_plugins/imessage/`

- [SHARED] `ACCESS.md`  .md
- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/external_plugins/imessage/skills/access/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/external_plugins/imessage/skills/configure/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/external_plugins/telegram/`

- [SHARED] `ACCESS.md`  .md
- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/external_plugins/telegram/skills/access/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/external_plugins/telegram/skills/configure/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/agent-sdk-dev/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/agent-sdk-dev/agents/`

- [AGENT] `agent-sdk-verifier-py.md`  .md
- [AGENT] `agent-sdk-verifier-ts.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/agent-sdk-dev/commands/`

- [SHARED] `new-sdk-app.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/clangd-lsp/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/claude-code-setup/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/claude-code-setup/skills/claude-automation-recommender/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/claude-code-setup/skills/claude-automation-recommender/references/`

- [SHARED] `hooks-patterns.md`  .md
- [SHARED] `mcp-servers.md`  .md
- [SHARED] `plugins-reference.md`  .md
- [AGENT] `skills-reference.md`  .md
- [AGENT] `subagent-templates.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/claude-md-management/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/claude-md-management/commands/`

- [SHARED] `revise-claude-md.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/claude-md-management/skills/claude-md-improver/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/claude-md-management/skills/claude-md-improver/references/`

- [SHARED] `quality-criteria.md`  .md
- [SHARED] `templates.md`  .md
- [SHARED] `update-guidelines.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/claude-security/`

- [SHARED] `NOTICE.md`  .md
- [USER] `README.md`  .md
- [SHARED] `SECURITY.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/claude-security/agents/`

- [SHARED] `claude-security.md`  .md
- [SHARED] `explore.md`  .md
- [SHARED] `patch-generator.md`  .md
- [AGENT] `patch-verifier.md`  .md
- [SHARED] `scan-inventory.md`  .md
- [SHARED] `scan-loader.md`  .md
- [SHARED] `scan-researcher.md`  .md
- [AGENT] `scan-verifier.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/claude-security/skills/claude-security/`

- [AGENT] `SKILL.md`  .md
- [SHARED] `role.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/claude-security/skills/claude-security/jobs/`

- [SHARED] `scan-changes.md`  .md
- [SHARED] `scan-codebase.md`  .md
- [SHARED] `suggest-patches.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/claude-security/skills/claude-security/specs/`

- [SHARED] `patch-spec.md`  .md
- [SHARED] `report-spec.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/code-modernization/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/code-modernization/agents/`

- [SHARED] `architecture-critic.md`  .md
- [SHARED] `business-rules-extractor.md`  .md
- [SHARED] `legacy-analyst.md`  .md
- [SHARED] `scaffolder.md`  .md
- [SHARED] `security-auditor.md`  .md
- [SHARED] `test-engineer.md`  .md
- [SHARED] `uplift-migrator.md`  .md
- [SHARED] `version-delta-analyst.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/code-modernization/commands/`

- [SHARED] `modernize-assess.md`  .md
- [SHARED] `modernize-brief.md`  .md
- [SHARED] `modernize-extract-rules.md`  .md
- [SHARED] `modernize-harden.md`  .md
- [SHARED] `modernize-map.md`  .md
- [SHARED] `modernize-preflight.md`  .md
- [SHARED] `modernize-reimagine.md`  .md
- [SHARED] `modernize-status.md`  .md
- [SHARED] `modernize-transform.md`  .md
- [SHARED] `modernize-uplift.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/code-review/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/code-review/commands/`

- [SHARED] `code-review.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/code-simplifier/agents/`

- [SHARED] `code-simplifier.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/commit-commands/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/commit-commands/commands/`

- [SHARED] `clean_gone.md`  .md
- [SHARED] `commit-push-pr.md`  .md
- [SHARED] `commit.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/csharp-lsp/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/cwc-makers/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/cwc-makers/commands/`

- [SHARED] `maker-setup.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/cwc-makers/skills/cardputer-buddy/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/cwc-makers/skills/m5-onboard/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/example-plugin/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/example-plugin/commands/`

- [AGENT] `example-command.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/example-plugin/skills/example-command/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/example-plugin/skills/example-skill/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/explanatory-output-style/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/feature-dev/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/feature-dev/agents/`

- [SHARED] `code-architect.md`  .md
- [SHARED] `code-explorer.md`  .md
- [SHARED] `code-reviewer.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/feature-dev/commands/`

- [SHARED] `feature-dev.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/frontend-design/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/frontend-design/skills/frontend-design/`

- [SHARED] `LICENSE.txt`  .txt
- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/gopls-lsp/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/hookify/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/hookify/agents/`

- [SHARED] `conversation-analyzer.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/hookify/commands/`

- [SHARED] `configure.md`  .md
- [SHARED] `help.md`  .md
- [SHARED] `hookify.md`  .md
- [SHARED] `list.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/hookify/examples/`

- [AGENT] `console-log-warning.local.md`  .md
- [SHARED] `dangerous-rm.local.md`  .md
- [SHARED] `require-tests-stop.local.md`  .md
- [SHARED] `sensitive-files-warning.local.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/hookify/skills/writing-rules/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/jdtls-lsp/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/kotlin-lsp/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/learning-output-style/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/lua-lsp/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/math-olympiad/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/math-olympiad/skills/math-olympiad/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/math-olympiad/skills/math-olympiad/references/`

- [SHARED] `adversarial_prompts.md`  .md
- [AGENT] `attempt_agent.md`  .md
- [SHARED] `known_constructions.md`  .md
- [SHARED] `model_tier_defaults.md`  .md
- [SHARED] `presentation_prompts.md`  .md
- [SHARED] `solver_heuristics.md`  .md
- [AGENT] `verifier_patterns.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/mcp-server-dev/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/mcp-server-dev/skills/build-mcp-app/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/mcp-server-dev/skills/build-mcp-app/references/`

- [SHARED] `abuse-protection.md`  .md
- [SHARED] `apps-sdk-messages.md`  .md
- [SHARED] `directory-checklist.md`  .md
- [SHARED] `iframe-sandbox.md`  .md
- [SHARED] `payload-budgeting.md`  .md
- [SHARED] `widget-templates.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/mcp-server-dev/skills/build-mcp-server/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/mcp-server-dev/skills/build-mcp-server/references/`

- [SHARED] `auth.md`  .md
- [SHARED] `deploy-cloudflare-workers.md`  .md
- [SHARED] `elicitation.md`  .md
- [SHARED] `remote-http-scaffold.md`  .md
- [SHARED] `resources-and-prompts.md`  .md
- [SHARED] `server-capabilities.md`  .md
- [SHARED] `tool-design.md`  .md
- [SHARED] `versions.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/mcp-server-dev/skills/build-mcpb/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/mcp-server-dev/skills/build-mcpb/references/`

- [SHARED] `local-security.md`  .md
- [SHARED] `manifest-schema.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/mcp-tunnels/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/mcp-tunnels/commands/`

- [SHARED] `create-docker-mcp-tunnel.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/php-lsp/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/playground/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/playground/skills/playground/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/playground/skills/playground/templates/`

- [SHARED] `code-map.md`  .md
- [SHARED] `concept-map.md`  .md
- [SHARED] `data-explorer.md`  .md
- [SHARED] `design-playground.md`  .md
- [SHARED] `diff-review.md`  .md
- [SHARED] `document-critique.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/agents/`

- [AGENT] `agent-creator.md`  .md
- [SHARED] `plugin-validator.md`  .md
- [AGENT] `skill-reviewer.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/commands/`

- [SHARED] `create-plugin.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/agent-development/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/agent-development/examples/`

- [AGENT] `agent-creation-prompt.md`  .md
- [AGENT] `complete-agent-examples.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/agent-development/references/`

- [AGENT] `agent-creation-system-prompt.md`  .md
- [SHARED] `system-prompt-design.md`  .md
- [SHARED] `triggering-examples.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/command-development/`

- [USER] `README.md`  .md
- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/command-development/examples/`

- [AGENT] `plugin-commands.md`  .md
- [AGENT] `simple-commands.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/command-development/references/`

- [SHARED] `advanced-workflows.md`  .md
- [SHARED] `documentation-patterns.md`  .md
- [SHARED] `frontmatter-reference.md`  .md
- [AGENT] `interactive-commands.md`  .md
- [SHARED] `marketplace-considerations.md`  .md
- [SHARED] `plugin-features-reference.md`  .md
- [SHARED] `testing-strategies.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/hook-development/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/hook-development/references/`

- [SHARED] `advanced.md`  .md
- [SHARED] `migration.md`  .md
- [SHARED] `patterns.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/hook-development/scripts/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/mcp-integration/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/mcp-integration/references/`

- [SHARED] `authentication.md`  .md
- [SHARED] `server-types.md`  .md
- [SHARED] `tool-usage.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/plugin-settings/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/plugin-settings/examples/`

- [AGENT] `create-settings-command.md`  .md
- [SHARED] `example-settings.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/plugin-settings/references/`

- [SHARED] `parsing-techniques.md`  .md
- [SHARED] `real-world-examples.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/plugin-structure/`

- [USER] `README.md`  .md
- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/plugin-structure/examples/`

- [SHARED] `advanced-plugin.md`  .md
- [SHARED] `minimal-plugin.md`  .md
- [SHARED] `standard-plugin.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/plugin-structure/references/`

- [SHARED] `component-patterns.md`  .md
- [SHARED] `manifest-reference.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/skill-development/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/plugin-dev/skills/skill-development/references/`

- [AGENT] `skill-creator-original.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/pr-review-toolkit/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/pr-review-toolkit/agents/`

- [SHARED] `code-reviewer.md`  .md
- [SHARED] `code-simplifier.md`  .md
- [SHARED] `comment-analyzer.md`  .md
- [SHARED] `pr-test-analyzer.md`  .md
- [SHARED] `silent-failure-hunter.md`  .md
- [SHARED] `type-design-analyzer.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/pr-review-toolkit/commands/`

- [SHARED] `review-pr.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/project-artifact/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/project-artifact/skills/project-artifact/`

- [AGENT] `SKILL.md`  .md
- [SHARED] `swe.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/pyright-lsp/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/ralph-loop/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/ralph-loop/commands/`

- [SHARED] `cancel-ralph.md`  .md
- [SHARED] `help.md`  .md
- [SHARED] `ralph-loop.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/receipts/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/receipts/skills/receipts/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/ruby-lsp/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/rust-analyzer-lsp/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/security-guidance/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/session-report/skills/session-report/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/skill-creator/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/skill-creator/skills/skill-creator/`

- [SHARED] `LICENSE.txt`  .txt
- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/skill-creator/skills/skill-creator/agents/`

- [SHARED] `analyzer.md`  .md
- [SHARED] `comparator.md`  .md
- [SHARED] `grader.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/skill-creator/skills/skill-creator/references/`

- [SHARED] `schemas.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/swift-lsp/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/claude-plugins-official/plugins/typescript-lsp/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/ponytail/`

- [AGENT] `AGENTS.md`  .md
- [USER] `README.es.md`  .md
- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/ponytail/benchmarks/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/ponytail/benchmarks/agentic/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/ponytail/benchmarks/arms/`

- [AGENT] `caveman-SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/ponytail/benchmarks/results/`

- [SHARED] `2026-06-12-caveman-vs-ponytail.md`  .md
- [SHARED] `2026-06-12-v4-hardening-vs-caveman.md`  .md
- [SHARED] `2026-06-15-llama3.2-local.md`  .md
- [SHARED] `2026-06-16-correctness-gate-fix.md`  .md
- [SHARED] `2026-06-16-robustness-audit.md`  .md
- [AGENT] `2026-06-17-agentic-safety.md`  .md
- [SHARED] `2026-06-17-cost-verification.md`  .md
- [AGENT] `2026-06-18-agentic.md`  .md

### 📂 `claude/plugins/marketplaces/ponytail/docs/`

- [AGENT] `agent-portability.md`  .md
- [SHARED] `platform-native.md`  .md

### 📂 `claude/plugins/marketplaces/ponytail/examples/`

- [USER] `README.md`  .md
- [SHARED] `csv-sum.md`  .md
- [SHARED] `debounce.md`  .md
- [SHARED] `deep-clone.md`  .md
- [SHARED] `email-validation.md`  .md
- [SHARED] `group-by.md`  .md
- [SHARED] `infinite-scroll.md`  .md
- [AGENT] `modal-dialog.md`  .md
- [SHARED] `number-formatting.md`  .md
- [SHARED] `rate-limit.md`  .md
- [SHARED] `react-countdown.md`  .md
- [SHARED] `url-params.md`  .md

### 📂 `claude/plugins/marketplaces/ponytail/ponytail-mcp/`

- [USER] `README.md`  .md

### 📂 `claude/plugins/marketplaces/ponytail/skills/ponytail/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/ponytail/skills/ponytail-audit/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/ponytail/skills/ponytail-debt/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/ponytail/skills/ponytail-gain/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/ponytail/skills/ponytail-help/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/plugins/marketplaces/ponytail/skills/ponytail-review/`

- [AGENT] `SKILL.md`  .md

### 📂 `claude/rules/`

- [SHARED] `context7.md`  .md

### 📂 `claude/skills/context7-mcp/`

- [AGENT] `SKILL.md`  .md

### 📂 `codex/`

- [SHARED] `instructions.md`  .md

### 📂 `codex/plugins/cache/openai-curated-remote/github/0.1.2/skills/gh-address-comments/`

- [SHARED] `LICENSE.txt`  .txt
- [AGENT] `SKILL.md`  .md

### 📂 `codex/plugins/cache/openai-curated-remote/github/0.1.2/skills/gh-fix-ci/`

- [SHARED] `LICENSE.txt`  .txt
- [AGENT] `SKILL.md`  .md

### 📂 `codex/plugins/cache/openai-curated-remote/github/0.1.2/skills/github/`

- [AGENT] `SKILL.md`  .md

### 📂 `codex/plugins/cache/openai-curated-remote/github/0.1.2/skills/yeet/`

- [SHARED] `LICENSE.txt`  .txt
- [AGENT] `SKILL.md`  .md

### 📂 `copilot/session-state/f0296c44-8221-4d43-8fd8-88b39d4f89f3/checkpoints/`

- [SHARED] `index.md`  .md

### 📂 `gemini/`

- [USER] `README.md`  .md

### 📂 `hermes-nous/`

- [SHARED] `instructions.md`  .md

### 📂 `ollama/`

- [SHARED] `system-prompt.md`  .md

### 📂 `openclaw/`

- [USER] `README.md`  .md

### 📂 `opencode/`

- [AGENT] `AGENTS.md`  .md

### 📂 `signal/`

- [SHARED] `instructions.md`  .md


## 📁 `dashboard/`
__5 document(s)__

- [SHARED] `DESIGN.md`  .md
- [USER] `README.md`  .md

### 📂 `app/pipelines/builder/`

- [SHARED] `IMPLEMENTATION_PLAN.md`  .md

### 📂 `clickhouse/`

- [SHARED] `DESIGN.md`  .md

### 📂 `supabase/`

- [SHARED] `DESIGN.md`  .md


## 📁 `docker/`
__1 document(s)__

- [USER] `README.md`  .md


## 📁 `docs/`
__8 document(s)__

- [AGENT] `PIPELINES.md`  .md
- [USER] `README.md`  .md
- [SHARED] `api.md`  .md
- [SHARED] `architecture.md`  .md
- [SHARED] `examples.md`  .md
- [AGENT] `pipelines.md`  .md
- [SHARED] `workspace-format.md`  .md

### 📂 `screenshots/`

- [USER] `README.md`  .md


## 📁 `hermes/`
__1990 document(s)__

- [AGENT] `SOUL.md`  .md

### 📂 `cache/exec/`

- [AGENT] `stdout-a35aaeba0c59.txt`  .txt
- [AGENT] `stdout-e610231faa6b.txt`  .txt

### 📂 `cache/web/`

- [AGENT] `github.com-08fbf6f2e5d407c8.cache.md`  .md
- [AGENT] `github.com-0ef94bbe6b.md`  .md
- [AGENT] `github.com-26de699d3e.md`  .md
- [AGENT] `github.com-da72684332ab2308.cache.md`  .md
- [AGENT] `hermes-agent.nousresearch.com-04399f5e69a626ec.cache.md`  .md
- [AGENT] `hermes-agent.nousresearch.com-c62c073895.md`  .md
- [AGENT] `hermes-agent.nousresearch.com-c88367adf8.md`  .md
- [AGENT] `hermes-agent.nousresearch.com-d44266cf53f2cbef.cache.md`  .md
- [AGENT] `pricepertoken.com-719818b282.md`  .md
- [AGENT] `pricepertoken.com-7fc19c7a76b34f3b.cache.md`  .md
- [AGENT] `raw.githubusercontent.com-6c8959931ad11bde.cache.md`  .md
- [AGENT] `raw.githubusercontent.com-8b4806adc6.md`  .md
- [AGENT] `raw.githubusercontent.com-f0f36b1953a1e0ea.cache.md`  .md
- [AGENT] `tailscale.com-2915acd75340a274.cache.md`  .md
- [AGENT] `tailscale.com-49fde707b3075ccc.cache.md`  .md
- [AGENT] `tailscale.com-b3d7c3a9c71beaaa.cache.md`  .md
- [AGENT] `www.tbench.ai-57f629bd9736c7af.cache.md`  .md

### 📂 `cron/output/1a96ce892dd1/`

- [AGENT] `2026-06-26_11-40-06.md`  .md

### 📂 `cron/output/6ef21d9e95f3/`

- [AGENT] `2026-09-03_02-46-24.md`  .md

### 📂 `cron/output/8aa048b02938/`

- [AGENT] `2026-08-11_18-23-19.md`  .md

### 📂 `cron/output/ea7cadcda726/`

- [AGENT] `2026-06-26_12-03-57.md`  .md

### 📂 `cron/output/`

- [AGENT] `ea7cadcda726_20260626_120357.txt`  .txt

### 📂 `hermes-agent/`

- [AGENT] `AGENTS.md`  .md
- [AGENT] `CONTRIBUTING.es.md`  .md
- [AGENT] `CONTRIBUTING.md`  .md
- [AGENT] `README.es.md`  .md
- [AGENT] `README.md`  .md
- [AGENT] `README.ur-pk.md`  .md
- [AGENT] `README.zh-CN.md`  .md
- [AGENT] `SECURITY.es.md`  .md
- [AGENT] `SECURITY.md`  .md
- [AGENT] `SOUL.md`  .md
- [AGENT] `constraints-termux.txt`  .txt

### 📂 `hermes-agent/apps/desktop/`

- [AGENT] `AGENTS.md`  .md
- [AGENT] `DESIGN.md`  .md
- [AGENT] `README.md`  .md

### 📂 `hermes-agent/apps/desktop/scripts/perf/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/apps/desktop/scripts/`

- [AGENT] `profile-typing-lag.md`  .md

### 📂 `hermes-agent/apps/desktop/src/debug/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/apps/desktop/src/plugins/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/contributors/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/docker/`

- [AGENT] `SOUL.md`  .md

### 📂 `hermes-agent/docs/`

- [AGENT] `ADR.md`  .md
- [AGENT] `billing-lifecycle.md`  .md
- [AGENT] `chronos-managed-cron-contract.md`  .md
- [AGENT] `cron-doctor-spec.md`  .md
- [AGENT] `hermes-kanban-v1-spec.pdf`  .pdf
- [AGENT] `micro-compaction.md`  .md
- [AGENT] `profile-routing.md`  .md
- [AGENT] `rca-ssl-cacert-post-git-pull.md`  .md
- [AGENT] `relay-connector-contract.md`  .md
- [AGENT] `session-lifecycle.md`  .md
- [AGENT] `state-db-recovery.md`  .md
- [AGENT] `streaming-tts.md`  .md

### 📂 `hermes-agent/docs/design/`

- [AGENT] `multiplexing-gateway.md`  .md
- [AGENT] `profile-builder.md`  .md

### 📂 `hermes-agent/docs/kanban/`

- [AGENT] `multi-gateway.md`  .md

### 📂 `hermes-agent/docs/middleware/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/docs/observability/`

- [AGENT] `README.md`  .md
- [AGENT] `monitoring.md`  .md
- [AGENT] `relay-shared-metrics.md`  .md

### 📂 `hermes-agent/docs/rfcs/`

- [AGENT] `2026-07-plugin-architecture-lessons-pi-opencode.md`  .md
- [AGENT] `plugin-config-state-bridge.md`  .md

### 📂 `hermes-agent/docs/security/`

- [AGENT] `network-egress-isolation.md`  .md

### 📂 `hermes-agent/evals/browser_use/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/evals/compaction/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/evals/compaction/results/`

- [AGENT] `SCORECARD-2026-08-15.md`  .md

### 📂 `hermes-agent/evals/core_tool_deferral/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/evals/core_tool_deferral/results/`

- [AGENT] `SUMMARY.md`  .md

### 📂 `hermes-agent/evals/readtool/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/evals/readtool/results/`

- [AGENT] `SUMMARY.md`  .md

### 📂 `hermes-agent/evals/session_search_schema/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/gateway/platforms/`

- [AGENT] `ADDING_A_PLATFORM.md`  .md

### 📂 `hermes-agent/hermes_agent.egg-info/`

- [AGENT] `SOURCES.txt`  .txt
- [AGENT] `dependency_links.txt`  .txt
- [AGENT] `entry_points.txt`  .txt
- [AGENT] `requires.txt`  .txt
- [AGENT] `top_level.txt`  .txt

### 📂 `hermes-agent/native/fts5_cjk/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/optional-skills/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/optional-skills/autonomous-ai-agents/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/optional-skills/autonomous-ai-agents/agent-merge-conflict-arbiter/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/autonomous-ai-agents/antigravity-cli/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/autonomous-ai-agents/antigravity-cli/references/`

- [AGENT] `cli-docs.md`  .md

### 📂 `hermes-agent/optional-skills/autonomous-ai-agents/blackbox/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/autonomous-ai-agents/grok/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/autonomous-ai-agents/honcho/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/autonomous-ai-agents/openhands/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/blockchain/evm/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/blockchain/hyperliquid/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/blockchain/solana/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/communication/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/optional-skills/communication/one-three-one-rule/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/ascii-art/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/audiocraft-audio-generation/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/audiocraft-audio-generation/references/`

- [AGENT] `advanced-usage.md`  .md
- [AGENT] `troubleshooting.md`  .md

### 📂 `hermes-agent/optional-skills/creative/baoyu-article-illustrator/`

- [AGENT] `PORT_NOTES.md`  .md
- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/baoyu-article-illustrator/prompts/`

- [AGENT] `system.md`  .md

### 📂 `hermes-agent/optional-skills/creative/baoyu-article-illustrator/references/palettes/`

- [AGENT] `macaron.md`  .md
- [AGENT] `mono-ink.md`  .md
- [AGENT] `neon.md`  .md
- [AGENT] `warm.md`  .md

### 📂 `hermes-agent/optional-skills/creative/baoyu-article-illustrator/references/`

- [AGENT] `prompt-construction.md`  .md
- [AGENT] `style-presets.md`  .md
- [AGENT] `styles.md`  .md
- [AGENT] `usage.md`  .md
- [AGENT] `workflow.md`  .md

### 📂 `hermes-agent/optional-skills/creative/baoyu-article-illustrator/references/styles/`

- [AGENT] `blueprint.md`  .md
- [AGENT] `chalkboard.md`  .md
- [AGENT] `editorial.md`  .md
- [AGENT] `elegant.md`  .md
- [AGENT] `fantasy-animation.md`  .md
- [AGENT] `flat-doodle.md`  .md
- [AGENT] `flat.md`  .md
- [AGENT] `ink-notes.md`  .md
- [AGENT] `intuition-machine.md`  .md
- [AGENT] `minimal.md`  .md
- [AGENT] `nature.md`  .md
- [AGENT] `notion.md`  .md
- [AGENT] `pixel-art.md`  .md
- [AGENT] `playful.md`  .md
- [AGENT] `retro.md`  .md
- [AGENT] `scientific.md`  .md
- [AGENT] `screen-print.md`  .md
- [AGENT] `sketch-notes.md`  .md
- [AGENT] `sketch.md`  .md
- [AGENT] `vector-illustration.md`  .md
- [AGENT] `vintage.md`  .md
- [AGENT] `warm.md`  .md
- [AGENT] `watercolor.md`  .md

### 📂 `hermes-agent/optional-skills/creative/baoyu-comic/`

- [AGENT] `PORT_NOTES.md`  .md
- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/baoyu-comic/references/`

- [AGENT] `analysis-framework.md`  .md
- [AGENT] `auto-selection.md`  .md
- [AGENT] `base-prompt.md`  .md
- [AGENT] `character-template.md`  .md
- [AGENT] `ohmsha-guide.md`  .md
- [AGENT] `partial-workflows.md`  .md
- [AGENT] `storyboard-template.md`  .md
- [AGENT] `workflow.md`  .md

### 📂 `hermes-agent/optional-skills/creative/baoyu-comic/references/art-styles/`

- [AGENT] `chalk.md`  .md
- [AGENT] `ink-brush.md`  .md
- [AGENT] `ligne-claire.md`  .md
- [AGENT] `manga.md`  .md
- [AGENT] `minimalist.md`  .md
- [AGENT] `realistic.md`  .md

### 📂 `hermes-agent/optional-skills/creative/baoyu-comic/references/layouts/`

- [AGENT] `cinematic.md`  .md
- [AGENT] `dense.md`  .md
- [AGENT] `four-panel.md`  .md
- [AGENT] `mixed.md`  .md
- [AGENT] `splash.md`  .md
- [AGENT] `standard.md`  .md
- [AGENT] `webtoon.md`  .md

### 📂 `hermes-agent/optional-skills/creative/baoyu-comic/references/presets/`

- [AGENT] `concept-story.md`  .md
- [AGENT] `four-panel.md`  .md
- [AGENT] `ohmsha.md`  .md
- [AGENT] `shoujo.md`  .md
- [AGENT] `wuxia.md`  .md

### 📂 `hermes-agent/optional-skills/creative/baoyu-comic/references/tones/`

- [AGENT] `action.md`  .md
- [AGENT] `dramatic.md`  .md
- [AGENT] `energetic.md`  .md
- [AGENT] `neutral.md`  .md
- [AGENT] `romantic.md`  .md
- [AGENT] `vintage.md`  .md
- [AGENT] `warm.md`  .md

### 📂 `hermes-agent/optional-skills/creative/comfyui/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/comfyui/references/`

- [AGENT] `official-cli.md`  .md
- [AGENT] `rest-api.md`  .md
- [AGENT] `template-integrity.md`  .md
- [AGENT] `workflow-format.md`  .md

### 📂 `hermes-agent/optional-skills/creative/comfyui/tests/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/optional-skills/creative/comfyui/workflows/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/optional-skills/creative/concept-diagrams/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/concept-diagrams/examples/`

- [AGENT] `apartment-floor-plan-conversion.md`  .md
- [AGENT] `automated-password-reset-flow.md`  .md
- [AGENT] `autonomous-llm-research-agent-flow.md`  .md
- [AGENT] `banana-journey-tree-to-smoothie.md`  .md
- [AGENT] `commercial-aircraft-structure.md`  .md
- [AGENT] `cpu-ooo-microarchitecture.md`  .md
- [AGENT] `electricity-grid-flow.md`  .md
- [AGENT] `feature-film-production-pipeline.md`  .md
- [AGENT] `hospital-emergency-department-flow.md`  .md
- [AGENT] `ml-benchmark-grouped-bar-chart.md`  .md
- [AGENT] `place-order-uml-sequence.md`  .md
- [AGENT] `smart-city-infrastructure.md`  .md
- [AGENT] `smartphone-layer-anatomy.md`  .md
- [AGENT] `sn2-reaction-mechanism.md`  .md
- [AGENT] `wind-turbine-structure.md`  .md

### 📂 `hermes-agent/optional-skills/creative/concept-diagrams/references/`

- [AGENT] `dashboard-patterns.md`  .md
- [AGENT] `infrastructure-patterns.md`  .md
- [AGENT] `physical-shape-cookbook.md`  .md

### 📂 `hermes-agent/optional-skills/creative/creative-ideation/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/creative-ideation/references/`

- [AGENT] `anti-slop.md`  .md
- [AGENT] `exercises.md`  .md
- [AGENT] `full-prompt-library.md`  .md
- [AGENT] `heuristics.md`  .md
- [AGENT] `method-catalog.md`  .md

### 📂 `hermes-agent/optional-skills/creative/creative-ideation/references/methods/`

- [AGENT] `affinity-diagrams.md`  .md
- [AGENT] `analogy-and-blending.md`  .md
- [AGENT] `biomimicry.md`  .md
- [AGENT] `chance-and-remix.md`  .md
- [AGENT] `compression-progress.md`  .md
- [AGENT] `creative-discipline.md`  .md
- [AGENT] `defamiliarization.md`  .md
- [AGENT] `derive-and-mapping.md`  .md
- [AGENT] `first-principles.md`  .md
- [AGENT] `jobs-to-be-done.md`  .md
- [AGENT] `lateral-provocations.md`  .md
- [AGENT] `leverage-points.md`  .md
- [AGENT] `oblique-strategies.md`  .md
- [AGENT] `oulipo.md`  .md
- [AGENT] `pataphysics.md`  .md
- [AGENT] `pattern-languages.md`  .md
- [AGENT] `polya.md`  .md
- [AGENT] `premortem-and-inversion.md`  .md
- [AGENT] `scamper.md`  .md
- [AGENT] `story-skeletons.md`  .md
- [AGENT] `triz-principles.md`  .md
- [AGENT] `volume-generation.md`  .md

### 📂 `hermes-agent/optional-skills/creative/draw-your-font/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/draw-your-font/references/`

- [AGENT] `troubleshooting.md`  .md

### 📂 `hermes-agent/optional-skills/creative/excalidraw/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/excalidraw/references/`

- [AGENT] `colors.md`  .md
- [AGENT] `dark-mode.md`  .md
- [AGENT] `examples.md`  .md

### 📂 `hermes-agent/optional-skills/creative/heartmula/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/hyperframes/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/hyperframes/references/`

- [AGENT] `cli.md`  .md
- [AGENT] `composition.md`  .md
- [AGENT] `features.md`  .md
- [AGENT] `gsap.md`  .md
- [AGENT] `troubleshooting.md`  .md
- [AGENT] `website-to-video.md`  .md

### 📂 `hermes-agent/optional-skills/creative/impeccable/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/kanban-video-orchestrator/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/kanban-video-orchestrator/references/`

- [AGENT] `examples.md`  .md
- [AGENT] `intake.md`  .md
- [AGENT] `kanban-setup.md`  .md
- [AGENT] `monitoring.md`  .md
- [AGENT] `role-archetypes.md`  .md
- [AGENT] `tool-matrix.md`  .md

### 📂 `hermes-agent/optional-skills/creative/meme-generation/`

- [AGENT] `EXAMPLES.md`  .md
- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/pixel-art/`

- [AGENT] `ATTRIBUTION.md`  .md
- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/pixel-art/references/`

- [AGENT] `palettes.md`  .md

### 📂 `hermes-agent/optional-skills/creative/pretext/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/pretext/references/`

- [AGENT] `patterns.md`  .md

### 📂 `hermes-agent/optional-skills/creative/simple-english/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/simple-english/references/`

- [AGENT] `checklist.md`  .md
- [AGENT] `use-cases.md`  .md

### 📂 `hermes-agent/optional-skills/creative/sketch/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/social-media-content-calendar/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/tldraw-offline/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/touchdesigner-mcp/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/touchdesigner-mcp/references/`

- [AGENT] `3d-scene.md`  .md
- [AGENT] `animation.md`  .md
- [AGENT] `audio-reactive.md`  .md
- [AGENT] `dat-scripting.md`  .md
- [AGENT] `external-data.md`  .md
- [AGENT] `geometry-comp.md`  .md
- [AGENT] `glsl.md`  .md
- [AGENT] `layout-compositor.md`  .md
- [AGENT] `mcp-tools.md`  .md
- [AGENT] `midi-osc.md`  .md
- [AGENT] `network-patterns.md`  .md
- [AGENT] `operator-tips.md`  .md
- [AGENT] `operators.md`  .md
- [AGENT] `panel-ui.md`  .md
- [AGENT] `particles.md`  .md
- [AGENT] `pitfalls.md`  .md
- [AGENT] `postfx.md`  .md
- [AGENT] `projection-mapping.md`  .md
- [AGENT] `python-api.md`  .md
- [AGENT] `replicator.md`  .md
- [AGENT] `troubleshooting.md`  .md

### 📂 `hermes-agent/optional-skills/creative/unreal-mcp/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/creative/unreal-mcp/references/`

- [AGENT] `advanced-workflows.md`  .md
- [AGENT] `pitfalls.md`  .md
- [AGENT] `recipes.md`  .md
- [AGENT] `scene-craft.md`  .md
- [AGENT] `tool-surface.md`  .md

### 📂 `hermes-agent/optional-skills/data-science/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/optional-skills/data-science/jupyter-notebook/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/devops/actual-setup/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/devops/actual-setup/references/`

- [AGENT] `opencode.md`  .md

### 📂 `hermes-agent/optional-skills/devops/docker-management/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/devops/hermes-s6-container-supervision/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/devops/inference-sh-cli/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/devops/inference-sh-cli/references/`

- [AGENT] `app-discovery.md`  .md
- [AGENT] `authentication.md`  .md
- [AGENT] `cli-reference.md`  .md
- [AGENT] `running-apps.md`  .md

### 📂 `hermes-agent/optional-skills/devops/pinggy-tunnel/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/devops/setup-wizard-generator/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/devops/watchers/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/dogfood/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/optional-skills/dogfood/adversarial-ux-test/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/email/agentmail/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/email/agentmail/references/`

- [AGENT] `core.md`  .md
- [AGENT] `mcp.md`  .md
- [AGENT] `signup.md`  .md
- [AGENT] `webhooks.md`  .md
- [AGENT] `websockets.md`  .md

### 📂 `hermes-agent/optional-skills/finance/3-statement-model/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/finance/3-statement-model/references/`

- [AGENT] `formatting.md`  .md
- [AGENT] `formulas.md`  .md
- [AGENT] `sec-filings.md`  .md

### 📂 `hermes-agent/optional-skills/finance/comps-analysis/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/finance/dcf-model/`

- [AGENT] `SKILL.md`  .md
- [AGENT] `TROUBLESHOOTING.md`  .md
- [AGENT] `requirements.txt`  .txt

### 📂 `hermes-agent/optional-skills/finance/excel-author/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/finance/lbo-model/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/finance/merger-model/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/finance/polymarket/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/finance/polymarket/references/`

- [AGENT] `api-endpoints.md`  .md

### 📂 `hermes-agent/optional-skills/finance/pptx-author/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/finance/stocks/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/gaming/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/optional-skills/gaming/minecraft-modpack-server/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/gaming/pokemon-player/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/health/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/optional-skills/health/fitness-nutrition/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/health/fitness-nutrition/references/`

- [AGENT] `FORMULAS.md`  .md

### 📂 `hermes-agent/optional-skills/health/neuroskill-bci/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/health/neuroskill-bci/references/`

- [AGENT] `api.md`  .md
- [AGENT] `metrics.md`  .md
- [AGENT] `protocols.md`  .md

### 📂 `hermes-agent/optional-skills/mcp/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/optional-skills/mcp/fastmcp/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mcp/fastmcp/references/`

- [AGENT] `fastmcp-cli.md`  .md

### 📂 `hermes-agent/optional-skills/mcp/mcp-oauth-remote-gateway/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mcp/mcp-oauth-remote-gateway/references/`

- [AGENT] `stripe-mcp-oauth-revocation.md`  .md

### 📂 `hermes-agent/optional-skills/mcp/mcporter/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/migration/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/optional-skills/migration/openclaw-migration/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/accelerate/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/accelerate/references/`

- [AGENT] `custom-plugins.md`  .md
- [AGENT] `megatron-integration.md`  .md
- [AGENT] `performance.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/chroma/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/chroma/references/`

- [AGENT] `integration.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/clip/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/clip/references/`

- [AGENT] `applications.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/evaluation/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/evaluation/evaluating-llms-harness/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/evaluation/evaluating-llms-harness/references/`

- [AGENT] `api-evaluation.md`  .md
- [AGENT] `benchmark-guide.md`  .md
- [AGENT] `custom-tasks.md`  .md
- [AGENT] `distributed-eval.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/evaluation/weights-and-biases/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/evaluation/weights-and-biases/references/`

- [AGENT] `artifacts.md`  .md
- [AGENT] `integrations.md`  .md
- [AGENT] `sweeps.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/faiss/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/faiss/references/`

- [AGENT] `index_types.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/flash-attention/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/flash-attention/references/`

- [AGENT] `benchmarks.md`  .md
- [AGENT] `transformers-integration.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/guidance/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/guidance/references/`

- [AGENT] `backends.md`  .md
- [AGENT] `constraints.md`  .md
- [AGENT] `examples.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/huggingface-tokenizers/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/huggingface-tokenizers/references/`

- [AGENT] `algorithms.md`  .md
- [AGENT] `integration.md`  .md
- [AGENT] `pipeline.md`  .md
- [AGENT] `training.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/inference/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/inference/llama-cpp/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/inference/llama-cpp/references/`

- [AGENT] `advanced-usage.md`  .md
- [AGENT] `hub-discovery.md`  .md
- [AGENT] `optimization.md`  .md
- [AGENT] `quantization.md`  .md
- [AGENT] `server.md`  .md
- [AGENT] `troubleshooting.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/inference/outlines/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/inference/outlines/references/`

- [AGENT] `backends.md`  .md
- [AGENT] `examples.md`  .md
- [AGENT] `json_generation.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/inference/serving-llms-vllm/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/inference/serving-llms-vllm/references/`

- [AGENT] `optimization.md`  .md
- [AGENT] `quantization.md`  .md
- [AGENT] `server-deployment.md`  .md
- [AGENT] `troubleshooting.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/instructor/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/instructor/references/`

- [AGENT] `examples.md`  .md
- [AGENT] `providers.md`  .md
- [AGENT] `validation.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/lambda-labs/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/lambda-labs/references/`

- [AGENT] `advanced-usage.md`  .md
- [AGENT] `troubleshooting.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/llava/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/llava/references/`

- [AGENT] `training.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/modal/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/modal/references/`

- [AGENT] `advanced-usage.md`  .md
- [AGENT] `troubleshooting.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/models/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/models/huggingface-hub/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/models/segment-anything-model/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/models/segment-anything-model/references/`

- [AGENT] `advanced-usage.md`  .md
- [AGENT] `troubleshooting.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/nemo-curator/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/nemo-curator/references/`

- [AGENT] `deduplication.md`  .md
- [AGENT] `filtering.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/obliteratus/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/obliteratus/references/`

- [AGENT] `analysis-modules.md`  .md
- [AGENT] `methods-guide.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/peft/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/peft/references/`

- [AGENT] `advanced-usage.md`  .md
- [AGENT] `troubleshooting.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/pinecone/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/pinecone/references/`

- [AGENT] `deployment.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/pytorch-fsdp/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/pytorch-fsdp/references/`

- [AGENT] `common-patterns.md`  .md
- [AGENT] `index.md`  .md
- [AGENT] `other.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/pytorch-lightning/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/pytorch-lightning/references/`

- [AGENT] `callbacks.md`  .md
- [AGENT] `distributed.md`  .md
- [AGENT] `hyperparameter-tuning.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/qdrant/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/qdrant/references/`

- [AGENT] `advanced-usage.md`  .md
- [AGENT] `troubleshooting.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/research/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/research/dspy/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/research/dspy/references/`

- [AGENT] `examples.md`  .md
- [AGENT] `modules.md`  .md
- [AGENT] `optimizers.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/saelens/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/saelens/references/`

- [AGENT] `README.md`  .md
- [AGENT] `api.md`  .md
- [AGENT] `tutorials.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/simpo/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/simpo/references/`

- [AGENT] `datasets.md`  .md
- [AGENT] `hyperparameters.md`  .md
- [AGENT] `loss-functions.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/slime/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/slime/references/`

- [AGENT] `api-reference.md`  .md
- [AGENT] `troubleshooting.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/stable-diffusion/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/stable-diffusion/references/`

- [AGENT] `advanced-usage.md`  .md
- [AGENT] `troubleshooting.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/tensorrt-llm/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/tensorrt-llm/references/`

- [AGENT] `multi-gpu.md`  .md
- [AGENT] `optimization.md`  .md
- [AGENT] `serving.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/torchtitan/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/torchtitan/references/`

- [AGENT] `checkpoint.md`  .md
- [AGENT] `custom-models.md`  .md
- [AGENT] `float8.md`  .md
- [AGENT] `fsdp.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/training/axolotl/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/training/axolotl/references/`

- [AGENT] `api.md`  .md
- [AGENT] `dataset-formats.md`  .md
- [AGENT] `index.md`  .md
- [AGENT] `other.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/training/trl-fine-tuning/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/training/trl-fine-tuning/references/`

- [AGENT] `dpo-variants.md`  .md
- [AGENT] `grpo-training.md`  .md
- [AGENT] `online-rl.md`  .md
- [AGENT] `reward-modeling.md`  .md
- [AGENT] `sft-training.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/training/unsloth/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/training/unsloth/references/`

- [AGENT] `index.md`  .md
- [AGENT] `llms-full.md`  .md
- [AGENT] `llms-txt.md`  .md
- [AGENT] `llms.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/whisper/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/mlops/whisper/references/`

- [AGENT] `languages.md`  .md

### 📂 `hermes-agent/optional-skills/payments/mpp-agent/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/payments/stripe-link-cli/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/payments/stripe-projects/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/productivity/canvas/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/productivity/decision-questionnaire/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/productivity/here-now/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/productivity/memento-flashcards/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/productivity/shop/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/productivity/shop/references/`

- [AGENT] `catalog-mcp.md`  .md
- [AGENT] `direct-api.md`  .md
- [AGENT] `legal.md`  .md
- [AGENT] `safety.md`  .md

### 📂 `hermes-agent/optional-skills/productivity/shopify/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/productivity/siyuan/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/productivity/telephony/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/research/bioinformatics/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/research/blogwatcher/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/research/darwinian-evolver/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/research/domain-intel/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/research/drug-discovery/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/research/drug-discovery/references/`

- [AGENT] `ADMET_REFERENCE.md`  .md

### 📂 `hermes-agent/optional-skills/research/duckduckgo-search/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/research/gitnexus-explorer/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/research/osint-investigation/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/research/osint-investigation/references/sources/`

- [AGENT] `courtlistener.md`  .md
- [AGENT] `gdelt.md`  .md
- [AGENT] `icij-offshore.md`  .md
- [AGENT] `nyc-acris.md`  .md
- [AGENT] `ofac-sdn.md`  .md
- [AGENT] `opencorporates.md`  .md
- [AGENT] `sec-edgar.md`  .md
- [AGENT] `senate-ld.md`  .md
- [AGENT] `usaspending.md`  .md
- [AGENT] `wayback.md`  .md
- [AGENT] `wikipedia.md`  .md

### 📂 `hermes-agent/optional-skills/research/osint-investigation/templates/`

- [AGENT] `source-template.md`  .md

### 📂 `hermes-agent/optional-skills/research/parallel-cli/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/research/pinecone-research/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/research/qmd/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/research/research-paper-writing/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/research/research-paper-writing/references/`

- [AGENT] `autoreason-methodology.md`  .md
- [AGENT] `checklists.md`  .md
- [AGENT] `citation-workflow.md`  .md
- [AGENT] `experiment-patterns.md`  .md
- [AGENT] `human-evaluation.md`  .md
- [AGENT] `paper-types.md`  .md
- [AGENT] `phase5-paper-drafting.md`  .md
- [AGENT] `reviewer-guidelines.md`  .md
- [AGENT] `sources.md`  .md
- [AGENT] `writing-guide.md`  .md

### 📂 `hermes-agent/optional-skills/research/research-paper-writing/templates/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/optional-skills/research/research-paper-writing/templates/aaai2026/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/optional-skills/research/research-paper-writing/templates/acl/`

- [AGENT] `README.md`  .md
- [AGENT] `anthology.bib.txt`  .txt
- [AGENT] `formatting.md`  .md

### 📂 `hermes-agent/optional-skills/research/research-paper-writing/templates/colm2025/`

- [AGENT] `README.md`  .md
- [AGENT] `colm2025_conference.pdf`  .pdf

### 📂 `hermes-agent/optional-skills/research/research-paper-writing/templates/iclr2026/`

- [AGENT] `iclr2026_conference.pdf`  .pdf

### 📂 `hermes-agent/optional-skills/research/research-paper-writing/templates/icml2026/`

- [AGENT] `example_paper.pdf`  .pdf
- [AGENT] `icml_numpapers.pdf`  .pdf

### 📂 `hermes-agent/optional-skills/research/scrapling/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/research/searxng-search/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/security/1password/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/security/1password/references/`

- [AGENT] `cli-examples.md`  .md
- [AGENT] `get-started.md`  .md

### 📂 `hermes-agent/optional-skills/security/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/optional-skills/security/godmode/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/security/godmode/references/`

- [AGENT] `jailbreak-templates.md`  .md
- [AGENT] `refusal-detection.md`  .md

### 📂 `hermes-agent/optional-skills/security/oss-forensics/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/security/oss-forensics/references/`

- [AGENT] `evidence-types.md`  .md
- [AGENT] `github-archive-guide.md`  .md
- [AGENT] `investigation-templates.md`  .md
- [AGENT] `recovery-techniques.md`  .md

### 📂 `hermes-agent/optional-skills/security/oss-forensics/templates/`

- [AGENT] `forensic-report.md`  .md
- [AGENT] `malicious-package-report.md`  .md

### 📂 `hermes-agent/optional-skills/security/sherlock/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/security/unbroker/`

- [AGENT] `README.md`  .md
- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/security/unbroker/references/legal/`

- [AGENT] `ccpa.md`  .md
- [AGENT] `drop.md`  .md
- [AGENT] `gdpr.md`  .md

### 📂 `hermes-agent/optional-skills/security/unbroker/references/`

- [AGENT] `methods.md`  .md
- [AGENT] `site-playbooks.md`  .md
- [AGENT] `state-machine.md`  .md

### 📂 `hermes-agent/optional-skills/security/unbroker/templates/consent/`

- [AGENT] `authorization.md`  .md

### 📂 `hermes-agent/optional-skills/security/unbroker/templates/emails/`

- [AGENT] `ccpa-authorized-agent.txt`  .txt
- [AGENT] `ccpa-deletion.txt`  .txt
- [AGENT] `ccpa-indirect-deletion.txt`  .txt
- [AGENT] `gdpr-erasure.txt`  .txt
- [AGENT] `generic-optout.txt`  .txt

### 📂 `hermes-agent/optional-skills/security/web-pentest/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/security/web-pentest/references/`

- [AGENT] `bypass-techniques.md`  .md
- [AGENT] `exploitation-techniques.md`  .md
- [AGENT] `scope-enforcement.md`  .md
- [AGENT] `vuln-taxonomy.md`  .md

### 📂 `hermes-agent/optional-skills/security/web-pentest/templates/`

- [AGENT] `authorization.md`  .md
- [AGENT] `pentest-report.md`  .md

### 📂 `hermes-agent/optional-skills/smart-home/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/optional-skills/smart-home/openhue/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/software-development/ast-grep/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/software-development/ast-grep/references/`

- [AGENT] `cli.md`  .md
- [AGENT] `install.md`  .md
- [AGENT] `patterns.md`  .md
- [AGENT] `pitfalls.md`  .md
- [AGENT] `recipes.md`  .md
- [AGENT] `sgconfig.md`  .md
- [AGENT] `yaml-rules.md`  .md

### 📂 `hermes-agent/optional-skills/software-development/code-wiki/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/software-development/code-wiki/templates/`

- [AGENT] `README.md`  .md
- [AGENT] `architecture.md`  .md
- [AGENT] `getting-started.md`  .md
- [AGENT] `module.md`  .md

### 📂 `hermes-agent/optional-skills/software-development/grill-me/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/software-development/rest-graphql-debug/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/software-development/subagent-driven-development/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/software-development/subagent-driven-development/references/`

- [AGENT] `context-budget-discipline.md`  .md
- [AGENT] `gates-taxonomy.md`  .md

### 📂 `hermes-agent/optional-skills/web-development/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/optional-skills/web-development/cloudflare-temporary-deploy/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/web-development/har-derived-api-client/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/web-development/page-agent/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/web-development/publish-site/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/optional-skills/yuanbao/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/plugins/disk-cleanup/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/plugins/google_meet/`

- [AGENT] `README.md`  .md
- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/plugins/hermes-achievements/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/plugins/memory/byterover/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/plugins/memory/hindsight/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/plugins/memory/holographic/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/plugins/memory/honcho/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/plugins/memory/mem0/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/plugins/memory/openviking/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/plugins/memory/retaindb/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/plugins/memory/supermemory/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/plugins/model-providers/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/plugins/observability/langfuse/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/plugins/platforms/a2a/`

- [AGENT] `DESIGN.md`  .md
- [AGENT] `README.md`  .md

### 📂 `hermes-agent/plugins/platforms/photon/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/plugins/platforms/photon/sidecar/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/plugins/security-guidance/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/providers/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/scripts/`

- [AGENT] `LIVETEST_README.md`  .md

### 📂 `hermes-agent/scripts/toolperf_abeval/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/skills/apple/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/skills/apple/apple-notes/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/apple/apple-reminders/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/apple/findmy/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/apple/imessage/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/autonomous-ai-agents/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/skills/autonomous-ai-agents/claude-code/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/autonomous-ai-agents/codex/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/autonomous-ai-agents/computer-use/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/autonomous-ai-agents/hermes-agent/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/autonomous-ai-agents/hermes-agent/references/`

- [AGENT] `background-systems.md`  .md
- [AGENT] `cli-reference.md`  .md
- [AGENT] `configuration.md`  .md
- [AGENT] `contributor-guide.md`  .md
- [AGENT] `delegate-task-concurrency-diagnosis.md`  .md
- [AGENT] `desktop-plugins.md`  .md
- [AGENT] `native-mcp.md`  .md
- [AGENT] `petdex.md`  .md
- [AGENT] `portal-auth-for-third-party-apps.md`  .md
- [AGENT] `project-context-files.md`  .md
- [AGENT] `providers-and-models.md`  .md
- [AGENT] `security-privacy.md`  .md
- [AGENT] `slash-commands.md`  .md
- [AGENT] `themes.md`  .md
- [AGENT] `troubleshooting.md`  .md
- [AGENT] `tui-widgets.md`  .md
- [AGENT] `webhooks.md`  .md
- [AGENT] `windows-quirks.md`  .md

### 📂 `hermes-agent/skills/autonomous-ai-agents/opencode/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/creative/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/skills/creative/architecture-diagram/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/creative/ascii-video/`

- [AGENT] `README.md`  .md
- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/creative/ascii-video/references/`

- [AGENT] `architecture.md`  .md
- [AGENT] `composition.md`  .md
- [AGENT] `effects.md`  .md
- [AGENT] `inputs.md`  .md
- [AGENT] `optimization.md`  .md
- [AGENT] `scenes.md`  .md
- [AGENT] `shaders.md`  .md
- [AGENT] `troubleshooting.md`  .md

### 📂 `hermes-agent/skills/creative/baoyu-infographic/`

- [AGENT] `PORT_NOTES.md`  .md
- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/creative/baoyu-infographic/references/`

- [AGENT] `analysis-framework.md`  .md
- [AGENT] `base-prompt.md`  .md
- [AGENT] `structured-content-template.md`  .md

### 📂 `hermes-agent/skills/creative/baoyu-infographic/references/layouts/`

- [AGENT] `bento-grid.md`  .md
- [AGENT] `binary-comparison.md`  .md
- [AGENT] `bridge.md`  .md
- [AGENT] `circular-flow.md`  .md
- [AGENT] `comic-strip.md`  .md
- [AGENT] `comparison-matrix.md`  .md
- [AGENT] `dashboard.md`  .md
- [AGENT] `dense-modules.md`  .md
- [AGENT] `funnel.md`  .md
- [AGENT] `hierarchical-layers.md`  .md
- [AGENT] `hub-spoke.md`  .md
- [AGENT] `iceberg.md`  .md
- [AGENT] `isometric-map.md`  .md
- [AGENT] `jigsaw.md`  .md
- [AGENT] `linear-progression.md`  .md
- [AGENT] `periodic-table.md`  .md
- [AGENT] `story-mountain.md`  .md
- [AGENT] `structural-breakdown.md`  .md
- [AGENT] `tree-branching.md`  .md
- [AGENT] `venn-diagram.md`  .md
- [AGENT] `winding-roadmap.md`  .md

### 📂 `hermes-agent/skills/creative/baoyu-infographic/references/styles/`

- [AGENT] `aged-academia.md`  .md
- [AGENT] `bold-graphic.md`  .md
- [AGENT] `chalkboard.md`  .md
- [AGENT] `claymation.md`  .md
- [AGENT] `corporate-memphis.md`  .md
- [AGENT] `craft-handmade.md`  .md
- [AGENT] `cyberpunk-neon.md`  .md
- [AGENT] `hand-drawn-edu.md`  .md
- [AGENT] `ikea-manual.md`  .md
- [AGENT] `kawaii.md`  .md
- [AGENT] `knolling.md`  .md
- [AGENT] `lego-brick.md`  .md
- [AGENT] `morandi-journal.md`  .md
- [AGENT] `origami.md`  .md
- [AGENT] `pixel-art.md`  .md
- [AGENT] `pop-laboratory.md`  .md
- [AGENT] `retro-pop-grid.md`  .md
- [AGENT] `storybook-watercolor.md`  .md
- [AGENT] `subway-map.md`  .md
- [AGENT] `technical-schematic.md`  .md
- [AGENT] `ui-wireframe.md`  .md

### 📂 `hermes-agent/skills/creative/claude-design/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/creative/design-md/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/creative/design-md/templates/`

- [AGENT] `starter.md`  .md

### 📂 `hermes-agent/skills/creative/humanizer/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/creative/manim-video/`

- [AGENT] `README.md`  .md
- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/creative/manim-video/references/`

- [AGENT] `animation-design-thinking.md`  .md
- [AGENT] `animations.md`  .md
- [AGENT] `camera-and-3d.md`  .md
- [AGENT] `decorations.md`  .md
- [AGENT] `equations.md`  .md
- [AGENT] `graphs-and-data.md`  .md
- [AGENT] `mobjects.md`  .md
- [AGENT] `paper-explainer.md`  .md
- [AGENT] `production-quality.md`  .md
- [AGENT] `rendering.md`  .md
- [AGENT] `scene-planning.md`  .md
- [AGENT] `troubleshooting.md`  .md
- [AGENT] `updaters-and-trackers.md`  .md
- [AGENT] `visual-design.md`  .md

### 📂 `hermes-agent/skills/creative/p5js/`

- [AGENT] `README.md`  .md
- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/creative/p5js/references/`

- [AGENT] `animation.md`  .md
- [AGENT] `color-systems.md`  .md
- [AGENT] `core-api.md`  .md
- [AGENT] `export-pipeline.md`  .md
- [AGENT] `interaction.md`  .md
- [AGENT] `shapes-and-geometry.md`  .md
- [AGENT] `troubleshooting.md`  .md
- [AGENT] `typography.md`  .md
- [AGENT] `visual-effects.md`  .md
- [AGENT] `webgl-and-3d.md`  .md

### 📂 `hermes-agent/skills/creative/popular-web-designs/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/creative/popular-web-designs/templates/`

- [AGENT] `airbnb.md`  .md
- [AGENT] `airtable.md`  .md
- [AGENT] `apple.md`  .md
- [AGENT] `bmw.md`  .md
- [AGENT] `cal.md`  .md
- [AGENT] `claude.md`  .md
- [AGENT] `clay.md`  .md
- [AGENT] `clickhouse.md`  .md
- [AGENT] `cohere.md`  .md
- [AGENT] `coinbase.md`  .md
- [AGENT] `composio.md`  .md
- [AGENT] `cursor.md`  .md
- [AGENT] `elevenlabs.md`  .md
- [AGENT] `expo.md`  .md
- [AGENT] `figma.md`  .md
- [AGENT] `framer.md`  .md
- [AGENT] `hashicorp.md`  .md
- [AGENT] `ibm.md`  .md
- [AGENT] `intercom.md`  .md
- [AGENT] `kraken.md`  .md
- [AGENT] `linear.app.md`  .md
- [AGENT] `lovable.md`  .md
- [AGENT] `minimax.md`  .md
- [AGENT] `mintlify.md`  .md
- [AGENT] `miro.md`  .md
- [AGENT] `mistral.ai.md`  .md
- [AGENT] `mongodb.md`  .md
- [AGENT] `notion.md`  .md
- [AGENT] `nvidia.md`  .md
- [AGENT] `ollama.md`  .md
- [AGENT] `opencode.ai.md`  .md
- [AGENT] `pinterest.md`  .md
- [AGENT] `posthog.md`  .md
- [AGENT] `raycast.md`  .md
- [AGENT] `replicate.md`  .md
- [AGENT] `resend.md`  .md
- [AGENT] `revolut.md`  .md
- [AGENT] `runwayml.md`  .md
- [AGENT] `sanity.md`  .md
- [AGENT] `sentry.md`  .md
- [AGENT] `spacex.md`  .md
- [AGENT] `spotify.md`  .md
- [AGENT] `stripe.md`  .md
- [AGENT] `supabase.md`  .md
- [AGENT] `superhuman.md`  .md
- [AGENT] `together.ai.md`  .md
- [AGENT] `uber.md`  .md
- [AGENT] `vercel.md`  .md
- [AGENT] `voltagent.md`  .md
- [AGENT] `warp.md`  .md
- [AGENT] `webflow.md`  .md
- [AGENT] `wise.md`  .md
- [AGENT] `x.ai.md`  .md
- [AGENT] `zapier.md`  .md

### 📂 `hermes-agent/skills/creative/songwriting-and-ai-music/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/devops/sdlc-review/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/email/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/skills/email/email-inbox-triage/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/email/himalaya/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/email/himalaya/references/`

- [AGENT] `configuration.md`  .md
- [AGENT] `message-composition.md`  .md

### 📂 `hermes-agent/skills/media/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/skills/media/gif-search/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/media/songsee/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/media/youtube-content/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/media/youtube-content/references/`

- [AGENT] `output-formats.md`  .md

### 📂 `hermes-agent/skills/note-taking/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/skills/note-taking/obsidian/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/productivity/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/skills/productivity/airtable/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/productivity/box/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/productivity/box/references/`

- [AGENT] `bulk-operations.md`  .md
- [AGENT] `cli-guide.md`  .md
- [AGENT] `content-workflows.md`  .md
- [AGENT] `hubs.md`  .md
- [AGENT] `oauth-setup.md`  .md
- [AGENT] `rest-api.md`  .md
- [AGENT] `sdk-development.md`  .md
- [AGENT] `search-and-ai.md`  .md
- [AGENT] `troubleshooting.md`  .md
- [AGENT] `webhooks-and-events.md`  .md

### 📂 `hermes-agent/skills/productivity/document-to-action-items/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/productivity/docx/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/productivity/docx/references/`

- [AGENT] `revisions-and-comments.md`  .md

### 📂 `hermes-agent/skills/productivity/google-workspace/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/productivity/google-workspace/references/`

- [AGENT] `daily-brief.md`  .md
- [AGENT] `gmail-search-syntax.md`  .md

### 📂 `hermes-agent/skills/productivity/maps/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/productivity/meeting-action-items/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/productivity/notion/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/productivity/notion/references/`

- [AGENT] `block-types.md`  .md

### 📂 `hermes-agent/skills/productivity/pdf/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/productivity/pdf/references/`

- [AGENT] `forms.md`  .md
- [AGENT] `nano-pdf-editing.md`  .md
- [AGENT] `ocr-extraction.md`  .md

### 📂 `hermes-agent/skills/productivity/powerpoint/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/productivity/product-price-monitor/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/productivity/teams-meeting-pipeline/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/productivity/weekly-review-planning/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/productivity/xlsx/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/productivity/xlsx/references/`

- [AGENT] `restructuring.md`  .md

### 📂 `hermes-agent/skills/research/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/skills/research/arxiv/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/research/competitor-news-monitor/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/research/grounded-citations/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/research/grounded-citations/references/`

- [AGENT] `citation-formats.md`  .md
- [AGENT] `grounding-rationale.md`  .md

### 📂 `hermes-agent/skills/research/llm-wiki/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/social-media/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/skills/social-media/xurl/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/software-development/codebase-inspection/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/software-development/dogfood/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/software-development/dogfood/references/`

- [AGENT] `issue-taxonomy.md`  .md

### 📂 `hermes-agent/skills/software-development/dogfood/templates/`

- [AGENT] `dogfood-report-template.md`  .md

### 📂 `hermes-agent/skills/software-development/github/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/software-development/github/references/`

- [AGENT] `auth.md`  .md
- [AGENT] `ci-troubleshooting.md`  .md
- [AGENT] `code-review.md`  .md
- [AGENT] `conventional-commits.md`  .md
- [AGENT] `github-api-cheatsheet.md`  .md
- [AGENT] `issue-to-pr.md`  .md
- [AGENT] `issues.md`  .md
- [AGENT] `pr-workflow.md`  .md
- [AGENT] `repo-management.md`  .md
- [AGENT] `review-output-template.md`  .md

### 📂 `hermes-agent/skills/software-development/github/templates/`

- [AGENT] `bug-report.md`  .md
- [AGENT] `feature-request.md`  .md
- [AGENT] `pr-body-bugfix.md`  .md
- [AGENT] `pr-body-feature.md`  .md

### 📂 `hermes-agent/skills/software-development/hermes-agent-skill-authoring/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/software-development/inspecting-hermes-desktop-dom/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/software-development/node-inspect-debugger/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/software-development/python-debugpy/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/software-development/requesting-code-review/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/software-development/simplify-code/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/software-development/spike/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/software-development/systematic-debugging/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/software-development/test-driven-development/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/skills/web/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `hermes-agent/skills/web/blocked-page-recovery/`

- [AGENT] `SKILL.md`  .md

### 📂 `hermes-agent/tests/conformance/persistence/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/tests/e2e/matrix_xsign_bootstrap/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/tools/neutts_samples/`

- [AGENT] `jo.txt`  .txt

### 📂 `hermes-agent/tools/wakewords/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/ui-tui/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/web/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/website/`

- [AGENT] `README.md`  .md

### 📂 `hermes-agent/website/docs/developer-guide/`

- [AGENT] `acp-internals.md`  .md
- [AGENT] `adding-platform-adapters.md`  .md
- [AGENT] `adding-providers.md`  .md
- [AGENT] `adding-tools.md`  .md
- [AGENT] `agent-loop.md`  .md
- [AGENT] `architecture.md`  .md
- [AGENT] `browser-provider-plugin.md`  .md
- [AGENT] `browser-supervisor.md`  .md
- [AGENT] `codebase-ownership.md`  .md
- [AGENT] `context-compression-and-caching.md`  .md
- [AGENT] `context-engine-plugin.md`  .md
- [AGENT] `contributing.md`  .md
- [AGENT] `creating-skills.md`  .md
- [AGENT] `cron-internals.md`  .md
- [AGENT] `desktop-plugin-sdk.md`  .md
- [AGENT] `egress-internals.md`  .md
- [AGENT] `extending-the-cli.md`  .md
- [AGENT] `gateway-internals.md`  .md
- [AGENT] `image-gen-provider-plugin.md`  .md
- [AGENT] `memory-provider-plugin.md`  .md
- [AGENT] `model-provider-plugin.md`  .md
- [AGENT] `plugin-llm-access.md`  .md
- [AGENT] `programmatic-integration.md`  .md
- [AGENT] `prompt-assembly.md`  .md
- [AGENT] `provider-runtime.md`  .md
- [AGENT] `secret-source-plugin.md`  .md
- [AGENT] `session-storage.md`  .md
- [AGENT] `subagent-lifecycle-api.md`  .md
- [AGENT] `terminal-environment-plugin.md`  .md
- [AGENT] `tools-runtime.md`  .md
- [AGENT] `trajectory-format.md`  .md
- [AGENT] `video-gen-provider-plugin.md`  .md
- [AGENT] `web-search-provider-plugin.md`  .md
- [AGENT] `worktree-ui-dev.md`  .md

### 📂 `hermes-agent/website/docs/developer-guide/plugins/`

- [AGENT] `index.md`  .md

### 📂 `hermes-agent/website/docs/getting-started/`

- [AGENT] `installation.md`  .md
- [AGENT] `learning-path.md`  .md
- [AGENT] `nix-setup.md`  .md
- [AGENT] `platform-support.md`  .md
- [AGENT] `quickstart.md`  .md
- [AGENT] `termux.md`  .md
- [AGENT] `updating.md`  .md

### 📂 `hermes-agent/website/docs/guides/`

- [AGENT] `agent-email-address.md`  .md
- [AGENT] `automate-with-cron.md`  .md
- [AGENT] `automation-blueprints.md`  .md
- [AGENT] `aws-bedrock.md`  .md
- [AGENT] `azure-foundry.md`  .md
- [AGENT] `cron-script-only.md`  .md
- [AGENT] `cron-troubleshooting.md`  .md
- [AGENT] `daily-briefing-bot.md`  .md
- [AGENT] `delegation-patterns.md`  .md
- [AGENT] `desktop-native-signin.md`  .md
- [AGENT] `github-pr-review-agent.md`  .md
- [AGENT] `google-gemini.md`  .md
- [AGENT] `google-vertex.md`  .md
- [AGENT] `local-llm-on-mac.md`  .md
- [AGENT] `local-ollama-setup.md`  .md
- [AGENT] `manage-hermes-cloud-with-mcp.md`  .md
- [AGENT] `microsoft-graph-app-registration.md`  .md
- [AGENT] `migrate-from-openclaw.md`  .md
- [AGENT] `minimax-oauth.md`  .md
- [AGENT] `oauth-over-ssh.md`  .md
- [AGENT] `operate-teams-meeting-pipeline.md`  .md
- [AGENT] `pipe-script-output.md`  .md
- [AGENT] `python-library.md`  .md
- [AGENT] `run-hermes-with-nous-portal.md`  .md
- [AGENT] `run-nemotron-3-ultra-free.md`  .md
- [AGENT] `secure-hermes-on-a-work-machine.md`  .md
- [AGENT] `team-telegram-assistant.md`  .md
- [AGENT] `tips.md`  .md
- [AGENT] `troubleshooting-agent-quality.md`  .md
- [AGENT] `use-mcp-with-hermes.md`  .md
- [AGENT] `use-soul-with-hermes.md`  .md
- [AGENT] `use-voice-mode-with-hermes.md`  .md
- [AGENT] `webhook-github-pr-review.md`  .md
- [AGENT] `work-with-skills.md`  .md
- [AGENT] `xai-grok-oauth.md`  .md

### 📂 `hermes-agent/website/docs/integrations/`

- [AGENT] `buzz.md`  .md
- [AGENT] `index.md`  .md
- [AGENT] `nous-portal.md`  .md
- [AGENT] `providers.md`  .md

### 📂 `hermes-agent/website/docs/reference/`

- [AGENT] `cli-commands.md`  .md
- [AGENT] `cli-symbols.md`  .md
- [AGENT] `environment-variables.md`  .md
- [AGENT] `faq.md`  .md
- [AGENT] `mcp-config-reference.md`  .md
- [AGENT] `model-catalog.md`  .md
- [AGENT] `optional-skills-catalog.md`  .md
- [AGENT] `profile-commands.md`  .md
- [AGENT] `skills-catalog.md`  .md
- [AGENT] `slash-commands.md`  .md
- [AGENT] `tools-reference.md`  .md
- [AGENT] `toolsets-reference.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/`

- [AGENT] `bot-mode.md`  .md
- [AGENT] `checkpoints-and-rollback.md`  .md
- [AGENT] `cli.md`  .md
- [AGENT] `configuration.md`  .md
- [AGENT] `configuring-models.md`  .md
- [AGENT] `desktop.md`  .md
- [AGENT] `docker.md`  .md
- [AGENT] `git-worktrees.md`  .md
- [AGENT] `import-from-other-agents.md`  .md
- [AGENT] `local-models.md`  .md
- [AGENT] `managed-scope.md`  .md
- [AGENT] `multi-connection-desktop.md`  .md
- [AGENT] `multi-profile-gateways.md`  .md
- [AGENT] `profile-distributions.md`  .md
- [AGENT] `profiles.md`  .md
- [AGENT] `security.md`  .md
- [AGENT] `sessions.md`  .md
- [AGENT] `tui.md`  .md
- [AGENT] `which-file-does-what.md`  .md
- [AGENT] `windows-native.md`  .md
- [AGENT] `windows-wsl-quickstart.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/egress/`

- [AGENT] `index.md`  .md
- [AGENT] `iron-proxy.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/features/`

- [AGENT] `acp.md`  .md
- [AGENT] `api-server.md`  .md
- [AGENT] `batch-processing.md`  .md
- [AGENT] `browser.md`  .md
- [AGENT] `built-in-plugins.md`  .md
- [AGENT] `code-execution.md`  .md
- [AGENT] `codex-app-server-runtime.md`  .md
- [AGENT] `computer-use.md`  .md
- [AGENT] `context-files.md`  .md
- [AGENT] `context-references.md`  .md
- [AGENT] `credential-pools.md`  .md
- [AGENT] `cron.md`  .md
- [AGENT] `curator.md`  .md
- [AGENT] `delegation.md`  .md
- [AGENT] `deliverable-mode.md`  .md
- [AGENT] `document-extraction.md`  .md
- [AGENT] `extending-the-dashboard.md`  .md
- [AGENT] `fallback-providers.md`  .md
- [AGENT] `goals.md`  .md
- [AGENT] `heartbeat.md`  .md
- [AGENT] `honcho.md`  .md
- [AGENT] `hooks.md`  .md
- [AGENT] `image-generation.md`  .md
- [AGENT] `kanban-tutorial.md`  .md
- [AGENT] `kanban-worker-lanes.md`  .md
- [AGENT] `kanban.md`  .md
- [AGENT] `loops.md`  .md
- [AGENT] `lsp.md`  .md
- [AGENT] `mcp.md`  .md
- [AGENT] `memory-providers.md`  .md
- [AGENT] `memory.md`  .md
- [AGENT] `mixture-of-agents.md`  .md
- [AGENT] `overview.md`  .md
- [AGENT] `personality.md`  .md
- [AGENT] `pets.md`  .md
- [AGENT] `plugins.md`  .md
- [AGENT] `provider-routing.md`  .md
- [AGENT] `skills.md`  .md
- [AGENT] `skins.md`  .md
- [AGENT] `spotify.md`  .md
- [AGENT] `subscription-proxy.md`  .md
- [AGENT] `tool-gateway.md`  .md
- [AGENT] `tool-search.md`  .md
- [AGENT] `tools.md`  .md
- [AGENT] `tts.md`  .md
- [AGENT] `vision.md`  .md
- [AGENT] `voice-mode.md`  .md
- [AGENT] `wake-word.md`  .md
- [AGENT] `web-dashboard.md`  .md
- [AGENT] `web-search.md`  .md
- [AGENT] `x-search.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/messaging/`

- [AGENT] `a2a.md`  .md
- [AGENT] `bluebubbles.md`  .md
- [AGENT] `buzz.md`  .md
- [AGENT] `dingtalk.md`  .md
- [AGENT] `discord.md`  .md
- [AGENT] `email.md`  .md
- [AGENT] `feishu.md`  .md
- [AGENT] `google_chat.md`  .md
- [AGENT] `homeassistant.md`  .md
- [AGENT] `index.md`  .md
- [AGENT] `irc.md`  .md
- [AGENT] `line.md`  .md
- [AGENT] `matrix.md`  .md
- [AGENT] `mattermost.md`  .md
- [AGENT] `msgraph-webhook.md`  .md
- [AGENT] `ntfy.md`  .md
- [AGENT] `open-webui.md`  .md
- [AGENT] `photon.md`  .md
- [AGENT] `qqbot.md`  .md
- [AGENT] `raft.md`  .md
- [AGENT] `relay.md`  .md
- [AGENT] `signal.md`  .md
- [AGENT] `simplex.md`  .md
- [AGENT] `slack.md`  .md
- [AGENT] `sms.md`  .md
- [AGENT] `teams-meetings.md`  .md
- [AGENT] `teams.md`  .md
- [AGENT] `telegram.md`  .md
- [AGENT] `webhooks.md`  .md
- [AGENT] `wecom-callback.md`  .md
- [AGENT] `wecom.md`  .md
- [AGENT] `weixin.md`  .md
- [AGENT] `whatsapp-cloud.md`  .md
- [AGENT] `whatsapp.md`  .md
- [AGENT] `yuanbao.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/secrets/`

- [AGENT] `bitwarden.md`  .md
- [AGENT] `command.md`  .md
- [AGENT] `index.md`  .md
- [AGENT] `onepassword.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/bundled/apple/`

- [AGENT] `apple-apple-notes.md`  .md
- [AGENT] `apple-apple-reminders.md`  .md
- [AGENT] `apple-findmy.md`  .md
- [AGENT] `apple-imessage.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/bundled/autonomous-ai-agents/`

- [AGENT] `autonomous-ai-agents-claude-code.md`  .md
- [AGENT] `autonomous-ai-agents-codex.md`  .md
- [AGENT] `autonomous-ai-agents-computer-use.md`  .md
- [AGENT] `autonomous-ai-agents-hermes-agent.md`  .md
- [AGENT] `autonomous-ai-agents-merge-reconciler.md`  .md
- [AGENT] `autonomous-ai-agents-opencode.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/bundled/creative/`

- [AGENT] `creative-architecture-diagram.md`  .md
- [AGENT] `creative-ascii-art.md`  .md
- [AGENT] `creative-ascii-video.md`  .md
- [AGENT] `creative-baoyu-infographic.md`  .md
- [AGENT] `creative-claude-design.md`  .md
- [AGENT] `creative-comfyui.md`  .md
- [AGENT] `creative-design-md.md`  .md
- [AGENT] `creative-excalidraw.md`  .md
- [AGENT] `creative-humanizer.md`  .md
- [AGENT] `creative-manim-video.md`  .md
- [AGENT] `creative-p5js.md`  .md
- [AGENT] `creative-popular-web-designs.md`  .md
- [AGENT] `creative-pretext.md`  .md
- [AGENT] `creative-sketch.md`  .md
- [AGENT] `creative-songwriting-and-ai-music.md`  .md
- [AGENT] `creative-touchdesigner-mcp.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/bundled/devops/`

- [AGENT] `devops-sdlc-review.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/bundled/email/`

- [AGENT] `email-email-inbox-triage.md`  .md
- [AGENT] `email-himalaya.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/bundled/github/`

- [AGENT] `github-codebase-inspection.md`  .md
- [AGENT] `github-github-auth.md`  .md
- [AGENT] `github-github-code-review.md`  .md
- [AGENT] `github-github-issue-to-pr.md`  .md
- [AGENT] `github-github-issues.md`  .md
- [AGENT] `github-github-pr-workflow.md`  .md
- [AGENT] `github-github-repo-management.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/bundled/media/`

- [AGENT] `media-gif-search.md`  .md
- [AGENT] `media-songsee.md`  .md
- [AGENT] `media-youtube-content.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/bundled/mlops/`

- [AGENT] `mlops-evaluation-evaluating-llms-harness.md`  .md
- [AGENT] `mlops-evaluation-weights-and-biases.md`  .md
- [AGENT] `mlops-huggingface-hub.md`  .md
- [AGENT] `mlops-inference-llama-cpp.md`  .md
- [AGENT] `mlops-inference-serving-llms-vllm.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/bundled/note-taking/`

- [AGENT] `note-taking-obsidian.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/bundled/productivity/`

- [AGENT] `productivity-airtable.md`  .md
- [AGENT] `productivity-box.md`  .md
- [AGENT] `productivity-document-to-action-items.md`  .md
- [AGENT] `productivity-docx.md`  .md
- [AGENT] `productivity-google-workspace.md`  .md
- [AGENT] `productivity-maps.md`  .md
- [AGENT] `productivity-meeting-action-items.md`  .md
- [AGENT] `productivity-nano-pdf.md`  .md
- [AGENT] `productivity-notion.md`  .md
- [AGENT] `productivity-ocr-and-documents.md`  .md
- [AGENT] `productivity-pdf.md`  .md
- [AGENT] `productivity-powerpoint.md`  .md
- [AGENT] `productivity-product-price-monitor.md`  .md
- [AGENT] `productivity-session-librarian.md`  .md
- [AGENT] `productivity-teams-meeting-pipeline.md`  .md
- [AGENT] `productivity-weekly-review-planning.md`  .md
- [AGENT] `productivity-xlsx.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/bundled/research/`

- [AGENT] `research-arxiv.md`  .md
- [AGENT] `research-blocked-page-recovery.md`  .md
- [AGENT] `research-blogwatcher.md`  .md
- [AGENT] `research-competitor-news-monitor.md`  .md
- [AGENT] `research-grounded-citations.md`  .md
- [AGENT] `research-llm-wiki.md`  .md
- [AGENT] `research-research-paper-writing.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/bundled/smart-home/`

- [AGENT] `smart-home-openhue.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/bundled/social-media/`

- [AGENT] `social-media-xurl.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/bundled/software-development/`

- [AGENT] `software-development-codebase-inspection.md`  .md
- [AGENT] `software-development-dogfood.md`  .md
- [AGENT] `software-development-github.md`  .md
- [AGENT] `software-development-hermes-agent-skill-authoring.md`  .md
- [AGENT] `software-development-inspecting-hermes-desktop-dom.md`  .md
- [AGENT] `software-development-node-inspect-debugger.md`  .md
- [AGENT] `software-development-python-debugpy.md`  .md
- [AGENT] `software-development-requesting-code-review.md`  .md
- [AGENT] `software-development-simplify-code.md`  .md
- [AGENT] `software-development-spike.md`  .md
- [AGENT] `software-development-systematic-debugging.md`  .md
- [AGENT] `software-development-test-driven-development.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/bundled/web/`

- [AGENT] `web-blocked-page-recovery.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/`

- [AGENT] `google-workspace.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/autonomous-ai-agents/`

- [AGENT] `autonomous-ai-agents-antigravity-cli.md`  .md
- [AGENT] `autonomous-ai-agents-blackbox.md`  .md
- [AGENT] `autonomous-ai-agents-grok.md`  .md
- [AGENT] `autonomous-ai-agents-honcho.md`  .md
- [AGENT] `autonomous-ai-agents-openhands.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/blockchain/`

- [AGENT] `blockchain-evm.md`  .md
- [AGENT] `blockchain-hyperliquid.md`  .md
- [AGENT] `blockchain-solana.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/communication/`

- [AGENT] `communication-one-three-one-rule.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/creative/`

- [AGENT] `creative-ascii-art.md`  .md
- [AGENT] `creative-audiocraft-audio-generation.md`  .md
- [AGENT] `creative-baoyu-article-illustrator.md`  .md
- [AGENT] `creative-baoyu-comic.md`  .md
- [AGENT] `creative-comfyui.md`  .md
- [AGENT] `creative-concept-diagrams.md`  .md
- [AGENT] `creative-creative-ideation.md`  .md
- [AGENT] `creative-draw-your-font.md`  .md
- [AGENT] `creative-excalidraw.md`  .md
- [AGENT] `creative-heartmula.md`  .md
- [AGENT] `creative-hyperframes.md`  .md
- [AGENT] `creative-impeccable.md`  .md
- [AGENT] `creative-kanban-video-orchestrator.md`  .md
- [AGENT] `creative-meme-generation.md`  .md
- [AGENT] `creative-pixel-art.md`  .md
- [AGENT] `creative-pretext.md`  .md
- [AGENT] `creative-simple-english.md`  .md
- [AGENT] `creative-sketch.md`  .md
- [AGENT] `creative-social-media-content-calendar.md`  .md
- [AGENT] `creative-tldraw-offline.md`  .md
- [AGENT] `creative-touchdesigner-mcp.md`  .md
- [AGENT] `creative-unreal-mcp.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/data-science/`

- [AGENT] `data-science-jupyter-notebook.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/devops/`

- [AGENT] `devops-actual-setup.md`  .md
- [AGENT] `devops-docker-management.md`  .md
- [AGENT] `devops-hermes-s6-container-supervision.md`  .md
- [AGENT] `devops-inference-sh-cli.md`  .md
- [AGENT] `devops-pinggy-tunnel.md`  .md
- [AGENT] `devops-setup-wizard-generator.md`  .md
- [AGENT] `devops-watchers.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/dogfood/`

- [AGENT] `dogfood-adversarial-ux-test.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/email/`

- [AGENT] `email-agentmail.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/finance/`

- [AGENT] `finance-3-statement-model.md`  .md
- [AGENT] `finance-comps-analysis.md`  .md
- [AGENT] `finance-dcf-model.md`  .md
- [AGENT] `finance-excel-author.md`  .md
- [AGENT] `finance-lbo-model.md`  .md
- [AGENT] `finance-merger-model.md`  .md
- [AGENT] `finance-polymarket.md`  .md
- [AGENT] `finance-pptx-author.md`  .md
- [AGENT] `finance-stocks.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/gaming/`

- [AGENT] `gaming-minecraft-modpack-server.md`  .md
- [AGENT] `gaming-pokemon-player.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/health/`

- [AGENT] `health-fitness-nutrition.md`  .md
- [AGENT] `health-neuroskill-bci.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/mcp/`

- [AGENT] `mcp-fastmcp.md`  .md
- [AGENT] `mcp-mcp-oauth-remote-gateway.md`  .md
- [AGENT] `mcp-mcporter.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/migration/`

- [AGENT] `migration-openclaw-migration.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/mlops/`

- [AGENT] `mlops-accelerate.md`  .md
- [AGENT] `mlops-chroma.md`  .md
- [AGENT] `mlops-clip.md`  .md
- [AGENT] `mlops-evaluation-evaluating-llms-harness.md`  .md
- [AGENT] `mlops-evaluation-weights-and-biases.md`  .md
- [AGENT] `mlops-faiss.md`  .md
- [AGENT] `mlops-flash-attention.md`  .md
- [AGENT] `mlops-guidance.md`  .md
- [AGENT] `mlops-huggingface-tokenizers.md`  .md
- [AGENT] `mlops-inference-llama-cpp.md`  .md
- [AGENT] `mlops-inference-outlines.md`  .md
- [AGENT] `mlops-inference-serving-llms-vllm.md`  .md
- [AGENT] `mlops-instructor.md`  .md
- [AGENT] `mlops-lambda-labs.md`  .md
- [AGENT] `mlops-llava.md`  .md
- [AGENT] `mlops-modal.md`  .md
- [AGENT] `mlops-models-huggingface-hub.md`  .md
- [AGENT] `mlops-models-segment-anything-model.md`  .md
- [AGENT] `mlops-nemo-curator.md`  .md
- [AGENT] `mlops-obliteratus.md`  .md
- [AGENT] `mlops-peft.md`  .md
- [AGENT] `mlops-pinecone.md`  .md
- [AGENT] `mlops-pytorch-fsdp.md`  .md
- [AGENT] `mlops-pytorch-lightning.md`  .md
- [AGENT] `mlops-qdrant.md`  .md
- [AGENT] `mlops-research-dspy.md`  .md
- [AGENT] `mlops-saelens.md`  .md
- [AGENT] `mlops-simpo.md`  .md
- [AGENT] `mlops-slime.md`  .md
- [AGENT] `mlops-stable-diffusion.md`  .md
- [AGENT] `mlops-tensorrt-llm.md`  .md
- [AGENT] `mlops-torchtitan.md`  .md
- [AGENT] `mlops-training-axolotl.md`  .md
- [AGENT] `mlops-training-trl-fine-tuning.md`  .md
- [AGENT] `mlops-training-unsloth.md`  .md
- [AGENT] `mlops-whisper.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/payments/`

- [AGENT] `payments-mpp-agent.md`  .md
- [AGENT] `payments-stripe-link-cli.md`  .md
- [AGENT] `payments-stripe-projects.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/productivity/`

- [AGENT] `productivity-canvas.md`  .md
- [AGENT] `productivity-decision-questionnaire.md`  .md
- [AGENT] `productivity-here-now.md`  .md
- [AGENT] `productivity-memento-flashcards.md`  .md
- [AGENT] `productivity-shop.md`  .md
- [AGENT] `productivity-shopify.md`  .md
- [AGENT] `productivity-siyuan.md`  .md
- [AGENT] `productivity-telephony.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/research/`

- [AGENT] `research-bioinformatics.md`  .md
- [AGENT] `research-blogwatcher.md`  .md
- [AGENT] `research-darwinian-evolver.md`  .md
- [AGENT] `research-domain-intel.md`  .md
- [AGENT] `research-drug-discovery.md`  .md
- [AGENT] `research-duckduckgo-search.md`  .md
- [AGENT] `research-gitnexus-explorer.md`  .md
- [AGENT] `research-osint-investigation.md`  .md
- [AGENT] `research-parallel-cli.md`  .md
- [AGENT] `research-pinecone-research.md`  .md
- [AGENT] `research-qmd.md`  .md
- [AGENT] `research-research-paper-writing.md`  .md
- [AGENT] `research-scrapling.md`  .md
- [AGENT] `research-searxng-search.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/security/`

- [AGENT] `security-1password.md`  .md
- [AGENT] `security-godmode.md`  .md
- [AGENT] `security-oss-forensics.md`  .md
- [AGENT] `security-sherlock.md`  .md
- [AGENT] `security-unbroker.md`  .md
- [AGENT] `security-web-pentest.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/smart-home/`

- [AGENT] `smart-home-openhue.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/software-development/`

- [AGENT] `software-development-ast-grep.md`  .md
- [AGENT] `software-development-code-wiki.md`  .md
- [AGENT] `software-development-grill-me.md`  .md
- [AGENT] `software-development-rest-graphql-debug.md`  .md
- [AGENT] `software-development-subagent-driven-development.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/web-development/`

- [AGENT] `web-development-cloudflare-temporary-deploy.md`  .md
- [AGENT] `web-development-har-derived-api-client.md`  .md
- [AGENT] `web-development-page-agent.md`  .md
- [AGENT] `web-development-publish-site.md`  .md

### 📂 `hermes-agent/website/docs/user-guide/skills/optional/yuanbao/`

- [AGENT] `yuanbao-yuanbao.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/developer-guide/`

- [AGENT] `acp-internals.md`  .md
- [AGENT] `adding-platform-adapters.md`  .md
- [AGENT] `adding-providers.md`  .md
- [AGENT] `adding-tools.md`  .md
- [AGENT] `agent-loop.md`  .md
- [AGENT] `architecture.md`  .md
- [AGENT] `browser-supervisor.md`  .md
- [AGENT] `context-compression-and-caching.md`  .md
- [AGENT] `context-engine-plugin.md`  .md
- [AGENT] `contributing.md`  .md
- [AGENT] `creating-skills.md`  .md
- [AGENT] `cron-internals.md`  .md
- [AGENT] `extending-the-cli.md`  .md
- [AGENT] `gateway-internals.md`  .md
- [AGENT] `image-gen-provider-plugin.md`  .md
- [AGENT] `memory-provider-plugin.md`  .md
- [AGENT] `model-provider-plugin.md`  .md
- [AGENT] `plugin-llm-access.md`  .md
- [AGENT] `programmatic-integration.md`  .md
- [AGENT] `prompt-assembly.md`  .md
- [AGENT] `provider-runtime.md`  .md
- [AGENT] `session-storage.md`  .md
- [AGENT] `tools-runtime.md`  .md
- [AGENT] `trajectory-format.md`  .md
- [AGENT] `video-gen-provider-plugin.md`  .md
- [AGENT] `web-search-provider-plugin.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/developer-guide/plugins/`

- [AGENT] `index.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/getting-started/`

- [AGENT] `installation.md`  .md
- [AGENT] `learning-path.md`  .md
- [AGENT] `nix-setup.md`  .md
- [AGENT] `quickstart.md`  .md
- [AGENT] `termux.md`  .md
- [AGENT] `updating.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/guides/`

- [AGENT] `automate-with-cron.md`  .md
- [AGENT] `automation-blueprints.md`  .md
- [AGENT] `aws-bedrock.md`  .md
- [AGENT] `azure-foundry.md`  .md
- [AGENT] `cron-script-only.md`  .md
- [AGENT] `cron-troubleshooting.md`  .md
- [AGENT] `daily-briefing-bot.md`  .md
- [AGENT] `delegation-patterns.md`  .md
- [AGENT] `github-pr-review-agent.md`  .md
- [AGENT] `google-gemini.md`  .md
- [AGENT] `local-llm-on-mac.md`  .md
- [AGENT] `local-ollama-setup.md`  .md
- [AGENT] `microsoft-graph-app-registration.md`  .md
- [AGENT] `migrate-from-openclaw.md`  .md
- [AGENT] `minimax-oauth.md`  .md
- [AGENT] `oauth-over-ssh.md`  .md
- [AGENT] `operate-teams-meeting-pipeline.md`  .md
- [AGENT] `pipe-script-output.md`  .md
- [AGENT] `python-library.md`  .md
- [AGENT] `run-hermes-with-nous-portal.md`  .md
- [AGENT] `team-telegram-assistant.md`  .md
- [AGENT] `tips.md`  .md
- [AGENT] `use-mcp-with-hermes.md`  .md
- [AGENT] `use-soul-with-hermes.md`  .md
- [AGENT] `use-voice-mode-with-hermes.md`  .md
- [AGENT] `webhook-github-pr-review.md`  .md
- [AGENT] `work-with-skills.md`  .md
- [AGENT] `xai-grok-oauth.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/integrations/`

- [AGENT] `buzz.md`  .md
- [AGENT] `index.md`  .md
- [AGENT] `nous-portal.md`  .md
- [AGENT] `providers.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/reference/`

- [AGENT] `cli-commands.md`  .md
- [AGENT] `environment-variables.md`  .md
- [AGENT] `faq.md`  .md
- [AGENT] `mcp-config-reference.md`  .md
- [AGENT] `model-catalog.md`  .md
- [AGENT] `optional-skills-catalog.md`  .md
- [AGENT] `profile-commands.md`  .md
- [AGENT] `skills-catalog.md`  .md
- [AGENT] `slash-commands.md`  .md
- [AGENT] `tools-reference.md`  .md
- [AGENT] `toolsets-reference.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/`

- [AGENT] `checkpoints-and-rollback.md`  .md
- [AGENT] `cli.md`  .md
- [AGENT] `configuration.md`  .md
- [AGENT] `configuring-models.md`  .md
- [AGENT] `docker.md`  .md
- [AGENT] `git-worktrees.md`  .md
- [AGENT] `profile-distributions.md`  .md
- [AGENT] `profiles.md`  .md
- [AGENT] `security.md`  .md
- [AGENT] `sessions.md`  .md
- [AGENT] `tui.md`  .md
- [AGENT] `windows-native.md`  .md
- [AGENT] `windows-wsl-quickstart.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/features/`

- [AGENT] `acp.md`  .md
- [AGENT] `api-server.md`  .md
- [AGENT] `batch-processing.md`  .md
- [AGENT] `browser.md`  .md
- [AGENT] `built-in-plugins.md`  .md
- [AGENT] `code-execution.md`  .md
- [AGENT] `codex-app-server-runtime.md`  .md
- [AGENT] `computer-use.md`  .md
- [AGENT] `context-files.md`  .md
- [AGENT] `context-references.md`  .md
- [AGENT] `credential-pools.md`  .md
- [AGENT] `cron.md`  .md
- [AGENT] `curator.md`  .md
- [AGENT] `delegation.md`  .md
- [AGENT] `deliverable-mode.md`  .md
- [AGENT] `extending-the-dashboard.md`  .md
- [AGENT] `fallback-providers.md`  .md
- [AGENT] `goals.md`  .md
- [AGENT] `honcho.md`  .md
- [AGENT] `hooks.md`  .md
- [AGENT] `image-generation.md`  .md
- [AGENT] `kanban-tutorial.md`  .md
- [AGENT] `kanban-worker-lanes.md`  .md
- [AGENT] `kanban.md`  .md
- [AGENT] `lsp.md`  .md
- [AGENT] `mcp.md`  .md
- [AGENT] `memory-providers.md`  .md
- [AGENT] `memory.md`  .md
- [AGENT] `overview.md`  .md
- [AGENT] `personality.md`  .md
- [AGENT] `plugins.md`  .md
- [AGENT] `provider-routing.md`  .md
- [AGENT] `skills.md`  .md
- [AGENT] `skins.md`  .md
- [AGENT] `spotify.md`  .md
- [AGENT] `subscription-proxy.md`  .md
- [AGENT] `tool-gateway.md`  .md
- [AGENT] `tools.md`  .md
- [AGENT] `tts.md`  .md
- [AGENT] `vision.md`  .md
- [AGENT] `voice-mode.md`  .md
- [AGENT] `web-dashboard.md`  .md
- [AGENT] `web-search.md`  .md
- [AGENT] `x-search.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/messaging/`

- [AGENT] `bluebubbles.md`  .md
- [AGENT] `dingtalk.md`  .md
- [AGENT] `discord.md`  .md
- [AGENT] `email.md`  .md
- [AGENT] `feishu.md`  .md
- [AGENT] `google_chat.md`  .md
- [AGENT] `homeassistant.md`  .md
- [AGENT] `index.md`  .md
- [AGENT] `line.md`  .md
- [AGENT] `matrix.md`  .md
- [AGENT] `mattermost.md`  .md
- [AGENT] `msgraph-webhook.md`  .md
- [AGENT] `ntfy.md`  .md
- [AGENT] `open-webui.md`  .md
- [AGENT] `qqbot.md`  .md
- [AGENT] `signal.md`  .md
- [AGENT] `simplex.md`  .md
- [AGENT] `slack.md`  .md
- [AGENT] `sms.md`  .md
- [AGENT] `teams-meetings.md`  .md
- [AGENT] `teams.md`  .md
- [AGENT] `telegram.md`  .md
- [AGENT] `webhooks.md`  .md
- [AGENT] `wecom-callback.md`  .md
- [AGENT] `wecom.md`  .md
- [AGENT] `weixin.md`  .md
- [AGENT] `whatsapp.md`  .md
- [AGENT] `yuanbao.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/secrets/`

- [AGENT] `bitwarden.md`  .md
- [AGENT] `index.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/bundled/apple/`

- [AGENT] `apple-apple-notes.md`  .md
- [AGENT] `apple-apple-reminders.md`  .md
- [AGENT] `apple-findmy.md`  .md
- [AGENT] `apple-imessage.md`  .md
- [AGENT] `apple-macos-computer-use.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/bundled/autonomous-ai-agents/`

- [AGENT] `autonomous-ai-agents-claude-code.md`  .md
- [AGENT] `autonomous-ai-agents-codex.md`  .md
- [AGENT] `autonomous-ai-agents-hermes-agent.md`  .md
- [AGENT] `autonomous-ai-agents-opencode.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/bundled/creative/`

- [AGENT] `creative-architecture-diagram.md`  .md
- [AGENT] `creative-ascii-art.md`  .md
- [AGENT] `creative-ascii-video.md`  .md
- [AGENT] `creative-baoyu-infographic.md`  .md
- [AGENT] `creative-claude-design.md`  .md
- [AGENT] `creative-comfyui.md`  .md
- [AGENT] `creative-design-md.md`  .md
- [AGENT] `creative-excalidraw.md`  .md
- [AGENT] `creative-humanizer.md`  .md
- [AGENT] `creative-manim-video.md`  .md
- [AGENT] `creative-p5js.md`  .md
- [AGENT] `creative-popular-web-designs.md`  .md
- [AGENT] `creative-pretext.md`  .md
- [AGENT] `creative-sketch.md`  .md
- [AGENT] `creative-songwriting-and-ai-music.md`  .md
- [AGENT] `creative-touchdesigner-mcp.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/bundled/email/`

- [AGENT] `email-himalaya.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/bundled/github/`

- [AGENT] `github-codebase-inspection.md`  .md
- [AGENT] `github-github-auth.md`  .md
- [AGENT] `github-github-code-review.md`  .md
- [AGENT] `github-github-issues.md`  .md
- [AGENT] `github-github-pr-workflow.md`  .md
- [AGENT] `github-github-repo-management.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/bundled/media/`

- [AGENT] `media-gif-search.md`  .md
- [AGENT] `media-songsee.md`  .md
- [AGENT] `media-youtube-content.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/bundled/mlops/`

- [AGENT] `mlops-evaluation-evaluating-llms-harness.md`  .md
- [AGENT] `mlops-evaluation-weights-and-biases.md`  .md
- [AGENT] `mlops-huggingface-hub.md`  .md
- [AGENT] `mlops-inference-llama-cpp.md`  .md
- [AGENT] `mlops-inference-serving-llms-vllm.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/bundled/note-taking/`

- [AGENT] `note-taking-obsidian.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/bundled/productivity/`

- [AGENT] `productivity-airtable.md`  .md
- [AGENT] `productivity-google-workspace.md`  .md
- [AGENT] `productivity-maps.md`  .md
- [AGENT] `productivity-nano-pdf.md`  .md
- [AGENT] `productivity-notion.md`  .md
- [AGENT] `productivity-ocr-and-documents.md`  .md
- [AGENT] `productivity-powerpoint.md`  .md
- [AGENT] `productivity-teams-meeting-pipeline.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/bundled/research/`

- [AGENT] `research-arxiv.md`  .md
- [AGENT] `research-blogwatcher.md`  .md
- [AGENT] `research-llm-wiki.md`  .md
- [AGENT] `research-research-paper-writing.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/bundled/smart-home/`

- [AGENT] `smart-home-openhue.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/bundled/social-media/`

- [AGENT] `social-media-xurl.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/bundled/software-development/`

- [AGENT] `software-development-dogfood.md`  .md
- [AGENT] `software-development-hermes-agent-skill-authoring.md`  .md
- [AGENT] `software-development-node-inspect-debugger.md`  .md
- [AGENT] `software-development-python-debugpy.md`  .md
- [AGENT] `software-development-requesting-code-review.md`  .md
- [AGENT] `software-development-spike.md`  .md
- [AGENT] `software-development-systematic-debugging.md`  .md
- [AGENT] `software-development-test-driven-development.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/`

- [AGENT] `google-workspace.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/optional/autonomous-ai-agents/`

- [AGENT] `autonomous-ai-agents-blackbox.md`  .md
- [AGENT] `autonomous-ai-agents-honcho.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/optional/blockchain/`

- [AGENT] `blockchain-evm.md`  .md
- [AGENT] `blockchain-hyperliquid.md`  .md
- [AGENT] `blockchain-solana.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/optional/communication/`

- [AGENT] `communication-one-three-one-rule.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/optional/creative/`

- [AGENT] `creative-audiocraft-audio-generation.md`  .md
- [AGENT] `creative-concept-diagrams.md`  .md
- [AGENT] `creative-heartmula.md`  .md
- [AGENT] `creative-hyperframes.md`  .md
- [AGENT] `creative-kanban-video-orchestrator.md`  .md
- [AGENT] `creative-meme-generation.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/optional/data-science/`

- [AGENT] `data-science-jupyter-notebook.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/optional/devops/`

- [AGENT] `devops-docker-management.md`  .md
- [AGENT] `devops-inference-sh-cli.md`  .md
- [AGENT] `devops-pinggy-tunnel.md`  .md
- [AGENT] `devops-watchers.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/optional/dogfood/`

- [AGENT] `dogfood-adversarial-ux-test.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/optional/email/`

- [AGENT] `email-agentmail.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/optional/finance/`

- [AGENT] `finance-3-statement-model.md`  .md
- [AGENT] `finance-comps-analysis.md`  .md
- [AGENT] `finance-dcf-model.md`  .md
- [AGENT] `finance-excel-author.md`  .md
- [AGENT] `finance-lbo-model.md`  .md
- [AGENT] `finance-merger-model.md`  .md
- [AGENT] `finance-polymarket.md`  .md
- [AGENT] `finance-pptx-author.md`  .md
- [AGENT] `finance-stocks.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/optional/health/`

- [AGENT] `health-fitness-nutrition.md`  .md
- [AGENT] `health-neuroskill-bci.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/optional/mcp/`

- [AGENT] `mcp-fastmcp.md`  .md
- [AGENT] `mcp-mcporter.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/optional/migration/`

- [AGENT] `migration-openclaw-migration.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/optional/mlops/`

- [AGENT] `mlops-accelerate.md`  .md
- [AGENT] `mlops-chroma.md`  .md
- [AGENT] `mlops-clip.md`  .md
- [AGENT] `mlops-faiss.md`  .md
- [AGENT] `mlops-flash-attention.md`  .md
- [AGENT] `mlops-guidance.md`  .md
- [AGENT] `mlops-huggingface-tokenizers.md`  .md
- [AGENT] `mlops-inference-outlines.md`  .md
- [AGENT] `mlops-instructor.md`  .md
- [AGENT] `mlops-lambda-labs.md`  .md
- [AGENT] `mlops-llava.md`  .md
- [AGENT] `mlops-modal.md`  .md
- [AGENT] `mlops-models-segment-anything-model.md`  .md
- [AGENT] `mlops-nemo-curator.md`  .md
- [AGENT] `mlops-peft.md`  .md
- [AGENT] `mlops-pinecone.md`  .md
- [AGENT] `mlops-pytorch-fsdp.md`  .md
- [AGENT] `mlops-pytorch-lightning.md`  .md
- [AGENT] `mlops-qdrant.md`  .md
- [AGENT] `mlops-saelens.md`  .md
- [AGENT] `mlops-simpo.md`  .md
- [AGENT] `mlops-slime.md`  .md
- [AGENT] `mlops-stable-diffusion.md`  .md
- [AGENT] `mlops-tensorrt-llm.md`  .md
- [AGENT] `mlops-torchtitan.md`  .md
- [AGENT] `mlops-training-axolotl.md`  .md
- [AGENT] `mlops-training-trl-fine-tuning.md`  .md
- [AGENT] `mlops-training-unsloth.md`  .md
- [AGENT] `mlops-whisper.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/optional/productivity/`

- [AGENT] `productivity-canvas.md`  .md
- [AGENT] `productivity-here-now.md`  .md
- [AGENT] `productivity-memento-flashcards.md`  .md
- [AGENT] `productivity-shop.md`  .md
- [AGENT] `productivity-shopify.md`  .md
- [AGENT] `productivity-siyuan.md`  .md
- [AGENT] `productivity-telephony.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/optional/research/`

- [AGENT] `research-bioinformatics.md`  .md
- [AGENT] `research-darwinian-evolver.md`  .md
- [AGENT] `research-domain-intel.md`  .md
- [AGENT] `research-drug-discovery.md`  .md
- [AGENT] `research-duckduckgo-search.md`  .md
- [AGENT] `research-gitnexus-explorer.md`  .md
- [AGENT] `research-osint-investigation.md`  .md
- [AGENT] `research-parallel-cli.md`  .md
- [AGENT] `research-qmd.md`  .md
- [AGENT] `research-scrapling.md`  .md
- [AGENT] `research-searxng-search.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/optional/security/`

- [AGENT] `security-1password.md`  .md
- [AGENT] `security-oss-forensics.md`  .md
- [AGENT] `security-sherlock.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/optional/software-development/`

- [AGENT] `software-development-rest-graphql-debug.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/optional/web-development/`

- [AGENT] `web-development-page-agent.md`  .md

### 📂 `hermes-agent/website/i18n/zh-Hans/docusaurus-plugin-content-docs/current/user-guide/skills/optional/yuanbao/`

- [AGENT] `yuanbao-yuanbao.md`  .md

### 📂 `logs/curator/20260826-230327/`

- [AGENT] `REPORT.md`  .md

### 📂 `logs/curator/20260902-232246/`

- [AGENT] `REPORT.md`  .md

### 📂 `memories/`

- [AGENT] `MEMORY.md`  .md
- [AGENT] `USER.md`  .md

### 📂 `pastes/`

- [AGENT] `paste_1_085548.txt`  .txt
- [AGENT] `paste_1_114924.txt`  .txt
- [AGENT] `paste_1_121838.txt`  .txt
- [AGENT] `paste_1_123131.txt`  .txt
- [AGENT] `paste_1_140835.txt`  .txt
- [AGENT] `paste_1_142645.txt`  .txt
- [AGENT] `paste_1_154207.txt`  .txt
- [AGENT] `paste_1_184541.txt`  .txt
- [AGENT] `paste_1_221905.txt`  .txt
- [AGENT] `paste_2_085816.txt`  .txt
- [AGENT] `paste_2_160157.txt`  .txt
- [AGENT] `paste_2_190802.txt`  .txt
- [AGENT] `paste_2_202714.txt`  .txt
- [AGENT] `paste_2_231234.txt`  .txt
- [AGENT] `paste_3_001649.txt`  .txt
- [AGENT] `paste_3_160202.txt`  .txt
- [AGENT] `paste_3_213322.txt`  .txt
- [AGENT] `paste_3_220842.txt`  .txt
- [AGENT] `paste_4_010612.txt`  .txt
- [AGENT] `paste_4_214622.txt`  .txt
- [AGENT] `paste_4_224433.txt`  .txt
- [AGENT] `paste_5_214920.txt`  .txt
- [AGENT] `paste_5_230244.txt`  .txt
- [AGENT] `paste_6_215412.txt`  .txt
- [AGENT] `paste_7_215434.txt`  .txt

### 📂 `plans/`

- [AGENT] `2026-06-26_093000-paos-remaining-work.md`  .md
- [AGENT] `2026-06-26_103000-paos-v2-enhancements.md`  .md
- [AGENT] `2026-06-26_120000-paos-enhancements-234.md`  .md
- [AGENT] `2026-06-26_122000-brainstorm-implementation.md`  .md

### 📂 `skills/agent-gateway-provider-config/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/agent-gateway-provider-config/references/`

- [AGENT] `omniroute-gateway.md`  .md

### 📂 `skills/apple/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `skills/apple/apple-notes/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/apple/apple-reminders/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/apple/findmy/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/apple/imessage/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/apple/macos-computer-use/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/autonomous-ai-agents/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `skills/autonomous-ai-agents/hermes-agent/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/autonomous-ai-agents/hermes-agent/references/`

- [AGENT] `background-systems.md`  .md
- [AGENT] `cli-reference.md`  .md
- [AGENT] `configuration.md`  .md
- [AGENT] `contributor-guide.md`  .md
- [AGENT] `delegate-task-concurrency-diagnosis.md`  .md
- [AGENT] `desktop-plugins.md`  .md
- [AGENT] `native-mcp.md`  .md
- [AGENT] `petdex.md`  .md
- [AGENT] `portal-auth-for-third-party-apps.md`  .md
- [AGENT] `project-context-files.md`  .md
- [AGENT] `providers-and-models.md`  .md
- [AGENT] `security-privacy.md`  .md
- [AGENT] `slash-commands.md`  .md
- [AGENT] `themes.md`  .md
- [AGENT] `troubleshooting.md`  .md
- [AGENT] `tui-widgets.md`  .md
- [AGENT] `webhooks.md`  .md
- [AGENT] `windows-quirks.md`  .md

### 📂 `skills/autonomous-ai-agents/merge-reconciler/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/creative/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `skills/creative/archify/`

- [AGENT] `CHANGELOG.md`  .md
- [AGENT] `CONTRIBUTING.md`  .md
- [AGENT] `DESIGN.md`  .md
- [AGENT] `PRODUCT.md`  .md
- [AGENT] `README.md`  .md
- [AGENT] `README_EN.md`  .md
- [AGENT] `README_ZH.md`  .md
- [AGENT] `ROADMAP.md`  .md
- [AGENT] `SECURITY.md`  .md
- [AGENT] `SKILL.md`  .md
- [AGENT] `THIRD_PARTY_NOTICES.md`  .md

### 📂 `skills/creative/archify/archify/`

- [AGENT] `THIRD_PARTY_NOTICES.md`  .md
- [AGENT] `UPSTREAM_SKILL.md`  .md

### 📂 `skills/creative/archify/archify/brand-marks/`

- [AGENT] `README.md`  .md

### 📂 `skills/creative/archify/archify/references/`

- [AGENT] `authoring-contract.md`  .md
- [AGENT] `brand-marks.md`  .md
- [AGENT] `delivery-contract.md`  .md
- [AGENT] `viewer-runtime.md`  .md

### 📂 `skills/creative/archify/archify/renderers/dataflow/`

- [AGENT] `README.md`  .md

### 📂 `skills/creative/archify/archify/renderers/lifecycle/`

- [AGENT] `README.md`  .md

### 📂 `skills/creative/archify/archify/renderers/sequence/`

- [AGENT] `README.md`  .md

### 📂 `skills/creative/archify/archify/renderers/workflow/`

- [AGENT] `README.md`  .md

### 📂 `skills/creative/archify/archify/schemas/`

- [AGENT] `README.md`  .md

### 📂 `skills/creative/archify/benchmarks/ordinary-model-floor/`

- [AGENT] `README.md`  .md

### 📂 `skills/creative/archify/benchmarks/ordinary-model-floor/prompts/`

- [AGENT] `agent-run.lifecycle.md`  .md
- [AGENT] `agent-tool-call.workflow.md`  .md
- [AGENT] `cache-miss.sequence.md`  .md
- [AGENT] `product-analytics.dataflow.md`  .md
- [AGENT] `web-runtime.architecture.md`  .md

### 📂 `skills/creative/archify/docs/`

- [AGENT] `article-archify.md`  .md
- [AGENT] `artifact-install-v2-measurement.md`  .md
- [AGENT] `authoring-cookbook.md`  .md
- [AGENT] `authoring-cookbook.zh-CN.md`  .md
- [AGENT] `cursor-acceptance-2026-07.md`  .md
- [AGENT] `deployment-ownership-profile-acceptance-2026-07-23.md`  .md
- [AGENT] `research-architecture-delta-pr-proof-2026-07-23.md`  .md
- [AGENT] `research-authored-reachability-2026-07-23.md`  .md
- [AGENT] `research-cursor-onboarding-2026-07.md`  .md
- [AGENT] `research-editorial-preset-2026-07-23.md`  .md
- [AGENT] `research-evidence-beacons-2026-07-23.md`  .md
- [AGENT] `research-fireworks-tech-graph.md`  .md
- [AGENT] `research-next-delight-slice-2026-07-22.md`  .md
- [AGENT] `research-next-stability-delight-2026-07-23.md`  .md
- [AGENT] `research-next-stability-delight-slice-2026-07-23.md`  .md
- [AGENT] `research-next-stability-growth-slice-2026-07.md`  .md
- [AGENT] `research-reach-share-card-2026-07-23.md`  .md
- [AGENT] `research-repo-evidence-passport-2026-07-23.md`  .md
- [AGENT] `research-trustworthy-first-diagram-slice.md`  .md
- [AGENT] `research-visual-evolution-round-10.md`  .md
- [AGENT] `research-visual-evolution-round-11.md`  .md
- [AGENT] `research-visual-evolution-round-12.md`  .md
- [AGENT] `research-visual-evolution-round-13.md`  .md
- [AGENT] `research-visual-evolution-round-14.md`  .md
- [AGENT] `research-visual-evolution-round-15.md`  .md
- [AGENT] `research-visual-evolution-round-16.md`  .md
- [AGENT] `research-visual-evolution-round-17.md`  .md
- [AGENT] `research-visual-evolution-round-18.md`  .md
- [AGENT] `research-visual-evolution-round-19.md`  .md
- [AGENT] `research-visual-evolution-round-2.md`  .md
- [AGENT] `research-visual-evolution-round-20.md`  .md
- [AGENT] `research-visual-evolution-round-21.md`  .md
- [AGENT] `research-visual-evolution-round-22.md`  .md
- [AGENT] `research-visual-evolution-round-23.md`  .md
- [AGENT] `research-visual-evolution-round-24.md`  .md
- [AGENT] `research-visual-evolution-round-25.md`  .md
- [AGENT] `research-visual-evolution-round-26.md`  .md
- [AGENT] `research-visual-evolution-round-27.md`  .md
- [AGENT] `research-visual-evolution-round-28.md`  .md
- [AGENT] `research-visual-evolution-round-29.md`  .md
- [AGENT] `research-visual-evolution-round-3.md`  .md
- [AGENT] `research-visual-evolution-round-30.md`  .md
- [AGENT] `research-visual-evolution-round-31.md`  .md
- [AGENT] `research-visual-evolution-round-32.md`  .md
- [AGENT] `research-visual-evolution-round-33.md`  .md
- [AGENT] `research-visual-evolution-round-34.md`  .md
- [AGENT] `research-visual-evolution-round-35.md`  .md
- [AGENT] `research-visual-evolution-round-36.md`  .md
- [AGENT] `research-visual-evolution-round-37.md`  .md
- [AGENT] `research-visual-evolution-round-38.md`  .md
- [AGENT] `research-visual-evolution-round-39.md`  .md
- [AGENT] `research-visual-evolution-round-4.md`  .md
- [AGENT] `research-visual-evolution-round-40.md`  .md
- [AGENT] `research-visual-evolution-round-41.md`  .md
- [AGENT] `research-visual-evolution-round-42.md`  .md
- [AGENT] `research-visual-evolution-round-43.md`  .md
- [AGENT] `research-visual-evolution-round-44.md`  .md
- [AGENT] `research-visual-evolution-round-45.md`  .md
- [AGENT] `research-visual-evolution-round-46.md`  .md
- [AGENT] `research-visual-evolution-round-47.md`  .md
- [AGENT] `research-visual-evolution-round-48.md`  .md
- [AGENT] `research-visual-evolution-round-49.md`  .md
- [AGENT] `research-visual-evolution-round-5.md`  .md
- [AGENT] `research-visual-evolution-round-6.md`  .md
- [AGENT] `research-visual-evolution-round-7.md`  .md
- [AGENT] `research-visual-evolution-round-8.md`  .md
- [AGENT] `research-visual-evolution-round-9.md`  .md
- [AGENT] `research-visual-style-picker-2026-07-23.md`  .md
- [AGENT] `skill-embedded-optional-update-notifier-design.md`  .md

### 📂 `skills/creative/archify/docs/issue-52-visual-evidence/`

- [AGENT] `README.md`  .md

### 📂 `skills/creative/archify/docs/research/`

- [AGENT] `skill-plugin-update-reminder-market-design.md`  .md

### 📂 `skills/creative/archify/experiments/v3-mermaid-validation/`

- [AGENT] `INDEX.md`  .md
- [AGENT] `RESULT.md`  .md

### 📂 `skills/creative/archify/experiments/v3-mermaid-validation/screenshots/`

- [AGENT] `manifest.txt`  .txt

### 📂 `skills/creative/archify/experiments/visual-evolution/`

- [AGENT] `DECISION-MAP.md`  .md

### 📂 `skills/creative/archify/integrations/deepseek-harness/`

- [AGENT] `README.md`  .md

### 📂 `skills/creative/architecture-diagram/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/creative/diagram-comparison/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/creative/diagram-comparison/references/`

- [AGENT] `paos-architecture-example.md`  .md

### 📂 `skills/data-science/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `skills/devops/docker-troubleshooting/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/devops/docker-troubleshooting/references/`

- [AGENT] `phantom-cache-investigation.md`  .md

### 📂 `skills/devops/sdlc-review/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/drawio-skill/`

- [AGENT] `README.md`  .md
- [AGENT] `SKILL.md`  .md
- [AGENT] `skill-card.md`  .md

### 📂 `skills/email/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `skills/github/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `skills/github/github-auth/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/github/github-code-review/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/github/github-code-review/references/`

- [AGENT] `review-output-template.md`  .md

### 📂 `skills/github/github-issue-to-pr/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/github/github-issues/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/github/github-issues/templates/`

- [AGENT] `bug-report.md`  .md
- [AGENT] `feature-request.md`  .md

### 📂 `skills/github/github-pr-workflow/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/github/github-pr-workflow/references/`

- [AGENT] `ci-troubleshooting.md`  .md
- [AGENT] `conventional-commits.md`  .md

### 📂 `skills/github/github-pr-workflow/templates/`

- [AGENT] `pr-body-bugfix.md`  .md
- [AGENT] `pr-body-feature.md`  .md

### 📂 `skills/github/github-repo-management/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/github/github-repo-management/references/`

- [AGENT] `github-api-cheatsheet.md`  .md

### 📂 `skills/media/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `skills/messaging/telegram-messaging/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/messaging/telegram-messaging/references/`

- [AGENT] `file-delivery-workflow.md`  .md

### 📂 `skills/mlops/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `skills/mlops/evaluation/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `skills/mlops/inference/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `skills/mlops/inference/llama-cpp/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/mlops/inference/llama-cpp/references/`

- [AGENT] `advanced-usage.md`  .md
- [AGENT] `hub-discovery.md`  .md
- [AGENT] `optimization.md`  .md
- [AGENT] `quantization.md`  .md
- [AGENT] `server.md`  .md
- [AGENT] `troubleshooting.md`  .md

### 📂 `skills/mlops/models/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `skills/mlops/models/segment-anything/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/mlops/models/segment-anything/references/`

- [AGENT] `advanced-usage.md`  .md
- [AGENT] `troubleshooting.md`  .md

### 📂 `skills/note-taking/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `skills/paos/paos-agent-lifecycle/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/paos/paos-agent-management/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/paos/paos-dashboard-backend/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/paos/paos-dashboard-backend/references/`

- [AGENT] `pipeline-visualization-fixes.md`  .md

### 📂 `skills/paos/paos-pipeline-commands/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/paos/paos-pipeline-commands/references/`

- [AGENT] `dashboard-integration-patterns.md`  .md
- [AGENT] `telegram-bot-patterns.md`  .md

### 📂 `skills/paos/paos-pipelines/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/paos/paos-pipelines/references/`

- [AGENT] `dashboard-pages.md`  .md
- [AGENT] `execute-modal-prompt-editing.md`  .md
- [AGENT] `inbox-to-pipeline.md`  .md
- [AGENT] `intervene-flow.md`  .md
- [AGENT] `meta-phases-format.md`  .md
- [AGENT] `paos-architecture.md`  .md
- [AGENT] `pipeline-json-enrichment.md`  .md
- [AGENT] `pipeline-visualization-implementation.md`  .md
- [AGENT] `queue-system.md`  .md
- [AGENT] `settings-and-theme.md`  .md
- [AGENT] `theme-presets.md`  .md
- [AGENT] `visual-settings.md`  .md

### 📂 `skills/paos/paos-tasks/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/paos/paos-tasks/references/`

- [AGENT] `task-system-implementation.md`  .md

### 📂 `skills/paos-pipeline-protocol/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/paos-pipeline-protocol/references/`

- [AGENT] `accordion-ux.md`  .md
- [AGENT] `dashboard-dev.md`  .md
- [AGENT] `dashboard-pipeline-ui.md`  .md
- [AGENT] `queue-system.md`  .md
- [AGENT] `task-markdown-format.md`  .md

### 📂 `skills/productivity/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `skills/productivity/document-to-action-items/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/productivity/notion/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/productivity/notion/references/`

- [AGENT] `block-types.md`  .md

### 📂 `skills/productivity/ocr-and-documents/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `skills/productivity/session-librarian/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/productivity/skills-audit/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/productivity/skills-audit/references/`

- [AGENT] `audit-2026-09-04.md`  .md
- [AGENT] `mcp-audit-2026-09-04.md`  .md

### 📂 `skills/productivity/xlsx/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/productivity/xlsx/references/`

- [AGENT] `restructuring.md`  .md

### 📂 `skills/research/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `skills/research/llm-wiki/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/smart-home/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `skills/social-media/`

- [AGENT] `DESCRIPTION.md`  .md

### 📂 `skills/software-development/codebase-inspection/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/software-development/github/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/software-development/github/references/`

- [AGENT] `auth.md`  .md
- [AGENT] `ci-troubleshooting.md`  .md
- [AGENT] `code-review.md`  .md
- [AGENT] `conventional-commits.md`  .md
- [AGENT] `github-api-cheatsheet.md`  .md
- [AGENT] `issue-to-pr.md`  .md
- [AGENT] `issues.md`  .md
- [AGENT] `pr-workflow.md`  .md
- [AGENT] `repo-management.md`  .md
- [AGENT] `review-output-template.md`  .md

### 📂 `skills/software-development/github/templates/`

- [AGENT] `bug-report.md`  .md
- [AGENT] `feature-request.md`  .md
- [AGENT] `pr-body-bugfix.md`  .md
- [AGENT] `pr-body-feature.md`  .md

### 📂 `skills/software-development/hermes-agent-skill-authoring/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/software-development/inspecting-hermes-desktop-dom/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/software-development/mcp-server-dev/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/software-development/mcp-server-dev/references/`

- [AGENT] `search-server-pattern.md`  .md

### 📂 `skills/software-development/node-inspect-debugger/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/software-development/paos-code-benchmark/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/software-development/paos-code-benchmark/references/`

- [AGENT] `gap-closure-patterns.md`  .md
- [AGENT] `telegram-delivery.md`  .md

### 📂 `skills/software-development/paos-dashboard-dev/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/software-development/paos-dashboard-dev/references/`

- [AGENT] `21st-dev-free-workflow.md`  .md
- [AGENT] `21st-dev-prompt-creation.md`  .md
- [AGENT] `active-project.md`  .md
- [AGENT] `api-security-middleware.md`  .md
- [AGENT] `ask-before-implementing.md`  .md
- [AGENT] `dark-mode-accessibility.md`  .md
- [AGENT] `dashboard-ui-patterns.md`  .md
- [AGENT] `diff-viewer-pattern.md`  .md
- [AGENT] `environment-path-settings.md`  .md
- [AGENT] `events-page-active-project.md`  .md
- [AGENT] `events-system.md`  .md
- [AGENT] `flow-builder-execution-cascade.md`  .md
- [AGENT] `flow-builder-execution.md`  .md
- [AGENT] `flow-builder-visual.md`  .md
- [AGENT] `flow-builder.md`  .md
- [AGENT] `handoff-edit.md`  .md
- [AGENT] `import-system.md`  .md
- [AGENT] `inbox-email-layout.md`  .md
- [AGENT] `inbox-merge-pattern.md`  .md
- [AGENT] `inbox-yaml-parsing.md`  .md
- [AGENT] `ledger-sort-pattern.md`  .md
- [AGENT] `ledger-view-all-pattern.md`  .md
- [AGENT] `new-dashboard-features.md`  .md
- [AGENT] `nextjs-hydration-debug.md`  .md
- [AGENT] `per-project-filtering.md`  .md
- [AGENT] `pipeline-artifact-enrichment.md`  .md
- [AGENT] `pipeline-builder-architecture.md`  .md
- [AGENT] `pipeline-builder-patterns.md`  .md
- [AGENT] `pipeline-flow-builder.md`  .md
- [AGENT] `pipeline-flow-schema.md`  .md
- [AGENT] `playwright-responsive-audit.md`  .md
- [AGENT] `project-auto-init.md`  .md
- [AGENT] `react-flow-integration.md`  .md
- [AGENT] `real-time-task-tracking.md`  .md
- [AGENT] `responsive-design.md`  .md
- [AGENT] `responsive-patterns.md`  .md
- [AGENT] `scoped-agents.md`  .md
- [AGENT] `secrets-system.md`  .md
- [AGENT] `self-contained-agent-install.md`  .md
- [AGENT] `shadcn-migration-patterns.md`  .md
- [AGENT] `system-monitoring-pages.md`  .md
- [AGENT] `tab-consolidation-pattern.md`  .md
- [AGENT] `tailscale-serve-dashboard.md`  .md
- [AGENT] `task-approval-workflow.md`  .md
- [AGENT] `task-progress-tracking.md`  .md
- [AGENT] `task-queue-system.md`  .md
- [AGENT] `tasks-system.md`  .md
- [AGENT] `theme-presets.md`  .md
- [AGENT] `two-tier-task-execution.md`  .md
- [AGENT] `ui-patterns-kanban-bulk-download.md`  .md
- [AGENT] `ui-patterns-kanban-gitview.md`  .md
- [AGENT] `ui-patterns.md`  .md
- [AGENT] `ux-principles.md`  .md
- [AGENT] `vault-system.md`  .md
- [AGENT] `view-all-events-ledger.md`  .md
- [AGENT] `workspace-system.md`  .md

### 📂 `skills/software-development/pipeline-builder/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/software-development/pipeline-builder/references/`

- [AGENT] `additional-patterns.md`  .md
- [AGENT] `code-patterns.md`  .md
- [AGENT] `flow-status-fallback.md`  .md
- [AGENT] `queue-cleanup.md`  .md
- [AGENT] `topological-sort.md`  .md

### 📂 `skills/software-development/plan/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/software-development/project-enhancement/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/software-development/project-enhancement/references/`

- [AGENT] `session-2026-06-26.md`  .md

### 📂 `skills/software-development/python-debugpy/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/software-development/requesting-code-review/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/software-development/simplify-code/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/software-development/spike/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/software-development/systematic-debugging/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/software-development/test-driven-development/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/software-development/ui-ux-pro-max/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/software-development/ui-ux-pro-max/references/`

- [AGENT] `interactive-canvas-patterns.md`  .md

### 📂 `skills/system-analysis-and-design/benchmark-audit/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/system-analysis-and-design/benchmark-audit/references/`

- [AGENT] `agents-page-21stdev-snippet.md`  .md
- [AGENT] `benchmark-documents.md`  .md
- [AGENT] `dashboard-new-features.md`  .md

### 📂 `skills/vps-kit/tailscale/`

- [AGENT] `SKILL.md`  .md

### 📂 `skills/vps-kit/tailscale/references/`

- [AGENT] `tailscale-serve-config.md`  .md

### 📂 `skills/web/`

- [AGENT] `DESCRIPTION.md`  .md


## 📁 `knowledge/`
__39 document(s)__

- [SHARED] `Models and AI subs.md`  .md
- [USER] `my brain.md`  .md

### 📂 `books/`

- [USER] `README.md`  .md

### 📂 `books/pdfs/`

- [SHARED] `2018_dowaward-giordano.pdf`  .pdf
- [SHARED] `Data Structures and Algorithms in Python [Goodrich, Tamassia  Goldwasser 2013-03-18].pdf`  .pdf
- [SHARED] `Introduction to Probability by Joseph K. Blitzstein, Jessica Hwang (z-lib.org).pdf`  .pdf
- [SHARED] `SSRN-id2580551.pdf`  .pdf
- [SHARED] `qm11k.The_.Art_.of_.Problem.Solving.Vol_.1.The_.Basics.pdf`  .pdf

### 📂 `docs/`

- [SHARED] `Tradingview.md`  .md
- [AGENT] `_agent-conventions.md`  .md
- [USER] `notes-done.md`  .md
- [USER] `notes.md`  .md
- [SHARED] `repos.md`  .md
- [SHARED] `session-protocol.md`  .md
- [USER] `user-questions-answered.md`  .md
- [USER] `user-questions.md`  .md

### 📂 `paos/`

- [SHARED] `constitution.md`  .md

### 📂 `previous-projects/`

- [USER] `README.md`  .md

### 📂 `questions/`

- [SHARED] `PAOS.md`  .md
- [SHARED] `index.md`  .md
- [SHARED] `test-project.md`  .md

### 📂 `references/`

- [SHARED] `books.md`  .md

### 📂 `srs/`

- [USER] `SRS-1-PAOS-Current-State.md`  .md
- [USER] `SRS-1-PAOS-Current-State.pdf`  .pdf
- [USER] `SRS-2-Enterprise-Agentic-AI-Harness.md`  .md
- [USER] `SRS-2-Enterprise-Agentic-AI-Harness.pdf`  .pdf

### 📂 `templates/fullstack-monorepo/`

- [USER] `README.md`  .md
- [USER] `notes-done.md`  .md
- [SHARED] `tasks.md`  .md

### 📂 `templates/fullstack-monorepo/ai_model/memories/`

- [SHARED] `learnings.md`  .md
- [SHARED] `system_status.md`  .md

### 📂 `templates/fullstack-monorepo/backend/`

- [SHARED] `requirements.txt`  .txt

### 📂 `templates/fullstack-monorepo/diagrams/`

- [SHARED] `architecture.mermaid.md`  .md

### 📂 `templates/fullstack-monorepo/docs/`

- [USER] `SRS.md`  .md
- [SHARED] `implementation_plan.md`  .md
- [SHARED] `instructions.md`  .md
- [SHARED] `setup.md`  .md
- [AGENT] `skills_to_use.md`  .md
- [USER] `walkthrough.md`  .md


## 📁 `logs/`
__46 document(s)__

### 📂 `antigravity/`

- [AGENT] `events.md`  .md

### 📂 `architect/`

- [AGENT] `events.md`  .md

### 📂 `claude/`

- [AGENT] `events.md`  .md

### 📂 `codex/`

- [AGENT] `events.md`  .md

### 📂 `coordinator/`

- [AGENT] `events.md`  .md

### 📂 `developer/`

- [AGENT] `events.md`  .md

### 📂 `gemini/`

- [AGENT] `events.md`  .md

### 📂 `gitkraken/`

- [AGENT] `events.md`  .md

- [AGENT] `global_ledger.md`  .md

### 📂 `hermes-nous/`

- [AGENT] `events.md`  .md

### 📂 `inbox/`

- [AGENT] `claude.md`  .md

### 📂 `memory/inbox/developer/`

- [AGENT] `1782148123179-pipeline-hermes-nous.md`  .md
- [AGENT] `1782150308174-pipeline-opencode-developer.md`  .md

### 📂 `ollama/`

- [AGENT] `events.md`  .md

### 📂 `openclaw/`

- [AGENT] `events.md`  .md

### 📂 `opencode/`

- [AGENT] `events.md`  .md

### 📂 `opencode-architect/`

- [AGENT] `events.md`  .md

### 📂 `opencode-coordinator/`

- [AGENT] `events.md`  .md

### 📂 `pipelines/AI_Workflow-PIPE_1-26-08-2026---23-34/`

- [AGENT] `PLAN.md`  .md
- [AGENT] `TASKS.md`  .md
- [AGENT] `VERIFICATION.md`  .md
- [AGENT] `WALKTHROUGH.md`  .md

### 📂 `pipelines/AI_Workflow-PIPE_1-26-08-2026---23-34/phases/executor/`

- [AGENT] `IMPLEMENTATION.md`  .md
- [AGENT] `REASONING.md`  .md
- [AGENT] `TASKS.md`  .md
- [AGENT] `WALKTHROUGH.md`  .md

### 📂 `pipelines/AI_Workflow-PIPE_1-26-08-2026---23-34/phases/planner/`

- [AGENT] `IMPLEMENTATION.md`  .md
- [AGENT] `REASONING.md`  .md
- [AGENT] `TASKS.md`  .md
- [AGENT] `WALKTHROUGH.md`  .md

### 📂 `pipelines/AI_Workflow-PIPE_1-26-08-2026---23-34/phases/verifier/`

- [AGENT] `IMPLEMENTATION.md`  .md
- [AGENT] `REASONING.md`  .md
- [AGENT] `TASKS.md`  .md
- [AGENT] `WALKTHROUGH.md`  .md

### 📂 `pipelines/PAOS/`

- [AGENT] `events.md`  .md
- [AGENT] `handoff.md`  .md
- [AGENT] `ledger.md`  .md
- [AGENT] `shared-context.md`  .md

### 📂 `projects/PAOS/`

- [AGENT] `ledger.md`  .md

### 📂 `projects/`

- [AGENT] `_template.md`  .md
- [AGENT] `index.md`  .md

### 📂 `prompts/`

- [AGENT] `_template.md`  .md

### 📂 `shared/`

- [AGENT] `HANDOFF.md`  .md
- [AGENT] `context.md`  .md
- [AGENT] `swot_audit.md`  .md

### 📂 `signal/`

- [AGENT] `events.md`  .md


## 📁 `mcp/`
__1 document(s)__

- [AGENT] `README.md`  .md


## 📁 `projects/`
__5 document(s)__

### 📂 `PAOS/`

- [AGENT] `events.md`  .md
- [AGENT] `handoff.md`  .md
- [AGENT] `ledger.md`  .md
- [SHARED] `shared-context.md`  .md

### 📂 `PAOS/tasks/`

- [SHARED] `test-second-task.md`  .md


## 📁 `research/`
__4 document(s)__

- [USER] `langchain-integration.md`  .md
- [USER] `multi-machine-paos.md`  .md
- [USER] `qa-audit-supplement.md`  .md
- [USER] `storage-comparison.md`  .md


## 📁 `skills/`
__56 document(s)__

- [AGENT] `INDEX.md`  .md

### 📂 `antigravity-review-loop/`

- [AGENT] `SKILL.md`  .md

### 📂 `antigravity-review-loop/references/`

- [AGENT] `implementation-plan-template.md`  .md
- [AGENT] `task-list-template.md`  .md
- [AGENT] `walkthrough-template.md`  .md

### 📂 `context7-mcp/`

- [AGENT] `SKILL.md`  .md

### 📂 `ponytail/`

- [AGENT] `SKILL.md`  .md

### 📂 `ponytail-repo/`

- [AGENT] `AGENTS.md`  .md
- [AGENT] `README.es.md`  .md
- [AGENT] `README.md`  .md

### 📂 `ponytail-repo/benchmarks/`

- [AGENT] `README.md`  .md

### 📂 `ponytail-repo/benchmarks/agentic/`

- [AGENT] `README.md`  .md

### 📂 `ponytail-repo/benchmarks/arms/`

- [AGENT] `caveman-SKILL.md`  .md

### 📂 `ponytail-repo/benchmarks/results/`

- [AGENT] `2026-06-12-caveman-vs-ponytail.md`  .md
- [AGENT] `2026-06-12-v4-hardening-vs-caveman.md`  .md
- [AGENT] `2026-06-15-llama3.2-local.md`  .md
- [AGENT] `2026-06-16-correctness-gate-fix.md`  .md
- [AGENT] `2026-06-16-robustness-audit.md`  .md
- [AGENT] `2026-06-17-agentic-safety.md`  .md
- [AGENT] `2026-06-17-cost-verification.md`  .md
- [AGENT] `2026-06-18-agentic.md`  .md

### 📂 `ponytail-repo/docs/`

- [AGENT] `agent-portability.md`  .md
- [AGENT] `platform-native.md`  .md

### 📂 `ponytail-repo/examples/`

- [AGENT] `README.md`  .md
- [AGENT] `csv-sum.md`  .md
- [AGENT] `debounce.md`  .md
- [AGENT] `deep-clone.md`  .md
- [AGENT] `email-validation.md`  .md
- [AGENT] `group-by.md`  .md
- [AGENT] `infinite-scroll.md`  .md
- [AGENT] `modal-dialog.md`  .md
- [AGENT] `number-formatting.md`  .md
- [AGENT] `rate-limit.md`  .md
- [AGENT] `react-countdown.md`  .md
- [AGENT] `url-params.md`  .md

### 📂 `ponytail-repo/ponytail-mcp/`

- [AGENT] `README.md`  .md

### 📂 `ponytail-repo/skills/ponytail/`

- [AGENT] `SKILL.md`  .md

### 📂 `ponytail-repo/skills/ponytail-audit/`

- [AGENT] `SKILL.md`  .md

### 📂 `ponytail-repo/skills/ponytail-debt/`

- [AGENT] `SKILL.md`  .md

### 📂 `ponytail-repo/skills/ponytail-gain/`

- [AGENT] `SKILL.md`  .md

### 📂 `ponytail-repo/skills/ponytail-help/`

- [AGENT] `SKILL.md`  .md

### 📂 `ponytail-repo/skills/ponytail-review/`

- [AGENT] `SKILL.md`  .md

### 📂 `system-analysis-and-design/`

- [AGENT] `AGENTS.md`  .md
- [AGENT] `SKILL.md`  .md

### 📂 `system-analysis-and-design/assets/`

- [AGENT] `elicitation-survey.md`  .md

### 📂 `system-analysis-and-design/references/`

- [AGENT] `benchmark-dashboard.md`  .md
- [AGENT] `coding-principles-benchmark.md`  .md
- [AGENT] `coding-principles.md`  .md
- [AGENT] `diagram-cookbook.md`  .md
- [AGENT] `elicitation-workflow.md`  .md
- [AGENT] `example-reachdog-srs.md`  .md
- [AGENT] `example-reachdog-srs.pdf`  .pdf
- [AGENT] `paos-code-audit-framework.md`  .md
- [AGENT] `pdf-build-guide.md`  .md
- [AGENT] `srs-template.md`  .md
- [AGENT] `swot-benchmark.md`  .md


## 📁 `vault/`
__4 document(s)__

### 📂 `chats/`

- [AGENT] `_template.md`  .md

### 📂 `daily/`

- [AGENT] `2026-06-22.md`  .md

- [AGENT] `dashboard.md`  .md

### 📂 `projects/`

- [AGENT] `projects.md`  .md


## 📁 `workflows/`
__1 document(s)__

- [USER] `workflow.md`  .md

