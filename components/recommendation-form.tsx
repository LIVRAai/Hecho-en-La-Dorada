"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { categories } from "@/lib/data";

const schema = z.object({ recommender_name: z.string().min(2), email: z.string().email(), phone: z.string().min(7), recommended_name: z.string().min(2), category: z.string().min(2), story: z.string().min(20), instagram: z.string().optional(), whatsapp: z.string().optional() });
type FormValues = z.infer<typeof schema>;

export function RecommendationForm() {
  const [message, setMessage] = useState<string | null>(null);
  const { register, handleSubmit, formState: { isSubmitting }, reset, setError } = useForm<FormValues>({ defaultValues: { category: "Emprendimiento" } });
  async function onSubmit(values: FormValues) {
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => setError(issue.path[0] as keyof FormValues, { message: issue.message }));
      setMessage("Revisa los campos obligatorios y escribe una historia de mínimo 20 caracteres.");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      const { error } = await supabase.from("recommendations").insert({ ...parsed.data, status: "Pendiente" });
      if (error) { setMessage(`No se pudo guardar: ${error.message}`); return; }
    }
    setMessage("Recomendación recibida. Estado inicial: Pendiente.");
    reset();
  }
  const input = "w-full rounded-2xl border border-suave/10 bg-white px-4 py-3 outline-none focus:border-dorado";
  return <form onSubmit={handleSubmit(onSubmit)} className="rounded-[2.5rem] bg-white/80 p-6 shadow-editorial backdrop-blur md:p-8"><div className="grid gap-5 md:grid-cols-2"><label>Nombre<input className={input} {...register("recommender_name")} /></label><label>Correo<input className={input} {...register("email")} /></label><label>Teléfono<input className={input} {...register("phone")} /></label><label>Nombre recomendado<input className={input} {...register("recommended_name")} /></label><label>Categoría<select className={input} {...register("category")}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label>Instagram<input className={input} {...register("instagram")} /></label><label>WhatsApp<input className={input} {...register("whatsapp")} /></label><label className="md:col-span-2">Historia<textarea className={`${input} min-h-40`} {...register("story")} /></label></div>{message && <p className="mt-4 rounded-2xl bg-ribera/10 p-4 font-semibold text-ribera">{message}</p>}<button disabled={isSubmitting} className="mt-6 rounded-full bg-dorado px-6 py-3 font-black text-suave transition hover:bg-[#c9922f] disabled:opacity-60">Enviar recomendación</button></form>;
}
