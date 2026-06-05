import type { Metadata } from "next";
import { OpportunityCard } from "@/components/cards";
import { CategoryFilter, SectionTitle } from "@/components/ui";
import { opportunities } from "@/lib/data";
export const metadata: Metadata = { title: "Oportunidades", description: "Muro comunitario de oportunidades de La Dorada." };
export default function OpportunitiesPage() { return <section className="mx-auto max-w-7xl px-4 py-16"><SectionTitle eyebrow="Muro de oportunidades" title="Conectar talento, empleo, servicios y voluntariado" description="Publicaciones comunitarias moderadas: busco empleo, ofrezco empleo, socios, proveedores, servicios, voluntariado y convocatorias." /><CategoryFilter categories={["Busco empleo", "Ofrezco empleo", "Busco socio", "Busco proveedor", "Ofrezco servicios", "Voluntariado", "Convocatorias"]} /><div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{opportunities.map((item) => <OpportunityCard key={item.id} item={item} />)}</div></section>; }
