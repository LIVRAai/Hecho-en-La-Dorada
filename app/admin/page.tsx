import { CalendarDays, ClipboardList, Headphones, Lightbulb, Newspaper, UsersRound } from "lucide-react";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { getAdminCounts } from "@/lib/admin-queries";

export default async function AdminPage() {
  const counts = await getAdminCounts();
  const metrics = [
    { title: "Total proyectos", value: counts.projects, description: "Iniciativas locales documentadas", icon: Lightbulb },
    { title: "Total historias", value: counts.stories, description: "Crónicas y piezas editoriales", icon: Newspaper },
    { title: "Total episodios", value: counts.podcast, description: "Conversaciones del podcast", icon: Headphones },
    { title: "Total eventos", value: counts.events, description: "Actividades en agenda", icon: CalendarDays },
    { title: "Recomendaciones pendientes", value: counts.pendingRecommendations, description: "Solicitudes por revisar", icon: UsersRound },
    { title: "Oportunidades activas", value: counts.activeOpportunities, description: "Publicaciones visibles", icon: ClipboardList }
  ];

  return <div className="space-y-7"><section className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-sm"><p className="text-xs font-black uppercase tracking-[0.3em] text-dorado">Dashboard</p><h2 className="mt-3 font-serif text-4xl font-black">Centro de gestión editorial</h2><p className="mt-3 max-w-3xl text-slate-300">Administra proyectos, historias, podcast, eventos, oportunidades, recomendaciones e indicadores sin mezclar el flujo interno con el sitio público.</p></section><section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{metrics.map((metric) => <AdminMetricCard key={metric.title} {...metric} />)}</section><section><div className="mb-4"><h3 className="font-serif text-3xl font-black">Gestión reciente</h3><p className="mt-2 text-slate-600">Vista rápida de recomendaciones entrantes y acciones de moderación.</p></div><AdminDataTable records={counts.recommendations} moduleSlug="recomendaciones" newLabel="Nueva recomendación" table="recommendations" /></section></div>;
}
