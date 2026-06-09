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
  description: z.string().min(5).optional(),
  imageUrl: z.string().url().or(z.literal("")).optional(),
  gallery: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  owner: z.string().optional(),
  value: z.string().optional(),
  source: z.string().optional(),
  externalUrl: z.string().url().or(z.literal("")).optional()
});

const homeSchema = z.object({
  id: z.string().optional(),
  hero_title: z.string().min(2),
  hero_subtitle: z.string().min(2),
  hero_badge: z.string().optional(),
  hero_quote: z.string().optional(),
  hero_image: z.string().url().or(z.literal("")).optional(),
  hero_cta_primary: z.string().optional(),
  hero_cta_primary_url: z.string().optional(),
  hero_cta_secondary: z.string().optional(),
  hero_cta_secondary_url: z.string().optional()
});

export async function saveAdminRecord(input: unknown) {
  const parsed = adminRecordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Datos inválidos" };

  const supabase = await getSupabaseServerClient();
  const { table, id, ...values } = parsed.data;
  const payload = toTablePayload(table, values);
  const query = id
    ? supabase.from(table as any).update(payload as any).eq("id", id)
    : supabase.from(table as any).insert(payload as any);
  const { error } = await query;

  if (error) return { ok: false, message: error.message };
  revalidateAdminAndPublic(table);
  return { ok: true, message: id ? "Registro actualizado" : "Registro creado" };
}

export async function deleteAdminRecord(input: { table: string; id: string }) {
  const parsed = z.object({ table: tableSchema, id: z.string().min(1) }).safeParse(input);
  if (!parsed.success) return { ok: false, message: "Datos inválidos" };

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from(parsed.data.table as any).delete().eq("id", parsed.data.id);
  if (error) return { ok: false, message: error.message };

  revalidateAdminAndPublic(parsed.data.table);
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

export async function saveHomeSettings(input: unknown) {
  const parsed = homeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Datos de inicio inválidos" };
  const supabase = await getSupabaseServerClient();
  const { id, ...homeValues } = parsed.data;
  const payload = { ...homeValues, updated_at: new Date().toISOString() };
  const { error } = id
    ? await supabase.from("site_home" as any).update(payload as any).eq("id", id)
    : await supabase.from("site_home" as any).insert(payload as any);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/");
  revalidatePath("/admin/inicio");
  return { ok: true, message: "Inicio actualizado" };
}

function toTablePayload(table: string, values: { title: string; category: string; status?: string; description?: string; imageUrl?: string; gallery?: string; date?: string; time?: string; owner?: string; value?: string; source?: string; externalUrl?: string }): Record<string, unknown> {
  const slug = values.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const published = values.status === "Publicada";
  const gallery = values.gallery?.split("\n").map((item) => item.trim()).filter(Boolean) ?? [];
  switch (table) {
    case "projects": {
      const payload: Record<string, unknown> = { name: values.title, slug, category: values.category, short_description: values.description ?? values.title, story: values.description ?? values.title, founder_name: values.owner, published, featured: published };
      if (values.imageUrl !== undefined) payload.main_image = values.imageUrl || null;
      if (values.gallery !== undefined) payload.gallery = gallery;
      return payload;
    }
    case "stories": {
      const payload: Record<string, unknown> = { title: values.title, slug, author: values.owner || "Admin", category: values.category, excerpt: values.description, content: values.description ?? values.title, reading_time: 5, published, featured: published };
      if (values.imageUrl !== undefined) payload.cover_image = values.imageUrl || null;
      return payload;
    }
    case "podcast_episodes": {
      const payload: Record<string, unknown> = { title: values.title, slug, guest_name: values.owner, category: values.category, summary: values.description, published };
      if (values.imageUrl !== undefined) payload.image_url = values.imageUrl || null;
      return payload;
    }
    case "events": {
      const payload: Record<string, unknown> = { title: values.title, slug, organizer: values.owner, category: values.category, description: values.description, date: values.date || new Date().toISOString().slice(0, 10), time: values.time || null, external_link: values.externalUrl || null, published };
      if (values.imageUrl !== undefined) payload.image_url = values.imageUrl || null;
      return payload;
    }
    case "opportunities": {
      const status = ["Pendiente", "Revisada", "Contactada", "Publicada", "Descartada"].includes(values.status ?? "") ? values.status : "Pendiente";
      return { title: values.title, category: values.category, description: values.description ?? values.title, contact_name: values.owner, contact_email: values.externalUrl, status };
    }
    case "recommendations": {
      const status = ["Pendiente", "Revisada", "Contactada", "Publicada", "Descartada"].includes(values.status ?? "") ? values.status : "Pendiente";
      return { recommender_name: values.owner || "Admin", email: "admin@hechoenladorada.co", recommended_name: values.title, category: values.category, story: values.description ?? values.title, status };
    }
    case "indicators":
      return { title: values.title, value: values.value || "Pendiente", category: values.category, description: values.description, source: values.source, published };
    default:
      return { title: values.title, category: values.category, description: values.description };
  }
}

function revalidateAdminAndPublic(table: string) {
  revalidatePath("/admin");
  revalidatePath("/");
  const publicPaths: Record<string, string[]> = {
    projects: ["/hecho-en-la-dorada", "/mapa"],
    stories: ["/historias"],
    podcast_episodes: ["/podcast"],
    events: ["/agenda"],
    indicators: ["/datos"],
    opportunities: ["/oportunidades"],
    recommendations: ["/admin/recomendaciones"]
  };
  for (const path of publicPaths[table] ?? []) revalidatePath(path);
}
