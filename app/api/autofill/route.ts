import { createSoteriaAssessment, type AssessmentInput } from "../../../lib/soteria";

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as AssessmentInput;
    if (!input || typeof input !== "object" || typeof input.source_text !== "string" || input.source_text.trim().length < 20) {
      return Response.json({ error: "No readable product text was supplied. Upload a searchable PDF, DOCX, or text file, or paste the specification." }, { status: 422 });
    }
    if (input.source_text.length > 500_000) {
      return Response.json({ error: "The combined documents are too long. Upload the relevant product sections in a smaller batch." }, { status: 413 });
    }
    const assessment = createSoteriaAssessment(input);
    return Response.json(assessment, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      { error: "Soteria could not read this intake. Check the supplied text and try again." },
      { status: 400 },
    );
  }
}
