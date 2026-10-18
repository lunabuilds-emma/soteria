import assert from "node:assert/strict";
import test from "node:test";
import { jurisdictions, inferJurisdictions, hasEUFootprint } from "../lib/jurisdictions.ts";
import { createSoteriaAssessment } from "../lib/soteria.ts";

test("all countries and US states are selectable with no duplicate identities", () => {
  assert.equal(jurisdictions.filter((item) => item.code.length === 2 && item.code !== "EU").length, 249);
  assert.equal(jurisdictions.filter((item) => item.parent === "European Union").length, 27);
  assert.equal(jurisdictions.filter((item) => item.parent === "United States").length, 52);
  assert.equal(new Set(jurisdictions.map((item) => item.name)).size, jurisdictions.length);
  assert.equal(new Set(jurisdictions.map((item) => item.code)).size, jurisdictions.length);
});

test("autofill recognizes new markets and their parent regimes", () => {
  const regions = inferJurisdictions("Deployment: Japan, Taiwan, Vietnam, Kazakhstan, Peru, Texas, Germany.");
  for (const name of ["Japan", "Taiwan", "Vietnam", "Kazakhstan", "Peru", "Texas", "Germany", "European Union", "United States"]) assert.ok(regions.includes(name), name);
  assert.equal(hasEUFootprint(["Sweden"]), true);
  assert.equal(hasEUFootprint(["Switzerland"]), false);
  assert.deepEqual(inferJurisdictions("We used a China-hosted prototype.\nDeployment: Japan"), ["Japan"]);
});

test("new selections affect the assessment and unreviewed locations do not invent a law", () => {
  const result = createSoteriaAssessment({ product_name: "Northstar", purpose: "Draft replies", capabilities: ["generative_ai"], regions: ["Germany", "Italy", "Japan", "Vietnam", "Texas", "Canada"] });
  assert.equal(result.candidate_frameworks.filter((framework) => framework.name === "EU AI Act").length, 1);
  for (const name of ["Italy", "Japan", "Vietnam", "Texas", "Canada"]) assert.ok(result.candidate_frameworks.some((framework) => framework.name.startsWith(name)), name);
  assert.ok(result.candidate_frameworks.find((framework) => framework.name.startsWith("Canada")).validation.includes("No complete local rule mapping"));
  assert.ok(result.candidate_frameworks.find((framework) => framework.name.startsWith("Japan")).source_url.startsWith("https://www8.cao.go.jp/"));
});
