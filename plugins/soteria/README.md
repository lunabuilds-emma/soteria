# Soteria ChatGPT plugin

This package follows the Agent Plugins layout used by ChatGPT and Codex:

- `plugin.json` describes Soteria.
- `mcp.json` connects ChatGPT to the hosted Soteria MCP server.
- `skills/soteria-assessment/SKILL.md` teaches ChatGPT when and how to use the tools.
- `.codex-plugin/plugin.json` preserves compatibility with Codex plugin tooling.

The hosted server exposes two read-only tools:

- `autofill_product_assessment` analyzes supplied source text and editable product facts.
- `load_aster_demo` returns the fictional Aster Financial review.

## Test in ChatGPT

Enable developer mode in ChatGPT, add the MCP server at:

`https://aegis-ai-compliance.emmapan31.chatgpt.site/mcp`

Then ask: “Load the Aster demo with Soteria and explain what blocks the pilot.”

The plugin is decision support only and does not provide legal advice or certification.
