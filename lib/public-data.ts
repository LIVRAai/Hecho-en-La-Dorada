import { createClient } from "@supabase/supabase-js";

export type PublicProject = {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  story: string;
  founderName: string;
  startYear?: number | null;
  location: string;
  whatsapp?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  website?: string | null;
  featured: boolean;
  mainImage?: string | null;
  gallery: string[];
  lat?: number | null;
  lng?: number | null;
  quote?: string;
};

export type PublicStory = { id: string; title: string; slug: string; author: string; category: string; coverImage?: string | null; excerpt: string; content: string; readingTime: number; featured: boolean; createdAt: string; gallery?: string[] };
export type PublicPodcastEpisode = { id: string; title: string; slug: string; guestName: string; category: string; summary: string; spotifyUrl?: string | null; youtubeUrl?: string | null; imageUrl?: string | null; highlights: string[]; projectId?: string | null; createdAt: string };
export type PublicEvent = { id: string; title: string; slug: string; date: string; time: string; location: string; organizer: string; category: string; description: string; imageUrl?: string | null; whatsapp?: string | null; externalLink?: string | null };
export type PublicIndicator = { id: string; title: string; value: string; category: string; description: string; source?: string | null; trend?: number[] };
export type PublicOpportunity = { id: string; title: string; category: string; description: string; contactName: string; contactPhone?: string | null; contactEmail?: string | null; status: string; createdAt: string };

function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function safeQuery<T>(query: PromiseLike<{ data: T | null; error: unknown }>, fallback: T): Promise<T> {
  try {
    const { data, error } = await query;
    if (error || !data) return fallback;
    return data;
  } catch {
    return fallback;
  }
}

export async function getProjects(limit?: number) {
  const supabase = getPublicClient();
  if (!supabase) return [] as PublicProject[];
  let query: any = supabase.from("projects").select("*").order("featured", { ascending: false }).order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const rows = await safeQuery<any[]>(query, []);
  return rows.map(mapProject);
}

export async function getProjectBySlug(slug: string) {
  const supabase = getPublicClient();
  if (!supabase) return null;
  const row = await safeQuery<any | null>(supabase.from("projects").select("*").eq("slug", slug).maybeSingle(), null);
  return row ? mapProject(row) : null;
}

export async function getStories(limit?: number) {
  const supabase = getPublicClient();
  if (!supabase) return [] as PublicStory[];
  let query: any = supabase.from("stories").select("*").order("featured", { ascending: false }).order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const rows = await safeQuery<any[]>(query, []);
  return rows.map(mapStory);
}

export async function getStoryBySlug(slug: string) {
  const supabase = getPublicClient();
  if (!supabase) return null;
  const row = await safeQuery<any | null>(supabase.from("stories").select("*").eq("slug", slug).maybeSingle(), null);
  return row ? mapStory(row) : null;
}

export async function getPodcastEpisodes(limit?: number) {
  const supabase = getPublicClient();
  if (!supabase) return [] as PublicPodcastEpisode[];
  let query: any = supabase.from("podcast_episodes").select("*").order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const rows = await safeQuery<any[]>(query, []);
  return rows.map(mapPodcastEpisode);
}

export async function getPodcastEpisodeBySlug(slug: string) {
  const supabase = getPublicClient();
  if (!supabase) return null;
  const row = await safeQuery<any | null>(supabase.from("podcast_episodes").select("*").eq("slug", slug).maybeSingle(), null);
  return row ? mapPodcastEpisode(row) : null;
}

export async function getEvents(limit?: number) {
  const supabase = getPublicClient();
  if (!supabase) return [] as PublicEvent[];
  let query: any = supabase.from("events").select("*").order("date", { ascending: true }).order("time", { ascending: true });
  if (limit) query = query.limit(limit);
  const rows = await safeQuery<any[]>(query, []);
  return rows.map(mapEvent);
}

export async function getIndicators(limit?: number) {
  const supabase = getPublicClient();
  if (!supabase) return [] as PublicIndicator[];
  let query: any = supabase.from("indicators").select("*").order("updated_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const rows = await safeQuery<any[]>(query, []);
  return rows.map(mapIndicator);
}

export async function getOpportunities(limit?: number) {
  const supabase = getPublicClient();
  if (!supabase) return [] as PublicOpportunity[];
  let query: any = supabase.from("opportunities").select("*").eq("status", "Publicada").order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const rows = await safeQuery<any[]>(query, []);
  return rows.map(mapOpportunity);
}

export async function getPublicSitemapEntries() {
  const [projects, stories, episodes] = await Promise.all([getProjects(), getStories(), getPodcastEpisodes()]);
  return { projects, stories, episodes };
}

function mapProject(row: any): PublicProject {
  return { id: String(row.id), name: row.name ?? "Sin nombre", slug: row.slug, category: row.category ?? "General", shortDescription: row.short_description ?? "", story: row.story ?? "", founderName: row.founder_name ?? "", startYear: row.start_year, location: row.location ?? "", whatsapp: row.whatsapp, instagram: row.instagram, facebook: row.facebook, website: row.website, featured: Boolean(row.featured), mainImage: row.main_image, gallery: Array.isArray(row.gallery) ? row.gallery : [], lat: row.latitude ?? row.lat ?? null, lng: row.longitude ?? row.lng ?? null, quote: row.quote ?? "" };
}
function mapStory(row: any): PublicStory {
  return { id: String(row.id), title: row.title ?? "Sin título", slug: row.slug, author: row.author ?? "Redacción", category: row.category ?? "General", coverImage: row.cover_image, excerpt: row.excerpt ?? "", content: row.content ?? "", readingTime: row.reading_time ?? 1, featured: Boolean(row.featured), createdAt: row.created_at ?? new Date().toISOString(), gallery: Array.isArray(row.gallery) ? row.gallery : [] };
}
function mapPodcastEpisode(row: any): PublicPodcastEpisode {
  return { id: String(row.id), title: row.title ?? "Sin título", slug: row.slug, guestName: row.guest_name ?? "Invitado", category: row.category ?? "General", summary: row.summary ?? "", spotifyUrl: row.spotify_url, youtubeUrl: row.youtube_url, imageUrl: row.image_url, highlights: Array.isArray(row.highlights) ? row.highlights : [], projectId: row.project_id, createdAt: row.created_at ?? new Date().toISOString() };
}
function mapEvent(row: any): PublicEvent {
  return { id: String(row.id), title: row.title ?? "Sin título", slug: row.slug, date: row.date, time: row.time ?? "", location: row.location ?? "", organizer: row.organizer ?? "", category: row.category ?? "General", description: row.description ?? "", imageUrl: row.image_url, whatsapp: row.whatsapp, externalLink: row.external_link };
}
function mapIndicator(row: any): PublicIndicator {
  return { id: String(row.id), title: row.title ?? "Indicador", value: row.value ?? "", category: row.category ?? "General", description: row.description ?? "", source: row.source, trend: [] };
}
function mapOpportunity(row: any): PublicOpportunity {
  return { id: String(row.id), title: row.title ?? "Sin título", category: row.category ?? "General", description: row.description ?? "", contactName: row.contact_name ?? "", contactPhone: row.contact_phone, contactEmail: row.contact_email, status: row.status ?? "Publicada", createdAt: row.created_at ?? new Date().toISOString() };
}
