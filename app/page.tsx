"use client";

import { useMemo, useState } from "react";

type ViewId =
  | "overview"
  | "rulebook"
  | "assess"
  | "assurance"
  | "monitor";

type Tone = "green" | "amber" | "red" | "blue" | "slate" | "purple";

const navItems: { id: ViewId; label: string; icon: string; count?: number }[] = [
  { id: "overview", label: "Home", icon: "⌂" },
  { id: "rulebook", label: "Rulebook", icon: "§", count: 286 },
  { id: "assess", label: "Assess", icon: "◇" },
  { id: "assurance", label: "Assurance", icon: "✓", count: 8 },
  { id: "monitor", label: "Changes", icon: "↻", count: 3 },
];

const regulations = [
  {
    id: "EU-AIA",
    name: "EU Artificial Intelligence Act",
    citation: "Regulation (EU) 2024/1689",
    region: "European Union",
    status: "In force",
    tone: "green" as Tone,
    nextDate: "02 Aug 2026",
    requirements: 74,
    reviewed: 92,
    authority: "European Parliament & Council",
    source: "Official Journal of the European Union",
    scope: "Providers, deployers, importers and distributors of AI systems placed on or used in the EU.",
    provision: "Article 9 · Risk management system",
    excerpt:
      "A risk management system shall be established, implemented, documented and maintained in relation to high-risk AI systems.",
  },
  {
    id: "CA-SB53",
    name: "California Transparency in Frontier AI Act",
    citation: "SB 53 · Chapter 2025",
    region: "United States · CA",
    status: "In force",
    tone: "green" as Tone,
    nextDate: "01 Jan 2027",
    requirements: 29,
    reviewed: 81,
    authority: "California Legislature",
    source: "California Legislative Information",
    scope: "Large frontier developers meeting statutory compute and revenue thresholds.",
    provision: "§ 22757.12 · Transparency framework",
    excerpt:
      "Covered developers publish and maintain a frontier AI framework describing safety and security practices.",
  },
  {
    id: "CO-AIA",
    name: "Colorado AI Act",
    citation: "SB 24-205, as amended",
    region: "United States · CO",
    status: "Amended",
    tone: "amber" as Tone,
    nextDate: "30 Jun 2027",
    requirements: 38,
    reviewed: 76,
    authority: "Colorado General Assembly",
    source: "Colorado General Assembly",
    scope: "Developers and deployers of high-risk AI systems used for consequential decisions.",
    provision: "§ 6-1-1703 · Duty of reasonable care",
    excerpt:
      "Developers and deployers must use reasonable care to protect consumers from algorithmic discrimination.",
  },
  {
    id: "KR-AIB",
    name: "Korea AI Basic Act",
    citation: "Act No. 20676",
    region: "South Korea",
    status: "Effective soon",
    tone: "blue" as Tone,
    nextDate: "22 Jan 2026",
    requirements: 31,
    reviewed: 68,
    authority: "National Assembly of Korea",
    source: "Korean Law Information Center",
    scope: "AI business operators, including providers of high-impact and generative AI.",
    provision: "Article 31 · Transparency obligations",
    excerpt:
      "Business operators must notify users when products or services use high-impact or generative AI.",
  },
  {
    id: "CN-LABEL",
    name: "AI-Generated Content Labeling Measures",
    citation: "CAC Measures · 2025",
    region: "China",
    status: "In force",
    tone: "green" as Tone,
    nextDate: "01 Sep 2025",
    requirements: 22,
    reviewed: 88,
    authority: "Cyberspace Administration of China",
    source: "CAC official release",
    scope: "Providers and distribution platforms for AI-generated or synthetic content.",
    provision: "Article 4 · Explicit and implicit labels",
    excerpt:
      "Providers must add explicit labels and embedded metadata to qualifying synthetic content.",
  },
  {
    id: "NYC-144",
    name: "NYC Automated Employment Decision Tools Law",
    citation: "Local Law 144 of 2021",
    region: "United States · NY",
    status: "Enforced",
    tone: "green" as Tone,
    nextDate: "Annual audit",
    requirements: 17,
    reviewed: 100,
    authority: "NYC Department of Consumer and Worker Protection",
    source: "NYC Rules and guidance",
    scope: "Employers and employment agencies using AEDTs for NYC candidates or employees.",
    provision: "§ 20-871 · Bias audit",
    excerpt:
      "Use requires a recent independent bias audit and public disclosure of specified results.",
  },
];

const requirements = [
  {
    id: "REQ-EU-009-01",
    title: "Maintain a continuous risk management system",
    source: "EU AI Act · Art. 9(1)",
    applies: "Provider · High-risk AI",
    control: "RM-01",
    evidence: "Risk register + review log",
    status: "Approved",
    confidence: 98,
    owner: "AI Risk",
  },
  {
    id: "REQ-EU-013-03",
    title: "Provide deployers with instructions for use",
    source: "EU AI Act · Art. 13(3)",
    applies: "Provider · High-risk AI",
    control: "DOC-07",
    evidence: "Versioned instructions",
    status: "Approved",
    confidence: 96,
    owner: "Product Legal",
  },
  {
    id: "REQ-CA-053-12",
    title: "Publish a frontier AI transparency framework",
    source: "California SB 53 · § 22757.12",
    applies: "Covered frontier developer",
    control: "GOV-04",
    evidence: "Public framework URL",
    status: "Needs review",
    confidence: 84,
    owner: "Regulatory Legal",
  },
  {
    id: "REQ-CN-LAB-04",
    title: "Attach explicit and implicit synthetic-content labels",
    source: "China Labeling Measures · Art. 4–7",
    applies: "Generative AI provider",
    control: "TRN-04",
    evidence: "Rendered label + metadata sample",
    status: "Approved",
    confidence: 94,
    owner: "Trust Engineering",
  },
  {
    id: "REQ-NYC-144-01",
    title: "Complete an independent annual bias audit",
    source: "NYC LL 144 · § 20-871",
    applies: "AEDT employer / agency",
    control: "FAI-03",
    evidence: "Signed audit report",
    status: "Approved",
    confidence: 99,
    owner: "Responsible AI",
  },
  {
    id: "REQ-KR-031-02",
    title: "Notify users of generative AI interaction",
    source: "Korea AI Basic Act · Art. 31",
    applies: "Generative AI operator",
    control: "TRN-04",
    evidence: "UI disclosure capture",
    status: "Needs review",
    confidence: 79,
    owner: "APAC Legal",
  },
];

const changeEvents = [
  {
    date: "SEP 28",
    title: "Colorado effective date shifted",
    source: "SB 26-189 signed",
    detail: "Effective date moved to June 30, 2027; developer disclosure language narrowed.",
    impact: "12 requirements · 3 products · 4 controls",
    tone: "amber" as Tone,
  },
  {
    date: "SEP 25",
    title: "Commission guidance indexed",
    source: "EU GPAI guidelines · version 1.1",
    detail: "New implementation examples affect copyright policy evidence and model documentation.",
    impact: "8 requirements · 2 products · 2 controls",
    tone: "blue" as Tone,
  },
  {
    date: "SEP 19",
    title: "Labeling standard cross-reference updated",
    source: "TC260 technical standard",
    detail: "Metadata field guidance changed for downloadable image and audio assets.",
    impact: "5 requirements · 4 products · 1 control",
    tone: "purple" as Tone,
  },
];

const controlCards = [
  { id: "RM-01", title: "AI risk lifecycle", owner: "AI Risk", coverage: 92, reqs: 18, evidence: 7, state: "Healthy" },
  { id: "TRN-04", title: "AI interaction disclosure", owner: "Trust Engineering", coverage: 71, reqs: 14, evidence: 5, state: "Action needed" },
  { id: "DOC-07", title: "Technical documentation", owner: "Product Legal", coverage: 84, reqs: 27, evidence: 12, state: "Healthy" },
  { id: "FAI-03", title: "Bias testing & audit", owner: "Responsible AI", coverage: 63, reqs: 11, evidence: 4, state: "Action needed" },
];

function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: Tone }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function Progress({ value, warning = false }: { value: number; warning?: boolean }) {
  return (
    <div className="progress" aria-label={`${value}% complete`}>
      <span className={warning ? "warning" : ""} style={{ width: `${value}%` }} />
    </div>
  );
}

function SectionTitle({ eyebrow, title, detail, action }: { eyebrow?: string; title: string; detail?: string; action?: React.ReactNode }) {
  return (
    <div className="section-title">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {detail && <p className="section-detail">{detail}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

function Overview({ onNavigate }: { onNavigate: (view: ViewId) => void }) {
  return (
    <div className="view-stack">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow light">Verified 29 Sep 2026</p>
          <h1>AI compliance,<br />connected.</h1>
          <p>Trace every law to a product decision, control, and proof.</p>
          <div className="hero-actions">
            <button className="button button-light" onClick={() => onNavigate("assess")}>Assess product <span>→</span></button>
            <button className="button button-ghost-light" onClick={() => onNavigate("rulebook")}>Open rulebook</button>
          </div>
        </div>
        <div className="hero-signal">
          <div className="signal-top"><span>Readiness index</span><Badge tone="green">↑ 4.8%</Badge></div>
          <div className="score-line"><strong>78</strong><span>/100</span></div>
          <Progress value={78} />
          <div className="signal-grid">
            <div><b>91%</b><span>source coverage</span></div>
            <div><b>68%</b><span>evidence current</span></div>
          </div>
          <p className="signal-note"><i /> 6 priority actions across 3 products</p>
        </div>
      </section>

      <section className="metric-grid">
        <article className="metric-card"><div className="metric-icon">§</div><div><span>Active sources</span><strong>47</strong><small>9 jurisdictions</small></div></article>
        <article className="metric-card"><div className="metric-icon">≡</div><div><span>Approved obligations</span><strong>254</strong><small>32 awaiting review</small></div></article>
        <article className="metric-card"><div className="metric-icon">◇</div><div><span>Products in scope</span><strong>12</strong><small>3 need attention</small></div></article>
        <article className="metric-card"><div className="metric-icon">⊞</div><div><span>Control coverage</span><strong>82%</strong><small>+6% this quarter</small></div></article>
      </section>

      <section className="overview-grid">
        <article className="panel change-panel">
          <div className="panel-heading">
            <div><p className="eyebrow">Changes</p><h2>This week</h2></div>
            <button className="text-button" onClick={() => onNavigate("monitor")}>View all →</button>
          </div>
          <div className="change-feature">
            <div className="date-block"><b>28</b><span>SEP</span></div>
            <div>
              <Badge tone="amber">Material change</Badge>
              <h3>Colorado AI Act effective date shifted</h3>
              <p>SB 26-189 moves the operative date and narrows several disclosure duties. Twelve normalized obligations need review.</p>
              <div className="impact-row"><span>12 requirements</span><span>3 products</span><span>4 controls</span></div>
            </div>
          </div>
          <div className="mini-change"><span className="change-dot blue" /><div><b>EU GPAI guidelines v1.1 indexed</b><small>8 obligations may need interpretation updates</small></div><span>2d</span></div>
          <div className="mini-change"><span className="change-dot purple" /><div><b>China labeling standard cross-reference</b><small>Metadata evidence requirement changed</small></div><span>5d</span></div>
        </article>

        <article className="panel deadlines-panel">
          <div className="panel-heading"><div><p className="eyebrow">Next</p><h2>Deadlines</h2></div><button className="icon-button" aria-label="Open deadline calendar">↗</button></div>
          <div className="deadline-list">
            <div className="deadline-item urgent"><div><b>22</b><span>JAN<br />2026</span></div><div><h3>Korea AI Basic Act</h3><p>Transparency and high-impact AI duties</p></div><Badge tone="red">115 days</Badge></div>
            <div className="deadline-item"><div><b>02</b><span>AUG<br />2026</span></div><div><h3>EU AI Act</h3><p>High-risk system obligations</p></div><Badge tone="blue">307 days</Badge></div>
            <div className="deadline-item"><div><b>01</b><span>JAN<br />2027</span></div><div><h3>California SB 53</h3><p>Frontier framework publication</p></div><Badge>459 days</Badge></div>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-heading"><div><p className="eyebrow">Products</p><h2>Readiness</h2></div><button className="text-button" onClick={() => onNavigate("assess")}>Assess →</button></div>
        <div className="product-grid">
          {[
            ["Aster Credit Memo", "AI-assisted credit operations pilot", "High", 42, "6 blockers", "AF"],
            ["Talent Lens", "Employment ranking", "High", 61, "6 gaps", "TL"],
            ["Beacon Fraud", "Transaction monitoring", "Limited", 88, "1 gap", "BF"],
            ["Studio Forge", "Media generation", "Transparency", 83, "2 gaps", "SF"],
          ].map(([name, detail, risk, score, gap, initials]) => (
            <button className="product-card" key={name as string} onClick={() => onNavigate("assess")}>
              <div className="product-top"><span className="avatar">{initials}</span><Badge tone={risk === "High" ? "red" : risk === "Limited" ? "blue" : "purple"}>{risk} risk</Badge></div>
              <h3>{name}</h3><p>{detail}</p>
              <div className="product-score"><span>Readiness</span><b>{score}%</b></div><Progress value={score as number} warning={(score as number) < 70} />
              <div className="product-foot"><span>{gap} open</span><span>View record →</span></div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function Regulations() {
  const [region, setRegion] = useState("All regions");
  const [selectedId, setSelectedId] = useState("EU-AIA");
  const visible = regulations.filter((item) => region === "All regions" || item.region.includes(region));
  const selected = regulations.find((item) => item.id === selectedId) ?? visible[0] ?? regulations[0];
  return (
    <div className="view-stack">
      <SectionTitle eyebrow="Sources" title="Regulations" detail="Official laws and guidance." action={<button className="button button-dark">+ Add source</button>} />
      <div className="library-stats">
        <span><b>47</b> active sources</span><span><b>9</b> jurisdictions</span><span><b>6</b> monitored languages</span><span><b>91%</b> source coverage</span>
      </div>
      <div className="filter-bar">
        <div className="filter-tabs"><button className="active">All <span>47</span></button><button>Primary law <span>18</span></button><button>Guidance <span>21</span></button><button>Standards <span>8</span></button></div>
        <select value={region} onChange={(e) => setRegion(e.target.value)} aria-label="Filter by region"><option>All regions</option><option>European Union</option><option>United States</option><option>South Korea</option><option>China</option></select>
      </div>
      <div className="split-library">
        <div className="reg-list panel">
          <div className="reg-list-head"><span>Instrument</span><span>Status</span><span>Requirements</span><span>Reviewed</span></div>
          {visible.map((reg) => (
            <button key={reg.id} className={`reg-row ${selected.id === reg.id ? "selected" : ""}`} onClick={() => setSelectedId(reg.id)}>
              <div><span className="jurisdiction-mark">{reg.id.split("-")[0]}</span><span><b>{reg.name}</b><small>{reg.citation} · {reg.region}</small></span></div>
              <Badge tone={reg.tone}>{reg.status}</Badge><span className="number-cell">{reg.requirements}</span>
              <span className="review-cell"><Progress value={reg.reviewed} /><small>{reg.reviewed}%</small></span>
            </button>
          ))}
        </div>
        <aside className="source-detail panel">
          <div className="detail-kicker"><Badge tone={selected.tone}>{selected.status}</Badge><span>{selected.id}</span></div>
          <h2>{selected.name}</h2><p className="citation">{selected.citation}</p>
          <dl><div><dt>Issuing authority</dt><dd>{selected.authority}</dd></div><div><dt>Official source</dt><dd>{selected.source}</dd></div><div><dt>Next milestone</dt><dd>{selected.nextDate}</dd></div></dl>
          <div className="scope-box"><span>Scope</span><p>{selected.scope}</p></div>
          <div className="provision-box"><span>{selected.provision}</span><p>“{selected.excerpt}”</p></div>
          <div className="trace-stats"><div><b>{selected.requirements}</b><span>atomic requirements</span></div><div><b>{selected.reviewed}%</b><span>legally reviewed</span></div></div>
          <button className="button button-dark full">Open source record →</button>
        </aside>
      </div>
    </div>
  );
}

function Requirements() {
  const [filter, setFilter] = useState("All");
  const shown = requirements.filter((item) => filter === "All" || item.status === filter);
  return (
    <div className="view-stack">
      <SectionTitle eyebrow="Obligations" title="Requirements" detail="Testable duties linked to source and evidence." action={<button className="button button-dark">Export matrix</button>} />
      <section className="rule-summary">
        <div><span>Total obligations</span><b>286</b><small>Across 47 sources</small></div>
        <div><span>Approved</span><b className="green-text">254</b><small>89% of inventory</small></div>
        <div><span>Needs legal review</span><b className="amber-text">32</b><small>8 high priority</small></div>
        <div><span>Control coverage</span><b>82%</b><small>51 unmapped obligations</small></div>
      </section>
      <div className="panel requirements-panel">
        <div className="requirements-toolbar">
          <div className="filter-tabs"><button className={filter === "All" ? "active" : ""} onClick={() => setFilter("All")}>All</button><button className={filter === "Approved" ? "active" : ""} onClick={() => setFilter("Approved")}>Approved</button><button className={filter === "Needs review" ? "active" : ""} onClick={() => setFilter("Needs review")}>Needs review</button></div>
          <button className="secondary-button">Filters · 2</button>
        </div>
        <div className="req-table">
          <div className="req-head"><span>Requirement</span><span>Applies to</span><span>Control</span><span>Evidence</span><span>Status</span></div>
          {shown.map((req) => (
            <button className="req-row" key={req.id}>
              <span className="req-main"><small>{req.id}</small><b>{req.title}</b><em>{req.source}</em></span>
              <span>{req.applies}</span><Badge tone="blue">{req.control}</Badge><span>{req.evidence}</span>
              <span className="req-status"><Badge tone={req.status === "Approved" ? "green" : "amber"}>{req.status}</Badge><small>{req.confidence}% confidence</small></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function LegalReview({ notify }: { notify: (message: string) => void }) {
  const [selected, setSelected] = useState(requirements.find((r) => r.status === "Needs review") ?? requirements[0]);
  const reviewItems = requirements.filter((r) => r.status === "Needs review");
  return (
    <div className="view-stack">
      <SectionTitle eyebrow="Review" title="Legal decisions" detail="Approve interpretations before they become rules." />
      <div className="review-layout">
        <aside className="review-queue panel">
          <div className="queue-head"><h2>Priority queue</h2><Badge tone="amber">8 open</Badge></div>
          {[...reviewItems, requirements[1], requirements[4]].map((item, index) => (
            <button key={`${item.id}-${index}`} className={selected.id === item.id ? "selected" : ""} onClick={() => setSelected(item)}>
              <div><small>{item.id}</small><Badge tone={index < 2 ? "red" : "slate"}>{index < 2 ? "High" : "Normal"}</Badge></div><b>{item.title}</b><span>{item.source}</span><em>{item.owner}</em>
            </button>
          ))}
        </aside>
        <section className="review-document panel">
          <div className="document-top"><div><p className="eyebrow">Candidate interpretation</p><h2>{selected.title}</h2></div><span className="version">v1.2</span></div>
          <div className="source-anchor"><span>Source anchor</span><b>{selected.source}</b><p>“Providers shall establish and maintain documented measures appropriate to the applicable risk and context of the AI system.”</p><button className="text-button">Open official text ↗</button></div>
          <div className="interpretation-block"><span>Normalized requirement</span><p>{selected.title}. The accountable owner must retain versioned evidence and review the control when the product’s purpose, model, geography, or risk classification changes.</p></div>
          <div className="logic-grid"><div><span>Actor</span><b>{selected.applies.split("·")[0]}</b></div><div><span>System class</span><b>{selected.applies.split("·")[1] ?? "In-scope AI"}</b></div><div><span>Modality</span><b>Ongoing duty</b></div><div><span>Evidence</span><b>{selected.evidence}</b></div></div>
          <div className="review-note"><b>AI extraction note</b><p>The model separated this duty from adjacent documentation requirements. Applicability conditions were inferred from the article heading and definitions cross-reference.</p></div>
        </section>
        <aside className="decision-panel panel">
          <p className="eyebrow">Review decision</p><div className="confidence-ring"><strong>{selected.confidence}</strong><span>%</span></div><p className="centered">Extraction confidence</p>
          <dl><div><dt>Source integrity</dt><dd><Badge tone="green">Verified</Badge></dd></div><div><dt>Cross-reference</dt><dd><Badge tone="green">Resolved</Badge></dd></div><div><dt>Ambiguity</dt><dd><Badge tone="amber">Medium</Badge></dd></div></dl>
          <label>Reviewer note<textarea placeholder="Add interpretation rationale…" /></label>
          <button className="button button-approve full" onClick={() => notify(`${selected.id} approved and published to the rulebook`)}>✓ Approve requirement</button>
          <button className="secondary-button full" onClick={() => notify(`${selected.id} returned for revision`)}>Return for revision</button>
          <button className="text-button danger" onClick={() => notify(`${selected.id} rejected`)}>Reject candidate</button>
        </aside>
      </div>
    </div>
  );
}

type IntakeDocument = { name: string; size: number; text: string; readable: boolean };

type AutofillFact = { field: string; value: string | string[]; confidence: number; needs_review: boolean };
type AutofillFramework = { name: string; status: "candidate" | "recommended"; rationale: string; validation: string };
type AutofillBlocker = { id: string; title: string; owner: string; evidence_needed: string };
type AutofillAssessment = {
  title: string;
  autofill_confidence: number;
  editable_facts: AutofillFact[];
  candidate_frameworks: AutofillFramework[];
  risk_signals: string[];
  blockers: AutofillBlocker[];
  plan: { decision: string; decision_label: string; evidence_readiness: number; next_steps: string[] };
  source_summary: { documents_analyzed: number; links_supplied: number; standards_supplied: number; evidence_items_supplied: number };
  disclaimer: string;
};

const demoDocuments: IntakeDocument[] = [
  { name: "Aster-AI-Compliance-Review-Demo-Submission.md", size: 24700, readable: true, text: "Company: Aster Financial\nProduct: Aster Credit Memo Assistant\nOwner: Chief Risk Officer\nStage: Pilot\nUsers: Credit analysts and credit officers\nIntended purpose: Draft factual consumer credit memos from authorized repayment history for officer review; it cannot approve credit or send external notices.\nDeployment: European Union, Ireland, United States, New York.\nTarget pilot date: 15 January 2027.\nThe pilot is submitted for review and is not approved. It uses a vendor-hosted LLM and customer credit information. A credit committee retains the lending decision." },
  { name: "VENDOR-CONFIG-v7.txt", size: 4200, readable: true, text: "Fictional enterprise LLM endpoint. Raw prompt payload retention is configured for 365 days, contrary to transient-processing policy RET-POL-v2. Processing regions, subprocessors, support access, transfer safeguards, and signed terms are unconfirmed." },
  { name: "CREDIT-TRACE-R.json", size: 6800, readable: true, text: "Synthetic staging trace: retrieval returned superseded record v3 while v4 existed; the current dispute was omitted; full report fields reached an unapproved endpoint. This is failing staging evidence, not a production breach." },
  { name: "VALIDATION-v4.pdf", size: 31800, readable: false, text: "" },
];

const demoIntake = {
  links: "https://risk.aster.example/credit-memo-assistant\nhttps://policies.aster.example/credit-data",
  standards: "RET-POL-v2 · Transient raw-prompt policy\nCREDIT-POL-v2 · Assigned-case access and allowed fields\nMR-POL-v3 · Validation and independent review\nREPORT-POL-v2 · Evidence and submission status",
  context: "Assess pilot readiness separately for Aster EU and Aster US Lending. Treat proposed controls as untested until evidence is supplied.",
};

function Assessment({ notify }: { notify: (message: string) => void }) {
  const [generated, setGenerated] = useState(false);
  const [autofillRan, setAutofillRan] = useState(false);
  const [autofillStatus, setAutofillStatus] = useState<"idle" | "analyzing" | "complete">("idle");
  const [analysisStep, setAnalysisStep] = useState(0);
  const [autofillError, setAutofillError] = useState("");
  const [autofillScore, setAutofillScore] = useState(0);
  const [assessment, setAssessment] = useState<AutofillAssessment | null>(null);
  const [editedFields, setEditedFields] = useState<string[]>([]);
  const [documents, setDocuments] = useState<IntakeDocument[]>(demoDocuments);
  const [intake, setIntake] = useState(demoIntake);
  const [profile, setProfile] = useState({
    name: "",
    owner: "",
    purpose: "",
    stage: "Design",
    users: "Employees",
  });
  const [features, setFeatures] = useState({ decisions: false, employees: false, generation: false, biometrics: false, minors: false });
  const [regions, setRegions] = useState<string[]>([]);
  const [fieldConfidence, setFieldConfidence] = useState({ name: 0, owner: 0, purpose: 0, stage: 0, users: 0 });
  const [completed, setCompleted] = useState<string[]>([]);
  const [reportAudience, setReportAudience] = useState("Legal & product");
  const [reportSections, setReportSections] = useState({ applicability: true, roadmap: true, evidence: true, questions: true });
  const toggle = (key: keyof typeof features) => setFeatures((current) => ({ ...current, [key]: !current[key] }));
  const toggleRegion = (region: string) => setRegions((current) => current.includes(region) ? current.filter((item) => item !== region) : [...current, region]);
  const toggleReportSection = (key: keyof typeof reportSections) => setReportSections((current) => ({ ...current, [key]: !current[key] }));
  const readableDocuments = documents.filter((document) => document.readable).length;
  const linkCount = intake.links.split("\n").filter((link) => link.trim()).length;
  const autofillConfidence = autofillScore;
  const markEdited = (field: string) => setEditedFields((current) => current.includes(field) ? current : [...current, field]);
  const loadDemo = () => {
    setDocuments(demoDocuments);
    setIntake(demoIntake);
    setProfile({ name: "", owner: "", purpose: "", stage: "Design", users: "Employees" });
    setFeatures({ decisions: false, employees: false, generation: false, biometrics: false, minors: false });
    setRegions([]);
    setAssessment(null);
    setAutofillScore(0);
    setAutofillRan(false);
    setAutofillStatus("idle");
    setEditedFields([]);
    setCompleted([]);
    setGenerated(false);
    setAutofillError("");
    notify("Fictional Aster customer demo loaded");
  };
  const startBlank = () => {
    setDocuments([]);
    setIntake({ links: "", standards: "", context: "" });
    setProfile({ name: "", owner: "", purpose: "", stage: "Design", users: "Employees" });
    setFeatures({ decisions: false, employees: false, generation: false, biometrics: false, minors: false });
    setRegions([]);
    setAssessment(null);
    setAutofillScore(0);
    setAutofillRan(false);
    setAutofillStatus("idle");
    setEditedFields([]);
    setCompleted([]);
    setGenerated(false);
    setAutofillError("");
    notify("Blank product intake ready");
  };
  const handleDocuments = async (files: FileList | null) => {
    const selected = Array.from(files ?? []);
    if (!selected.length) return;
    const parsed = await Promise.all(selected.map(async (file): Promise<IntakeDocument> => {
      const readable = /\.(txt|md|json|csv|html?)$/i.test(file.name) || file.type.startsWith("text/");
      let text = "";
      if (readable) {
        try { text = await file.text(); } catch { text = ""; }
      }
      return { name: file.name, size: file.size, text, readable: readable && Boolean(text) };
    }));
    setDocuments((current) => [...current.filter((item) => !parsed.some((next) => next.name === item.name)), ...parsed]);
    setAutofillRan(false);
    setAutofillStatus("idle");
  };
  const runAutofill = async () => {
    const sourceCount = documents.length + linkCount + (intake.standards.trim() ? 1 : 0);
    if (!sourceCount) {
      notify("Add a document, link, or RAI standard first");
      return;
    }
    setAutofillStatus("analyzing");
    setAutofillRan(false);
    setAutofillError("");
    setEditedFields([]);
    setAnalysisStep(0);
    const steps = [250, 560, 860].map((delay, index) => window.setTimeout(() => setAnalysisStep(index + 1), delay));
    try {
      const rawSource = documents.map((document) => `Document: ${document.name}\n${document.readable ? document.text : "[File name captured; full text was not available in this browser demo.]"}`).join("\n\n");
      const response = await fetch("/api/autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_text: rawSource,
          spec_links: intake.links.split("\n").map((item) => item.trim()).filter(Boolean),
          responsible_ai_standards: intake.standards.split("\n").map((item) => item.trim()).filter(Boolean),
          review_focus: intake.context,
        }),
      });
      if (!response.ok) throw new Error("Assessment request failed");
      const result = await response.json() as AutofillAssessment;
      await new Promise((resolve) => window.setTimeout(resolve, 1050));
      const fact = (field: string) => result.editable_facts.find((item) => item.field === field);
      const capabilities = (fact("capabilities")?.value as string[] | undefined) ?? [];
      const inferredRegions = (fact("regions")?.value as string[] | undefined) ?? [];
      const inferredUsers = String(fact("users")?.value ?? "Employees");
      setProfile({
        name: String(fact("product_name")?.value ?? ""),
        owner: String(fact("owner")?.value ?? ""),
        purpose: String(fact("purpose")?.value ?? ""),
        stage: String(fact("stage")?.value ?? "Design"),
        users: /both/i.test(inferredUsers) ? "Both" : /analyst|employee|officer|internal|recruiter/i.test(inferredUsers) ? "Employees" : "Consumers",
      });
      setFeatures({
        decisions: capabilities.includes("consequential_decisions"),
        employees: capabilities.includes("employment"),
        generation: capabilities.includes("generative_ai"),
        biometrics: capabilities.includes("biometrics"),
        minors: capabilities.includes("children"),
      });
      setRegions(inferredRegions.length ? inferredRegions.map((region) => region === "Ireland" ? "European Union" : region === "New York" ? "United States" : region).filter((region, index, all) => all.indexOf(region) === index) : []);
      setFieldConfidence({
        name: fact("product_name")?.confidence ?? 0,
        owner: fact("owner")?.confidence ?? 0,
        purpose: fact("purpose")?.confidence ?? 0,
        stage: fact("stage")?.confidence ?? 0,
        users: fact("users")?.confidence ?? 0,
      });
      setAssessment(result);
      setAutofillScore(result.autofill_confidence);
      setCompleted([]);
      setAutofillRan(true);
      setAutofillStatus("complete");
      notify(`Autofilled ${String(fact("product_name")?.value ?? "product assessment")} from ${sourceCount} sources`);
    } catch {
      setAutofillStatus("idle");
      setAutofillError("Autofill could not complete. Your intake is still here—try again.");
      notify("Autofill could not complete");
    } finally {
      steps.forEach((timer) => window.clearTimeout(timer));
    }
  };
  const checklist = [
    ["DATA-01", "Fix current-record retrieval and dispute preservation", "Before pilot", "Version, correction, and revised-memo tests", "EU privacy · US credit"],
    ["VEN-02", "Correct vendor retention and endpoint controls", "Before pilot", "Config, terms, and enforcement tests", "EU privacy · US privacy"],
    ["MRM-03", "Validate scoring v5 and evaluate the memo LLM", "Before pilot", "Version-matched validation and review", "EU AI · US fair lending"],
    ["HUM-04", "Prove meaningful officer review", "Before pilot", "Intervention, rejection, and permission tests", "EU AI · US credit"],
    ["LAW-05", "Confirm entity-specific duties and schedules", "Before approval", "Legal mapping and retention schedule", "Ireland · New York"],
    ["INC-06", "Approve incident, reporting, and recovery routes", "Before pilot", "Signed matrix, tabletop, recovery test", "Entity specific"],
  ];
  const currentBlockers: AutofillBlocker[] = assessment?.blockers ?? checklist.map(([id, title, , evidence, sources]) => ({ id, title, owner: sources, evidence_needed: evidence }));
  const currentFrameworks = assessment?.candidate_frameworks ?? [];
  const isAsterDemo = /aster/i.test(profile.name);
  const reportSummary = isAsterDemo
    ? `${profile.name} is a draft-only assistant proposed for credit analysts. It uses customer credit history to prepare factual memos, but officers must verify sources and the credit committee retains every lending decision. Aster EU and Aster US Lending require separate approvals.`
    : `${profile.name || "This product"} is a ${profile.stage.toLowerCase()}-stage AI system for ${profile.users.toLowerCase()}. ${profile.purpose || "Its intended purpose still needs to be confirmed."} This draft separates extracted facts from candidate legal scope and routes every decision to a human owner.`;
  const reportDecision = assessment?.plan.decision_label ?? "Complete the named evidence and legal review before launch";
  const roadmapGroups = [currentBlockers.slice(0, 2), currentBlockers.slice(2, 4), currentBlockers.slice(4)];
  const analysisLabels = ["Reading source material", "Extracting product facts", "Mapping risk signals", "Building the review plan"];
  return (
    <div className="view-stack">
      <SectionTitle eyebrow="Assess" title="Product assessment" detail="Show how Soteria turns scattered product evidence into an editable, review-ready decision." action={<Badge tone={generated ? "green" : "purple"}>{generated ? "Report ready" : "Customer demo · Fictional data"}</Badge>} />
      {!generated ? (
        <>
        <section className="ai-intake panel">
          <div className="ai-intake-heading">
            <div className="ai-intake-title"><span className="ai-spark">✦</span><div><p className="eyebrow">AI autofill</p><h2>From source material to review-ready facts</h2><p>Upload specs, add product links and internal standards, then review every extracted answer and its confidence.</p></div></div>
            <div className="demo-actions"><button className="secondary-button" onClick={loadDemo}>Load Aster demo</button><button className="secondary-button" onClick={startBlank}>Try my product</button>{autofillRan && <div className="autofill-score"><div><strong>{autofillConfidence}</strong><span>%</span></div><small>Extraction confidence</small></div>}</div>
          </div>
          <div className="intake-source-grid">
            <div className="intake-source-card">
              <div className="source-card-head"><span className="source-type-icon">▤</span><div><b>Documents</b><small>Specs, model cards, DPIAs</small></div></div>
              <label className="upload-drop">+ Add files<input type="file" multiple accept=".pdf,.doc,.docx,.txt,.md,.json,.csv" onChange={(event) => { void handleDocuments(event.target.files); event.target.value = ""; }} /></label>
              <div className="document-chips">
                {documents.length ? documents.map((document) => <span key={document.name}>{document.name}<i className={document.readable ? "read" : "name-only"}>{document.readable ? "full text" : "name only"}</i><button aria-label={`Remove ${document.name}`} onClick={() => { setDocuments((current) => current.filter((item) => item.name !== document.name)); setAutofillRan(false); setAutofillStatus("idle"); setAssessment(null); }}>×</button></span>) : <small>No documents selected</small>}
              </div>
            </div>
            <label className="intake-source-card source-field" htmlFor="assessment-links" aria-label="Documentation links">
              <span className="source-card-head"><span className="source-type-icon">↗</span><span><b>Links</b><small>Docs, wikis, repositories</small></span></span>
              <textarea id="assessment-links" value={intake.links} onChange={(event) => { setIntake((current) => ({ ...current, links: event.target.value })); setAutofillRan(false); setAutofillStatus("idle"); }} placeholder="Paste one URL per line…" />
            </label>
            <label className="intake-source-card source-field" htmlFor="assessment-standards" aria-label="Responsible AI standards">
              <span className="source-card-head"><span className="source-type-icon">◎</span><span><b>RAI standards</b><small>Internal AI and risk rules</small></span></span>
              <textarea id="assessment-standards" value={intake.standards} onChange={(event) => { setIntake((current) => ({ ...current, standards: event.target.value })); setAutofillRan(false); setAutofillStatus("idle"); }} placeholder="Name or paste relevant internal standards…" />
            </label>
          </div>
          <div className="intake-instructions">
            <label><span>Instructions <em>Optional</em></span><input value={intake.context} onChange={(event) => { setIntake((current) => ({ ...current, context: event.target.value })); setAutofillRan(false); setAutofillStatus("idle"); }} placeholder="What should the AI prioritize?" /></label>
            <button className={`button button-dark autofill-button ${autofillStatus === "analyzing" ? "loading" : ""}`} disabled={autofillStatus === "analyzing"} onClick={() => { void runAutofill(); }}><span>{autofillStatus === "analyzing" ? "◌" : "✦"}</span>{autofillStatus === "analyzing" ? analysisLabels[analysisStep] : autofillRan ? "Run autofill again" : "Autofill assessment"}</button>
          </div>
          {autofillStatus === "analyzing" && <div className="analysis-progress" aria-live="polite">{analysisLabels.map((label, index) => <span key={label} className={index < analysisStep ? "done" : index === analysisStep ? "active" : ""}><i>{index < analysisStep ? "✓" : index + 1}</i>{label}</span>)}</div>}
          {autofillError && <div className="autofill-error" role="alert"><b>Autofill paused</b><span>{autofillError}</span><button onClick={() => { void runAutofill(); }}>Retry</button></div>}
          {autofillRan && <div className="autofill-result">
            <div className="result-summary"><span className="result-check">✓</span><span><b>{assessment?.editable_facts.length ?? 0} core facts extracted</b><small>{documents.length + linkCount + (intake.standards.trim() ? 1 : 0)} sources supplied · {readableDocuments} full-text</small></span></div>
            <div className="confidence-breakdown"><span><i style={{ width: `${Math.round((fieldConfidence.name + fieldConfidence.owner + fieldConfidence.purpose) / 3)}%` }} /><b>Product profile</b><em>{Math.round((fieldConfidence.name + fieldConfidence.owner + fieldConfidence.purpose) / 3)}%</em></span><span><i style={{ width: `${Math.max(64, autofillConfidence - 7)}%` }} /><b>Risk attributes</b><em>{Math.max(64, autofillConfidence - 7)}%</em></span><span><i style={{ width: `${regions.length > 1 ? 91 : 68}%` }} /><b>Deployment scope</b><em>{regions.length > 1 ? "91%" : "68%"}</em></span></div>
            <p>Editable draft · {assessment?.blockers.length ?? 0} evidence gaps found · human approval required</p>
          </div>}
        </section>
        <div className="assessment-layout">
          <section className="assessment-form panel">
            <div className="step-label"><span>1</span><div><b>Product profile</b><small>Describe the system and its use</small></div></div>
            <div className="form-grid"><label><span>Product name {autofillRan && <em className={editedFields.includes("name") ? "ai-field-tag edited" : fieldConfidence.name < 80 ? "ai-field-tag review" : "ai-field-tag"}>{editedFields.includes("name") ? "Edited by you" : `AI filled · ${fieldConfidence.name}%`}</em>}</span><input value={profile.name} placeholder="Product name" onChange={(event) => { markEdited("name"); setProfile((current) => ({ ...current, name: event.target.value })); }} /></label><label><span>Primary owner {autofillRan && <em className={editedFields.includes("owner") ? "ai-field-tag edited" : fieldConfidence.owner < 80 ? "ai-field-tag review" : "ai-field-tag"}>{editedFields.includes("owner") ? "Edited by you" : `AI filled · ${fieldConfidence.owner}%`}</em>}</span><input value={profile.owner} placeholder="Owning team" onChange={(event) => { markEdited("owner"); setProfile((current) => ({ ...current, owner: event.target.value })); }} /></label><label className="wide"><span>Intended purpose {autofillRan && <em className={editedFields.includes("purpose") ? "ai-field-tag edited" : fieldConfidence.purpose < 80 ? "ai-field-tag review" : "ai-field-tag"}>{editedFields.includes("purpose") ? "Edited by you" : `${fieldConfidence.purpose < 80 ? "Confirm" : "AI filled"} · ${fieldConfidence.purpose}%`}</em>}</span><textarea value={profile.purpose} placeholder="What does the system do?" onChange={(event) => { markEdited("purpose"); setProfile((current) => ({ ...current, purpose: event.target.value })); }} /></label><label><span>Lifecycle stage {autofillRan && <em className={editedFields.includes("stage") ? "ai-field-tag edited" : fieldConfidence.stage < 80 ? "ai-field-tag review" : "ai-field-tag"}>{editedFields.includes("stage") ? "Edited by you" : `AI filled · ${fieldConfidence.stage}%`}</em>}</span><select value={profile.stage} onChange={(event) => { markEdited("stage"); setProfile((current) => ({ ...current, stage: event.target.value })); }}><option>Design</option><option>Pilot</option><option>Production</option></select></label><label><span>Primary users {autofillRan && <em className={editedFields.includes("users") ? "ai-field-tag edited" : fieldConfidence.users < 80 ? "ai-field-tag review" : "ai-field-tag"}>{editedFields.includes("users") ? "Edited by you" : `AI filled · ${fieldConfidence.users}%`}</em>}</span><select value={profile.users} onChange={(event) => { markEdited("users"); setProfile((current) => ({ ...current, users: event.target.value })); }}><option>Consumers</option><option>Employees</option><option>Both</option></select></label></div>
            {autofillRan && <div className="source-trace"><div><span>Source trail</span><b>{documents.filter((document) => document.readable).map((document) => document.name).slice(0, 2).join(" · ") || "Manual intake"}</b></div><div><span>Needs confirmation</span><b>{assessment?.editable_facts.filter((fact) => fact.needs_review).map((fact) => fact.field.replaceAll("_", " ")).join(" · ") || "No low-confidence core facts"}</b></div></div>}
            <div className="step-label"><span>2</span><div><b>Risk-relevant attributes</b><small>Select every behavior that applies</small></div></div>
            <div className="toggle-grid">
              {[
                ["decisions", "Supports consequential decisions", "Influences eligibility, access, ranking, or treatment"],
                ["employees", "Used in employment", "Recruitment, evaluation, promotion, or termination"],
                ["generation", "Generates synthetic content", "Produces text, image, audio, or video"],
                ["biometrics", "Processes biometric data", "Identifies or infers sensitive traits"],
                ["minors", "Used by or affects minors", "Children may directly interact with the system"],
              ].map(([key, title, detail]) => (
                <button key={key} className={features[key as keyof typeof features] ? "active" : ""} onClick={() => toggle(key as keyof typeof features)}><span className="check-box">{features[key as keyof typeof features] ? "✓" : ""}</span><span><b>{title}</b><small>{detail}</small></span></button>
              ))}
            </div>
            <div className="step-label"><span>3</span><div><b>Deployment footprint</b><small>Where users and affected people are located</small></div></div>
            <div className="region-chips">{["European Union", "United States", "South Korea", "China", "United Kingdom"].map((region) => <button key={region} className={regions.includes(region) ? "selected" : ""} onClick={() => toggleRegion(region)}>{region} {regions.includes(region) ? "✓" : "+"}</button>)}</div>
            <button className="button button-dark generate" disabled={!profile.name || !profile.purpose} onClick={() => { setGenerated(true); notify("Tailored compliance plan generated"); }}>Generate tailored plan <span>→</span></button>
          </section>
          <aside className="assessment-insight panel">
            <p className="eyebrow">Live scope preview</p><h2>{autofillRan ? "Candidate obligations" : "Ready for intake"}</h2><p>{autofillRan ? `Soteria found ${currentFrameworks.length} frameworks to validate and ${currentBlockers.length} evidence gaps to close.` : "Run autofill to separate extracted product facts from candidate regulatory scope."}</p>
            <div className="risk-orbit"><div><strong>{currentFrameworks.length || "—"}</strong><span>frameworks</span></div></div>
            <div className="trigger-list">{currentFrameworks.slice(0, 4).map((framework, index) => <div key={framework.name}><span className={`change-dot ${["green", "blue", "purple", "amber"][index]}`}/><span><b>{framework.name}</b><small>{framework.rationale}</small></span></div>)}</div>
            <p className="assessment-caveat">Candidate scope, not legal advice. Every inferred fact remains editable and final applicability requires qualified review.</p>
          </aside>
        </div>
        </>
      ) : (
        <div className="plan-layout">
          <section className="plan-summary panel"><div><p className="eyebrow">Customized report</p><h2>{profile.name} {profile.stage.toLowerCase()} review</h2><p>{assessment?.editable_facts.length ?? 0} core facts · {assessment?.source_summary.evidence_items_supplied ?? 0} evidence references · Updated 17 Oct 2026</p></div><div className="plan-score"><strong>{assessment?.plan.evidence_readiness ?? 42}</strong><span>/100<br />evidence ready</span></div><div className="plan-actions"><button className="secondary-button" onClick={() => setGenerated(false)}>Edit facts</button><button className="button button-dark" onClick={() => notify("Customer-ready report prepared for export")}>Export report</button></div></section>
          <section className="plan-banner"><div><b>{currentFrameworks.length}</b><span>candidate frameworks</span></div><div><b>{assessment?.risk_signals.length ?? 0}</b><span>risk signals</span></div><div><b>{currentBlockers.length}</b><span>stage blockers</span></div><div><b>{regions.length}</b><span>regions reviewed</span></div></section>

          <section className="report-builder panel">
            <div className="report-builder-copy"><p className="eyebrow">Report settings</p><h2>Customize this plan</h2><p>Choose the audience and sections. The report stays linked to the approved rulebook.</p></div>
            <label>Audience<select value={reportAudience} onChange={(event) => setReportAudience(event.target.value)}><option>Legal & product</option><option>Executive leadership</option><option>Engineering & operations</option><option>Regulator response</option></select></label>
            <div className="report-section-toggles" aria-label="Report sections">
              {([[
                "applicability", "Applicability"
              ], ["roadmap", "Roadmap"], ["evidence", "Evidence"], ["questions", "Open questions"]] as [keyof typeof reportSections, string][]).map(([key, label]) => <button key={key} className={reportSections[key] ? "selected" : ""} onClick={() => toggleReportSection(key)}><span>{reportSections[key] ? "✓" : "+"}</span>{label}</button>)}
            </div>
          </section>

          <section className="report-overview panel">
            <div className="report-overview-head"><div><p className="eyebrow">Executive summary</p><h2>{isAsterDemo ? "AI-assisted credit workflow across EU and US entities" : `${profile.name} · ${regions.join(" and ") || "deployment scope to confirm"}`}</h2></div><Badge tone={assessment?.plan.decision === "do_not_launch" ? "red" : "amber"}>{assessment?.plan.decision === "do_not_launch" ? `${profile.stage} blocked` : "Conditions open"}</Badge></div>
            <p>{reportSummary}</p>
            <div className="report-fact-grid"><div><span>Product role</span><b>{isAsterDemo ? "Deployer / lender" : "Confirm role"}</b></div><div><span>Lifecycle</span><b>{profile.stage}</b></div><div><span>Primary users</span><b>{profile.users}</b></div><div><span>Accountable owner</span><b>{profile.owner}</b></div><div><span>Assessment confidence</span><b>{autofillConfidence}%</b></div><div><span>Target date</span><b>{isAsterDemo ? "15 Jan 2027" : "Not supplied"}</b></div></div>
            <div className="report-conclusion"><span>Stage decision</span><p>{reportDecision}. This is a decision-support draft; final scope and approval remain with qualified legal, privacy, security, model-risk, and business owners.</p></div>
          </section>

          {reportSections.applicability && <section className="panel report-detail-card">
            <div className="panel-heading"><div><p className="eyebrow">Applicability</p><h2>Scoped legal decisions</h2></div><Badge tone="amber">Local confirmation needed</Badge></div>
            <div className="applicability-table">
              <div className="applicability-head"><span>Regime</span><span>Decision</span><span>Why it applies</span><span>Confidence</span></div>
              {currentFrameworks.map((framework, index) => <div className="applicability-row" key={framework.name}><b>{framework.name}</b><Badge tone={framework.status === "recommended" ? "blue" : "amber"}>{framework.status === "recommended" ? "Map" : "Confirm"}</Badge><p>{framework.rationale} {framework.validation}</p><strong>{framework.status === "recommended" ? "90%" : `${Math.max(72, 88 - index * 4)}%`}</strong></div>)}
            </div>
          </section>}

          {reportSections.roadmap && <section className="panel report-detail-card">
            <div className="panel-heading"><div><p className="eyebrow">Implementation</p><h2>Path to pilot decision</h2></div><Badge tone="blue">6 workstreams</Badge></div>
            <div className="roadmap-grid">{roadmapGroups.map((items, index) => <div key={index}><span className="roadmap-day">{["Now", "Next", `Before ${profile.stage.toLowerCase()}`][index]}</span><h3>{["Close known gaps", "Complete specialist review", "Prove operating controls"][index]}</h3><ul>{items.map((item) => <li key={item.id}><b>{item.title}</b><small>Owner · {item.owner}</small></li>)}</ul><em>Gate · {items.length ? items.map((item) => item.evidence_needed).join("; ") : "Written scoped approval"}</em></div>)}</div>
          </section>}

          <div className="report-two-column">
            {reportSections.evidence && <section className="panel report-detail-card">
              <div className="panel-heading"><div><p className="eyebrow">Evidence plan</p><h2>Proof to collect</h2></div><Badge tone="amber">7 items</Badge></div>
              <div className="evidence-plan-list">{currentBlockers.slice(0, 4).map((item, index) => <div key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><p><b>{item.title}</b><small>{item.evidence_needed}</small></p><Badge tone="red">Needed</Badge></div>)}</div>
            </section>}
            {reportSections.questions && <section className="panel report-detail-card">
              <div className="panel-heading"><div><p className="eyebrow">Before approval</p><h2>Open questions</h2></div><Badge tone="amber">3 decisions</Badge></div>
              <div className="question-list"><label><input type="checkbox" />Which human or system makes the final consequential decision?</label><label><input type="checkbox" />Are the deployment entities, users, and affected people confirmed for every region?</label><label><input type="checkbox" />Which controls are operating today, and which are only proposed?</label></div>
              <div className="assumption-box"><span>Scope boundary</span><p>Approval would cover only the named entity, dataset, environment, limits, and component versions. It would not authorize autonomous underwriting, wider data access, external notices, or regulatory filing.</p></div>
            </section>}
          </div>

          <section className="panel checklist-panel"><div className="panel-heading"><div><p className="eyebrow">Priority workplan</p><h2>{profile.stage} blockers</h2></div><Badge tone="red">{currentBlockers.length - completed.length} open</Badge></div>
            {currentBlockers.map(({ id, title, owner, evidence_needed }) => {
              const done = completed.includes(id);
              return <button key={id} className={`checklist-row ${done ? "done" : ""}`} onClick={() => setCompleted((current) => done ? current.filter((x) => x !== id) : [...current, id])}><span className="task-check">{done ? "✓" : ""}</span><span><small>{id}</small><b>{title}</b><em>Evidence gap tied to the current product facts</em></span><span><small>Target</small><b>Before {profile.stage.toLowerCase()}</b></span><span><small>Evidence</small><b>{evidence_needed}</b></span><span><small>Owner</small><b>{owner}</b></span></button>;
            })}
          </section>
        </div>
      )}
    </div>
  );
}

function Controls() {
  return (
    <div className="view-stack">
      <SectionTitle eyebrow="Controls" title="Controls & evidence" detail="Map duties once. Reuse the proof." action={<button className="button button-dark">+ Add control</button>} />
      <div className="control-grid">
        {controlCards.map((control) => <article className="panel control-card" key={control.id}><div className="control-top"><Badge tone="blue">{control.id}</Badge><Badge tone={control.state === "Healthy" ? "green" : "amber"}>{control.state}</Badge></div><h2>{control.title}</h2><p>Owner · {control.owner}</p><div className="coverage-line"><span>Requirement coverage</span><b>{control.coverage}%</b></div><Progress value={control.coverage} warning={control.coverage < 75} /><div className="control-stats"><span><b>{control.reqs}</b> obligations</span><span><b>{control.evidence}</b> evidence items</span></div><button className="text-button">Open control record →</button></article>)}
      </div>
      <section className="panel matrix-panel"><div className="panel-heading"><div><p className="eyebrow">Cross-regime mapping</p><h2>One control, many obligations</h2></div><Badge tone="green">18 duplicate tasks avoided</Badge></div>
        <div className="mapping-flow"><div className="mapping-control"><span>SHARED CONTROL</span><b>TRN-04</b><h3>AI interaction disclosure</h3><p>Standard notice, placement rules, and release evidence</p></div><div className="mapping-lines"><span/><span/><span/><span/></div><div className="mapping-sources"><div><Badge tone="blue">EU</Badge><span><b>Art. 50(1)</b><small>Inform natural persons of AI interaction</small></span></div><div><Badge tone="purple">CN</Badge><span><b>Arts. 4–7</b><small>Explicit and implicit content labels</small></span></div><div><Badge tone="green">KR</Badge><span><b>Art. 31</b><small>Generative AI user notification</small></span></div><div><Badge tone="amber">CA</Badge><span><b>§ 22757.12</b><small>Covered-model transparency disclosures</small></span></div></div></div>
      </section>
    </div>
  );
}

function Monitor({ onReview }: { onReview: () => void }) {
  return (
    <div className="view-stack">
      <SectionTitle eyebrow="Monitor" title="Regulatory changes" detail="Only changes that affect your work." action={<button className="button button-dark">Set alerts</button>} />
      <section className="monitor-summary"><div><span className="pulse"/><span><b>47 sources monitored</b><small>Last source check 18 minutes ago</small></span></div><div><b>3</b><span>material changes</span></div><div><b>25</b><span>obligations impacted</span></div><div><b>6</b><span>products to reassess</span></div></section>
      <div className="monitor-layout">
        <section className="timeline panel"><div className="panel-heading"><div><p className="eyebrow">Change feed</p><h2>Needs attention</h2></div><button className="secondary-button">Impact: material</button></div>
          {changeEvents.map((event, index) => <article className="event" key={event.title}><div className="event-date">{event.date}</div><div className={`event-rail ${event.tone}`}/><div className="event-content"><div><Badge tone={event.tone}>{index === 0 ? "Legislative change" : index === 1 ? "New guidance" : "Technical update"}</Badge><span>{event.source}</span></div><h3>{event.title}</h3><p>{event.detail}</p><div className="impact-row"><span>{event.impact.split(" · ")[0]}</span><span>{event.impact.split(" · ")[1]}</span><span>{event.impact.split(" · ")[2]}</span></div><button className="text-button" onClick={onReview}>Review semantic diff →</button></div></article>)}
        </section>
        <aside className="impact-panel panel"><p className="eyebrow">Impact graph</p><h2>Colorado date change</h2><p>Downstream records that will update after legal approval.</p><div className="impact-map"><div className="impact-source"><span>SB 26-189</span><b>1 source version</b></div><div className="impact-arrow">↓</div><div className="impact-nodes"><div><b>12</b><span>requirements</span></div><div><b>4</b><span>controls</span></div><div><b>3</b><span>products</span></div></div><div className="impact-arrow">↓</div><div className="impact-tasks"><b>7 work items will be rescheduled</b><span>No evidence will be deleted</span></div></div><button className="button button-dark full" onClick={onReview}>Open legal review</button></aside>
      </div>
    </div>
  );
}

function Rulebook() {
  const [section, setSection] = useState<"sources" | "requirements">("sources");
  return (
    <div className="combined-view">
      <div className="view-switcher" role="tablist" aria-label="Rulebook sections">
        <button role="tab" aria-selected={section === "sources"} className={section === "sources" ? "active" : ""} onClick={() => setSection("sources")}>Sources <span>47</span></button>
        <button role="tab" aria-selected={section === "requirements"} className={section === "requirements" ? "active" : ""} onClick={() => setSection("requirements")}>Requirements <span>286</span></button>
      </div>
      {section === "sources" ? <Regulations /> : <Requirements />}
    </div>
  );
}

function Assurance({ notify }: { notify: (message: string) => void }) {
  const [section, setSection] = useState<"review" | "controls">("review");
  return (
    <div className="combined-view">
      <div className="view-switcher" role="tablist" aria-label="Assurance sections">
        <button role="tab" aria-selected={section === "review"} className={section === "review" ? "active" : ""} onClick={() => setSection("review")}>Review <span>8</span></button>
        <button role="tab" aria-selected={section === "controls"} className={section === "controls" ? "active" : ""} onClick={() => setSection("controls")}>Controls <span>32</span></button>
      </div>
      {section === "review" ? <LegalReview notify={notify} /> : <Controls />}
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState<ViewId>("overview");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const searchResults = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return [
      ...regulations.filter((x) => `${x.name} ${x.citation} ${x.region}`.toLowerCase().includes(q)).map((x) => ({ type: "Source", title: x.name, meta: x.citation, view: "rulebook" as ViewId })),
      ...requirements.filter((x) => `${x.title} ${x.id} ${x.source}`.toLowerCase().includes(q)).map((x) => ({ type: "Requirement", title: x.title, meta: x.id, view: "rulebook" as ViewId })),
    ].slice(0, 6);
  }, [query]);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 3200); };
  const navigate = (view: ViewId) => { setActive(view); setMobileNav(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const activeLabel = navItems.find((item) => item.id === active)?.label;
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
        <div className="brand"><div className="brand-mark">S</div><div><b>Soteria</b><span>AI COMPLIANCE</span></div></div>
        <nav aria-label="Primary navigation">
          <p>Workspace</p>
          {navItems.map((item) => <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => navigate(item.id)}><span className="nav-icon">{item.icon}</span><span>{item.label}</span>{item.count && <em>{item.count}</em>}</button>)}
        </nav>
        <div className="workspace-card"><span className="workspace-avatar">AF</span><div><b>Aster Financial</b><small>Demo workspace</small></div><button aria-label="Workspace menu">···</button></div>
      </aside>
      {mobileNav && <button className="nav-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
      <div className="main-shell">
        <header className="topbar">
          <div className="mobile-brand"><button className="menu-button" onClick={() => setMobileNav(true)} aria-label="Open navigation">☰</button><b>Soteria</b></div>
          <div className="breadcrumb"><span>Aster Financial</span><i>/</i><b>{activeLabel}</b></div>
          <div className="global-search">
            <span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Soteria…" aria-label="Global search" /><kbd>⌘ K</kbd>
            {searchResults.length > 0 && <div className="search-popover">{searchResults.map((result) => <button key={`${result.type}-${result.meta}`} onClick={() => { navigate(result.view); setQuery(""); }}><Badge tone={result.type === "Source" ? "blue" : "purple"}>{result.type}</Badge><span><b>{result.title}</b><small>{result.meta}</small></span><em>↗</em></button>)}</div>}
          </div>
          <div className="top-actions"><button className="status-pill"><span /> Up to date</button><button className="notify-button" aria-label="Notifications">○<em>3</em></button><span className="user-avatar">EP</span></div>
        </header>
        <main>
          {active === "overview" && <Overview onNavigate={navigate} />}
          {active === "rulebook" && <Rulebook />}
          {active === "assess" && <Assessment notify={notify} />}
          {active === "assurance" && <Assurance notify={notify} />}
          {active === "monitor" && <Monitor onReview={() => navigate("assurance")} />}
        </main>
      </div>
      {toast && <div className="toast"><span>✓</span>{toast}</div>}
    </div>
  );
}
