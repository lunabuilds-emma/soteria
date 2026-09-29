---
document_id: ASTER-AI-PROPOSAL-001
version: "1.0"
company: Aster Financial (fictional)
accountable_owner: Chief Risk Officer
status: submitted_for_review_not_approved
target_pilot_date: "2027-01-15"
data_classification: synthetic_demo_only
---

# Aster Financial — proposed AI credit-operations workflow

This compact example mirrors the product facts and evidence gaps used in the Soteria demo. All entities, records, volumes, controls, and documents are fictional.

## Requested decision

May Aster begin a four-week customer-data pilot of AI-assisted credit-memo preparation for ten authorized analysts and up to 100 applications per entity? Aster EU and Aster US Lending must be reviewed and approved separately.

## Product and authority

The Aster Credit Memo Assistant uses a vendor-hosted LLM to draft a factual memo from authorized credit-history records and policies. A credit officer must verify sources, edit or reject the draft, and record review. The credit committee retains the lending decision. The assistant cannot approve credit, invent reasons, change source facts, or send external notices.

The separate Credit Scoring Model v5 requires its own classification, validation, and decision-use assessment.

## Known evidence gaps

- A staging cache returned record v3 when the corrected v4 record existed.
- The draft omitted the current dispute status.
- A staging trace used fields and an endpoint outside the approved boundary.
- Vendor configuration retains raw prompts for 365 days, conflicting with RET-POL-v2.
- Validation exists for scoring model v4, not the proposed v5.
- Human-review design exists, but no intervention or rejection test has been supplied.
- Irish and New York applicability, licensing, privacy, and retention mappings remain incomplete.

## Evidence manifest

- `RET-POL-v2` — transient raw-prompt policy
- `VENDOR-CONFIG-v7` — configuration showing 365-day payload retention
- `CREDIT-POL-v2` — assigned-case access, fields, and endpoint policy
- `REPORT-v3` / `REPORT-v4` — superseded and current synthetic credit records
- `CREDIT-TRACE-R` — failing synthetic staging trace
- `MR-POL-v3` — model validation and review policy
- `VALIDATION-v4` — validation for the wrong scoring-model version
- `REVIEW-DESIGN-v1` — proposed officer review without operating evidence

## Required Soteria output

Return scoped applicability decisions, a requirement checklist, a data-use and retention view, prioritized pilot blockers, evidence requests, accountable employees, and a stage decision. Use `MET`, `NOT_MET`, `EVIDENCE_NEEDED`, `NOT_APPLICABLE`, and `FUTURE_REQUIREMENT`. Do not convert proposed safeguards into operating controls or produce a generic compliance percentage.

## Remediation ownership

1. Compliance/legal: approve entity-specific applicability and record schedules.
2. Security/vendor owner: correct retention, processing boundary, and terms.
3. Credit data owner: fix current-record retrieval and dispute preservation.
4. Model risk owner: validate scoring v5 and evaluate the memo LLM separately.
5. Head of Credit Operations: prove effective officer review.
6. Compliance and incident response: approve reporting and recovery routes.

No approval authorizes autonomous underwriting, wider data access, account restrictions, external notices, or regulatory filing.
