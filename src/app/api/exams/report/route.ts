import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { z } from "zod";

const schema = z.object({ examId: z.string().uuid(), studentName: z.string().max(100), result: z.object({ correct: z.number(), total: z.number(), percentage: z.number() }) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Datos de informe inválidos." }, { status: 400 });
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  page.drawRectangle({ x: 0, y: 720, width: 595, height: 122, color: rgb(0.055, 0.12, 0.18) });
  page.drawText("ENSAYO PAES", { x: 48, y: 780, size: 27, font: bold, color: rgb(1, 1, 1) });
  page.drawText("COMPETENCIA MATEMATICA 1", { x: 48, y: 752, size: 14, font: regular, color: rgb(.76, .83, .87) });
  page.drawText(parsed.data.studentName || "Estudiante", { x: 48, y: 670, size: 20, font: bold, color: rgb(.055, .12, .18) });
  page.drawText(new Intl.DateTimeFormat("es-CL", { dateStyle: "long" }).format(new Date()), { x: 48, y: 642, size: 11, font: regular, color: rgb(.35, .4, .43) });
  page.drawText(`${parsed.data.result.correct} / ${parsed.data.result.total}`, { x: 48, y: 535, size: 62, font: bold, color: rgb(.08, .42, .39) });
  page.drawText(`${parsed.data.result.percentage}% de logro`, { x: 50, y: 500, size: 18, font: regular, color: rgb(.15, .2, .23) });
  page.drawText(`ID de ensayo: ${parsed.data.examId}`, { x: 48, y: 72, size: 9, font: regular, color: rgb(.45, .49, .52) });
  const bytes = await pdf.save();
  return new NextResponse(Buffer.from(bytes), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="Ensayo-M1-Corregido-${parsed.data.examId}.pdf"` } });
}
