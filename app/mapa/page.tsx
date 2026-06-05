import type { Metadata } from "next";
import { MapView } from "@/components/map-view";
import { SectionTitle } from "@/components/ui";
import { projects } from "@/lib/data";
export const metadata: Metadata = { title: "Mapa", description: "Mapa de lo Hecho en La Dorada." };
export default function MapaPage() { return <section className="mx-auto max-w-7xl px-4 py-16"><SectionTitle eyebrow="Mapa interactivo" title="Mapa de lo Hecho en La Dorada" description="Emprendimientos, eventos, lugares turísticos, espacios culturales, fundaciones, organizaciones, parques, bibliotecas y museos filtrables por categoría." /><MapView projects={projects} /></section>; }
