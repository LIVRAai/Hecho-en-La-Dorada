"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, ImageIcon, Trash2, UploadCloud } from "lucide-react";
import { ensureMediaBucket } from "@/lib/media-actions";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const maxSize = 5 * 1024 * 1024;

type MediaItem = { name: string; path: string; publicUrl: string; createdAt?: string };

function isBucketMissing(message: string) {
  return /bucket not found|not found/i.test(message);
}

export function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  async function loadMedia() {
    if (!supabase) return;
    const { data, error } = await supabase.storage.from("media").list("public", { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    if (error) {
      if (isBucketMissing(error.message)) {
        const setup = await ensureMediaBucket();
        setMessage(setup.ok ? setup.message : setup.message);
        if (setup.ok) return loadMedia();
      } else {
        setMessage(error.message);
      }
      return;
    }
    setItems((data ?? []).filter((file: { name: string }) => file.name !== ".emptyFolderPlaceholder").map((file: { name: string; created_at?: string | null }) => {
      const path = `public/${file.name}`;
      const { data: publicData } = supabase.storage.from("media").getPublicUrl(path);
      return { name: file.name, path, publicUrl: publicData.publicUrl, createdAt: file.created_at ?? undefined };
    }));
  }

  useEffect(() => { void loadMedia(); }, []);

  async function uploadFiles(files: FileList | null) {
    if (!supabase || !files?.length) return;
    setLoading(true);
    setMessage(null);
    for (const file of Array.from(files)) {
      if (!allowedTypes.includes(file.type)) { setMessage("Solo se permiten imágenes jpg, jpeg, png o webp."); continue; }
      if (file.size > maxSize) { setMessage("Cada imagen debe pesar máximo 5 MB."); continue; }
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "-");
      const path = `public/${Date.now()}-${safeName}`;
      const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type, upsert: false });
      if (error) {
        if (isBucketMissing(error.message)) {
          const setup = await ensureMediaBucket();
          setMessage(setup.message);
          if (setup.ok) {
            const retry = await supabase.storage.from("media").upload(path, file, { contentType: file.type, upsert: false });
            if (retry.error) { setMessage(retry.error.message); continue; }
          } else {
            continue;
          }
        } else {
          setMessage(error.message);
          continue;
        }
      }
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      await supabase.from("media_assets").insert({ file_name: safeName, file_path: path, public_url: data.publicUrl, bucket: "media", type: extension });
    }
    setLoading(false);
    await loadMedia();
  }

  async function remove(item: MediaItem) {
    if (!supabase) return;
    const { error } = await supabase.storage.from("media").remove([item.path]);
    if (error) { setMessage(error.message); return; }
    await supabase.from("media_assets").delete().eq("file_path", item.path);
    await loadMedia();
  }

  async function copy(url: string) {
    await navigator.clipboard.writeText(url);
    setMessage("URL pública copiada al portapapeles.");
  }

  return <div className="space-y-6"><div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"><strong>Importante:</strong> la biblioteca usa el bucket público <code>media</code>. Si ves “Bucket not found”, ejecuta <code>supabase/schema.sql</code> o crea el bucket en Supabase Storage con nombre <code>media</code>.</div><label onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void uploadFiles(event.dataTransfer.files); }} className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white p-10 text-center shadow-sm transition hover:border-dorado"><UploadCloud className="text-magdalena" size={40} /><p className="mt-4 font-serif text-2xl font-black">Sube imágenes a Supabase Storage</p><p className="mt-2 text-sm text-slate-500">Arrastra archivos o haz clic. Formatos: jpg, jpeg, png, webp. Máximo 5 MB.</p><input type="file" multiple accept="image/jpeg,image/jpg,image/png,image/webp" className="sr-only" onChange={(event) => void uploadFiles(event.target.files)} /></label>{message && <p className="rounded-2xl bg-slate-100 p-4 text-sm font-semibold text-slate-700">{message}</p>}<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => <article key={item.path} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><img src={item.publicUrl} alt="" className="h-56 w-full object-cover" /><div className="p-4"><p className="truncate font-bold">{item.name}</p><p className="mt-1 truncate text-xs text-slate-500">{item.publicUrl}</p><div className="mt-4 flex gap-2"><button onClick={() => void copy(item.publicUrl)} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white"><Copy size={14} />Copiar URL</button><button onClick={() => void remove(item)} className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700"><Trash2 size={14} />Eliminar</button></div></div></article>)}{items.length === 0 && !loading && <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500"><ImageIcon className="mx-auto" /><p className="mt-3 font-bold">Aún no hay imágenes subidas.</p></div>}</div></div>;
}
