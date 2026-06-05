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

export const recommendations: AdminRecord[] = [];

export const adminModules: Record<string, AdminModule> = {
  proyectos: {
    slug: "proyectos",
    title: "Gestión de proyectos",
    description: "Administra emprendimientos, fundaciones, colectivos, marcas e iniciativas locales desde Supabase.",
    newLabel: "Nuevo proyecto",
    categoryLabel: "Categoría",
    records: []
  },
  historias: {
    slug: "historias",
    title: "Gestión de historias",
    description: "Crea, edita y publica crónicas, entrevistas y piezas editoriales reales.",
    newLabel: "Nueva historia",
    categoryLabel: "Categoría",
    records: []
  },
  podcast: {
    slug: "podcast",
    title: "Gestión de podcast",
    description: "Administra episodios, invitados, embeds, frases destacadas y relaciones con proyectos.",
    newLabel: "Nuevo episodio",
    categoryLabel: "Categoría",
    records: []
  },
  eventos: {
    slug: "eventos",
    title: "Gestión de eventos",
    description: "Publica agenda cultural, talleres, ferias, festivales y actividades comunitarias.",
    newLabel: "Nuevo evento",
    categoryLabel: "Categoría",
    records: []
  },
  oportunidades: {
    slug: "oportunidades",
    title: "Gestión de oportunidades",
    description: "Modera ofertas de empleo, voluntariados, convocatorias, proveedores y servicios.",
    newLabel: "Nueva oportunidad",
    categoryLabel: "Tipo",
    records: []
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
    records: []
  },
  configuracion: {
    slug: "configuracion",
    title: "Configuración del sistema",
    description: "Define ajustes editoriales, roles, SEO, integraciones y criterios de publicación.",
    newLabel: "Nuevo ajuste",
    categoryLabel: "Sección",
    records: []
  }
};
