export function StructuredData() {
  const jsonLd = { "@context": "https://schema.org", "@type": "WebSite", name: "Hecho en La Dorada", description: "Historias, personas y proyectos que construyen nuestra ciudad.", inLanguage: "es-CO", url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hechoenladorada.co" };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
