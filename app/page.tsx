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

function cleanDocumentName(name: string) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/(?:^|[_-])(prd|spec|model[_-]?card|dpia|v\d+|\d{4}[-_]\d{2})(?:$|[_-])/gi, " ")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function Assessment({ notify }: { notify: (message: string) => void }) {
  const [generated, setGenerated] = useState(false);
  const [autofillRan, setAutofillRan] = useState(false);
  const [autofillStatus, setAutofillStatus] = useState<"idle" | "analyzing" | "complete">("idle");
  const [documents, setDocuments] = useState<IntakeDocument[]>([
    { name: "Aster-AI-Compliance-Review-Demo-Submission.md", size: 24700, readable: true, text: "Company: Aster Financial\nProduct: Aster Credit Memo Assistant\nOwner: Chief Risk Officer\nStage: Pilot\nUsers: Credit analysts\nIntended purpose: Draft factual consumer credit memos from authorized repayment history for officer review; it cannot approve credit or send external notices.\nDeployment: European Union, Ireland, United States, New York.\nTarget pilot date: 15 January 2027.\nThe pilot is submitted for review and is not approved. It uses a vendor-hosted LLM and customer credit information. A credit committee retains the lending decision." },
    { name: "VENDOR-CONFIG-v7.txt", size: 4200, readable: true, text: "Fictional enterprise LLM endpoint. Raw prompt payload retention is configured for 365 days, contrary to transient-processing policy RET-POL-v2. Processing regions, subprocessors, support access, transfer safeguards, and signed terms are unconfirmed." },
    { name: "CREDIT-TRACE-R.json", size: 6800, readable: true, text: "Synthetic staging trace: retrieval returned superseded record v3 while v4 existed; the current dispute was omitted; full report fields reached an unapproved endpoint. This is failing staging evidence, not a production breach." },
    { name: "VALIDATION-v4.pdf", size: 31800, readable: false, text: "" },
  ]);
  const [intake, setIntake] = useState({
    links: "https://risk.aster.example/credit-memo-assistant\nhttps://policies.aster.example/credit-data",
    standards: "RET-POL-v2 · Transient raw-prompt policy\nCREDIT-POL-v2 · Assigned-case access and allowed fields\nMR-POL-v3 · Validation and independent review\nREPORT-POL-v2 · Evidence and submission status",
    context: "Assess pilot readiness separately for Aster EU and Aster US Lending. Treat proposed controls as untested until evidence is supplied.",
  });
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
  const structuredSourceBonus = documents.some((document) => /submission|proposal|spec/i.test(document.name) && document.text.length > 300) ? 8 : 0;
  const autofillConfidence = Math.min(97, 54 + readableDocuments * 7 + Math.min(linkCount, 3) * 3 + (intake.standards.trim() ? 6 : 0) + (intake.context.trim() ? 3 : 0) + structuredSourceBonus);
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
    setDocuments(parsed);
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
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    const rawSource = [documents.map((document) => `${document.name}\n${document.text}`).join("\n"), intake.links, intake.standards, intake.context].join("\n");
    const source = rawSource.toLowerCase();
    const findLine = (label: string) => rawSource.match(new RegExp(`(?:^|\\n)${label}\\s*[:\\-]\\s*([^\\n]{2,240})`, "i"))?.[1]?.trim();
    const urlName = intake.links.match(/https?:\/\/[^\s]+\/([^\s/?#]+)/i)?.[1]?.replace(/[-_]+/g, " ");
    const inferredName = findLine("(?:product|system)(?: name)?") || (source.includes("aster financial") ? "Aster Credit Memo Assistant" : source.includes("atlas assist") ? "Atlas Assist" : urlName ? urlName.replace(/\b\w/g, (letter) => letter.toUpperCase()) : cleanDocumentName(documents[0]?.name ?? "AI Product"));
    const inferredOwner = findLine("(?:primary )?owner") || findLine("accountable[_ ]owner") || (source.includes("credit memo") ? "Chief Risk Officer" : source.includes("customer") || source.includes("support") ? "Customer Experience AI" : source.includes("recruit") || source.includes("employment") ? "People AI" : source.includes("fraud") ? "Financial Crime Analytics" : "AI Product Team");
    const inferredPurpose = findLine("(?:intended )?purpose") || (source.includes("credit memo") ? "Draft factual consumer credit memos from authorized repayment history for officer review; lending decisions remain with the credit committee." : source.includes("support") || source.includes("customer") ? "Generative assistant that summarizes customer records and drafts support responses for human approval." : source.includes("recruit") || source.includes("candidate") ? "AI system that supports candidate screening and ranking for human recruiters." : source.includes("fraud") ? "AI system that identifies potentially fraudulent transactions for analyst review." : "AI-enabled product inferred from the supplied specifications and governance materials.");
    const statedStage = findLine("(?:lifecycle )?stage")?.toLowerCase();
    const statedUsers = findLine("(?:primary )?users?")?.toLowerCase();
    const inferredStage = statedStage?.includes("pilot") ? "Pilot" : statedStage?.includes("production") ? "Production" : /\bpilot\b|beta|proof of concept|\bpoc\b/.test(source) ? "Pilot" : /\bproduction\b|\blive\b|deployed/.test(source) ? "Production" : "Design";
    const inferredUsers = statedUsers ? (/analyst|employee|officer|internal/.test(statedUsers) ? "Employees" : /both/.test(statedUsers) ? "Both" : "Consumers") : /employees?|internal users?|support agents?|recruiters?|credit analysts?/.test(source) ? "Employees" : "Consumers";
    const inferredRegions = [
      [/european union|\beu\b|europe/, "European Union"],
      [/united states|\busa?\b|california|colorado|new york/, "United States"],
      [/south korea|korean?/, "South Korea"],
      [/china|chinese|\bcac\b/, "China"],
      [/united kingdom|\buk\b|britain/, "United Kingdom"],
    ].filter(([pattern]) => (pattern as RegExp).test(source)).map(([, region]) => region as string);
    setProfile({ name: inferredName, owner: inferredOwner, purpose: inferredPurpose, stage: inferredStage, users: inferredUsers });
    setFeatures({
      decisions: /decision|rank|eligib|credit|fraud|recommend/.test(source),
      employees: /employment|recruit|candidate|promotion|termination/.test(source),
      generation: /generative|generate|draft|synthetic|large language|\bllm\b/.test(source),
      biometrics: /biometric|facial|voiceprint|fingerprint/.test(source) && !/no biometric/.test(source),
      minors: /minor|child|children|under 18/.test(source) && !/no use by minors|not.*minor/.test(source),
    });
    setRegions(inferredRegions.length ? inferredRegions : ["United States"]);
    setFieldConfidence({
      name: findLine("(?:product|system)(?: name)?") ? 99 : 86,
      owner: findLine("(?:primary )?owner") || findLine("accountable[_ ]owner") ? 96 : 78,
      purpose: findLine("(?:intended )?purpose") ? 94 : 74,
      stage: statedStage ? 98 : /\bproduction\b|\blive\b|deployed|\bpilot\b|beta|proof of concept|\bpoc\b/.test(source) ? 90 : 67,
      users: statedUsers ? 97 : /employees?|internal users?|support agents?|credit analysts?|customers?|consumers?/.test(source) ? 90 : 65,
    });
    setAutofillRan(true);
    setAutofillStatus("complete");
    notify(`Autofilled ${inferredName} from ${sourceCount} sources`);
  };
  const checklist = [
    ["DATA-01", "Fix current-record retrieval and dispute preservation", "Before pilot", "Version, correction, and revised-memo tests", "EU privacy · US credit"],
    ["VEN-02", "Correct vendor retention and endpoint controls", "Before pilot", "Config, terms, and enforcement tests", "EU privacy · US privacy"],
    ["MRM-03", "Validate scoring v5 and evaluate the memo LLM", "Before pilot", "Version-matched validation and review", "EU AI · US fair lending"],
    ["HUM-04", "Prove meaningful officer review", "Before pilot", "Intervention, rejection, and permission tests", "EU AI · US credit"],
    ["LAW-05", "Confirm entity-specific duties and schedules", "Before approval", "Legal mapping and retention schedule", "Ireland · New York"],
    ["INC-06", "Approve incident, reporting, and recovery routes", "Before pilot", "Signed matrix, tabletop, recovery test", "Entity specific"],
  ];
  return (
    <div className="view-stack">
      <SectionTitle eyebrow="Assess" title="Product assessment" detail="Turn product facts into a compliance plan." action={<Badge tone={generated ? "green" : "blue"}>{generated ? "Report ready" : `Draft · ${profile.name || "New product"}`}</Badge>} />
      {!generated ? (
        <>
        <section className="ai-intake panel">
          <div className="ai-intake-heading">
            <div className="ai-intake-title"><span className="ai-spark">✦</span><div><p className="eyebrow">AI autofill</p><h2>Autofill from your documents</h2><p>Add source material. Soteria fills the form; you review every answer.</p></div></div>
            {autofillRan ? <div className="autofill-score"><div><strong>{autofillConfidence}</strong><span>%</span></div><small>Autofill confidence</small></div> : <Badge tone="purple">Human review required</Badge>}
          </div>
          <div className="intake-source-grid">
            <div className="intake-source-card">
              <div className="source-card-head"><span className="source-type-icon">▤</span><div><b>Documents</b><small>Specs, model cards, DPIAs</small></div></div>
              <label className="upload-drop">+ Add files<input type="file" multiple accept=".pdf,.doc,.docx,.txt,.md,.json,.csv" onChange={(event) => { void handleDocuments(event.target.files); event.target.value = ""; }} /></label>
              <div className="document-chips">
                {documents.length ? documents.map((document) => <span key={document.name}>{document.name}{document.readable && <i>read</i>}<button aria-label={`Remove ${document.name}`} onClick={() => { setDocuments((current) => current.filter((item) => item.name !== document.name)); setAutofillRan(false); setAutofillStatus("idle"); }}>×</button></span>) : <small>No documents selected</small>}
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
            <button className={`button button-dark autofill-button ${autofillStatus === "analyzing" ? "loading" : ""}`} disabled={autofillStatus === "analyzing"} onClick={() => { void runAutofill(); }}><span>{autofillStatus === "analyzing" ? "◌" : "✦"}</span>{autofillStatus === "analyzing" ? "Analyzing sources…" : autofillRan ? "Run autofill again" : "Autofill assessment"}</button>
          </div>
          {autofillRan && <div className="autofill-result">
            <div className="result-summary"><span className="result-check">✓</span><span><b>18 product facts extracted</b><small>{documents.length + linkCount + (intake.standards.trim() ? 1 : 0)} sources analyzed · {readableDocuments} full-text</small></span></div>
            <div className="confidence-breakdown"><span><i style={{ width: `${Math.round((fieldConfidence.name + fieldConfidence.owner + fieldConfidence.purpose) / 3)}%` }} /><b>Product profile</b><em>{Math.round((fieldConfidence.name + fieldConfidence.owner + fieldConfidence.purpose) / 3)}%</em></span><span><i style={{ width: "88%" }} /><b>Risk attributes</b><em>88%</em></span><span><i style={{ width: regions.length > 1 ? "91%" : "68%" }} /><b>Deployment scope</b><em>{regions.length > 1 ? "91%" : "68%"}</em></span></div>
            <p>Everything below is editable and requires your review.</p>
          </div>}
        </section>
        <div className="assessment-layout">
          <section className="assessment-form panel">
            <div className="step-label"><span>1</span><div><b>Product profile</b><small>Describe the system and its use</small></div></div>
            <div className="form-grid"><label><span>Product name {autofillRan && <em className={fieldConfidence.name < 80 ? "ai-field-tag review" : "ai-field-tag"}>AI filled · {fieldConfidence.name}%</em>}</span><input value={profile.name} placeholder="Product name" onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} /></label><label><span>Primary owner {autofillRan && <em className={fieldConfidence.owner < 80 ? "ai-field-tag review" : "ai-field-tag"}>AI filled · {fieldConfidence.owner}%</em>}</span><input value={profile.owner} placeholder="Owning team" onChange={(event) => setProfile((current) => ({ ...current, owner: event.target.value }))} /></label><label className="wide"><span>Intended purpose {autofillRan && <em className={fieldConfidence.purpose < 80 ? "ai-field-tag review" : "ai-field-tag"}>{fieldConfidence.purpose < 80 ? "Confirm" : "AI filled"} · {fieldConfidence.purpose}%</em>}</span><textarea value={profile.purpose} placeholder="What does the system do?" onChange={(event) => setProfile((current) => ({ ...current, purpose: event.target.value }))} /></label><label><span>Lifecycle stage {autofillRan && <em className={fieldConfidence.stage < 80 ? "ai-field-tag review" : "ai-field-tag"}>AI filled · {fieldConfidence.stage}%</em>}</span><select value={profile.stage} onChange={(event) => setProfile((current) => ({ ...current, stage: event.target.value }))}><option>Design</option><option>Pilot</option><option>Production</option></select></label><label><span>Primary users {autofillRan && <em className={fieldConfidence.users < 80 ? "ai-field-tag review" : "ai-field-tag"}>AI filled · {fieldConfidence.users}%</em>}</span><select value={profile.users} onChange={(event) => setProfile((current) => ({ ...current, users: event.target.value }))}><option>Consumers</option><option>Employees</option><option>Both</option></select></label></div>
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
            <p className="eyebrow">Live applicability</p><h2>Likely regulated</h2><p>Based on the current profile, {profile.name} triggers transparency, documentation, risk management, and human oversight duties.</p>
            <div className="risk-orbit"><div><strong>4</strong><span>frameworks</span></div></div>
            <div className="trigger-list"><div><span className="change-dot green"/><span><b>EU AI Act</b><small>Credit workflow classification required</small></span></div><div><span className="change-dot blue"/><span><b>EU privacy</b><small>Purpose, minimization, DPIA, vendor terms</small></span></div><div><span className="change-dot purple"/><span><b>US credit laws</b><small>FCRA, ECOA, records, explanations</small></span></div><div><span className="change-dot amber"/><span><b>New York rules</b><small>Licensing, privacy, retention mapping</small></span></div></div>
            <p className="assessment-caveat">This preview updates as facts change. Final applicability requires legal approval.</p>
          </aside>
        </div>
        </>
      ) : (
        <div className="plan-layout">
          <section className="plan-summary panel"><div><p className="eyebrow">Customized report</p><h2>{profile.name} pilot review</h2><p>18 product facts · 11 evidence records · Updated 29 Sep 2026</p></div><div className="plan-score"><strong>42</strong><span>/100<br />readiness</span></div><div className="plan-actions"><button className="secondary-button" onClick={() => setGenerated(false)}>Edit facts</button><button className="button button-dark" onClick={() => notify("Customized report prepared for export")}>Export report</button></div></section>
          <section className="plan-banner"><div><b>31</b><span>applicable obligations</span></div><div><b>10</b><span>required controls</span></div><div><b>6</b><span>pilot blockers</span></div><div><b>2</b><span>entities reviewed</span></div></section>

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
            <div className="report-overview-head"><div><p className="eyebrow">Executive summary</p><h2>AI-assisted credit workflow across EU and US entities</h2></div><Badge tone="red">Pilot blocked</Badge></div>
            <p>{profile.name} is a draft-only assistant proposed for ten credit analysts and up to 100 applications per entity. It uses customer credit history to prepare factual memos, but officers must verify sources and the credit committee retains every lending decision. Aster EU and Aster US Lending require separate approvals.</p>
            <div className="report-fact-grid"><div><span>Product role</span><b>Deployer / lender</b></div><div><span>Lifecycle</span><b>{profile.stage}</b></div><div><span>Primary users</span><b>{profile.users}</b></div><div><span>Accountable owner</span><b>{profile.owner}</b></div><div><span>Assessment confidence</span><b>{autofillConfidence}%</b></div><div><span>Target pilot</span><b>15 Jan 2027</b></div></div>
            <div className="report-conclusion"><span>Decision</span><p>Do not begin a customer-data pilot yet. Current evidence shows stale-record retrieval, an omitted dispute, an unapproved endpoint, and 365-day prompt retention. Version-matched model validation and effective human-review evidence are also missing.</p></div>
          </section>

          {reportSections.applicability && <section className="panel report-detail-card">
            <div className="panel-heading"><div><p className="eyebrow">Applicability</p><h2>Scoped legal decisions</h2></div><Badge tone="amber">Local confirmation needed</Badge></div>
            <div className="applicability-table">
              <div className="applicability-head"><span>Regime</span><span>Decision</span><span>Why it applies</span><span>Confidence</span></div>
              {[
                ["EU AI Act", "Classify", "Assess the scoring model, memo LLM, and integrated influence on credit decisions separately.", "86%", "amber"],
                ["EU privacy", "In scope", "Customer credit data, vendor processing, minimization, retention, rights, and DPIA duties apply.", "96%", "green"],
                ["US credit laws", "In scope", "FCRA and ECOA analysis is needed for purpose, records, explanations, and model use.", "94%", "green"],
                ["New York rules", "Confirm", "Nonbank licensing, privacy, security, and retention mapping remains entity specific.", "74%", "blue"],
              ].map(([regime, decision, reason, confidence, tone]) => <div className="applicability-row" key={regime}><b>{regime}</b><Badge tone={tone as Tone}>{decision}</Badge><p>{reason}</p><strong>{confidence}</strong></div>)}
            </div>
          </section>}

          {reportSections.roadmap && <section className="panel report-detail-card">
            <div className="panel-heading"><div><p className="eyebrow">Implementation</p><h2>Path to pilot decision</h2></div><Badge tone="blue">6 workstreams</Badge></div>
            <div className="roadmap-grid">
              <div><span className="roadmap-day">0–30 days</span><h3>Stop known failures</h3><ul><li><b>Disable 365-day prompt retention</b><small>Owner · Security / vendor</small></li><li><b>Fix freshness and dispute handling</b><small>Owner · Credit data</small></li></ul><em>Gate · Passing negative and version tests</em></div>
              <div><span className="roadmap-day">31–60 days</span><h3>Complete legal and model work</h3><ul><li><b>Approve entity mappings and schedules</b><small>Owner · Compliance / legal</small></li><li><b>Validate scoring v5 and memo LLM</b><small>Owner · Model risk</small></li></ul><em>Gate · Independent review accepted</em></div>
              <div><span className="roadmap-day">Before pilot</span><h3>Prove operations</h3><ul><li><b>Test officer intervention and rejection</b><small>Owner · Credit Operations</small></li><li><b>Run incident and recovery tabletop</b><small>Owner · Compliance / IR</small></li></ul><em>Gate · Scoped written release decision</em></div>
            </div>
          </section>}

          <div className="report-two-column">
            {reportSections.evidence && <section className="panel report-detail-card">
              <div className="panel-heading"><div><p className="eyebrow">Evidence plan</p><h2>Proof to collect</h2></div><Badge tone="amber">7 items</Badge></div>
              <div className="evidence-plan-list"><div><span>01</span><p><b>Current-record retrieval</b><small>Cache invalidation, correction, dispute, and revised-memo tests</small></p><Badge tone="red">Failing</Badge></div><div><span>02</span><p><b>Vendor boundary</b><small>Approved endpoint, transient retention, terms, and payload test</small></p><Badge tone="red">Conflict</Badge></div><div><span>03</span><p><b>Component validation</b><small>Scoring v5 validation and separate memo-LLM evaluation</small></p><Badge tone="red">Missing</Badge></div><div><span>04</span><p><b>Officer oversight</b><small>Source inspection, edit, rejection, permissions, and escalation test</small></p><Badge tone="amber">Designed</Badge></div></div>
            </section>}
            {reportSections.questions && <section className="panel report-detail-card">
              <div className="panel-heading"><div><p className="eyebrow">Before approval</p><h2>Open questions</h2></div><Badge tone="amber">3 decisions</Badge></div>
              <div className="question-list"><label><input type="checkbox" />What actual influence do the score and draft memo have on the credit decision?</label><label><input type="checkbox" />Which Irish and New York record schedules apply to each copy?</label><label><input type="checkbox" />Are vendor regions, subprocessors, support access, transfers, and terms approved per entity?</label></div>
              <div className="assumption-box"><span>Scope boundary</span><p>Approval would cover only the named entity, dataset, environment, limits, and component versions. It would not authorize autonomous underwriting, wider data access, external notices, or regulatory filing.</p></div>
            </section>}
          </div>

          <section className="panel checklist-panel"><div className="panel-heading"><div><p className="eyebrow">Priority workplan</p><h2>Pilot blockers</h2></div><Badge tone="red">{6 - completed.length} open</Badge></div>
            {checklist.map(([id, title, due, evidence, sources]) => {
              const done = completed.includes(id);
              return <button key={id} className={`checklist-row ${done ? "done" : ""}`} onClick={() => setCompleted((current) => done ? current.filter((x) => x !== id) : [...current, id])}><span className="task-check">{done ? "✓" : ""}</span><span><small>{id}</small><b>{title}</b><em>Why it applies: customer credit data and consequential-decision support</em></span><span><small>Target</small><b>{due}</b></span><span><small>Evidence</small><b>{evidence}</b></span><span><small>Sources</small><b>{sources}</b></span></button>;
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
