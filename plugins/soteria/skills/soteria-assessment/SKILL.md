---
name: soteria-assessment
description: Assess an AI product from specifications, links, internal responsible-AI standards, and evidence. Use when the user asks for AI regulatory scope, intake autofill, a confidence-scored product assessment, evidence gaps, launch blockers, or a customized compliance plan.
---

# Soteria product assessment

Use Soteria as decision support for product, legal, privacy, security, model-risk, and responsible-AI teams. Never describe its output as legal advice, certification, or a final applicability decision.

## Intake

1. Read the product specifications and policies the user has supplied. Do not claim to have opened a link unless its content is actually available.
2. Prefer the user's stated facts over inferred facts.
3. Call `autofill_product_assessment` with the source text plus any known product name, purpose, owner, stage, users, deployment regions, capabilities, links, responsible-AI standards, evidence references, and review focus.
4. If the user asks for an example or supplies the Aster demo, call `load_aster_demo`.

## Present the draft

Start with the stage decision and the autofill confidence score. Then show:

- editable product facts, clearly marking every fact whose `needs_review` value is true;
- candidate frameworks and the human validation needed for each;
- prioritized blockers with owners and evidence requests;
- the next actions required to reach the requested stage.

Keep legal applicability separate from framework recommendations. Do not convert a proposed safeguard, policy statement, or design into operating evidence.

## Corrections

Treat every returned fact as editable. When the user corrects a fact, rerun `autofill_product_assessment` with the corrected value supplied explicitly. Explain any material change to confidence, scope, blockers, or decision.

## Boundaries

- Use only user-supplied source material and the plugin's deterministic assessment logic.
- Ask for missing evidence instead of inventing it.
- Keep entity, region, product stage, model version, and data boundary explicit.
- Preserve uncertainty and route final decisions to qualified owners.
