"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { saveAdminRecord } from "@/lib/admin-actions";

const schema = z.object({ title: z.string().min(2), category: z.string().min(2), status: z.string().min(2), description: z.string().min(5), imageUrl: z.string().optional(), gallery: z.string().optional(), date: z.string().optional(), time: z.string().optional(), owner: z.string().optional(), value: z.string().optional(), source: z.string().optional(), externalUrl: z.string().optional() });

type TableName = "projects" | "stories" | "podcast_episodes" | "events" | "opportunities" | "recommendations" | "indicators";

export function AdminForm({ moduleTitle, table }: { moduleTitle: string; table: TableName }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const showImage = ["projects", "stories", "podcast_episodes", "events"].includes(table);
  const showGallery = table === "projects";
  const showDate = table === "events";
  const showValue = table === "indicators";

  function submit(formData: FormData) {
    const values = Object.fromEntries(formData.entries());
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      setMessage("Completa título, categoría, estado y descripción.");
      return;
    }
    startTransition(async () => {
      const result = await saveAdminRecord({ table, ...parsed.data });
      setMessage(result.message);
    });
  }

  return <form action={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="font-serif text-2xl font-black">Crear / editar</h2><p className="mt-1 text-sm text-slate-500">Formulario conectado a Supabase para {moduleTitle.toLowerCase()}. Usa <a className="font-bold text-magdalena" href="/admin/media">Biblioteca de imágenes</a> para subir y copiar URLs.</p></div><button disabled={isPending} className="rounded-2xl bg-dorado px-4 py-2 text-sm font-black text-suave disabled:opacity-60">Guardar</button></div><div className="mt-6 grid gap-4 md:grid-cols-2"><label className="text-sm font-bold text-slate-600">Título<input name="title" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-dorado" /></label><label className="text-sm font-bold text-slate-600">Categoría<input name="category" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-dorado" /></label><label className="text-sm font-bold text-slate-600">Estado<select name="status" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-dorado"><option>Borrador</option><option>Publicada</option><option>Pendiente</option><option>Revisada</option><option>Contactada</option><option>Descartada</option></select></label><label className="text-sm font-bold text-slate-600">Responsable / autor / invitado<input name="owner" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-dorado" /></label>{showImage && <label className="text-sm font-bold text-slate-600 md:col-span-2">URL de imagen principal<input name="imageUrl" placeholder="Pega la URL pública de /admin/media" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-dorado" /></label>}{showGallery && <label className="text-sm font-bold text-slate-600 md:col-span-2">Galería (una URL por línea)<textarea name="gallery" className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-dorado" /></label>}{showDate && <><label className="text-sm font-bold text-slate-600">Fecha<input type="date" name="date" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-dorado" /></label><label className="text-sm font-bold text-slate-600">Hora<input type="time" name="time" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-dorado" /></label><label className="text-sm font-bold text-slate-600 md:col-span-2">Link externo<input name="externalUrl" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-dorado" /></label></>}{showValue && <><label className="text-sm font-bold text-slate-600">Valor<input name="value" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-dorado" /></label><label className="text-sm font-bold text-slate-600">Fuente<input name="source" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-dorado" /></label></>}<label className="text-sm font-bold text-slate-600 md:col-span-2">Descripción / contenido<textarea name="description" className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-dorado" /></label></div>{message && <p className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm font-semibold text-slate-700">{message}</p>}</form>;
}
