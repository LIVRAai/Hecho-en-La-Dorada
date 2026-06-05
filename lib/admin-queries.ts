import { getSupabaseServerClient } from "@/lib/supabase-server";
import type { AdminRecord } from "@/lib/admin-data";

export async function getAdminRecords(table: string): Promise<AdminRecord[]> {
  try {
    const supabase = await getSupabaseServerClient();
    const orderColumn = table === "indicators" ? "updated_at" : "created_at";
    const { data, error } = await supabase.from(table as any).select("*").order(orderColumn, { ascending: false });
    if (error || !data) return [];
    return (data as any[]).map((row) => mapAdminRecord(table, row));
  } catch {
    return [];
  }
}

export async function getAdminCounts() {
  const tables = ["projects", "stories", "podcast_episodes", "events", "recommendations", "opportunities"];
  const entries = await Promise.all(tables.map(async (table) => {
    const records = await getAdminRecords(table);
    return [table, records] as const;
  }));
  const data = Object.fromEntries(entries);
  return {
    projects: data.projects?.length ?? 0,
    stories: data.stories?.length ?? 0,
    podcast: data.podcast_episodes?.length ?? 0,
    events: data.events?.length ?? 0,
    pendingRecommendations: (data.recommendations ?? []).filter((item) => item.status === "Pendiente").length,
    activeOpportunities: (data.opportunities ?? []).filter((item) => item.status === "Publicada").length,
    recommendations: data.recommendations ?? []
  };
}

function mapAdminRecord(table: string, row: any): AdminRecord {
  switch (table) {
    case "projects":
      return { id: String(row.id), title: row.name ?? "Sin nombre", category: row.category ?? "General", status: row.published ? "Publicada" : "Borrador", date: row.created_at ?? "", owner: row.founder_name ?? "", description: row.short_description ?? row.story ?? "" };
    case "stories":
      return { id: String(row.id), title: row.title ?? "Sin título", category: row.category ?? "General", status: row.published ? "Publicada" : "Borrador", date: row.created_at ?? "", owner: row.author ?? "", description: row.excerpt ?? row.content ?? "" };
    case "podcast_episodes":
      return { id: String(row.id), title: row.title ?? "Sin título", category: row.category ?? "General", status: row.published ? "Publicada" : "Borrador", date: row.created_at ?? "", owner: row.guest_name ?? "", description: row.summary ?? "" };
    case "events":
      return { id: String(row.id), title: row.title ?? "Sin título", category: row.category ?? "General", status: row.published ? "Publicada" : "Borrador", date: row.date ?? row.created_at ?? "", owner: row.organizer ?? "", description: row.description ?? "" };
    case "opportunities":
      return { id: String(row.id), title: row.title ?? "Sin título", category: row.category ?? "General", status: row.status ?? "Pendiente", date: row.created_at ?? "", owner: row.contact_name ?? "", description: row.description ?? "" };
    case "recommendations":
      return { id: String(row.id), title: row.recommended_name ?? "Sin nombre", category: row.category ?? "General", status: row.status ?? "Pendiente", date: row.created_at ?? "", owner: row.recommender_name ?? row.email ?? "", description: row.story ?? "" };
    case "indicators":
      return { id: String(row.id), title: row.title ?? "Indicador", category: row.category ?? "General", status: row.published ? "Publicada" : "Borrador", date: row.updated_at ?? "", owner: row.source ?? "", description: row.description ?? row.value ?? "" };
    default:
      return { id: String(row.id), title: row.title ?? row.name ?? "Registro", category: row.category ?? "General", status: row.status ?? (row.published ? "Publicada" : "Borrador"), date: row.created_at ?? "", owner: "", description: row.description ?? "" };
  }
}
