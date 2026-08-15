import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DashboardClient } from "@/components/dashboard-client";
export default function Dashboard(){return <AppShell><div className="page-top"><div><p className="eyebrow">Panel del estudiante</p><h1>Hola, Santiago.</h1><p className="muted">Este es tu mapa de preparación para M1.</p></div><Link href="/exams/generating" className="btn btn-primary"><Plus size={17}/> Nuevo ensayo</Link></div><DashboardClient/></AppShell>}
