# PROMPT — Agente de Código: "Diagnóstico Next You" en WordPress + Bricks + FluentCRM

*Copia y pega este documento completo como instrucción inicial para tu agente de código (Claude Code u otro con acceso a tu instalación de WordPress). Sustituye al enfoque Next.js/Airtable — se integra directo con el stack que ya tienes en carlamontano.io.*

---

## ROL Y OBJETIVO

Construye el **"Diagnóstico Next You"**, el lead magnet principal de Reiniciar Sin Mapa / NEXT YOU™, como una página autocontenida dentro de un sitio **WordPress con Bricks Builder**, capturando los leads **directo en FluentCRM** (ya instalado) — con tag automático por arquetipo/pilar prioritario, para que las automatizaciones de nutrición por email ya existentes en FluentCRM se disparen sin pasos manuales ni intermediarios externos.

**No usar** Airtable, Zapier, Make ni Next.js — todo vive dentro del mismo WordPress, lo cual es más simple, más rápido y no depende de servicios de terceros de pago adicionales.

---

## ARQUITECTURA RECOMENDADA (y por qué)

```
Página de Bricks (/diagnostico-next-you)
   └── Bloque "Code" / HTML personalizado
         └── App del quiz en HTML + CSS + JS vanilla (un solo archivo, sin frameworks)
               └── Al terminar: fetch() a un endpoint REST propio de WordPress
                     └── wp-json/nextyou/v1/quiz-submit  (function.php o mu-plugin)
                           └── Llama a la API de FluentCRM (dentro del mismo WordPress):
                                 • Crea o actualiza el contacto (nombre + email)
                                 • Aplica un tag según el pilar prioritario (ej. "diagnostico-mentalidad")
                                 • Guarda los puntajes de los 8 pilares como campos personalizados
                           └── FluentCRM dispara la automatización ya configurada para ese tag
```

**Por qué este enfoque y no Next.js + Airtable:**
- Cero dependencias nuevas de pago — todo corre en el hosting que ya tienes.
- FluentCRM recibe el lead con el tag correcto **en el mismo request**, no en un paso posterior — la automatización arranca de inmediato.
- Bricks solo se usa para alojar la página; toda la lógica del quiz vive en JS vanilla dentro de un bloque de código, evitando pelear con las limitaciones de Bricks para lógica condicional multi-paso.

---

## ESPECIFICACIÓN FUNCIONAL (idéntica a la versión anterior — no cambiar)

### Flujo
```
Portada del quiz (promesa + CTA "Empezar")
   ↓
8 preguntas, una por pantalla, barra de progreso visible
   ↓
Captura — Nombre + Email ("Ya casi tienes tu resultado")
   ↓
Resultado — Arquetipo + pilar prioritario + descripción + CTA a Comunidad Next You
```

### Las 8 preguntas y puntaje (1 = pilar resuelto, 4 = pilar es la mayor fricción)

1. **Mentalidad** — "Cuando piensas en cambiar de rumbo profesional, ¿qué es lo primero que sientes?"
   Confianza (1) · Curiosidad con duda (2) · Miedo a fallar otra vez (3) · Culpa por no haberlo hecho antes (4)
2. **Dirección** — "¿Qué tan clara tienes tu próxima meta profesional?"
   Muy clara (1) · Idea general (2) · Varias ideas, no sé cuál elegir (3) · Ninguna idea todavía (4)
3. **Tecnología e IA** — "¿Cómo describirías tu relación con la tecnología y la IA hoy?"
   La uso a mi favor (1) · La uso poco, quiero aprender más (2) · Me intimida (3) · La evito por completo (4)
4. **Empleabilidad** — "¿Qué tan preparado(a) sientes tu perfil profesional hoy?"
   Listo para postular (1) · Necesita ajustes (2) · Desactualizado hace tiempo (3) · No sé por dónde empezar (4)
5. **Inglés profesional** — "¿Cómo te sientes usando inglés en un contexto laboral?"
   Lo domino (1) · Cómodo con margen de mejora (2) · Me pongo nervioso/a (3) · Es una barrera real (4)
6. **Productividad** — "¿Qué tan bien organizas tu tiempo entre trabajo, familia y tu crecimiento?"
   Tengo un sistema (1) · Voy resolviendo semana a semana (2) · El tiempo se me escapa (3) · No encuentro tiempo para mí (4)
7. **Bienestar** — "¿Cómo está tu energía/salud mientras persigues este cambio?"
   Cuido mi descanso (1) · Podría cuidarme más (2) · Cansado/a la mayoría del tiempo (3) · Agotado/a, al límite (4)
8. **Comunidad** — "¿Con quién cuentas hoy para acompañarte en este proceso?"
   Red de apoyo sólida (1) · 1-2 personas cercanas (2) · Casi siempre solo/a (3) · Completamente solo/a (4)

### Arquetipos (pilar de mayor puntaje gana; empate → el primero en esta lista)

| Pilar | Arquetipo | Tag de FluentCRM a aplicar |
|---|---|---|
| Mentalidad | La Reinventora Silenciosa | `diagnostico-mentalidad` |
| Dirección | La Multipotencial Atascada | `diagnostico-direccion` |
| Tecnología e IA | La Analógica en Transición | `diagnostico-tecnologia` |
| Empleabilidad | La Profesional Invisible | `diagnostico-empleabilidad` |
| Inglés profesional | La Migrante en Pausa | `diagnostico-ingles` |
| Productividad | La Ocupada Sin Avance | `diagnostico-productividad` |
| Bienestar | La Guerrera Agotada | `diagnostico-bienestar` |
| Comunidad | La Reinventora en Solitario | `diagnostico-comunidad` |

*(Descripciones de cada arquetipo: reusar el texto ya redactado en la versión anterior del prompt — no repetir aquí para no duplicar contenido, pero el agente debe usarlas tal cual.)*

CTA final del resultado: **"Únete a la Comunidad Next You"** (destino: página de membresía paga).

---

## IMPLEMENTACIÓN TÉCNICA PASO A PASO

### 1. Frontend — bloque de código en Bricks
- Crear una página nueva en Bricks: `/diagnostico-next-you`.
- Insertar un elemento **"Code"** (HTML personalizado) que contenga el quiz completo: HTML + `<style>` + `<script>` en un solo bloque, sin dependencias externas de JS (vanilla).
- Usar los tokens de diseño de marca ya definidos (tinta `#14192B`, papel `#EDE6D8`, terracota `#BE5A34`, salvia `#6E7F5C`, ocre `#C9A227`; tipografías Fraunces/Inter/IBM Plex Mono vía Google Fonts).
- Mobile-first, barra de progreso, una pregunta por pantalla.
- Al completar la captura de email, hacer:
```js
fetch('/wp-json/nextyou/v1/quiz-submit', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({ name, email, scores, archetype, tag })
})
```

### 2. Backend — endpoint REST personalizado
Crear un **mu-plugin** (o plugin propio activado) con:
- Registro de la ruta `nextyou/v1/quiz-submit` vía `register_rest_route()`.
- Validación básica de email y datos recibidos (sanitizar con `sanitize_email()`, `sanitize_text_field()`).
- Verificación de que **FluentCRM esté activo** (`function_exists('FluentCrmApi')` o equivalente según la versión instalada — el agente debe confirmar el método correcto revisando la documentación/código de FluentCRM instalado, ya que la API interna puede variar entre versiones).
- Usar la API interna de FluentCRM para:
  - Crear o actualizar el contacto por email.
  - Aplicar el tag correspondiente al arquetipo (tabla de arriba).
  - Guardar los 8 puntajes como campos personalizados del contacto (custom fields), para poder segmentar más adelante si se desea.
- Responder `200 OK` con un JSON simple de confirmación para que el frontend muestre la pantalla de resultado.

### 3. Configuración en FluentCRM (fuera del código, pero documentar los pasos)
- Crear los 8 tags listados arriba si no existen.
- Crear (o confirmar que ya existen) 8 automatizaciones — una por tag — que empiecen con un email de bienvenida específico al pilar detectado y terminen invitando a la Comunidad Next You.
- Confirmar que el campo personalizado para guardar puntajes esté creado en FluentCRM antes de que el endpoint intente escribir en él.

---

## ENTREGABLES ESPERADOS

1. Código completo del bloque HTML/CSS/JS del quiz, listo para pegar en el elemento "Code" de Bricks.
2. Código del mu-plugin (o plugin) con el endpoint REST y la integración a FluentCRM.
3. Lista clara de los 8 tags y 8 custom fields que hay que crear manualmente en FluentCRM antes de activar (con nombres exactos, para copiar/pegar sin ambigüedad).
4. Instrucciones de dónde pegar cada pieza de código (qué archivo, qué página de Bricks).
5. Registro de qué versión/API de FluentCRM se usó, para poder depurar si una actualización futura del plugin cambia esa API.

---

## CHECKLIST DE QA

- [ ] El quiz funciona completo en móvil (375px) dentro de la página real de Bricks, no solo en aislamiento.
- [ ] Al enviar el formulario, el contacto aparece en FluentCRM con el tag correcto.
- [ ] Los 8 puntajes quedan guardados como campos personalizados del contacto.
- [ ] La automatización de FluentCRM correspondiente se dispara sin intervención manual.
- [ ] El CTA final de la pantalla de resultado apunta a la página de Comunidad/Membresía.
- [ ] El endpoint rechaza correctamente emails inválidos o solicitudes malformadas (no debe crear contactos basura en FluentCRM).
- [ ] Se probó al menos un envío real de punta a punta antes de considerar esto terminado.

---

*Nota: pide al agente que primero te muestre el HTML/CSS/JS del quiz como prototipo aislado (abrible en el navegador sin WordPress) para que valides el diseño y el copy, y solo después conecte el endpoint con FluentCRM — así evitas iterar sobre diseño dentro del entorno de WordPress, que es más lento de probar.*
