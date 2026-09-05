# PLAN — Panel de Administración, CRM, Analytics y Agendamiento
## Complementa a "plan-migracion-stack-tecnico.md" — mismo proyecto, alcance ampliado

*Este documento cubre específicamente lo que se agregó al alcance: admin con editor WYSIWYG, CRM de leads, dashboard con estadísticas, integración GA4, y agendamiento nativo con Google Calendar + Stripe.*

---

## 1. PÁGINAS PÚBLICAS DEL MVP (confirmadas y ajustadas)

```
/                    → Home
/blog                → Archivo del blog
/blog/[slug]          → Post individual
/diagnostico-next-you → Quiz (lead magnet)
/mentorias            → Mentorías + agendamiento real + pago
/comunidad             → Página puente: propuesta de valor + CTA que redirige a Skool
```

**Nota sobre `/comunidad`**: no es una comunidad funcional propia — es una landing que vende la membresía y enlaza a `skool.com/...`. Toda la funcionalidad real (feed, classroom, lives) sigue 100% en Skool. Construir eso aquí sería trabajo duplicado sin beneficio.

`/mi-historia` puede esperar a una fase posterior — no la incluiste en tu lista y tiene sentido: es contenido de profundización (fase de consideración), no esencial para que el lead capture y el negocio funcionen desde el día 1.

---

## 2. ARQUITECTURA DEL ADMIN

El admin vive dentro del mismo proyecto Next.js, en una ruta protegida:

```
/admin                    → Dashboard principal (stats)
/admin/login               → Login (Supabase Auth)
/admin/blog                 → Lista de posts + crear/editar (WYSIWYG)
/admin/blog/[id]/edit        → Editor de post individual
/admin/contactos              → CRM: todos los leads (quiz + newsletter + bookings)
/admin/contactos/[id]          → Ficha de un contacto (historial de eventos)
/admin/mentorias                → Calendario de bookings + gestión de slots
/admin/pagos                     → Historial de pagos de Stripe
/admin/analytics                  → Dashboard de GA4
```

**Autenticación**: Supabase Auth, un solo usuario admin (tú). No hace falta sistema de roles/permisos para el MVP — es un panel de un solo operador.

**Editor WYSIWYG**: usa **Tiptap** (librería headless de editor de texto enriquecido, hecha para React/Next.js). Guarda el contenido como HTML o JSON en la columna `content` de `blog_posts`. Es la opción más usada en stacks Next.js + Supabase — evita depender de un CMS externo (Sanity, Contentful) que agregaría otro servicio más a tu stack.

**Tags y categorías**: no construyas un sistema de tags libre/dinámico — tu taxonomía ya está definida y cerrada (8 pilares como categoría, 7 fases del arco como etiqueta). En el editor, estos van como **dropdowns de selección fija**, no como campos de texto libre. Esto es más simple de construir y evita inconsistencias (alguien escribiendo "Mentalidad" vs "mentalidad" vs "Mind").

---

## 3. MODELO DE DATOS AMPLIADO (CRM)

Reemplaza las tablas `quiz_leads` y `newsletter_subscribers` del documento anterior por un modelo de CRM más robusto, centrado en **contactos + eventos** — así el dashboard y el CRM pueden construirse sobre una sola fuente de verdad:

```sql
create table contacts (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  tags text[] default '{}',         -- ej. ['diagnostico-mentalidad', 'newsletter']
  status text default 'nuevo',      -- nuevo | contactado | en_nutricion | convertido
  created_at timestamptz default now()
);

create table contact_events (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references contacts(id),
  event_type text not null,         -- 'quiz_completed' | 'newsletter_signup' | 'booking_created' | 'payment_completed'
  metadata jsonb,                   -- ej. { archetype: 'La Reinventora Silenciosa', scores: {...} }
  created_at timestamptz default now()
);

create table stripe_payments (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references contacts(id),
  amount_cents int not null,
  product text not null,             -- 'mentoria_1_1' | futuros productos
  stripe_payment_id text,
  status text default 'completed',
  created_at timestamptz default now()
);

create table mentoria_slots (
  id uuid primary key default gen_random_uuid(),
  start_time timestamptz not null,
  duration_minutes int default 60,
  is_booked boolean default false,
  google_calendar_event_id text      -- para sincronización bidireccional
);

create table mentoria_bookings (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid references mentoria_slots(id),
  contact_id uuid references contacts(id),
  stripe_payment_id text,
  status text default 'confirmed',
  created_at timestamptz default now()
);

create table ga4_daily_stats (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  page_path text,
  sessions int,
  pageviews int,
  synced_at timestamptz default now()
);
```

**Por qué este modelo (contactos + eventos) y no tablas separadas por origen:** te permite construir el dashboard de leads, el funnel de conversión, y la ficha de cada contacto **sin duplicar datos** — un mismo email que hizo el quiz, se suscribió al newsletter, y después pagó una mentoría es UN solo contacto con 3 eventos en su historial, no 3 registros desconectados. Esto es lo que hace que el CRM sea útil de verdad, no solo una lista plana.

---

## 4. GOOGLE CALENDAR — vía n8n, no código propio

**No construyas la integración de OAuth con Google Calendar directamente en Next.js** — es la parte más propensa a errores y mantenimiento de todo este plan. En su lugar:

1. n8n tiene un **nodo nativo de Google Calendar** — conecta tu cuenta ahí una sola vez (n8n guarda y refresca el token automáticamente).
2. **Workflow de sincronización de disponibilidad** (corre cada noche): n8n lee tu calendario real (eventos existentes = ocupado), genera los slots disponibles según tus reglas de negocio (ej. martes y jueves 6-8pm), y los escribe en la tabla `mentoria_slots` de Supabase.
3. **Workflow de creación de evento** (se dispara cuando se confirma un pago): n8n crea el evento en tu Google Calendar real (con Google Meet automático) y guarda el `google_calendar_event_id` en el slot correspondiente.

Esto significa que tu dashboard de `/admin/mentorias` simplemente **lee** la tabla `mentoria_slots`/`mentoria_bookings` de Supabase — no habla directamente con la API de Google en ningún momento. Mucho más simple de construir y mantener.

---

## 5. GA4 — sincronización, no llamadas en vivo

**No consultes la API de GA4 en tiempo real cada vez que abres el dashboard** — es lenta y tiene límites de cuota. En su lugar:

1. Workflow de n8n (corre 1 vez al día) que llama a la **Google Analytics Data API (GA4)** con una cuenta de servicio, trae sesiones/pageviews/páginas más visitadas del día anterior, y las escribe en `ga4_daily_stats`.
2. `/admin/analytics` simplemente lee esa tabla de Supabase y grafica — carga instantánea, sin depender de la disponibilidad de la API de Google en el momento en que abres el panel.

---

## 6. DASHBOARD PRINCIPAL (`/admin`) — qué mostrar

Con el modelo de datos de la sección 3, estas métricas salen prácticamente gratis:

- **Leads por semana** (conteo de `contact_events` tipo `quiz_completed` y `newsletter_signup`, agrupado por fecha)
- **Funnel de conversión**: cuántos contactos tienen evento `quiz_completed` → cuántos de esos también tienen `booking_created` o `payment_completed`
- **Ingresos** (suma de `stripe_payments.amount_cents`, por semana/mes)
- **Arquetipo más común** (agrupar `contact_events.metadata->archetype`) — útil para saber qué pilar necesita más contenido
- **Tráfico del sitio** (desde `ga4_daily_stats`): sesiones totales, páginas más visitadas

---

## 7. ROADMAP DE FASES — actualizado con el alcance completo

### Fase 1 — Público esencial + captura de leads
- Home, Blog (archivo + post), Diagnóstico Next You
- Tabla `contacts` + `contact_events` + workflow n8n del quiz (Flujo 1 del documento anterior, adaptado a este modelo)

### Fase 2 — Admin de contenido
- Login admin (Supabase Auth)
- `/admin/blog` con editor Tiptap, CRUD completo, dropdowns de pilar/fase
- Migrar los 4 blog posts ya redactados

### Fase 3 — Mentorías + pagos + Google Calendar
- `/mentorias` público con selección de slot + Stripe Checkout
- Workflows n8n de Google Calendar (sección 4)
- `/admin/mentorias` (vista de bookings) y `/admin/pagos`

### Fase 4 — CRM visual
- `/admin/contactos` (lista + filtros por tag/status/fuente)
- Ficha de contacto individual con historial de eventos

### Fase 5 — Dashboard y Analytics
- `/admin/analytics` con sync de GA4
- Dashboard principal con las métricas de la sección 6

### Fase 6 — Página `/comunidad` + corte de WordPress
- Página puente hacia Skool
- Apagar WordPress solo después de 1-2 semanas estables en producción

---

## 8. RESUMEN DE DECISIONES TÉCNICAS (para que el agente no improvise)

| Decisión | Elección | Por qué |
|---|---|---|
| Editor de contenido | Tiptap (no CMS externo) | Menos servicios que mantener, control total |
| Taxonomía de blog | Dropdowns fijos, no tags libres | Taxonomía ya cerrada (8 pilares + 7 fases) |
| Modelo de leads | Contactos + eventos (no tablas separadas por fuente) | Habilita CRM y funnel real sin duplicar datos |
| Integración Google Calendar | Vía n8n, no OAuth propio en Next.js | Menor superficie de mantenimiento y error |
| Integración GA4 | Sync diario a Supabase, no llamadas en vivo | Velocidad y límites de cuota |
| Autenticación admin | Supabase Auth, un solo usuario | No se necesita sistema de roles para un panel de un operador |

---

*Este documento se entrega junto con "plan-migracion-stack-tecnico.md" — ese cubre la arquitectura general y los flujos de email; este cubre específicamente el admin, CRM, analytics y agendamiento que se agregaron al alcance.*
