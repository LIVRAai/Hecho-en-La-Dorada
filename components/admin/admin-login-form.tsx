"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    setMessage(null);
    const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) {
      setLoading(false);
      setMessage("Ingresa un correo válido y una contraseña de mínimo 6 caracteres.");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      setMessage("Faltan variables públicas de Supabase.");
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    if (data.session?.access_token) {
      document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }
    router.replace(searchParams.get("redirectedFrom") ?? "/admin");
    router.refresh();
  }

  return <form action={submit} className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white p-8 text-slate-950 shadow-2xl"><p className="text-xs font-black uppercase tracking-[0.3em] text-magdalena">Acceso privado</p><h1 className="mt-3 font-serif text-4xl font-black">Admin Hecho en La Dorada</h1><p className="mt-3 text-slate-600">Inicia sesión con Supabase Auth para gestionar contenidos, recomendaciones y datos.</p><div className="mt-8 grid gap-4"><label className="text-sm font-bold text-slate-600">Correo<input name="email" type="email" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-dorado" /></label><label className="text-sm font-bold text-slate-600">Contraseña<input name="password" type="password" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-dorado" /></label></div>{message && <p className="mt-4 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{message}</p>}<button disabled={loading} className="mt-6 w-full rounded-2xl bg-dorado px-5 py-3 font-black text-suave disabled:opacity-60">{loading ? "Ingresando..." : "Ingresar"}</button></form>;
}
