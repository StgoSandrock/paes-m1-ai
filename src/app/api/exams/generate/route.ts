import { NextResponse } from "next/server";
import { buildQuestionBank } from "@/lib/questions";
import { generateExamBlueprint } from "@/lib/blueprint";
import { sanitizeQuestion } from "@/lib/scoring";
import { selectUnseenQuestions } from "@/lib/selection";
import { validateQuestion } from "@/lib/validation";
import { z } from "zod";

const buckets = new Map<string, number[]>();
const requestSchema = z.object({ exposedQuestionIds: z.array(z.string()).max(3000).default([]) });

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") ?? "local";
  const now = Date.now();
  const recent = (buckets.get(forwarded) ?? []).filter((stamp) => now - stamp < 60_000);
  if (recent.length >= 5) return NextResponse.json({ error: "Demasiadas solicitudes. Intenta nuevamente en un minuto." }, { status: 429 });
  buckets.set(forwarded, [...recent, now]);
  const body = await request.text();
  let payload: unknown = {};
  try { payload = body ? JSON.parse(body) : {}; } catch { return NextResponse.json({ error: "Solicitud de ensayo inválida." }, { status: 400 }); }
  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Solicitud de ensayo inválida." }, { status: 400 });
  const bank = buildQuestionBank();
  const invalid = bank.filter((question) => !validateQuestion(question).valid);
  if (invalid.length) return NextResponse.json({ error: "El banco no superó la validación." }, { status: 500 });
  const examId = crypto.randomUUID();
  const questions = selectUnseenQuestions(bank, new Set(parsed.data.exposedQuestionIds), generateExamBlueprint(examId), examId);
  if (questions.length !== 65) return NextResponse.json({ error: "No fue posible completar un ensayo equilibrado." }, { status: 500 });
  return NextResponse.json({ examId, startedAt: new Date().toISOString(), durationSeconds: 8400, questions: questions.map(sanitizeQuestion) });
}
