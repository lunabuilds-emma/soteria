import assert from "node:assert/strict";
import test from "node:test";
import { createSoteriaAssessment } from "../lib/soteria.ts";

const value = (result, field) => result.editable_facts.find((fact) => fact.field === field)?.value;

test("extracts an unrelated product from plain prose", () => {
  const result = createSoteriaAssessment({ source_text: "Lumen Support is an AI assistant that drafts replies for customer support agents. It is used by internal agents in the European Union.\nOwner: Support Engineering\nStage: Pilot" });
  assert.equal(value(result, "product_name"), "Lumen Support");
  assert.match(value(result, "purpose"), /drafts replies/);
  assert.equal(value(result, "owner"), "Support Engineering");
  assert.deepEqual(value(result, "regions"), ["European Union"]);
  assert.doesNotMatch(JSON.stringify(result), /aster|credit memo/i);
});

test("extracts Markdown headings and JSON product metadata", () => {
  const markdown = createSoteriaAssessment({ source_text: "## Product name\nHelix Recruiting\n**Owner:** People Engineering\nPurpose: Rank candidates for interviews.\nDeployment: New York\nStage: Pilot" });
  assert.equal(value(markdown, "product_name"), "Helix Recruiting");
  assert.equal(value(markdown, "owner"), "People Engineering");
  assert.ok(markdown.candidate_frameworks.some((framework) => framework.name === "NYC Local Law 144"));
  const json = createSoteriaAssessment({ source_text: '{"product_name":"Orchid Notes","purpose":"Summarize meeting notes for internal teams.","owner":"Product Engineering"}' });
  assert.equal(value(json, "product_name"), "Orchid Notes");
  assert.equal(value(json, "owner"), "Product Engineering");
});

test("missing facts stay empty and user corrections override source inference", () => {
  const empty = createSoteriaAssessment({ source_text: "Unrelated policy that does not identify a product." });
  assert.equal(value(empty, "product_name"), "");
  assert.equal(value(empty, "owner"), "");
  assert.ok(empty.editable_facts.find((fact) => fact.field === "product_name").needs_review);
  const corrected = createSoteriaAssessment({ source_text: "Product: Original\nPurpose: Rank candidates in New York", product_name: "Corrected", regions: ["United Kingdom"], capabilities: [] });
  assert.equal(value(corrected, "product_name"), "Corrected");
  assert.deepEqual(value(corrected, "capabilities"), []);
  assert.deepEqual(value(corrected, "regions"), ["United Kingdom"]);
});
