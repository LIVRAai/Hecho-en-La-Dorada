"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu, Search } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export function AdminHeader() {
  const router = useRouter();
  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase?.auth.signOut();
    document.cookie = "sb-access-token=; path=/; max-age=0; SameSite=Lax";
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button className="rounded-xl border border-slate-200 p-2 lg:hidden" aria-label="Abrir navegación"><Menu /></button>
          <div><p className="text-xs font-black uppercase tracking-[0.25em] text-magdalena">Zona privada</p><h1 className="font-serif text-2xl font-black">Panel administrativo</h1></div>
        </div>
        <div className="hidden max-w-md flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:flex"><Search size={18} className="text-slate-400" /><input className="w-full bg-transparent text-sm outline-none" placeholder="Buscar en el administrador..." /></div>
        <button onClick={signOut} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white"><LogOut size={16} />Salir</button>
      </div>
    </header>
  );
}
