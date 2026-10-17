import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";

import {
  capabilityValues,
  createSoteriaAssessment,
} from "../../lib/soteria";

const inputSchema = z.object({
  source_text: z.string().max(40_000).optional().describe("Plain text extracted from product specs, policies, intake forms, or other supplied documents."),
  product_name: z.string().optional(),
  purpose: z.string().optional(),
  owner: z.string().optional(),
  stage: z.string().optional().describe("For example: design, pilot, limited release, or production."),
  users: z.string().optional(),
  regions: z.array(z.string()).optional(),
  capabilities: z.array(z.enum(capabilityValues)).optional(),
  spec_links: z.array(z.string()).optional(),
  responsible_ai_standards: z.array(z.string()).optional(),
  evidence_references: z.array(z.string()).optional(),
  review_focus: z.string().optional(),
});

function resultFor(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    structuredContent: data as Record<string, unknown>,
  };
}

function buildServer() {
  const server = new McpServer({ name: "soteria", version: "0.1.0" });

  server.registerTool(
    "autofill_product_assessment",
    {
      title: "Autofill a Soteria product assessment",
      description: "Extract editable product facts from supplied source text and facts, score autofill confidence, identify candidate regulatory frameworks and risk signals, and return an evidence-based launch plan. Use the returned fields as a draft for human review.",
      inputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (input) => resultFor(createSoteriaAssessment(input)),
  );

  server.registerResource(
    "soteria-methodology",
    "soteria://methodology",
    {
      title: "Soteria assessment methodology",
      description: "How Soteria separates extracted facts, candidate applicability, evidence gaps, and human decisions.",
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [{
        uri: uri.href,
        mimeType: "text/markdown",
        text: "# Soteria methodology\n\n1. Extract product facts from user-supplied sources.\n2. Show a confidence score and mark low-confidence facts for review.\n3. Treat regulatory frameworks as candidates until a qualified reviewer confirms applicability.\n4. Do not treat proposed controls as operating evidence.\n5. Convert evidence gaps into owned, testable workstreams and a stage decision.\n6. Preserve the user's corrections and rerun the assessment with the edited facts.\n\nSoteria is decision support, not legal advice or certification.",
      }],
    }),
  );

  return server;
}

const handler = createMcpHandler(buildServer, {
  legacy: "stateless",
  responseMode: "json",
  onerror: (error) => console.error("Soteria MCP error", error),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Accept, MCP-Protocol-Version, MCP-Session-Id, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Expose-Headers": "MCP-Protocol-Version, MCP-Session-Id",
};

async function serve(request: Request) {
  const response = await handler.fetch(request);
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(corsHeaders)) headers.set(name, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export const GET = serve;
export const POST = serve;
export const DELETE = serve;
