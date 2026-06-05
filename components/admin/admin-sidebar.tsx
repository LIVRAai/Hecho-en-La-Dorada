"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarDays, ClipboardList, Headphones, Home, ImageIcon, LayoutTemplate, Lightbulb, Newspaper, Settings, Sparkles, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/inicio", label: "Inicio", icon: LayoutTemplate },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/proyectos", label: "Proyectos", icon: Lightbulb },
  { href: "/admin/historias", label: "Historias", icon: Newspaper },
  { href: "/admin/podcast", label: "Podcast", icon: Headphones },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/admin/oportunidades", label: "Oportunidades", icon: ClipboardList },
  { href: "/admin/recomendaciones", label: "Recomendaciones", icon: UsersRound },
  { href: "/admin/indicadores", label: "Indicadores", icon: BarChart3 },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings }
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-800 bg-slate-950 px-5 py-6 text-white lg:block">
      <Link href="/admin" className="flex items-center gap-3 rounded-2xl bg-white/5 p-4">
        <span className="grid size-11 place-items-center rounded-xl bg-dorado text-suave"><Sparkles size={20} /></span>
        <span><span className="block text-xs font-black uppercase tracking-[0.25em] text-slate-400">Admin</span><span className="font-serif text-xl font-black">Hecho en La Dorada</span></span>
      </Link>
      <nav className="mt-8 grid gap-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white", active && "bg-dorado text-suave hover:bg-dorado hover:text-suave")}><Icon size={18} />{label}</Link>;
        })}
      </nav>
      <div className="absolute bottom-6 left-5 right-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        Panel privado con Supabase Auth, RLS y acciones preparadas para crecer.
      </div>
    </aside>
  );
}
