"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

const allowedRoles = new Set(["Administrador", "Editor"]);
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

class AdminActionError extends Error {}

type AdminClientResult = { supabase: SupabaseClient; userId: string };
type AdminRecordValues = { title: string; category: string; status?: string; description?: string; imageUrl?: string; gallery?: string; date?: string; time?: string; owner?: string; value?: string; source?: string; externalUrl?: string };

export async function saveAdminRecord(input: unknown) {
  const parsed = adminRecordSchema.safeParse(normalizeInput(input));
  if (!parsed.success) return { ok: false, message: "Datos inválidos: revisa título, categoría, descripción y URLs." };

  try {
    const { supabase } = await getVerifiedAdminSupabaseClient();
    const { table, id, ...values } = parsed.data;
    const payload = toTablePayload(table, values);
    await ensureUniqueSlug(supabase, table, payload, id);

    const query = id
      ? supabase.from(table as any).update(payload as any).eq("id", id)
      : supabase.from(table as any).insert(payload as any);
    const { error } = await query;

    if (error) return { ok: false, message: humanizeSupabaseError(error.message) };
    revalidateAdminAndPublic(table);
    return { ok: true, message: id ? "Registro actualizado" : "Registro creado" };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "No se pudo guardar el registro." };
  }
}

export async function deleteAdminRecord(input: { table: string; id: string }) {
  const parsed = z.object({ table: tableSchema, id: z.string().min(1) }).safeParse(input);
  if (!parsed.success) return { ok: false, message: "Datos inválidos" };

  try {
    const { supabase } = await getVerifiedAdminSupabaseClient();
    const { error } = await supabase.from(parsed.data.table as any).delete().eq("id", parsed.data.id);
    if (error) return { ok: false, message: humanizeSupabaseError(error.message) };

    revalidateAdminAndPublic(parsed.data.table);
    return { ok: true, message: "Registro eliminado" };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "No se pudo eliminar el registro." };
  }
}

export async function updateRecommendationStatus(id: string, status: string) {
  const parsed = z.object({ id: z.string().min(1), status: z.enum(["Pendiente", "Revisada", "Contactada", "Publicada", "Descartada"]) }).safeParse({ id, status });
  if (!parsed.success) return { ok: false, message: "Estado inválido" };

  try {
    const { supabase } = await getVerifiedAdminSupabaseClient();
    const { error } = await supabase.from("recommendations").update({ status: parsed.data.status }).eq("id", parsed.data.id);
    if (error) return { ok: false, message: humanizeSupabaseError(error.message) };

    revalidatePath("/admin/recomendaciones");
    return { ok: true, message: "Estado actualizado" };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "No se pudo actualizar el estado." };
  }
}

export async function saveHomeSettings(input: unknown) {
  const parsed = homeSchema.safeParse(normalizeInput(input));
  if (!parsed.success) return { ok: false, message: "Datos de inicio inválidos" };

  try {
    const { supabase } = await getVerifiedAdminSupabaseClient();
    const { id, ...homeValues } = parsed.data;
    const payload = { ...homeValues, updated_at: new Date().toISOString() };
    const { error } = id
      ? await supabase.from("site_home" as any).update(payload as any).eq("id", id)
      : await supabase.from("site_home" as any).insert(payload as any);
    if (error) return { ok: false, message: humanizeSupabaseError(error.message) };
    revalidatePath("/");
    revalidatePath("/admin/inicio");
    return { ok: true, message: "Inicio actualizado" };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "No se pudo guardar el inicio." };
  }
}

async function getVerifiedAdminSupabaseClient(): Promise<AdminClientResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new AdminActionError("Faltan variables públicas de Supabase en el servidor.");

  const token = (await cookies()).get("sb-access-token")?.value;
  if (!token) throw new AdminActionError("No hay sesión activa. Vuelve a iniciar sesión en /admin/login.");

  const userClient = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false }
  });

  const { data: userData, error: userError } = await userClient.auth.getUser(token);
  if (userError || !userData.user?.id) throw new AdminActionError("La sesión no pudo validarse. Vuelve a iniciar sesión.");

  const { data: profile, error: profileError } = await userClient.from("profiles").select("role").eq("id", userData.user.id).maybeSingle();
  if (profileError) throw new AdminActionError(humanizeSupabaseError(profileError.message));
  if (!allowedRoles.has(profile?.role ?? "")) throw new AdminActionError("Tu usuario no tiene rol Administrador o Editor en profiles.");

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = isConfiguredServiceKey(serviceKey)
    ? createClient(url, serviceKey, { auth: { persistSession: false } })
    : userClient;

  return { supabase, userId: userData.user.id };
}

function isConfiguredServiceKey(key: string | undefined): key is string {
  return Boolean(key && !key.startsWith("opcional") && (key.startsWith("eyJ") || key.startsWith("sb_secret_")));
}

function normalizeInput(input: unknown) {
  if (!(input instanceof FormData)) return input;
  return Object.fromEntries(Array.from(input.entries()).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value]));
}

async function ensureUniqueSlug(supabase: SupabaseClient, table: string, payload: Record<string, unknown>, id?: string) {
  if (typeof payload.slug !== "string" || !payload.slug) return;

  const baseSlug = payload.slug;
  let nextSlug = baseSlug;
  let attempt = 0;

  while (attempt < 5) {
    let query = supabase.from(table as any).select("id").eq("slug", nextSlug).limit(1);
    if (id) query = query.neq("id", id);
    const { data, error } = await query;
    if (error) return;
    if (!data?.length) {
      payload.slug = nextSlug;
      return;
    }
    attempt += 1;
    nextSlug = `${baseSlug}-${Date.now().toString(36).slice(-5)}${attempt > 1 ? `-${attempt}` : ""}`;
  }

  payload.slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;
}

function toTablePayload(table: string, values: AdminRecordValues): Record<string, unknown> {
  const slug = values.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const published = values.status === "Publicada";
  const gallery = values.gallery?.split("\n").map((item) => item.trim()).filter(Boolean) ?? [];
  switch (table) {
    case "projects": {
      const payload: Record<string, unknown> = { name: values.title, slug, category: values.category, short_description: values.description ?? values.title, story: values.description ?? values.title, founder_name: values.owner || null, published, featured: published };
      if (values.imageUrl !== undefined) payload.main_image = values.imageUrl || null;
      if (values.gallery !== undefined) payload.gallery = gallery;
      return payload;
    }
    case "stories": {
      const payload: Record<string, unknown> = { title: values.title, slug, author: values.owner || "Admin", category: values.category, excerpt: values.description ?? "", content: values.description ?? values.title, reading_time: 5, published, featured: published };
      if (values.imageUrl !== undefined) payload.cover_image = values.imageUrl || null;
      return payload;
    }
    case "podcast_episodes": {
      const payload: Record<string, unknown> = { title: values.title, slug, guest_name: values.owner || null, category: values.category, summary: values.description ?? "", published };
      if (values.imageUrl !== undefined) payload.image_url = values.imageUrl || null;
      return payload;
    }
    case "events": {
      const payload: Record<string, unknown> = { title: values.title, slug, organizer: values.owner || null, category: values.category, description: values.description ?? "", date: values.date || new Date().toISOString().slice(0, 10), time: values.time || null, external_link: values.externalUrl || null, published };
      if (values.imageUrl !== undefined) payload.image_url = values.imageUrl || null;
      return payload;
    }
    case "opportunities": {
      const status = ["Pendiente", "Revisada", "Contactada", "Publicada", "Descartada"].includes(values.status ?? "") ? values.status : "Pendiente";
      return { title: values.title, category: values.category, description: values.description ?? values.title, contact_name: values.owner || null, contact_email: values.externalUrl || null, status };
    }
    case "recommendations": {
      const status = ["Pendiente", "Revisada", "Contactada", "Publicada", "Descartada"].includes(values.status ?? "") ? values.status : "Pendiente";
      return { recommender_name: values.owner || "Admin", email: "admin@hechoenladorada.co", recommended_name: values.title, category: values.category, story: values.description ?? values.title, status };
    }
    case "indicators":
      return { title: values.title, value: values.value || "Pendiente", category: values.category, description: values.description ?? "", source: values.source || null, published };
    default:
      return { title: values.title, category: values.category, description: values.description ?? "" };
  }
}

function humanizeSupabaseError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("row-level security") || lower.includes("permission denied")) {
    return "No tienes permisos para guardar. Verifica que tu usuario tenga rol Administrador o Editor en profiles y que hayas ejecutado supabase/schema.sql.";
  }
  if (lower.includes("schema cache") || lower.includes("column") || lower.includes("relation") || lower.includes("does not exist")) {
    return "La base de datos no está sincronizada con la app. Ejecuta supabase/schema.sql completo en Supabase y vuelve a intentar.";
  }
  if (lower.includes("duplicate key") || lower.includes("unique constraint")) {
    return "Ya existe un registro con ese identificador. Cambia el título o intenta guardar nuevamente.";
  }
  if (lower.includes("invalid input value for enum")) {
    return "El estado seleccionado no es válido para esta tabla. Usa Pendiente, Revisada, Contactada, Publicada o Descartada.";
  }
  return message;
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
