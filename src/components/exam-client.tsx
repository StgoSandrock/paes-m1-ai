"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock3, Grid3X3, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getExam, saveExam, type StoredExam } from "@/lib/storage";
import type { AnswerKey } from "@/lib/types";
import { VisualResource } from "./visual-resource";

export function ExamClient({ id }: { id: string }) {
  const router = useRouter();
  const [exam, setExam] = useState<StoredExam>();
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [navOpen, setNavOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const task = window.setTimeout(() => setExam(getExam(id)), 0);
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => { window.clearTimeout(task); window.clearInterval(timer); };
  }, [id]);

  const remaining = useMemo(
    () => exam ? Math.max(0, 8400 - Math.floor((now - new Date(exam.startedAt).getTime()) / 1000)) : 8400,
    [exam, now],
  );
  useEffect(() => { if (exam && remaining === 0 && !busy) void submit(); }, [remaining]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!exam) return <div className="empty"><p>No encontramos este ensayo en el dispositivo.</p><Link className="btn btn-primary" href="/dashboard">Volver al panel</Link></div>;

  const question = exam.questions[index];
  const answered = Object.keys(exam.answers).length;
  const time = `${String(Math.floor(remaining / 3600)).padStart(2, "0")}:${String(Math.floor(remaining % 3600 / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;

  function answer(value: AnswerKey) {
    if (!exam) return;
    const next = { ...exam, answers: { ...exam.answers, [question.id]: value } };
    setExam(next);
    saveExam(next);
  }

  async function submit() {
    if (!exam || busy) return;
    if (remaining > 0 && answered < 65 && !window.confirm(`Tienes ${65 - answered} preguntas sin responder. ¿Entregar de todas formas?`)) return;
    setBusy(true);
    const response = await fetch("/api/exams/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examId: exam.id, questionIds: exam.questions.map((item) => item.id), answers: exam.answers }),
    });
    if (!response.ok) {
      setBusy(false);
      window.alert("No pudimos entregar el ensayo. Tus respuestas siguen guardadas.");
      return;
    }
    const result = await response.json();
    saveExam({ ...exam, status: "SUBMITTED", submittedAt: result.submittedAt, result });
    router.push(`/exams/${exam.id}/results`);
  }

  return <div className="exam-screen"><header className="exam-header"><Link href="/dashboard" className="exam-brand">Savia <b>M1</b></Link><div className="exam-progress"><span>Pregunta {index + 1} de 65</span><div><span style={{ width: `${(index + 1) / 65 * 100}%` }} /></div></div><div className={remaining < 600 ? "timer warning" : "timer"}><Clock3 size={18} /><b>{time}</b></div></header><main className="exam-body"><aside className={navOpen ? "exam-nav open" : "exam-nav"}><div className="nav-head"><b>Navegador</b><button onClick={() => setNavOpen(false)} aria-label="Cerrar navegador">×</button></div><div className="nav-grid">{exam.questions.map((item, position) => <button key={item.id} className={`${position === index ? "current " : ""}${exam.answers[item.id] ? "answered" : ""}`} onClick={() => { setIndex(position); setNavOpen(false); }}>{String(position + 1).padStart(2, "0")}</button>)}</div><div className="nav-legend"><span><i className="answered" />Respondida</span><span><i />Sin responder</span></div></aside><section className="question-area"><button className="nav-trigger btn btn-ghost" onClick={() => setNavOpen(true)}><Grid3X3 size={16} /> Ver preguntas</button><div className="question-meta"><span>{question.unit}</span><span>Dificultad {question.difficulty}</span></div><h1>{question.statement}</h1><VisualResource question={question} /><fieldset className="answer-list"><legend className="sr-only">Selecciona una alternativa</legend>{(["A", "B", "C", "D"] as AnswerKey[]).map((key) => <label className={exam.answers[question.id] === key ? "selected" : ""} key={key}><input type="radio" name="answer" checked={exam.answers[question.id] === key} onChange={() => answer(key)} /><span>{key}</span><b>{question.options[key]}</b></label>)}</fieldset><div className="exam-actions"><button className="btn btn-ghost" disabled={index === 0} onClick={() => setIndex(index - 1)}><ChevronLeft size={17} /> Anterior</button><span>{answered} de 65 respondidas</span>{index < 64 ? <button className="btn btn-primary" onClick={() => setIndex(index + 1)}>Siguiente <ChevronRight size={17} /></button> : <button className="btn btn-danger" disabled={busy} onClick={() => void submit()}><Send size={16} /> {busy ? "Entregando..." : "Entregar ensayo"}</button>}</div></section></main></div>;
}
