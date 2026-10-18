"use client";

import { useState } from "react";
import { getJurisdiction, jurisdictions } from "../lib/jurisdictions";

export default function DeploymentFootprint({ selected, onToggle }: { selected: string[]; onToggle: (name: string) => void }) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState("AI laws");
  const filtered = jurisdictions.filter((item) => {
    const match = `${item.name} ${item.code} ${item.law?.title ?? ""}`.toLowerCase().includes(query.trim().toLowerCase());
    if (!match) return false;
    if (query.trim()) return true;
    if (view === "All countries") return item.group !== "US states & local";
    if (view === "US states") return item.group === "US states & local";
    return Boolean(item.law);
  });
  const lawSelections = selected.map((name) => ({ name, law: getJurisdiction(name)?.law })).filter((item) => item.law);
  return <div className="deployment-picker">
    <div className="deployment-toolbar"><label><span className="sr-only">Search deployment locations</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search country, state, or AI law…" /></label><span>{selected.length} selected</span></div>
    <div className="deployment-tabs" aria-label="Deployment location filters">{["AI laws", "All countries", "US states"].map((label) => <button type="button" key={label} aria-pressed={view === label} className={view === label ? "active" : ""} onClick={() => setView(label)}>{label}</button>)}</div>
    {selected.length > 0 && <div className="selected-locations" aria-label="Selected deployment locations">{selected.map((name) => <button type="button" key={name} onClick={() => onToggle(name)} aria-label={`Remove ${name}`}>{name}<span aria-hidden="true">×</span></button>)}</div>}
    <div className="deployment-options" aria-label="Available deployment locations">{filtered.length ? filtered.map((item) => <button type="button" key={item.code} className={selected.includes(item.name) ? "selected" : ""} aria-pressed={selected.includes(item.name)} onClick={() => onToggle(item.name)}><span className="location-checkbox" aria-hidden="true">{selected.includes(item.name) ? "✓" : "+"}</span><span><b>{item.name}</b><small>{item.law?.kind ?? (item.group === "US states & local" ? "State / local review" : "Local review")}{item.parent && ` · ${item.parent}`}</small></span></button>) : <p>No matching locations. Try a country or state name.</p>}</div>
    <p className="deployment-help">Select where the product is available and where affected people are located. “AI laws” highlights verified enacted laws, including targeted rules; applicability and commencement dates still need review.</p>
    {lawSelections.length > 0 && <details className="deployment-sources"><summary>View laws for selected locations ({lawSelections.length})</summary>{lawSelections.map(({ name, law }) => <div key={name}><b>{name}</b><a href={law!.url} target="_blank" rel="noreferrer">{law!.title} ↗</a><p>{law!.note}</p></div>)}<small>Law references checked 17 Oct 2026. Locations without a law label are available for local review; this does not mean no law applies.</small></details>}
  </div>;
}
