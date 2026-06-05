import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminForm } from "@/components/admin/admin-form";
import { adminModules } from "@/lib/admin-data";
import { getAdminRecords } from "@/lib/admin-queries";

type AdminContentModule = "proyectos" | "historias" | "podcast" | "eventos" | "oportunidades" | "recomendaciones" | "indicadores";
type AdminTableName = "projects" | "stories" | "podcast_episodes" | "events" | "opportunities" | "recommendations" | "indicators";

const tableMap: Record<AdminContentModule, AdminTableName> = {
  proyectos: "projects",
  historias: "stories",
  podcast: "podcast_episodes",
  eventos: "events",
  oportunidades: "opportunities",
  recomendaciones: "recommendations",
  indicadores: "indicators"
};

export async function AdminModulePage({ moduleSlug }: { moduleSlug: AdminContentModule }) {
  const module = adminModules[moduleSlug];
  const table = tableMap[moduleSlug];
  const records = await getAdminRecords(table);
  return <div className="space-y-6"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="text-xs font-black uppercase tracking-[0.25em] text-magdalena">Módulo administrador</p><h2 className="mt-2 font-serif text-4xl font-black text-slate-950">{module.title}</h2><p className="mt-3 max-w-3xl text-slate-600">{module.description}</p></div></div><AdminDataTable records={records} moduleSlug={module.slug} newLabel={module.newLabel} table={table} /><AdminForm moduleTitle={module.title} table={table} /></div>;
}
