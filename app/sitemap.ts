import type { MetadataRoute } from "next";
import { podcastEpisodes, projects, stories } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hechoenladorada.co";
  const staticRoutes = ["", "/hecho-en-la-dorada", "/historias", "/podcast", "/agenda", "/mapa", "/datos", "/oportunidades", "/recomendar"].map((route) => ({ url: `${base}${route}`, lastModified: new Date() }));
  return [
    ...staticRoutes,
    ...projects.map((item) => ({ url: `${base}/hecho-en-la-dorada/${item.slug}`, lastModified: new Date() })),
    ...stories.map((item) => ({ url: `${base}/historias/${item.slug}`, lastModified: new Date(item.createdAt) })),
    ...podcastEpisodes.map((item) => ({ url: `${base}/podcast/${item.slug}`, lastModified: new Date(item.createdAt) }))
  ];
}
