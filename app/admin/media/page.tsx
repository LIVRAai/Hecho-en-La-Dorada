import { MediaManager } from "@/components/admin/media-manager";

export default function AdminMediaPage() {
  return <div className="space-y-6"><div><p className="text-xs font-black uppercase tracking-[0.25em] text-magdalena">Biblioteca</p><h2 className="mt-2 font-serif text-4xl font-black text-slate-950">Biblioteca de imágenes</h2><p className="mt-3 max-w-3xl text-slate-600">Sube imágenes al bucket público `media`, copia URLs y úsalas en proyectos, historias, podcast, eventos e inicio.</p></div><MediaManager /></div>;
}
