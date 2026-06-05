import Link from "next/link";
import { Calendar, Clock, MapPin, Mic, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/lib/data";

export function ProjectCard({ project }: { project: Project }) {
  return <Link href={`/hecho-en-la-dorada/${project.slug}`} className="group overflow-hidden rounded-[2rem] bg-white shadow-editorial transition hover:-translate-y-1"><div className="relative h-64 overflow-hidden"><img src={project.mainImage} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute left-4 top-4"><Badge>{project.category}</Badge></div></div><div className="p-6"><h3 className="font-serif text-2xl font-black text-suave">{project.name}</h3><p className="mt-3 text-suave/65">{project.shortDescription}</p><p className="mt-5 flex items-center gap-2 text-sm font-semibold text-magdalena"><MapPin size={16} />{project.location}</p></div></Link>;
}

export function StoryCard({ story }: { story: { title: string; slug: string; category: string; coverImage: string; excerpt: string; readingTime: number; author: string } }) {
  return <Link href={`/historias/${story.slug}`} className="group grid overflow-hidden rounded-[2rem] bg-white shadow-editorial md:grid-cols-[0.9fr_1.1fr]"><img src={story.coverImage} alt="" className="h-72 w-full object-cover transition duration-700 group-hover:scale-105 md:h-full" /><div className="p-6"><Badge>{story.category}</Badge><h3 className="mt-5 font-serif text-3xl font-black leading-tight">{story.title}</h3><p className="mt-4 text-suave/65">{story.excerpt}</p><p className="mt-6 flex items-center gap-4 text-sm font-semibold text-suave/55"><span>{story.author}</span><span className="flex items-center gap-1"><Clock size={15} />{story.readingTime} min</span></p></div></Link>;
}

export function PodcastCard({ episode }: { episode: { title: string; slug: string; guestName: string; category: string; summary: string; imageUrl: string; createdAt: string } }) {
  return <Link href={`/podcast/${episode.slug}`} className="rounded-[2rem] border border-suave/10 bg-white/80 p-5 shadow-editorial transition hover:-translate-y-1"><img src={episode.imageUrl} alt="" className="h-48 w-full rounded-[1.5rem] object-cover" /><div className="mt-5 flex items-center gap-2 text-sm font-bold text-magdalena"><Mic size={16} />{episode.guestName}</div><h3 className="mt-3 font-serif text-2xl font-black">{episode.title}</h3><p className="mt-3 text-suave/65">{episode.summary}</p><p className="mt-4 text-sm text-suave/50">{formatDate(episode.createdAt)}</p></Link>;
}

export function EventCard({ event }: { event: { title: string; date: string; time: string; location: string; category: string; description: string; imageUrl: string } }) {
  return <article className="grid gap-4 rounded-[2rem] bg-white p-4 shadow-editorial md:grid-cols-[220px_1fr]"><img src={event.imageUrl} alt="" className="h-56 w-full rounded-[1.5rem] object-cover md:h-full" /><div className="p-2"><Badge>{event.category}</Badge><h3 className="mt-4 font-serif text-3xl font-black">{event.title}</h3><p className="mt-2 text-suave/65">{event.description}</p><div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-magdalena"><span className="flex items-center gap-2"><Calendar size={16} />{formatDate(event.date)} · {event.time}</span><span className="flex items-center gap-2"><MapPin size={16} />{event.location}</span></div></div></article>;
}

export function OpportunityCard({ item }: { item: { title: string; category: string; description: string; status: string; contactName: string } }) {
  return <article className="rounded-[2rem] border border-suave/10 bg-white/80 p-6 shadow-editorial"><div className="flex items-center justify-between gap-3"><Badge>{item.category}</Badge><span className="rounded-full bg-ribera/10 px-3 py-1 text-xs font-bold text-ribera">{item.status}</span></div><h3 className="mt-5 font-serif text-2xl font-black">{item.title}</h3><p className="mt-3 text-suave/65">{item.description}</p><p className="mt-5 text-sm font-semibold text-magdalena">Contacto: {item.contactName}</p></article>;
}

export function StatisticCard({ stat }: { stat: { title: string; value: string; category: string; description: string; trend?: number[] } }) {
  return <article className="rounded-[2rem] bg-white p-6 shadow-editorial"><p className="text-xs font-black uppercase tracking-[0.25em] text-ribera">{stat.category}</p><p className="mt-3 font-serif text-4xl font-black text-magdalena">{stat.value}</p><h3 className="mt-2 text-lg font-black">{stat.title}</h3><p className="mt-3 text-sm leading-6 text-suave/60">{stat.description}</p>{stat.trend && <div className="mt-5 flex items-end gap-1">{stat.trend.map((point, i) => <span key={i} className="w-full rounded-t bg-dorado/70" style={{ height: `${point * 3}px` }} />)}<TrendingUp className="ml-2 text-ribera" size={18} /></div>}</article>;
}
