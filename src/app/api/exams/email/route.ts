import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({ email: z.string().email().endsWith("@gmail.com"), name: z.string().max(100), correct: z.number(), percentage: z.number() });
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Datos de correo inválidos." }, { status: 400 });
  if (!process.env.RESEND_API_KEY) return NextResponse.json({ status: "skipped", reason: "RESEND_API_KEY no configurada; el informe sigue disponible." });
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev", to: parsed.data.email, subject: "Resultado de tu Ensayo PAES M1",
    html: `<p>Hola, ${parsed.data.name}:</p><p>Tu ensayo fue corregido.</p><p><strong>${parsed.data.correct} de 65 respuestas correctas (${parsed.data.percentage} %).</strong></p><p>El informe permanece disponible en tu panel.</p>`
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });
  return NextResponse.json({ status: "sent", id: data?.id });
}
