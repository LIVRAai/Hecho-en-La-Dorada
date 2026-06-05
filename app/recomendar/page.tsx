import type { Metadata } from "next";
import { RecommendationForm } from "@/components/recommendation-form";
import { SectionTitle } from "@/components/ui";
export const metadata: Metadata = { title: "Recomendar una historia", description: "Formulario para recomendar iniciativas locales de La Dorada." };
export default function RecomendarPage() { return <section className="mx-auto max-w-5xl px-4 py-16"><SectionTitle eyebrow="Recomendar" title="Ayúdanos a descubrir lo que merece ser contado" description="La recomendación se guarda en Supabase con estado inicial Pendiente cuando las variables de entorno están configuradas." /><RecommendationForm /></section>; }
