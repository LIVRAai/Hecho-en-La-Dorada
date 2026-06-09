"use server";

import { createClient } from "@supabase/supabase-js";

const mediaBucket = "media";

export async function ensureMediaBucket() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return {
      ok: false,
      message: "El bucket media no existe. Créalo en Supabase Storage o configura SUPABASE_SERVICE_ROLE_KEY en Vercel para que el servidor pueda crearlo automáticamente."
    };
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data: bucket } = await supabase.storage.getBucket(mediaBucket);

  if (bucket) {
    const { error } = await supabase.storage.updateBucket(mediaBucket, {
      public: true,
      allowedMimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
      fileSizeLimit: 5 * 1024 * 1024
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: "Bucket media verificado." };
  }

  const { error } = await supabase.storage.createBucket(mediaBucket, {
    public: true,
    allowedMimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    fileSizeLimit: 5 * 1024 * 1024
  });

  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Bucket media creado correctamente." };
}
