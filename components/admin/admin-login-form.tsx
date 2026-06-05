"use client";

import { type FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
const allowedRoles = new Set(["Administrador", "Editor"]);

const reasonMessages: Record<string, string> = {
  role: "Tu usuario inició sesión, pero no tiene rol Administrador o Editor en la tabla profiles.",
  session: "Tu sesión expiró o no pudo validarse. Vuelve a ingresar.",
  config: "Faltan variables públicas de Supabase para validar el acceso."
};

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMessage = useMemo(() => reasonMessages[searchParams.get("reason") ?? ""] ?? null, [searchParams]);
  const [message, setMessage] = useState<string | null>(initialMessage);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
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
    if (error || !data.session?.access_token || !data.user?.id) {
      setLoading(false);
      setMessage(error?.message ?? "No se pudo iniciar sesión. Revisa las credenciales.");
      return;
    }

    const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
    if (profileError || !allowedRoles.has(profile?.role ?? "")) {
      await supabase.auth.signOut();
      document.cookie = "sb-access-token=; path=/; max-age=0; SameSite=Lax";
      setLoading(false);
      setMessage("Acceso no autorizado. Crea o actualiza tu perfil en Supabase con rol Administrador o Editor en la tabla profiles.");
      return;
    }

    document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
    router.replace(searchParams.get("redirectedFrom") ?? "/admin");
    router.refresh();
  }

  return <form onSubmit={submit} className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white p-8 text-slate-950 shadow-2xl"><p className="text-xs font-black uppercase tracking-[0.3em] text-magdalena">Acceso privado</p><h1 className="mt-3 font-serif text-4xl font-black">Admin Hecho en La Dorada</h1><p className="mt-3 text-slate-600">Inicia sesión con Supabase Auth. Solo usuarios con rol Administrador o Editor pueden entrar al CMS.</p><div className="mt-8 grid gap-4"><label className="text-sm font-bold text-slate-600">Correo<input name="email" type="email" autoComplete="email" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-dorado" /></label><label className="text-sm font-bold text-slate-600">Contraseña<input name="password" type="password" autoComplete="current-password" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-dorado" /></label></div>{message && <p className="mt-4 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{message}</p>}<button type="submit" disabled={loading} className="mt-6 w-full rounded-2xl bg-dorado px-5 py-3 font-black text-suave disabled:opacity-60">{loading ? "Validando acceso..." : "Ingresar"}</button><p className="mt-4 text-xs leading-5 text-slate-500">Si tus credenciales son correctas pero no avanzas, verifica que tu usuario exista en <code>profiles</code> con rol <strong>Administrador</strong> o <strong>Editor</strong>.</p></form>;
}
