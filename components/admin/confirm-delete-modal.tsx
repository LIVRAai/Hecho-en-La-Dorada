"use client";

export function ConfirmDeleteModal({ open, title, onCancel, onConfirm }: { open: boolean; title: string; onCancel: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"><div className="max-w-md rounded-3xl bg-white p-6 shadow-2xl"><h2 className="font-serif text-2xl font-black">Eliminar registro</h2><p className="mt-3 text-slate-600">¿Seguro que deseas eliminar “{title}”? Esta acción debe confirmarse antes de afectar Supabase.</p><div className="mt-6 flex justify-end gap-3"><button onClick={onCancel} className="rounded-2xl border border-slate-200 px-4 py-2 font-bold">Cancelar</button><button onClick={onConfirm} className="rounded-2xl bg-rose-600 px-4 py-2 font-bold text-white">Eliminar</button></div></div></div>;
}
