import type { MetadataRoute } from "next";
import { getPublicSitemapEntries } from "@/lib/public-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hechoenladorada.co";
  const staticRoutes = ["", "/hecho-en-la-dorada", "/historias", "/podcast", "/agenda", "/mapa", "/datos", "/oportunidades", "/recomendar"].map((route) => ({ url: `${base}${route}`, lastModified: new Date() }));
  const { projects, stories, episodes } = await getPublicSitemapEntries();
  return [
    ...staticRoutes,
    ...projects.map((item) => ({ url: `${base}/hecho-en-la-dorada/${item.slug}`, lastModified: new Date() })),
    ...stories.map((item) => ({ url: `${base}/historias/${item.slug}`, lastModified: new Date(item.createdAt) })),
    ...episodes.map((item) => ({ url: `${base}/podcast/${item.slug}`, lastModified: new Date(item.createdAt) }))
  ];
}
