# Hecho en La Dorada

**Hecho en La Dorada** es un MVP editorial y comunitario para descubrir, documentar y conectar personas, emprendimientos, organizaciones, eventos, datos e iniciativas de impacto positivo en La Dorada, Caldas.

> “Historias, personas y proyectos que construyen nuestra ciudad.”

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-ready design tokens y componentes propios
- Supabase Auth + PostgreSQL
- React Hook Form + Zod
- TanStack Query
- Leaflet / React Leaflet
- Framer Motion
- Lucide React
- Vercel

## Arquitectura

```txt
app/                      Rutas públicas, SEO, sitemap y robots
components/               UI editorial reutilizable, cards, mapa y formularios
lib/                      Datos demo, helpers y cliente Supabase
supabase/schema.sql       Esquema PostgreSQL, roles, RLS y políticas
supabase/seed.sql         Semillas SQL iniciales
.env.example              Variables de entorno necesarias
