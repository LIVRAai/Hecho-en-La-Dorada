"use client";

import { useMemo, useState, useTransition } from "react";
import { CheckCircle2, Edit3, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteAdminRecord, saveAdminRecord, updateRecommendationStatus } from "@/lib/admin-actions";
import type { AdminRecord } from "@/lib/admin-data";

const statuses = ["Todos", "Pendiente", "Revisada", "Contactada", "Publicada", "Descartada", "Activa", "Borrador"];

export function AdminDataTable({ records, moduleSlug, newLabel, table }: { records: AdminRecord[]; moduleSlug: string; newLabel: string; table: string }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const [category, setCategory] = useState("Todos");
  const [deleteTarget, setDeleteTarget] = useState<AdminRecord | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const categories = useMemo(() => ["Todos", ...Array.from(new Set(records.map((record) => record.category)))], [records]);
  const filtered = useMemo(() => records.filter((record) => {
    const matchesQuery = `${record.title} ${record.owner} ${record.description}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "Todos" || record.status === status;
    const matchesCategory = category === "Todos" || record.category === category;
    return matchesQuery && matchesStatus && matchesCategory;
  }), [category, query, records, status]);

  function confirmDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteAdminRecord({ table, id: deleteTarget.id });
      setMessage(result.message);
      setDeleteTarget(null);
    });
  }

  function changeRecommendationStatus(id: string, nextStatus: string) {
    startTransition(async () => {
      const result = await updateRecommendationStatus(id, nextStatus);
      setMessage(result.message);
    });
  }

  function convertRecommendation(record: AdminRecord) {
    startTransition(async () => {
      const result = await saveAdminRecord({ table: "projects", title: record.title, category: record.category, status: "Borrador", description: record.description });
      setMessage(result.ok ? "Recomendación convertida en proyecto borrador" : result.message);
    });
  }

  function quickEdit(record: AdminRecord) {
    const title = window.prompt("Nuevo título", record.title);
    if (!title) return;
    const description = window.prompt("Descripción", record.description) ?? record.description;
    startTransition(async () => {
      const result = await saveAdminRecord({ table, id: record.id, title, category: record.category, status: record.status, description });
      setMessage(result.message);
    });
  }

  function togglePublished(record: AdminRecord) {
    const nextStatus = table === "opportunities"
      ? record.status === "Publicada" || record.status === "Activa" ? "Pendiente" : "Publicada"
      : record.status === "Publicada" ? "Borrador" : "Publicada";
    startTransition(async () => {
      const result = await saveAdminRecord({ table, id: record.id, title: record.title, category: record.category, status: nextStatus, description: record.description });
      setMessage(result.message);
    });
  }

  return <section className="rounded-3xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"><Search size={18} className="text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Buscar por título, responsable o descripción..." /></div><div className="flex flex-wrap gap-3"><select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold"><option value="Todos">Todas las categorías</option>{categories.filter((item) => item !== "Todos").map((item) => <option key={item}>{item}</option>)}</select><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold">{statuses.map((item) => <option key={item}>{item}</option>)}</select><button className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white"><Plus size={16} />{newLabel}</button></div></div>{message && <p className="mx-5 mt-5 rounded-2xl bg-slate-100 p-4 text-sm font-semibold text-slate-700">{message}</p>}<div className="overflow-x-auto"><table className="w-full min-w-[920px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-500"><tr><th className="px-5 py-4">Registro</th><th className="px-5 py-4">Categoría</th><th className="px-5 py-4">Responsable</th><th className="px-5 py-4">Estado</th><th className="px-5 py-4">Fecha</th><th className="px-5 py-4 text-right">Acciones</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((record) => <tr key={record.id} className="align-top"><td className="px-5 py-4"><p className="font-black text-slate-950">{record.title}</p><p className="mt-1 max-w-md text-slate-500">{record.description}</p>{moduleSlug === "recomendaciones" && <button onClick={() => convertRecommendation(record)} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-dorado/15 px-3 py-2 text-xs font-black text-tierra"><CheckCircle2 size={14} />Convertir en proyecto</button>}</td><td className="px-5 py-4 font-semibold text-slate-600">{record.category}</td><td className="px-5 py-4 text-slate-600">{record.owner}</td><td className="px-5 py-4">{moduleSlug === "recomendaciones" ? <select value={record.status} disabled={isPending} onChange={(event) => changeRecommendationStatus(record.id, event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold">{statuses.filter((item) => item !== "Todos" && item !== "Activa" && item !== "Borrador").map((item) => <option key={item}>{item}</option>)}</select> : <StatusBadge status={record.status} />}</td><td className="px-5 py-4 text-slate-500">{record.date}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => togglePublished(record)} className="rounded-xl border border-slate-200 p-2 text-slate-600" aria-label="Cambiar estado"><RefreshCw size={16} /></button><button onClick={() => quickEdit(record)} className="rounded-xl border border-slate-200 p-2 text-slate-600" aria-label="Editar"><Edit3 size={16} /></button><button onClick={() => setDeleteTarget(record)} className="rounded-xl border border-rose-200 p-2 text-rose-600" aria-label="Eliminar"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div><ConfirmDeleteModal open={Boolean(deleteTarget)} title={deleteTarget?.title ?? ""} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} /></section>;
}
