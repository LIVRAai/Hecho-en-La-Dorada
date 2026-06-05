"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { Project } from "@/lib/data";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });

export function MapView({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState("Todos");
  const filtered = useMemo(() => category === "Todos" ? projects : projects.filter((p) => p.category === category), [category, projects]);
  const cats = ["Todos", ...Array.from(new Set(projects.map((p) => p.category)))];
  return <div><div className="mb-5 flex gap-2 overflow-x-auto pb-2">{cats.map((cat) => <button key={cat} onClick={() => setCategory(cat)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${cat === category ? "bg-dorado text-suave" : "bg-white text-suave/65"}`}>{cat}</button>)}</div><MapContainer center={[5.454, -74.666]} zoom={14} scrollWheelZoom={false} className="shadow-editorial"><TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{filtered.map((project) => <Marker key={project.id} position={[project.lat, project.lng]}><Popup><strong>{project.name}</strong><br />{project.category}<br />{project.location}</Popup></Marker>)}</MapContainer></div>;
}
