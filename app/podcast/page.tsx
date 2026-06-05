import type { Metadata } from "next";
import { PodcastCard } from "@/components/cards";
import { SectionTitle } from "@/components/ui";
import { podcastEpisodes } from "@/lib/data";
export const metadata: Metadata = { title: "Podcast", description: "Podcast Hecho en La Dorada." };
export default function PodcastPage() { return <section className="mx-auto max-w-7xl px-4 py-16"><SectionTitle eyebrow="Podcast Hecho en La Dorada" title="Conversaciones con quienes construyen comunidad" description="Imagen, invitado, fecha, resumen, categoría y fichas con Spotify, YouTube, frases destacadas y proyectos relacionados." /><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{podcastEpisodes.map((episode) => <PodcastCard key={episode.id} episode={episode} />)}</div></section>; }
