export const capabilityValues = [
  "generative_ai",
  "customer_data",
  "consequential_decisions",
  "employment",
  "biometrics",
  "children",
  "frontier_model",
] as const;

export type Capability = (typeof capabilityValues)[number];

export type AssessmentInput = {
  source_text?: string;
  product_name?: string;
  purpose?: string;
  owner?: string;
  stage?: string;
  users?: string;
  regions?: string[];
  capabilities?: Capability[];
  spec_links?: string[];
  responsible_ai_standards?: string[];
  evidence_references?: string[];
  review_focus?: string;
};

type EditableFact = {
  field: string;
  value: string | string[];
  confidence: number;
  needs_review: boolean;
};

type Framework = {
  name: string;
  status: "candidate" | "recommended";
  rationale: string;
  validation: string;
};

type Blocker = {
  id: string;
  title: string;
  owner: string;
  evidence_needed: string;
};

export type SoteriaAssessment = {
  title: string;
  status: "draft_human_review_required";
  autofill_confidence: number;
  editable_facts: EditableFact[];
  candidate_frameworks: Framework[];
  risk_signals: string[];
  blockers: Blocker[];
  plan: {
    decision: "do_not_launch" | "conditional_review" | "continue_documented_review";
    decision_label: string;
    evidence_readiness: number;
    next_steps: string[];
  };
  source_summary: {
    documents_analyzed: number;
    links_supplied: number;
    standards_supplied: number;
    evidence_items_supplied: number;
  };
  disclaimer: string;
};

const trim = (value?: string) => value?.trim() ?? "";

function lineValue(text: string, labels: string[]): string {
  for (const label of labels) {
    const expression = new RegExp(`^\\s*${label}\\s*:\\s*(.+)$`, "im");
    const match = text.match(expression);
    if (match?.[1]) return match[1].trim();
  }
  return "";
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function inferCapabilities(text: string): Capability[] {
  const value = text.toLowerCase();
  const inferred: Capability[] = [];
  if (/generative|llm|language model|draft|synthetic content/.test(value)) inferred.push("generative_ai");
  if (/customer|consumer|personal data|credit history|patient|record/.test(value)) inferred.push("customer_data");
  if (/credit|lending|eligibility|consequential|underwriting|housing|education/.test(value)) inferred.push("consequential_decisions");
  if (/employment|candidate|employee|hiring/.test(value)) inferred.push("employment");
  if (/biometric|facial recognition|voiceprint|fingerprint/.test(value)) inferred.push("biometrics");
  if (/child|children|minor|student under 18/.test(value)) inferred.push("children");
  if (/frontier model|foundation model|10\^25|training compute/.test(value)) inferred.push("frontier_model");
  return inferred;
}

function inferRegions(text: string): string[] {
  const regions: string[] = [];
  const patterns: Array<[RegExp, string]> = [
    [/european union|\beu\b/i, "European Union"],
    [/ireland/i, "Ireland"],
    [/united states|\bu\.s\.?\b|\busa\b/i, "United States"],
    [/new york|\bnyc\b/i, "New York"],
    [/california/i, "California"],
    [/colorado/i, "Colorado"],
    [/south korea|korea/i, "South Korea"],
    [/china|\bprc\b/i, "China"],
  ];
  for (const [pattern, label] of patterns) {
    if (pattern.test(text)) regions.push(label);
  }
  return regions;
}

function resolveInput(input: AssessmentInput) {
  const source = trim(input.source_text);
  const combined = [
    source,
    input.product_name,
    input.purpose,
    input.owner,
    input.stage,
    input.users,
    ...(input.regions ?? []),
    ...(input.responsible_ai_standards ?? []),
    ...(input.evidence_references ?? []),
  ]
    .filter(Boolean)
    .join("\n");

  const isAster = /aster financial|aster credit memo/i.test(combined);
  const productName = trim(input.product_name) || lineValue(source, ["Product", "System(?: name)?"]) || (isAster ? "Aster Credit Memo Assistant" : "Unnamed AI product");
  const purpose = trim(input.purpose) || lineValue(source, ["Intended purpose", "Purpose", "Use case"]) || (isAster ? "Draft factual consumer credit memos from authorized repayment history for officer review." : "Purpose not yet documented");
  const owner = trim(input.owner) || lineValue(source, ["Owner", "Accountable owner"]) || (isAster ? "Chief Risk Officer" : "Owner not assigned");
  const stage = trim(input.stage) || lineValue(source, ["Stage", "Lifecycle"]) || (/pilot|proof of concept|\bpoc\b/i.test(source) ? "Pilot" : /production|deployed|live/i.test(source) ? "Production" : "Design");
  const users = trim(input.users) || lineValue(source, ["Users", "Primary users"]) || (isAster ? "Credit analysts and credit officers" : "Users not documented");
  const regions = unique((input.regions?.length ? input.regions : inferRegions(combined)).map((item) => item.trim()).filter(Boolean));
  const capabilities = unique([...(input.capabilities ?? []), ...inferCapabilities(combined)]);
  const evidenceFromText = source.match(/\b(?:RET|VENDOR|CREDIT|REPORT|MR|VALIDATION|REVIEW)-[A-Z0-9-]+\b/g) ?? [];
  const evidence = unique([...(input.evidence_references ?? []), ...evidenceFromText]);

  return {
    source,
    productName,
    purpose,
    owner,
    stage,
    users,
    regions,
    capabilities,
    links: unique((input.spec_links ?? []).map((item) => item.trim()).filter(Boolean)),
    standards: unique((input.responsible_ai_standards ?? []).map((item) => item.trim()).filter(Boolean)),
    evidence,
    reviewFocus: trim(input.review_focus),
    isAster,
  };
}

function frameworks(regions: string[], capabilities: Capability[], standards: string[]): Framework[] {
  const regionText = regions.join(" ").toLowerCase();
  const result: Framework[] = [];
  const consequential = capabilities.includes("consequential_decisions");

  if (/european union|ireland|france|germany|spain|italy/.test(regionText)) {
    result.push({
      name: "EU AI Act",
      status: "candidate",
      rationale: consequential ? "EU deployment and consequential-decision use may trigger high-risk system analysis." : "EU deployment requires role, system, and prohibited-practice classification.",
      validation: "Confirm provider/deployer role, Annex III category, entity, and effective-date scope with counsel.",
    });
    result.push({
      name: "EU GDPR / local data protection law",
      status: "candidate",
      rationale: capabilities.includes("customer_data") ? "The described workflow uses customer or personal data." : "Confirm whether personal data enters prompts, retrieval, logs, or outputs.",
      validation: "Complete lawful-basis, DPIA, processor, transfer, minimization, and retention review.",
    });
  }
  if (/colorado/.test(regionText) && consequential) {
    result.push({ name: "Colorado AI Act", status: "candidate", rationale: "Colorado use in consequential decisions may create developer or deployer duties.", validation: "Confirm covered decision, role, consumer nexus, exemptions, and operative dates." });
  }
  if (/united states|new york|california|colorado/.test(regionText) && consequential) {
    result.push({ name: "US sector and anti-discrimination requirements", status: "candidate", rationale: "Consequential-decision support may be governed by sector rules, civil-rights law, consumer protection, and state requirements.", validation: "Confirm the decision domain, entity role, affected people, notices, testing, records, explanations, and adverse-action workflow." });
  }
  if (/new york/.test(regionText) && capabilities.includes("employment")) {
    result.push({ name: "NYC Local Law 144", status: "candidate", rationale: "The product may be an automated employment decision tool used for NYC candidates or employees.", validation: "Confirm AEDT definition, location, bias-audit status, notices, and disclosure scope." });
  }
  if (/california/.test(regionText) && capabilities.includes("frontier_model")) {
    result.push({ name: "California frontier AI requirements", status: "candidate", rationale: "The product description signals frontier-model development activity.", validation: "Confirm statutory compute, developer, revenue, and model thresholds." });
  }
  if (/south korea/.test(regionText)) {
    result.push({ name: "Korea AI Basic Act", status: "candidate", rationale: "Deployment in South Korea may trigger transparency or high-impact AI duties.", validation: "Confirm operator role, high-impact classification, user notices, and local guidance." });
  }
  if (/china/.test(regionText) && capabilities.includes("generative_ai")) {
    result.push({ name: "China generative AI and labeling rules", status: "candidate", rationale: "Generative AI content distributed in China may require notices, labels, and metadata.", validation: "Confirm service availability, public-facing scope, content type, filing, and labeling rules." });
  }

  result.push({
    name: /nist/i.test(standards.join(" ")) ? "NIST AI RMF" : "NIST AI RMF (recommended)",
    status: "recommended",
    rationale: "Use a common govern-map-measure-manage structure for cross-jurisdiction controls.",
    validation: "Map existing internal controls and retain evidence; this is not a legal classification.",
  });
  return result;
}

function riskSignals(capabilities: Capability[]): string[] {
  const labels: Record<Capability, string> = {
    generative_ai: "Generative output can introduce unsupported or misleading content.",
    customer_data: "Customer or personal data may enter prompts, retrieval, logs, or outputs.",
    consequential_decisions: "The workflow may influence a consequential decision even if a human makes the final call.",
    employment: "Employment use can trigger bias-audit, notice, and anti-discrimination duties.",
    biometrics: "Biometric processing can trigger consent, retention, security, and use restrictions.",
    children: "Use involving minors requires age-appropriate privacy, safety, and consent analysis.",
    frontier_model: "Frontier-model development may trigger model-level safety and transparency duties.",
  };
  return capabilities.map((capability) => labels[capability]);
}

function blockersFor(input: ReturnType<typeof resolveInput>): Blocker[] {
  const blockers: Blocker[] = [];
  const evidenceText = `${input.source}\n${input.evidence.join(" ")}`.toLowerCase();
  const highImpact = input.capabilities.includes("consequential_decisions") || input.capabilities.includes("employment") || input.capabilities.includes("biometrics");

  if (!input.regions.length) blockers.push({ id: "SCOPE-01", title: "Confirm deployment entities and jurisdictions", owner: "Legal / Compliance", evidence_needed: "Entity-by-region deployment map and accountable role classification" });
  if (input.isAster) blockers.push({ id: "SCOPE-01", title: "Approve entity-specific applicability and pilot scope", owner: "Legal / Compliance", evidence_needed: "Separate signed analysis for Aster EU and Aster US Lending, including role, licensing, privacy, retention, and decision-use scope" });
  if (input.capabilities.includes("customer_data") && (!input.standards.length || /365 day|retention|outside the approved boundary|unapproved endpoint/.test(evidenceText))) {
    blockers.push({ id: "DATA-02", title: "Approve data use, retention, and processing boundaries", owner: "Privacy / Security / Vendor owner", evidence_needed: "Approved data-flow, retention configuration, contract terms, and enforcement test" });
  }
  if (highImpact && (!input.evidence.length || /stale|corrected v4|omitted.*dispute|current-record/.test(evidenceText))) {
    blockers.push({ id: "DATA-03", title: "Prove source-record integrity and correction handling", owner: "Product data owner", evidence_needed: "Version, correction, dispute-preservation, and revised-output tests" });
  }
  if ((highImpact || input.capabilities.includes("generative_ai")) && (!input.evidence.length || /wrong scoring-model version|validation.*v4|model v5|no.*validation/.test(evidenceText))) {
    blockers.push({ id: "VAL-04", title: "Complete version-matched model and system validation", owner: "Model Risk / Responsible AI", evidence_needed: "Validation for the deployed model, prompts, retrieval, guardrails, and intended-use limits" });
  }
  if (highImpact && (!input.evidence.length || /no intervention|no.*rejection test|human-review design/.test(evidenceText))) {
    blockers.push({ id: "HUM-05", title: "Demonstrate effective human oversight", owner: "Business operations owner", evidence_needed: "Intervention, rejection, escalation, permission, and override test results" });
  }
  if (highImpact && (!input.evidence.length || /incident|reporting.*incomplete|recovery/.test(evidenceText))) {
    blockers.push({ id: "GOV-06", title: "Approve incident, reporting, and recovery routes", owner: "Compliance / Incident Response", evidence_needed: "Signed reporting matrix, tabletop record, rollback plan, and recovery test" });
  }
  if (!input.owner || /not assigned/i.test(input.owner)) blockers.push({ id: "GOV-07", title: "Assign an accountable product owner", owner: "Executive sponsor", evidence_needed: "Named owner with approval and escalation authority" });
  return blockers;
}

function fieldConfidence(value: string | string[], explicit: boolean, missingMarkers: RegExp): number {
  const present = Array.isArray(value) ? value.length > 0 : Boolean(value) && !missingMarkers.test(value);
  if (!present) return 28;
  return explicit ? 97 : 82;
}

export function createSoteriaAssessment(rawInput: AssessmentInput): SoteriaAssessment {
  const input = resolveInput(rawInput);
  const missing = /not (?:yet )?documented|not assigned|unnamed/i;
  const source = input.source;
  const facts: EditableFact[] = [
    { field: "product_name", value: input.productName, confidence: fieldConfidence(input.productName, Boolean(rawInput.product_name) || /^(?:product|system(?: name)?)\s*:/im.test(source), missing), needs_review: false },
    { field: "purpose", value: input.purpose, confidence: fieldConfidence(input.purpose, Boolean(rawInput.purpose) || /^(?:intended purpose|purpose|use case)\s*:/im.test(source), missing), needs_review: false },
    { field: "owner", value: input.owner, confidence: fieldConfidence(input.owner, Boolean(rawInput.owner) || /^(?:owner|accountable owner)\s*:/im.test(source), missing), needs_review: false },
    { field: "stage", value: input.stage, confidence: fieldConfidence(input.stage, Boolean(rawInput.stage) || /^(?:stage|lifecycle)\s*:/im.test(source), missing), needs_review: false },
    { field: "users", value: input.users, confidence: fieldConfidence(input.users, Boolean(rawInput.users) || /^(?:users|primary users)\s*:/im.test(source), missing), needs_review: false },
    { field: "regions", value: input.regions, confidence: fieldConfidence(input.regions, Boolean(rawInput.regions?.length) || /^(?:deployment|regions?|jurisdictions?)\s*:/im.test(source), missing), needs_review: false },
    { field: "capabilities", value: input.capabilities, confidence: fieldConfidence(input.capabilities, Boolean(rawInput.capabilities?.length), missing), needs_review: false },
  ].map((fact) => ({ ...fact, needs_review: fact.confidence < 90 }));

  const sourceCoverage = [
    input.source.length > 80,
    input.links.length > 0,
    input.standards.length > 0,
    input.evidence.length > 0,
  ].filter(Boolean).length;
  const factScore = facts.reduce((sum, fact) => sum + fact.confidence, 0) / facts.length;
  const autofillConfidence = Math.min(97, Math.round(factScore * 0.72 + sourceCoverage * 7));
  const blockers = blockersFor(input);
  const signals = riskSignals(input.capabilities);
  const evidenceReadiness = input.isAster ? 42 : Math.max(18, Math.min(92, Math.round(72 + input.evidence.length * 3 + input.standards.length * 2 - blockers.length * 9)));
  const decision = blockers.length >= 4 ? "do_not_launch" : blockers.length > 0 ? "conditional_review" : "continue_documented_review";
  const decisionLabels = {
    do_not_launch: "Do not launch or begin the proposed data pilot yet",
    conditional_review: "Continue only after named conditions are closed",
    continue_documented_review: "Continue documented human and legal review",
  } as const;

  return {
    title: `${input.productName} — Soteria assessment`,
    status: "draft_human_review_required",
    autofill_confidence: autofillConfidence,
    editable_facts: facts,
    candidate_frameworks: frameworks(input.regions, input.capabilities, input.standards),
    risk_signals: signals,
    blockers,
    plan: {
      decision,
      decision_label: decisionLabels[decision],
      evidence_readiness: evidenceReadiness,
      next_steps: blockers.length
        ? blockers.map((blocker) => `${blocker.owner}: ${blocker.title} — ${blocker.evidence_needed}`)
        : ["Record the final human applicability decision and approval rationale.", "Set a monitoring date for product, model, data, and regulatory changes."],
    },
    source_summary: {
      documents_analyzed: input.source ? 1 : 0,
      links_supplied: input.links.length,
      standards_supplied: input.standards.length,
      evidence_items_supplied: input.evidence.length,
    },
    disclaimer: "Decision-support draft only. Candidate frameworks and controls require review by qualified legal, privacy, security, model-risk, and business owners; this is not legal advice or certification.",
  };
}

export const asterExampleInput: AssessmentInput = {
  source_text: `Company: Aster Financial
Product: Aster Credit Memo Assistant
Owner: Chief Risk Officer
Stage: Pilot
Users: Credit analysts and credit officers
Intended purpose: Draft factual consumer credit memos from authorized repayment history for officer review; it cannot approve credit or send external notices.
Deployment: European Union, Ireland, United States, New York.
The workflow uses a vendor-hosted LLM and customer credit information. A credit committee retains the lending decision.
Known gaps: a staging cache returned a stale record; a draft omitted a dispute; an unapproved endpoint was used; raw prompts are retained for 365 days; validation covers model v4 instead of v5; human-review intervention and rejection tests are missing; incident and recovery routes are incomplete.
Evidence: RET-POL-v2, VENDOR-CONFIG-v7, CREDIT-POL-v2, REPORT-v4, CREDIT-TRACE-R, MR-POL-v3, VALIDATION-v4, REVIEW-DESIGN-v1.`,
  product_name: "Aster Credit Memo Assistant",
  purpose: "Draft factual consumer credit memos from authorized repayment history for officer review; it cannot approve credit or send external notices.",
  owner: "Chief Risk Officer",
  stage: "Pilot",
  users: "Credit analysts and credit officers",
  regions: ["European Union", "Ireland", "United States", "New York"],
  capabilities: ["generative_ai", "customer_data", "consequential_decisions"],
  spec_links: ["https://risk.aster.example/credit-memo-assistant", "https://policies.aster.example/credit-data"],
  responsible_ai_standards: ["MR-POL-v3", "RET-POL-v2", "CREDIT-POL-v2"],
  evidence_references: ["VENDOR-CONFIG-v7", "REPORT-v4", "CREDIT-TRACE-R", "VALIDATION-v4", "REVIEW-DESIGN-v1"],
  review_focus: "Assess pilot readiness separately for Aster EU and Aster US Lending. Treat proposed controls as untested until evidence is supplied.",
};
