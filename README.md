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
```

## Rutas implementadas

- `/` landing editorial con hero, recientes, proyectos, eventos, podcast, datos y CTA.
- `/hecho-en-la-dorada` buscador, filtros y grilla de iniciativas.
- `/hecho-en-la-dorada/[slug]` ficha de proyecto con historia, contactos, galería y relacionados.
- `/historias` y `/historias/[slug]` crónicas y fichas editoriales.
- `/podcast` y `/podcast/[slug]` episodios con embeds de Spotify y YouTube.
- `/agenda` lista y vista calendario editorial de eventos.
- `/mapa` mapa interactivo con filtros por categoría.
- `/datos` dashboard editorial de indicadores.
- `/oportunidades` muro comunitario moderable.
- `/recomendar` formulario validado con Zod y guardado opcional en Supabase.
- `/admin` dashboard base para administración y CRUD futuro.

## Instalación local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre `http://localhost:3000`.

## Configuración Supabase

1. Crea un proyecto en Supabase.
2. Ejecuta `supabase/schema.sql` en el SQL editor.
3. Ejecuta `supabase/seed.sql` para datos iniciales.
4. Copia las llaves del proyecto en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nvidjyavggljuukjmmmf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_mEutHNmodVNOLCoclP3MDA_6l8VDx93
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` puede usar la publishable key de Supabase porque está diseñada para ejecutarse en el navegador. No publiques `SUPABASE_SERVICE_ROLE_KEY`: esa llave es privada y solo debe configurarse en entornos seguros del servidor si se agrega lógica administrativa.

El formulario de recomendaciones funciona en modo demo sin Supabase; si detecta variables configuradas, inserta en la tabla `recommendations` con estado `Pendiente`.

## Módulo administrador

- Login privado en `/admin/login` usando Supabase Auth.
- Middleware protege `/admin/*` y redirige a `/admin/login` cuando no existe sesión activa.
- Layout independiente con sidebar, header, métricas, tablas, filtros, formularios y acciones de moderación.
- Las operaciones administrativas usan la sesión del usuario y políticas RLS; no se expone `SUPABASE_SERVICE_ROLE_KEY` al navegador.
- Para conceder acceso, crea el usuario en Supabase Auth y registra su perfil con rol `Administrador` o `Editor` en la tabla `profiles`.

## Datos demo

El MVP incluye datos demo inspirados en La Dorada:

- 15 proyectos locales
- 10 historias
- 8 episodios de podcast
- 10 eventos
- 20 indicadores
- 10 oportunidades

Los datos de interfaz viven en `lib/data.ts`; los seeds SQL de arranque viven en `supabase/seed.sql`.

## Despliegue en Vercel

1. Conecta el repositorio en Vercel.
2. Configura estas variables en **Project Settings → Environment Variables**:
   - `NEXT_PUBLIC_SITE_URL=https://hechoenladorada.co`
   - `NEXT_PUBLIC_SUPABASE_URL=https://nvidjyavggljuukjmmmf.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_mEutHNmodVNOLCoclP3MDA_6l8VDx93`
3. Usa el comando de build por defecto:

```bash
npm run build
```

4. Publica el dominio final y ajusta `NEXT_PUBLIC_SITE_URL` para Open Graph, sitemap y robots.

## Nota de compatibilidad Vercel

La app usa rangos estables de React 19 (`react` y `react-dom` en `^19.0.0`) para que npm resuelva correctamente peer dependencies como `@tanstack/react-query` en Vercel. Evita volver a versiones React RC (`19.0.0-rc-*`) porque npm no las considera compatibles con rangos peer como `^19`. No uses `--force` ni `--legacy-peer-deps` como solución del despliegue; si aparece un conflicto, actualiza la dependencia incompatible.

## SEO

Incluye metadata global y dinámica, Open Graph, sitemap, robots.txt y JSON-LD de WebSite.
