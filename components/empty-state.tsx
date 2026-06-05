import { Sparkles } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-suave/15 bg-white/70 p-8 text-center shadow-sm">
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-dorado/15 text-tierra"><Sparkles size={20} /></div>
      <h3 className="mt-4 font-serif text-2xl font-black text-suave">{title}</h3>
      {description && <p className="mx-auto mt-3 max-w-xl text-suave/60">{description}</p>}
    </div>
  );
}
