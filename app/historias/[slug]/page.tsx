import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Facebook, Linkedin, Share2 } from "lucide-react";
import { Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { getStoryBySlug } from "@/lib/public-data";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 60;
export function generateStaticParams() { return []; }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const story = await getStoryBySlug(slug); return { title: story?.title ?? "Historia", description: story?.excerpt }; }
export default async function StoryDetail({ params }: Props) { const { slug } = await params; const story = await getStoryBySlug(slug); if (!story) notFound(); return <article><section className="mx-auto max-w-5xl px-4 py-14"><Badge>{story.category}</Badge><h1 className="mt-5 font-serif text-5xl font-black leading-tight md:text-7xl">{story.title}</h1><p className="mt-6 text-xl leading-9 text-suave/70">{story.excerpt}</p><div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-suave/55"><span>Por {story.author}</span><span>{formatDate(story.createdAt)}</span><span>{story.readingTime} minutos de lectura</span></div></section>{story.coverImage ? <img src={story.coverImage} alt="" className="mx-auto h-[620px] w-[min(92rem,100%-2rem)] rounded-[3rem] object-cover shadow-editorial" /> : <div className="mx-auto h-[420px] w-[min(92rem,100%-2rem)] rounded-[3rem] bg-gradient-to-br from-dorado/25 via-crema to-magdalena/20 shadow-editorial" />}<section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1fr_240px]"><div className="editorial-prose rounded-[2.5rem] bg-white p-8 text-lg shadow-editorial"><p>{story.content}</p></div><aside className="rounded-[2rem] bg-suave p-6 text-crema shadow-editorial"><h3 className="font-serif text-2xl font-black">Compartir</h3><div className="mt-5 grid gap-3"><span className="flex items-center gap-2"><Share2 size={16} />Copiar enlace</span><span className="flex items-center gap-2"><Facebook size={16} />Facebook</span><span className="flex items-center gap-2"><Linkedin size={16} />LinkedIn</span></div></aside></section></article>; }
