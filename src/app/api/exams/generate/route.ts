import { NextResponse } from "next/server";
import { buildQuestionBank } from "@/lib/questions";
import { sanitizeQuestion } from "@/lib/scoring";
import { validateQuestion } from "@/lib/validation";

const buckets = new Map<string, number[]>();

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") ?? "local";
  const now = Date.now();
  const recent = (buckets.get(forwarded) ?? []).filter((stamp) => now - stamp < 60_000);
  if (recent.length >= 5) return NextResponse.json({ error: "Demasiadas solicitudes. Intenta nuevamente en un minuto." }, { status: 429 });
  buckets.set(forwarded, [...recent, now]);
  const questions = buildQuestionBank();
  const invalid = questions.filter((question) => !validateQuestion(question).valid);
  if (invalid.length) return NextResponse.json({ error: "El banco no superó la validación." }, { status: 500 });
  return NextResponse.json({ examId: crypto.randomUUID(), startedAt: new Date().toISOString(), durationSeconds: 8400, questions: questions.map(sanitizeQuestion) });
}
