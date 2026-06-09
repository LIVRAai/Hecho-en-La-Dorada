import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { ProjectCard } from "@/components/cards";
import { CategoryFilter, SearchBar, SectionTitle } from "@/components/ui";
import { categories } from "@/lib/constants";
import { getProjects } from "@/lib/public-data";

export const metadata: Metadata = { title: "Proyectos locales", description: "Emprendimientos, fundaciones, colectivos, artistas y organizaciones de La Dorada." };
export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <section className="mx-auto max-w-7xl px-4 py-16"><SectionTitle eyebrow="Hecho en La Dorada" title="Iniciativas locales que están construyendo ciudad" description="Explora emprendimientos, negocios, fundaciones, colectivos, artistas, organizaciones, proyectos sociales, startups y marcas locales." /><div className="mb-8 grid gap-4"><SearchBar /><CategoryFilter categories={categories} /></div><div className="mb-8 flex flex-wrap gap-3 text-sm font-semibold text-suave/60"><span>Ordenar: destacados primero</span><span>•</span><span>{projects.length} iniciativas publicadas</span></div>{projects.length > 0 ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div> : <EmptyState title="Aún no hay proyectos publicados." description="Cuando el administrador publique proyectos en Supabase aparecerán en esta sección." />}</section>;
}
