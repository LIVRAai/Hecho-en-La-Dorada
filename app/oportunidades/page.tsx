import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { OpportunityCard } from "@/components/cards";
import { CategoryFilter, SectionTitle } from "@/components/ui";
import { getOpportunities } from "@/lib/public-data";
export const metadata: Metadata = { title: "Oportunidades", description: "Muro comunitario de oportunidades de La Dorada." };
export const revalidate = 60;
export default async function OpportunitiesPage() { const opportunities = await getOpportunities(); return <section className="mx-auto max-w-7xl px-4 py-16"><SectionTitle eyebrow="Muro de oportunidades" title="Conectar talento, empleo, servicios y voluntariado" description="Publicaciones comunitarias moderadas: busco empleo, ofrezco empleo, socios, proveedores, servicios, voluntariado y convocatorias." /><CategoryFilter categories={["Busco empleo", "Ofrezco empleo", "Busco socio", "Busco proveedor", "Ofrezco servicios", "Voluntariado", "Convocatorias"]} />{opportunities.length > 0 ? <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{opportunities.map((item) => <OpportunityCard key={item.id} item={item} />)}</div> : <div className="mt-8"><EmptyState title="Aún no hay oportunidades publicadas." description="Las oportunidades con estado Publicada aparecerán en este muro." /></div>}</section>; }
