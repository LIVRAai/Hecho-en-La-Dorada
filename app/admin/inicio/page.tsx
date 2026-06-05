import { HomeSettingsForm } from "@/components/admin/home-settings-form";
import { getHomeSettings } from "@/lib/public-data";

export default async function AdminInicioPage() {
  const home = await getHomeSettings();
  return <div className="space-y-6"><div><p className="text-xs font-black uppercase tracking-[0.25em] text-magdalena">Home editable</p><h2 className="mt-2 font-serif text-4xl font-black text-slate-950">Contenido de inicio</h2><p className="mt-3 max-w-3xl text-slate-600">Edita el hero público sin tocar código: título, subtítulo, imagen, frase y botones.</p></div><HomeSettingsForm home={home} /></div>;
}
