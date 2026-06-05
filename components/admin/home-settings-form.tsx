"use client";

import { useState, useTransition } from "react";
import { saveHomeSettings } from "@/lib/admin-actions";
import type { HomeSettings } from "@/lib/public-data";

export function HomeSettingsForm({ home }: { home: HomeSettings }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(formData: FormData) {
    const values = Object.fromEntries(formData.entries());
    startTransition(async () => {
      const result = await saveHomeSettings(values);
      setMessage(result.message);
    });
  }

  const input = "mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-dorado";
  return <form action={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><input type="hidden" name="id" defaultValue={home.id ?? ""} /><div className="flex items-center justify-between gap-4"><div><h2 className="font-serif text-3xl font-black">Editar Home</h2><p className="mt-2 text-slate-500">Estos campos alimentan el hero público desde la tabla site_home.</p></div><button disabled={isPending} className="rounded-2xl bg-dorado px-5 py-3 font-black text-suave disabled:opacity-60">Guardar inicio</button></div><div className="mt-6 grid gap-4 md:grid-cols-2"><label className="text-sm font-bold text-slate-600">Título principal<input name="hero_title" defaultValue={home.heroTitle} className={input} /></label><label className="text-sm font-bold text-slate-600">Badge<input name="hero_badge" defaultValue={home.heroBadge} className={input} /></label><label className="text-sm font-bold text-slate-600 md:col-span-2">Subtítulo<textarea name="hero_subtitle" defaultValue={home.heroSubtitle} className={`${input} min-h-24`} /></label><label className="text-sm font-bold text-slate-600 md:col-span-2">Frase destacada<input name="hero_quote" defaultValue={home.heroQuote} className={input} /></label><label className="text-sm font-bold text-slate-600 md:col-span-2">Imagen principal<input name="hero_image" defaultValue={home.heroImage ?? ""} className={input} placeholder="URL pública desde /admin/media" /></label><label className="text-sm font-bold text-slate-600">Botón primario<input name="hero_cta_primary" defaultValue={home.heroCtaPrimary} className={input} /></label><label className="text-sm font-bold text-slate-600">URL botón primario<input name="hero_cta_primary_url" defaultValue={home.heroCtaPrimaryUrl} className={input} /></label><label className="text-sm font-bold text-slate-600">Botón secundario<input name="hero_cta_secondary" defaultValue={home.heroCtaSecondary} className={input} /></label><label className="text-sm font-bold text-slate-600">URL botón secundario<input name="hero_cta_secondary_url" defaultValue={home.heroCtaSecondaryUrl} className={input} /></label></div>{message && <p className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm font-semibold text-slate-700">{message}</p>}</form>;
}
