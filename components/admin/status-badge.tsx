import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  Pendiente: "bg-amber-100 text-amber-800",
  Revisada: "bg-sky-100 text-sky-800",
  Contactada: "bg-violet-100 text-violet-800",
  Publicada: "bg-emerald-100 text-emerald-800",
  Descartada: "bg-rose-100 text-rose-800",
  Activa: "bg-emerald-100 text-emerald-800",
  Borrador: "bg-slate-200 text-slate-700"
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-black", styles[status] ?? "bg-slate-100 text-slate-700")}>{status}</span>;
}
