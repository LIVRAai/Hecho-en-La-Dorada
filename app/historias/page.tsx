import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { StoryCard } from "@/components/cards";
import { CategoryFilter, SearchBar, SectionTitle } from "@/components/ui";
import { getStories } from "@/lib/public-data";

export const metadata: Metadata = { title: "Historias", description: "Crónicas, entrevistas y relatos de La Dorada." };
export const revalidate = 60;

export default async function StoriesPage() {
  const stories = await getStories();
  return <section className="mx-auto max-w-7xl px-4 py-16"><SectionTitle eyebrow="Historias" title="Crónicas, entrevistas y memoria local" description="Relatos con portada, autor, fecha, lectura estimada, categorías, galería y contenido enriquecido." /><div className="mb-8 grid gap-4"><SearchBar placeholder="Buscar historias, autores o categorías..." /><CategoryFilter categories={["Crónicas", "Entrevistas", "Cultura", "Historia local", "Emprendimiento", "Personajes", "Turismo", "Comunidad"]} /></div>{stories.length > 0 ? <div className="grid gap-6 lg:grid-cols-2">{stories.map((story) => <StoryCard key={story.id} story={story} />)}</div> : <EmptyState title="Aún no hay historias disponibles." description="Publica la primera historia desde el panel administrador para alimentar esta página." />}</section>;
}
