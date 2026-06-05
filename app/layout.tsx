import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { StructuredData } from "@/components/structured-data";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

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
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          <StructuredData />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
