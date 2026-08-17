import { NextResponse } from "next/server";
import { z } from "zod";
import { buildQuestionBank } from "@/lib/questions";
import { scoreExam } from "@/lib/scoring";

const schema = z.object({
  examId: z.string().uuid(),
  questionIds: z.array(z.string()).length(65).refine((ids) => new Set(ids).size === 65),
  answers: z.record(z.string(), z.enum(["A", "B", "C", "D"])),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Entrega inválida." }, { status: 400 });
  const bankById = new Map(buildQuestionBank().map((question) => [question.id, question]));
  const questions = parsed.data.questionIds.map((id) => bankById.get(id));
  if (questions.some((question) => !question)) return NextResponse.json({ error: "El ensayo contiene preguntas desconocidas." }, { status: 400 });
  return NextResponse.json({
    ...scoreExam(questions.filter((question) => question !== undefined), parsed.data.answers),
    submittedAt: new Date().toISOString(),
  });
}
