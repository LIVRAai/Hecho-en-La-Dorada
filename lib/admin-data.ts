import { events, indicators, opportunities, podcastEpisodes, projects, stories } from "@/lib/data";

export const adminStatuses = ["Pendiente", "Revisada", "Contactada", "Publicada", "Descartada"] as const;

export type AdminRecord = {
  id: string;
  title: string;
  category: string;
  status: string;
  date: string;
  owner: string;
  description: string;
};

export type AdminModule = {
  slug: string;
  title: string;
  description: string;
  newLabel: string;
  categoryLabel: string;
  records: AdminRecord[];
};

export const recommendations: AdminRecord[] = [
  { id: "rec-1", title: "Colectivo Jóvenes del Puerto", category: "Impacto Social", status: "Pendiente", date: "2026-06-01", owner: "María López", description: "Recomendación recibida desde el formulario público para documentar un colectivo juvenil." },
  { id: "rec-2", title: "Panadería La Estación", category: "Gastronomía", status: "Revisada", date: "2026-06-02", owner: "Carlos Ríos", description: "Negocio familiar con historia de barrio y empleo local." },
  { id: "rec-3", title: "Club de Lectura Ribereño", category: "Cultura", status: "Contactada", date: "2026-06-03", owner: "Ana Gómez", description: "Iniciativa cultural recomendada para entrevista editorial." },
  { id: "rec-4", title: "Ruta de Artesanos", category: "Turismo", status: "Publicada", date: "2026-06-04", owner: "Equipo Hecho", description: "Recomendación convertida en proyecto turístico local." }
];

export const adminModules: Record<string, AdminModule> = {
  proyectos: {
    slug: "proyectos",
    title: "Gestión de proyectos",
    description: "Administra emprendimientos, fundaciones, colectivos, marcas e iniciativas locales.",
    newLabel: "Nuevo proyecto",
    categoryLabel: "Categoría",
    records: projects.map((item) => ({ id: String(item.id), title: item.name, category: item.category, status: item.featured ? "Publicada" : "Borrador", date: String(item.startYear), owner: item.founderName, description: item.shortDescription }))
  },
  historias: {
    slug: "historias",
    title: "Gestión de historias",
    description: "Crea, edita y publica crónicas, entrevistas y piezas editoriales.",
    newLabel: "Nueva historia",
    categoryLabel: "Categoría",
    records: stories.map((item) => ({ id: String(item.id), title: item.title, category: item.category, status: item.featured ? "Publicada" : "Borrador", date: item.createdAt, owner: item.author, description: item.excerpt }))
  },
  podcast: {
    slug: "podcast",
    title: "Gestión de podcast",
    description: "Administra episodios, invitados, embeds, frases destacadas y relaciones con proyectos.",
    newLabel: "Nuevo episodio",
    categoryLabel: "Categoría",
    records: podcastEpisodes.map((item) => ({ id: String(item.id), title: item.title, category: item.category, status: "Publicada", date: item.createdAt, owner: item.guestName, description: item.summary }))
  },
  eventos: {
    slug: "eventos",
    title: "Gestión de eventos",
    description: "Publica agenda cultural, talleres, ferias, festivales y actividades comunitarias.",
    newLabel: "Nuevo evento",
    categoryLabel: "Categoría",
    records: events.map((item) => ({ id: String(item.id), title: item.title, category: item.category, status: "Publicada", date: item.date, owner: item.organizer, description: item.description }))
  },
  oportunidades: {
    slug: "oportunidades",
    title: "Gestión de oportunidades",
    description: "Modera ofertas de empleo, voluntariados, convocatorias, proveedores y servicios.",
    newLabel: "Nueva oportunidad",
    categoryLabel: "Tipo",
    records: opportunities.map((item) => ({ id: String(item.id), title: item.title, category: item.category, status: item.status === "Publicada" ? "Activa" : item.status, date: item.createdAt, owner: item.contactName, description: item.description }))
  },
  recomendaciones: {
    slug: "recomendaciones",
    title: "Recomendaciones recibidas",
    description: "Revisa recomendaciones del formulario público, cambia estado y conviértelas en proyectos.",
    newLabel: "Nueva recomendación",
    categoryLabel: "Estado",
    records: recommendations
  },
  indicadores: {
    slug: "indicadores",
    title: "Gestión de indicadores",
    description: "Actualiza datos editoriales, fuentes, categorías y tendencias de La Dorada.",
    newLabel: "Nuevo indicador",
    categoryLabel: "Categoría",
    records: indicators.map((item) => ({ id: String(item.id), title: item.title, category: item.category, status: "Publicada", date: "Actualizado", owner: item.source, description: item.description }))
  },
  configuracion: {
    slug: "configuracion",
    title: "Configuración del sistema",
    description: "Define ajustes editoriales, roles, SEO, integraciones y criterios de publicación.",
    newLabel: "Nuevo ajuste",
    categoryLabel: "Sección",
    records: [
      { id: "cfg-1", title: "Roles editoriales", category: "Seguridad", status: "Activa", date: "2026-06-05", owner: "Administrador", description: "Administrador, Editor y Usuario conectados a Supabase Auth." },
      { id: "cfg-2", title: "SEO global", category: "SEO", status: "Activa", date: "2026-06-05", owner: "Editor", description: "Metadata, Open Graph, sitemap y robots configurables." },
      { id: "cfg-3", title: "Moderación", category: "Contenido", status: "Activa", date: "2026-06-05", owner: "Administrador", description: "Flujo Pendiente, Revisada, Contactada, Publicada y Descartada." }
    ]
  }
};
