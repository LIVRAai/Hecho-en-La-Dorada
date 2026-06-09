import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { StatisticCard } from "@/components/cards";
import { SectionTitle } from "@/components/ui";
import { getIndicators } from "@/lib/public-data";
export const metadata: Metadata = { title: "La Dorada en datos", description: "Dashboard editorial de indicadores de La Dorada." };
export const revalidate = 60;
export default async function DatosPage() { const indicators = await getIndicators(); return <section className="mx-auto max-w-7xl px-4 py-16"><SectionTitle eyebrow="Dashboard editorial" title="La Dorada en datos" description="Tarjetas, tendencias e indicadores históricos para población, empresas, turismo, educación, empleo y cultura. En producción se administran desde Supabase." />{indicators.length > 0 ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{indicators.map((stat) => <StatisticCard key={stat.id} stat={stat} />)}</div> : <EmptyState title="Aún no hay indicadores publicados." description="Agrega indicadores reales desde el panel administrador para construir este dashboard." />}</section>; }
