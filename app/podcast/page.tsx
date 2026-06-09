import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { PodcastCard } from "@/components/cards";
import { SectionTitle } from "@/components/ui";
import { getPodcastEpisodes } from "@/lib/public-data";
export const metadata: Metadata = { title: "Podcast", description: "Podcast Hecho en La Dorada." };
export const revalidate = 60;
export default async function PodcastPage() { const podcastEpisodes = await getPodcastEpisodes(); return <section className="mx-auto max-w-7xl px-4 py-16"><SectionTitle eyebrow="Podcast Hecho en La Dorada" title="Conversaciones con quienes construyen comunidad" description="Imagen, invitado, fecha, resumen, categoría y fichas con Spotify, YouTube, frases destacadas y proyectos relacionados." />{podcastEpisodes.length > 0 ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{podcastEpisodes.map((episode) => <PodcastCard key={episode.id} episode={episode} />)}</div> : <EmptyState title="Aún no hay episodios disponibles." description="Cuando publiques episodios en Supabase aparecerán aquí." />}</section>; }
