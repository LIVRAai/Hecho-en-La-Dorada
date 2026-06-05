import type { Metadata } from "next";
import { StoryCard } from "@/components/cards";
import { CategoryFilter, SearchBar, SectionTitle } from "@/components/ui";
import { stories } from "@/lib/data";

export const metadata: Metadata = { title: "Historias", description: "Crónicas, entrevistas y relatos de La Dorada." };

export default function StoriesPage() {
  return <section className="mx-auto max-w-7xl px-4 py-16"><SectionTitle eyebrow="Historias" title="Crónicas, entrevistas y memoria local" description="Relatos con portada, autor, fecha, lectura estimada, categorías, galería y contenido enriquecido." /><div className="mb-8 grid gap-4"><SearchBar placeholder="Buscar historias, autores o categorías..." /><CategoryFilter categories={["Crónicas", "Entrevistas", "Cultura", "Historia local", "Emprendimiento", "Personajes", "Turismo", "Comunidad"]} /></div><div className="grid gap-6 lg:grid-cols-2">{stories.map((story) => <StoryCard key={story.id} story={story} />)}</div></section>;
}
