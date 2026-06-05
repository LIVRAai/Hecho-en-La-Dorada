import Link from "next/link";
import { cn } from "@/lib/utils";

export function ButtonLink({ href, children, variant = "primary", className }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" | "ghost"; className?: string }) {
  return <Link href={href} className={cn("inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5", variant === "primary" && "bg-dorado text-suave shadow-lg shadow-dorado/25 hover:bg-[#c9922f]", variant === "secondary" && "bg-magdalena text-white hover:bg-[#195b72]", variant === "ghost" && "border border-suave/15 bg-white/50 text-suave hover:bg-white", className)}>{children}</Link>;
}

export function SectionTitle({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return <div className="mb-8 max-w-3xl"><p className="mb-3 text-xs font-black uppercase tracking-[0.32em] text-magdalena">{eyebrow}</p><h2 className="font-serif text-3xl font-black leading-tight text-suave md:text-5xl">{title}</h2>{description && <p className="mt-4 text-lg leading-8 text-suave/70">{description}</p>}</div>;
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex rounded-full bg-dorado/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-tierra", className)}>{children}</span>;
}

export function SearchBar({ placeholder = "Buscar por nombre, barrio, categoría o historia..." }: { placeholder?: string }) {
  return <div className="rounded-3xl border border-suave/10 bg-white/80 p-3 shadow-editorial backdrop-blur"><input aria-label="Buscar" placeholder={placeholder} className="w-full rounded-2xl bg-transparent px-4 py-3 text-suave outline-none placeholder:text-suave/40" /></div>;
}

export function CategoryFilter({ categories }: { categories: string[] }) {
  return <div className="flex gap-2 overflow-x-auto pb-2">{["Todos", ...categories].map((category) => <button key={category} className="shrink-0 rounded-full border border-suave/10 bg-white/70 px-4 py-2 text-sm font-semibold text-suave/75 transition hover:border-dorado hover:text-suave">{category}</button>)}</div>;
}
