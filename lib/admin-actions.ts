"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase-server";

const tableSchema = z.enum(["projects", "stories", "podcast_episodes", "events", "opportunities", "recommendations", "indicators"]);
const adminRecordSchema = z.object({
  table: tableSchema,
  id: z.string().optional(),
  title: z.string().min(2),
  category: z.string().min(2),
  status: z.string().optional(),
  description: z.string().min(5).optional()
});

export async function saveAdminRecord(input: unknown) {
  const parsed = adminRecordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Datos inválidos" };

  const supabase = await getSupabaseServerClient();
  const { table, id, ...values } = parsed.data;
  const payload = toTablePayload(table, values);
  const query = id ? supabase.from(table).update(payload).eq("id", id) : supabase.from(table).insert(payload);
  const { error } = await query;

  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin");
  return { ok: true, message: id ? "Registro actualizado" : "Registro creado" };
}

export async function deleteAdminRecord(input: { table: string; id: string }) {
  const parsed = z.object({ table: tableSchema, id: z.string().min(1) }).safeParse(input);
  if (!parsed.success) return { ok: false, message: "Datos inválidos" };

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from(parsed.data.table).delete().eq("id", parsed.data.id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin");
  return { ok: true, message: "Registro eliminado" };
}

export async function updateRecommendationStatus(id: string, status: string) {
  const parsed = z.object({ id: z.string().min(1), status: z.enum(["Pendiente", "Revisada", "Contactada", "Publicada", "Descartada"]) }).safeParse({ id, status });
  if (!parsed.success) return { ok: false, message: "Estado inválido" };

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("recommendations").update({ status: parsed.data.status }).eq("id", parsed.data.id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/recomendaciones");
  return { ok: true, message: "Estado actualizado" };
}

function toTablePayload(table: z.infer<typeof tableSchema>, values: { title: string; category: string; status?: string; description?: string }) {
  const slug = values.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  switch (table) {
    case "projects":
      return { name: values.title, slug, category: values.category, short_description: values.description ?? values.title, story: values.description ?? values.title };
    case "stories":
      return { title: values.title, slug, author: "Admin", category: values.category, excerpt: values.description, content: values.description ?? values.title };
    case "podcast_episodes":
      return { title: values.title, slug, category: values.category, summary: values.description };
    case "events":
      return { title: values.title, slug, category: values.category, description: values.description, date: new Date().toISOString().slice(0, 10) };
    case "opportunities":
      return { title: values.title, category: values.category, description: values.description ?? values.title, status: values.status ?? "Pendiente" };
    case "recommendations":
      return { recommender_name: "Admin", email: "admin@hechoenladorada.co", recommended_name: values.title, category: values.category, story: values.description ?? values.title, status: values.status ?? "Pendiente" };
    case "indicators":
      return { title: values.title, value: "Pendiente", category: values.category, description: values.description };
  }
}
