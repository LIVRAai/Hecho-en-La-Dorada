import Link from "next/link";
import { Database, Home, Images, ShieldCheck } from "lucide-react";

const settings = [
  { title: "Inicio público", description: "Edita el hero, la imagen principal y los botones visibles en la landing.", href: "/admin/inicio", icon: Home },
  { title: "Biblioteca de imágenes", description: "Sube, previsualiza, copia URLs públicas y elimina imágenes del bucket media.", href: "/admin/media", icon: Images },
  { title: "Base de datos", description: "El contenido público proviene de Supabase y solo se muestra cuando está publicado.", href: "/admin/proyectos", icon: Database },
  { title: "Accesos", description: "La zona privada requiere Supabase Auth y rol Administrador o Editor en profiles.", href: "/admin", icon: ShieldCheck }
];

export default function AdminConfiguracionPage() {
  return <div className="space-y-6"><section className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-sm"><p className="text-xs font-black uppercase tracking-[0.3em] text-dorado">Configuración</p><h2 className="mt-3 font-serif text-4xl font-black">Centro de ajustes del CMS</h2><p className="mt-3 max-w-3xl text-slate-300">Esta sección reúne accesos operativos y criterios de publicación. Evita duplicar formularios: cada contenido se gestiona en su módulo correspondiente.</p></section><section className="grid gap-5 md:grid-cols-2">{settings.map(({ title, description, href, icon: Icon }) => <Link key={title} href={href} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-editorial"><span className="grid size-12 place-items-center rounded-2xl bg-dorado/15 text-tierra"><Icon size={22} /></span><h3 className="mt-5 font-serif text-2xl font-black text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></Link>)}</section><section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="font-serif text-2xl font-black">Reglas claras de operación</h3><ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-600"><li><strong>Sin datos de ejemplo:</strong> si Supabase está vacío, el sitio público muestra estados vacíos.</li><li><strong>Publicación explícita:</strong> proyectos, historias, podcast, eventos e indicadores requieren estado Publicada.</li><li><strong>Oportunidades:</strong> solo aparecen en público con estado Publicada.</li><li><strong>Imágenes:</strong> primero se suben en Media y luego se pega la URL pública en el formulario del módulo.</li></ul></section></div>;
}
