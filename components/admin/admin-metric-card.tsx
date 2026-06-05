import type { LucideIcon } from "lucide-react";

export function AdminMetricCard({ title, value, description, icon: Icon }: { title: string; value: number | string; description: string; icon: LucideIcon }) {
  return <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm font-bold text-slate-500">{title}</p><p className="mt-3 font-serif text-4xl font-black text-slate-950">{value}</p></div><span className="grid size-12 place-items-center rounded-2xl bg-dorado/15 text-tierra"><Icon size={22} /></span></div><p className="mt-4 text-sm text-slate-500">{description}</p></article>;
}
