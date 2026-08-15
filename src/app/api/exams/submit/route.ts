import { NextResponse } from "next/server";
import { z } from "zod";
import { buildQuestionBank } from "@/lib/questions";
import { scoreExam } from "@/lib/scoring";

const schema = z.object({ examId: z.string().uuid(), answers: z.record(z.string(), z.enum(["A", "B", "C", "D"])) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Entrega inválida." }, { status: 400 });
  return NextResponse.json({ ...scoreExam(buildQuestionBank(), parsed.data.answers), submittedAt: new Date().toISOString() });
}
