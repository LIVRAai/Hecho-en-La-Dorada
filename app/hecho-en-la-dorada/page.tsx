import type { Metadata } from "next";
import { ProjectCard } from "@/components/cards";
import { CategoryFilter, SearchBar, SectionTitle } from "@/components/ui";
import { categories, projects } from "@/lib/data";

export const metadata: Metadata = { title: "Proyectos locales", description: "Emprendimientos, fundaciones, colectivos, artistas y organizaciones de La Dorada." };

export default function ProjectsPage() {
  return <section className="mx-auto max-w-7xl px-4 py-16"><SectionTitle eyebrow="Hecho en La Dorada" title="Iniciativas locales que están construyendo ciudad" description="Explora emprendimientos, negocios, fundaciones, colectivos, artistas, organizaciones, proyectos sociales, startups y marcas locales." /><div className="mb-8 grid gap-4"><SearchBar /><CategoryFilter categories={categories} /></div><div className="mb-8 flex flex-wrap gap-3 text-sm font-semibold text-suave/60"><span>Ordenar: destacados primero</span><span>•</span><span>{projects.length} iniciativas documentadas</span></div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div></section>;
}
