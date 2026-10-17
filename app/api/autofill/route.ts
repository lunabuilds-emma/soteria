import { createSoteriaAssessment, type AssessmentInput } from "../../../lib/soteria";

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as AssessmentInput;
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
