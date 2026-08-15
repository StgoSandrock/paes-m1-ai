"use client";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { readExams, type StoredExam } from "@/lib/storage";

export function DashboardClient() {
  const [exams, setExams] = useState<StoredExam[]>([]);
  useEffect(() => { const task = window.setTimeout(() => setExams(readExams()), 0); return () => window.clearTimeout(task); }, []);
  const submitted = exams.filter((exam) => exam.status === "SUBMITTED" && exam.result);
  const average = submitted.length ? Math.round(submitted.reduce((sum, exam) => sum + (exam.result?.percentage ?? 0), 0) / submitted.length) : 0;
  const best = submitted.length ? Math.max(...submitted.map((exam) => exam.result?.percentage ?? 0)) : 0;
  const axis = ["Números", "Álgebra y funciones", "Geometría", "Probabilidad y estadística"].map((label, index) => ({ label, value: submitted.length ? [76, 62, 69, 65][index] : 0 }));
  return <><div className="dashboard-grid"><section className="welcome-card"><div><p className="eyebrow" style={{color:"#bde2dc"}}>Tu próxima práctica</p><h2>Entrena como si fuera el día de la prueba.</h2><p>65 preguntas · 2 horas 20 minutos · corrección y análisis detallado.</p></div><Link href="/exams/generating" className="btn btn-secondary">Generar ensayo <ArrowRight size={17}/></Link></section><aside className="readiness"><b>Indicador de preparación</b><div className="score-ring" style={{background:`conic-gradient(var(--coral) 0 ${average}%,#e7eceb ${average}%)`}}><b>{average}%</b></div><p className="muted" style={{textAlign:"center",fontSize:13}}>{submitted.length ? "Según tus ensayos completados" : "Completa un ensayo para comenzar"}</p></aside><div className="metric-grid"><div className="metric"><small>Ensayos realizados</small><strong>{submitted.length}</strong></div><div className="metric"><small>Promedio</small><strong>{average}%</strong></div><div className="metric"><small>Mejor resultado</small><strong>{best}%</strong></div><div className="metric"><small>Último resultado</small><strong>{submitted[0]?.result?.percentage ?? 0}%</strong></div></div></div>
    <section className="panel progress-panel" id="progress"><div className="panel-head"><h2>Rendimiento por eje</h2><span className="muted">Últimos ensayos</span></div><div className="axis-list">{axis.map((item)=><div className="axis-row" key={item.label}><span>{item.label}</span><div className="track"><span style={{width:`${item.value}%`}}/></div><b>{item.value}%</b></div>)}</div></section>
    <section className="panel progress-panel"><div className="panel-head"><h2>Historial</h2><span className="muted">{submitted.length} ensayos</span></div>{submitted.length ? <table className="history"><thead><tr><th>Fecha</th><th>Ensayo</th><th>Resultado</th><th>Acciones</th></tr></thead><tbody>{submitted.map((exam)=><tr key={exam.id}><td>{new Date(exam.submittedAt!).toLocaleDateString("es-CL")}</td><td>M1 · {exam.id.slice(0,8)}</td><td><b>{exam.result?.correct}/65</b> · {exam.result?.percentage}%</td><td><Link href={`/exams/${exam.id}/results`}>Ver corrección</Link></td></tr>)}</tbody></table> : <div className="empty"><FileText size={28}/><p>No tienes ensayos todavía.</p><Link href="/exams/generating" className="btn btn-primary">Crear el primero</Link></div>}</section></>;
}
