

## Plan: Blog con panel de administración para la app educativa

### Resumen
Crear un sistema de blog completo con dos partes: una vista pública de artículos con diseño moderno orientado a SEO/marketing, y un panel de administración protegido para crear/editar/eliminar artículos. Los datos se almacenarán en Supabase (Lovable Cloud).

---

### 1. Base de datos (Supabase)

Crear tabla `blog_posts`:

```text
blog_posts
├── id              uuid (PK, default gen_random_uuid())
├── title           text NOT NULL
├── slug            text NOT NULL UNIQUE
├── excerpt         text (resumen corto para cards/SEO)
├── content         text NOT NULL (markdown)
├── cover_image_url text (URL de imagen de portada)
├── category        text (ej: "gramática", "vocabulario", "cultura")
├── tags            text[] (array de etiquetas)
├── published       boolean DEFAULT false
├── author_name     text DEFAULT 'Equipo Vokabeltrainer'
├── reading_time    integer (minutos estimados)
├── created_at      timestamptz DEFAULT now()
├── updated_at      timestamptz DEFAULT now()
```

RLS: lectura pública para posts publicados (`published = true`), escritura solo para admins autenticados.

---

### 2. Páginas y rutas nuevas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/blog` | `BlogPage` | Lista de artículos con filtros por categoría, búsqueda y diseño de cards |
| `/blog/:slug` | `BlogPostPage` | Vista completa del artículo con markdown renderizado |
| `/admin/blog` | `AdminBlogPage` | Panel de gestión: lista de borradores y publicados |
| `/admin/blog/new` | `AdminBlogEditorPage` | Editor de artículos (crear) |
| `/admin/blog/edit/:id` | `AdminBlogEditorPage` | Editor de artículos (editar) |

---

### 3. Vista pública del blog (`/blog`)

- Header con título "Blog" y barra de búsqueda
- Filtros por categoría (chips horizontales)
- Grid de cards con: imagen de portada, categoría badge, título, excerpt, fecha, tiempo de lectura
- Animaciones con framer-motion (fade-up staggered)
- Enlace al blog desde la landing page y desde el BottomNav o header
- Diseño responsive (1 col mobile, 2-3 cols desktop)

---

### 4. Vista de artículo (`/blog/:slug`)

- Hero con imagen de portada a ancho completo
- Metadatos: autor, fecha, tiempo de lectura, categoría
- Contenido renderizado desde markdown (usando `react-markdown` + `remark-gfm`)
- Navegación "Volver al blog"
- Botón compartir
- Artículos relacionados al final (misma categoría)

---

### 5. Panel de administración (`/admin/blog`)

- Acceso protegido con contraseña simple (localStorage) — sin auth completa por ahora, se puede mejorar después
- Tabla con todos los artículos (título, estado, fecha, acciones)
- Botones: crear nuevo, editar, eliminar, publicar/despublicar
- Editor con campos: título, slug (auto-generado), excerpt, contenido (textarea grande), categoría (select), tags, URL de imagen, toggle publicado
- Preview en vivo del markdown mientras se escribe

---

### 6. Dependencias nuevas

- `react-markdown` — renderizar contenido markdown
- `remark-gfm` — soporte para tablas, listas de tareas, etc. en markdown

---

### 7. Integración con la app existente

- Añadir enlace "Blog" en la landing page (sección de navegación)
- Añadir ruta en `App.tsx` para las 5 nuevas rutas
- El blog NO usa BottomNav (es contenido público/marketing, no parte del flujo de la app)
- Mantener la estética existente: modo oscuro, colores teal/primary, tipografía Plus Jakarta Sans

