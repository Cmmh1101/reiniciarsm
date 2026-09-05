# SECUENCIA DE BIENVENIDA — Newsletter General
## Reiniciar Sin Mapa / NEXT YOU™

*Reemplaza el email único "Bienvenida a tu nuevo camino tech" por esta secuencia de 4 emails. Este flujo es para suscriptores del newsletter general (no pasaron por el Diagnóstico), así que no asumimos ningún pilar prioritario — presentamos la marca completa progresivamente.*

**Automatización sugerida en FluentCRM:**
```
Newsletter signup (New Form Submission)
   ↓
Apply List: Newsletter
   ↓
Apply Tag: newsletter-general
   ↓
Email 1 — inmediato
   ↓ (esperar 2 días)
Email 2
   ↓ (esperar 3 días)
Email 3
   ↓ (esperar 4 días)
Email 4 — invitación a Comunidad
```

---

## EMAIL 1 — Bienvenida (envío inmediato)

**Asunto:** Ya estás dentro. Esto es lo que va a pasar ahora
**Preheader:** No necesitas tener todo resuelto para comenzar.

```
Hola [nombre],

Gracias por estar aquí.

Mi nombre es Carla Montaño. Fui mesera sin hablar inglés en mi primer
trabajo en Estados Unidos. Después limpié casas, cuidé bebés, trabajé
en un gimnasio y en un comedor escolar. Hoy trabajo remoto como
Software Engineer, sin título en tecnología, y ayudo a otras personas
a reconstruir su carrera desde cero.

No te cuento esto para impresionarte. Te lo cuento porque si sientes
que tu vida profesional ya no te representa, quiero que sepas algo
desde el primer día: no necesitas tener todo resuelto para empezar
a cambiarla.

Esto es Reiniciar Sin Mapa.

En los próximos días te voy a mandar:
— La historia completa detrás de este movimiento (y por qué no es
  un discurso motivacional, es un método).
— Los 8 pilares que sostienen cualquier reinvención profesional real.
— Una invitación a la Comunidad Next You, si quieres dejar de hacer
  esto sola/o.

Por ahora, solo una pregunta: ¿qué parte de tu vida profesional
sientes que ya no te representa? Contéstame este email — leo todas
las respuestas.

Carla
```

---

## EMAIL 2 — La historia (día 2)

**Asunto:** "Educadora, latina, mujer, mamá... imposible"
**Preheader:** Así es como me sentía. Estaba equivocada.

```
Hola [nombre],

Durante casi 2 años me repetí la misma frase cada vez que intentaba
aprender tecnología: "educadora, latina, mujer, mamá... imposible."

Aprendía un poco de HTML y CSS. Dudaba. Paraba. Volvía a intentar
meses después. Ese ciclo duró de 2019 a 2021.

Lo que lo rompió no fue sentir menos miedo. Fue un fin de semana
como voluntaria en un evento llamado GiveCamp, construyendo una
página web para una organización sin fines de lucro. No solo aporté
al equipo — terminé liderándolo. Ese resultado real fue la primera
prueba de que sí era posible.

Meses después entré a un bootcamp de programación mientras trabajaba
tiempo completo como profesora y era mamá de tres. Dormía de 1am a
5am durante 6 meses. En septiembre de 2021 conseguí mi primer trabajo
remoto como Software Engineer.

Te cuento esto porque el "imposible" que tú te estás diciendo hoy —
sea cual sea— probablemente también es una creencia, no un hecho.

Mañana te cuento qué hice distinto para que ese ciclo de intentar y
parar finalmente se rompiera.

Carla
```

---

## EMAIL 3 — El método (día 5)

**Asunto:** Los 8 pilares que sostienen cualquier reinicio real
**Preheader:** No es solo mentalidad. Es esto.

```
Hola [nombre],

Uno de los errores más comunes al intentar reinventarte es pensar
que todo se resuelve con "mentalidad positiva". La mentalidad importa,
pero sola no sostiene nada.

Después de reiniciar mi vida profesional varias veces —migrando de
país, cambiando de carrera, volviendo a empezar— identifiqué 8 áreas
que tienen que moverse juntas. Le llamo NEXT YOU™:

1. Mentalidad — la creencia de que sí es posible
2. Dirección — saber hacia dónde, aunque sea de forma imperfecta
3. Tecnología e IA — las herramientas del momento en que vivimos
4. Empleabilidad — hacer visible lo que ya sabes hacer
5. Inglés profesional — cuando aplica, dejar de ser una barrera
6. Productividad — sostener el cambio sin sacrificar tu vida
7. Bienestar — que reiniciar no te cueste tu salud
8. Comunidad — no hacerlo sola/o

Si quieres saber cuál de estos 8 pilares es tu prioridad ahora mismo,
te dejo un diagnóstico corto y gratuito aquí: [enlace al Diagnóstico
Next You]

En el próximo email te cuento cómo se ve esto puesto en práctica,
dentro de una comunidad real.

Carla
```

---

## EMAIL 4 — Invitación a la Comunidad (día 9)

**Asunto:** No vas a reiniciar sola
**Preheader:** Así es una semana dentro de la Comunidad Next You.

```
Hola [nombre],

Llevas unos días conmigo y ya conoces mi historia y el método detrás
de Reiniciar Sin Mapa. Hoy quiero contarte dónde vive todo esto en
la práctica: la Comunidad Next You.

No es un grupo de Facebook silencioso ni un curso grabado que nadie
termina. Así se ve una semana adentro:

— Lunes: planteo la intención de la semana, ligada a un pilar
  específico y un micro-reto concreto.
— Miércoles: check-in con tu accountability partner del mes.
— Viernes: compartimos avances en el Muro de Victorias — grandes o
  pequeños, todos cuentan.
— Una vez al mes: sesión en vivo conmigo, profundizando un pilar.

Dentro hay personas que hoy mismo están donde tú podrías estar en
seis meses. Y otras que están exactamente donde tú estás ahora.

Si sientes que ya no quieres intentar esto sola/o, te dejo la puerta
abierta aquí: [enlace a la Comunidad Next You]

No necesitas tener todo resuelto para entrar. Solo el siguiente paso.

Carla
```

---

## NOTAS DE IMPLEMENTACIÓN

- **Personalización `[nombre]`**: usar el campo de nombre de FluentCRM; si el formulario de newsletter no captura nombre, cambiar a un saludo genérico cálido ("Hola,") en vez de forzar "Hola [nombre]" vacío.
- **Email 2 y 3 dependen del Banco de Historias** ya documentado — si en el futuro quieres rotar esta secuencia con otras historias (el bootcamp, el regreso a Venezuela), ese documento ya tiene el material listo.
- **Diferencia clave con la secuencia del Diagnóstico**: esta secuencia NO conoce el pilar prioritario del suscriptor, por eso el CTA final es a la Comunidad en general, no personalizado por arquetipo. Si más adelante quieres cruzar datos (alguien se suscribe al newsletter y después hace el Diagnóstico), FluentCRM puede aplicar el tag de pilar sobre el mismo contacto sin conflicto.
- **Frecuencia de envío regular después de esta secuencia**: una vez terminados los 4 emails, el contacto debería entrar al newsletter semanal regular (el que ya tienes funcionando), no quedar suelto sin más comunicación.
