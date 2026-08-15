import Link from "next/link";
import { BookOpen, ChartNoAxesCombined, CircleUserRound, LayoutDashboard } from "lucide-react";
import { Logo } from "./logo";

export function AppShell({ children, active = "dashboard" }: { children: React.ReactNode; active?: string }) {
  const items = [{ id: "dashboard", href: "/dashboard", label: "Panel", icon: LayoutDashboard }, { id: "practice", href: "/exams/generating", label: "Nuevo ensayo", icon: BookOpen }, { id: "progress", href: "/dashboard#progress", label: "Progreso", icon: ChartNoAxesCombined }];
  return <div className="app-layout"><aside className="sidebar"><Logo /><nav aria-label="Navegación principal">{items.map(({ id, href, label, icon: Icon }) => <Link key={id} href={href} className={active === id ? "active" : ""}><Icon size={18} />{label}</Link>)}</nav><Link href="/profile" className="profile-mini"><span>SS</span><span><b>Santiago</b><small>Estudiante</small></span><CircleUserRound size={18} /></Link></aside><main className="app-main">{children}</main></div>;
}
