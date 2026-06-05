import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Providers } from "@/components/providers";
import { SiteShell } from "@/components/site-shell";
import { StructuredData } from "@/components/structured-data";


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://hechoenladorada.co"),
  title: {
    default: "Hecho en La Dorada | Historias, personas y proyectos",
    template: "%s | Hecho en La Dorada"
  },
  description: "Plataforma editorial y comunitaria para descubrir proyectos, historias, eventos y oportunidades de La Dorada, Caldas.",
  openGraph: {
    title: "Hecho en La Dorada",
    description: "Historias, personas y proyectos que construyen nuestra ciudad.",
    locale: "es_CO",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <Providers>
          <StructuredData />
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
