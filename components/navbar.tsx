import Link from "next/link";
import { Menu, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui";

const links = [
  ["Proyectos", "/hecho-en-la-dorada"], ["Historias", "/historias"], ["Podcast", "/podcast"], ["Agenda", "/agenda"], ["Mapa", "/mapa"], ["Datos", "/datos"], ["Oportunidades", "/oportunidades"]
];

export function Navbar() {
  return <header className="sticky top-0 z-50 border-b border-suave/10 bg-crema/85 backdrop-blur-xl"><nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4"><Link href="/" className="flex items-center gap-3 font-black tracking-tight"><span className="grid size-10 place-items-center rounded-full bg-magdalena text-white"><Sparkles size={19} /></span><span><span className="block leading-4">HECHO EN</span><span className="block text-dorado">LA DORADA</span></span></Link><div className="hidden items-center gap-5 lg:flex">{links.map(([label, href]) => <Link key={href} href={href} className="text-sm font-semibold text-suave/70 transition hover:text-magdalena">{label}</Link>)}<ButtonLink href="/recomendar">Recomendar</ButtonLink></div><button className="lg:hidden" aria-label="Abrir menú"><Menu /></button></nav></header>;
}
