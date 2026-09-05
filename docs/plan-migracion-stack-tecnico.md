# PLAN DE MIGRACIÓN DE STACK — Reiniciar Sin Mapa / NEXT YOU™
## De WordPress + Bricks + FluentCRM → Netlify + Next.js + Supabase + Resend + n8n + Stripe

*Documento para pasar directo a tu agente de código. Incluye arquitectura, modelo de datos, flujos de automatización y un roadmap de migración por fases — no todo tiene que construirse de una vez.*

---

## 1. CONTEXTO Y OBJETIVO

El sitio actual (carlamontano.io) vive en WordPress + Bricks Builder, con FluentCRM manejando leads y automatizaciones de email, y FluentForms/TidyCal para agendamiento. Se migra a un stack propio para tener control total del código, mejor rendimiento, y porque Carla es Software Engineer y puede mantenerlo directamente.

**Lo que NO cambia** (fuera del alcance de esta migración):
- La Comunidad Next You sigue viviendo en **Skool** — no se migra.
- La planificación de contenido sigue en **Notion** — no se migra.
- La identidad de marca (colores, tipografías, copy, estructura de páginas) ya está definida y no se rediseña — se **reconstruye** con el nuevo stack, no se reinventa.
- Los canales de TikTok/Instagram/YouTube no cambian.

**Lo que sí cambia:** todo el sitio web (carlamontano.io) pasa de WordPress a una aplicación Next.js desplegada en Netlify, con Supabase como base de datos, Resend para envío de emails, n8n como motor de automatización (reemplaza las automatizaciones de FluentCRM), y Stripe para pagos de Mentoría y futuros productos.

---

## 2. ARQUITECTURA GENERAL

```
                    ┌─────────────────────┐
                    │   Netlify (hosting)  │
                    │   Next.js (frontend) │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                 │
      ┌───────▼──────┐ ┌───────▼──────┐  ┌──────▼───────┐
      │   Supabase    │ │     n8n      │  │    Stripe     │
      │  (base de     │ │ (automatiza- │  │  (pagos:      │
      │   datos)      │ │  ciones)     │  │  Mentoría,    │
      └───────┬───────┘ └───────┬──────┘  │  futuros      │
              │                 │          │  productos)   │
              │         ┌───────▼──────┐  └───────────────┘
              │         │    Resend     │
              │         │ (envío email) │
              │         └──────────────┘
              │
      ┌───────▼────────────────────┐
      │  Skool (Comunidad — externo,│
      │  no migra, solo se enlaza)  │
      └─────────────────────────────┘
```

**Responsabilidad de cada pieza:**
- **Netlify**: hosting y despliegue continuo del sitio Next.js.
- **Next.js**: todas las páginas del sitio (Home, Mi Historia, Mentorías, Diagnóstico, Blog).
- **Supabase**: base de datos (leads del quiz, suscriptores de newsletter, posts del blog, bookings de mentoría) + Supabase Storage para imágenes.
- **n8n**: reemplaza las automatizaciones de FluentCRM — recibe eventos (quiz completado, suscripción a newsletter, booking confirmado, pago recibido) y ejecuta las secuencias correspondientes.
- **Resend**: el motor de envío real de los emails que n8n orquesta.
- **Stripe**: cobro de sesiones de Mentoría 1:1 y cualquier producto futuro (Bootcamp, Planner, etc.). La membresía de Comunidad sigue cobrándose dentro de Skool, no aquí.

---

## 3. ESTRUCTURA DE PÁGINAS (Next.js — App Router recomendado)

```
/                          → Home
/mi-historia                → Mi Historia
/mentorias                  → Mentorías (incluye sistema de agendamiento propio)
/diagnostico-next-you       → Quiz interactivo
/blog                       → Archivo del blog (con filtro por pilar)
/blog/[slug]                 → Template de post individual
/gracias                     → Página de confirmación post-submit (quiz, newsletter, booking)
/api/quiz-submit             → Endpoint que recibe el resultado del quiz
/api/newsletter-subscribe    → Endpoint de suscripción a newsletter
/api/booking-create          → Endpoint de creación de reserva de mentoría
/api/stripe-webhook          → Webhook de confirmación de pago
```

Todas las páginas deben reconstruirse con el sistema de diseño de marca ya establecido: tokens de color (`--ink #14192B`, `--paper #EDE6D8`, `--clay #BE5A34`, `--sage #6E7F5C`, `--gold #C9A227`), tipografías (Fraunces, Inter, IBM Plex Mono), y la estructura visual ya validada en los mockups HTML previos (hero con el elemento de firma "La Ruta", tarjetas de los 8 pilares, etc.) — el agente debe usar esos mockups como referencia exacta de diseño, no reinterpretarlos.

---

## 4. MODELO DE DATOS EN SUPABASE

### Tabla `quiz_leads`
```sql
create table quiz_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  scores jsonb not null,           -- { mentalidad: 3, direccion: 1, ... }
  archetype text not null,          -- "La Reinventora Silenciosa"
  priority_pillar text not null,    -- "mentalidad"
  created_at timestamptz default now()
);
```

### Tabla `newsletter_subscribers`
```sql
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique not null,
  source text,                      -- "quiz" | "newsletter_form" | "blog"
  sequence_status text default 'active', -- controla en qué email de la secuencia va
  created_at timestamptz default now()
);
```

### Tabla `blog_posts`
```sql
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,                     -- subtítulo del hero
  content text not null,            -- markdown
  pillar text not null,             -- categoría (uno de los 8 pilares)
  arc_phase text,                   -- "Fase 03 — Travesía del umbral" (nullable, no todos los posts son autobiográficos)
  featured_image_url text,
  published_at timestamptz,
  reading_time_minutes int
);
```

### Tabla `mentoria_slots` y `mentoria_bookings` (sistema de agendamiento propio)
```sql
create table mentoria_slots (
  id uuid primary key default gen_random_uuid(),
  start_time timestamptz not null,
  duration_minutes int default 60,
  is_booked boolean default false
);

create table mentoria_bookings (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid references mentoria_slots(id),
  name text not null,
  email text not null,
  stripe_payment_id text,
  status text default 'pending',    -- pending | confirmed | cancelled
  created_at timestamptz default now()
);
```

---

## 5. FLUJOS DE AUTOMATIZACIÓN EN N8N (reemplazo de FluentCRM)

### Flujo 1 — Diagnóstico Next You completado
```
Webhook (recibe POST desde /api/quiz-submit)
  → Guardar en Supabase (quiz_leads)
  → Determinar arquetipo/pilar prioritario (ya calculado en frontend, solo se guarda)
  → Enviar email inmediato vía Resend con el resultado + link a Comunidad
  → Esperar 2-3 días → enviar email 2 de profundización del pilar (reutilizar contenido de las 8 secuencias que ya existían en FluentCRM)
  → Esperar 3-4 días más → enviar email de invitación a Comunidad Next You
```
*Nota: las 8 secuencias por arquetipo ya están redactadas de la migración anterior — el agente debe reutilizar ese copy, no reescribirlo.*

### Flujo 2 — Suscripción a Newsletter general
```
Webhook (recibe POST desde /api/newsletter-subscribe)
  → Guardar en Supabase (newsletter_subscribers)
  → Enviar Email 1 inmediato (bienvenida)
  → Esperar 2 días → Email 2
  → Esperar 3 días → Email 3
  → Esperar 4 días → Email 4 (invitación a Comunidad)
```
*Nota: el copy de estos 4 emails ya existe (secuencia "Bienvenida a Reiniciar Sin Mapa") — reutilizar tal cual.*

### Flujo 3 — Booking de Mentoría confirmado
```
Webhook (recibe evento desde /api/booking-create, después de pago confirmado en Stripe)
  → Marcar slot como is_booked = true en Supabase
  → Enviar email de confirmación con detalles de la sesión (vía Resend)
  → Programar recordatorio 24h antes de la sesión (n8n con nodo de espera/schedule)
```

### Flujo 4 — Webhook de Stripe
```
Stripe envía evento de pago exitoso
  → n8n valida el evento
  → Dispara el Flujo 3 (booking confirmado) o marca el producto correspondiente como pagado
  → Envía recibo/confirmación vía Resend
```

---

## 6. INTEGRACIÓN DE STRIPE

- **Mentoría 1:1**: Stripe Checkout (o Payment Link) — el pago ocurre ANTES de confirmar el slot, para evitar reservas sin pago.
- **Futuros productos** (Bootcamp, Planner, Ritmo Next You si se vende suelto): mismo patrón, un Payment Link o Checkout Session por producto.
- **La membresía de Comunidad NO pasa por aquí** — se sigue cobrando nativamente dentro de Skool. No dupliques ese flujo.

---

## 7. SISTEMA DE AGENDAMIENTO PROPIO (reemplazo de TidyCal)

Componentes mínimos:
1. Un calendario simple en `/mentorias` que consulta `mentoria_slots` en Supabase (solo slots con `is_booked = false`).
2. Al seleccionar un horario, el usuario paga vía Stripe.
3. Tras el pago confirmado (webhook), se crea el registro en `mentoria_bookings` y se marca el slot como reservado.
4. Confirmación automática por email (Resend, vía n8n).

Para el MVP, los slots pueden crearse manualmente (Carla los agrega en Supabase cada semana) — no hace falta sincronización automática con Google Calendar en la primera versión.

---

## 8. MIGRACIÓN DE CONTENIDO — qué ya existe y dónde vive

| Contenido | Estado actual | Acción |
|---|---|---|
| Copy de Home, Mi Historia, Mentorías | Ya escrito y probado en WordPress/Bricks | Migrar tal cual al nuevo Next.js, sin reescribir |
| Lógica y copy del Diagnóstico (8 preguntas, 8 arquetipos) | Funcionando en JS vanilla dentro de Bricks | Portar la misma lógica a un componente React |
| 4 blog posts (3 nuevos + 1 reutilizado) | Contenido completo ya redactado | Insertar como filas en `blog_posts` |
| Meta tags de Home/Mi Historia/Mentorías/Blog/Diagnóstico | Ya redactados | Aplicar como metadata de Next.js (`generateMetadata`) |
| Las 8 secuencias de email por arquetipo + secuencia de newsletter (4 emails) | Redactadas para FluentCRM | Reutilizar el copy, solo cambia el motor de envío (Resend en vez de FluentCRM) |

---

## 9. ROADMAP DE MIGRACIÓN POR FASES

**No migres todo de una vez.** Orden recomendado, de mayor a menor prioridad de negocio:

### Fase 1 — Lo que bloquea el lead capture (prioridad máxima)
- Página Home + Mi Historia + Diagnóstico Next You (con Supabase + n8n + Resend funcionando de punta a punta)
- Flujo 1 (n8n) completo y probado

### Fase 2 — Blog y SEO
- Archivo de blog + template de post individual
- Los 4 posts migrados
- Flujo 2 (newsletter) completo

### Fase 3 — Mentorías y pagos
- Página de Mentorías + sistema de agendamiento propio + Stripe
- Flujos 3 y 4 (n8n)

### Fase 4 — Corte definitivo
- Redirecciones 301 de las URLs viejas de WordPress a las nuevas (si cambian slugs)
- Apagar WordPress/Bricks/FluentCRM solo después de confirmar que las 3 fases anteriores funcionan en producción sin errores durante al menos 1-2 semanas

---

## 10. ENTREGABLES ESPERADOS DEL AGENTE

1. Repositorio Next.js con las páginas de la Fase 1 funcionando localmente.
2. Esquema de Supabase aplicado (las tablas de la sección 4).
3. Los workflows de n8n de la Fase 1 (Flujo 1) configurados y documentados.
4. Variables de entorno documentadas (`.env.example`) para Supabase, Resend, Stripe, n8n.
5. Confirmación de que el Diagnóstico Next You funciona de punta a punta en un entorno de prueba antes de tocar producción.

---

*Nota final: pide al agente que trabaje fase por fase, con tu validación entre cada una — no que intente migrar todo el sitio en una sola sesión. Es la misma lógica de "no necesitas tenerlo todo resuelto para comenzar" aplicada a tu propia migración técnica.*
