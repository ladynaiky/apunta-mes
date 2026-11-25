# Apunta+ · CLAUDE.md

Este archivo tiene dos partes. La **parte 1** son las instrucciones originales del grupo, copiadas sin cambios. La **parte 2** recoge las decisiones aprobadas después. Si las dos no coinciden, **manda la parte 2**.

---

# PARTE 1 · Instrucciones del proyecto (originales)

## 0. Reglas de trabajo (obligatorias en toda la sesión)
- Háblame siempre en castellano. Somos un grupo de un curso de UX/UI: explica las decisiones técnicas de forma clara y breve.
- NO hagas ningún cambio sin mi consentimiento explícito. Eso incluye crear, editar o borrar archivos, instalar paquetes, ejecutar comandos que modifiquen algo, hacer git commit o push, y crear o configurar servicios (MongoDB Atlas, Render). Leer y explorar sí puedes.
- Antes de cada cambio, dime qué vas a hacer, en qué archivos y por qué, y espera mi «OK».
- Trabaja por fases. Al terminar cada fase, dame un resumen, cómo probarlo y cuál es el siguiente paso. Después, para y espera.
- Si algo es ambiguo o el diseño se contradice, pregúntame en vez de suponer. Agrupa las preguntas, numéralas y añade tu recomendación en cada una.
- Secretos (URI de MongoDB, secreto de JWT): nunca en el código ni en commits. Usa .env, .env.example y .gitignore. Las claves las escribo yo.
- Antes de instalar nada, dime qué versiones vas a usar (versiones estables actuales).

## 1. Qué es Apunta+
Agenda escolar digital: el alumnado apunta tareas, exámenes, excursiones y aniversarios, y los ve en un calendario. La interfaz está en catalán y está diseñada para Android, a 412 × 892 dp (hay que probarla también a 360 dp).
En esta primera versión solo hay alumnado. El registro guarda un rol, pero la app funciona igual para todos los roles.

## 2. Fuentes de diseño
- Design (Alta fidelitat): https://claude.ai/artifact/5H9N23VZZNuTvPSPTmeUMy
- Design System: https://claude.ai/artifact/VM7DnKfQr83Afa1AJgQF15
- Lee los dos enteros antes de proponer nada. Si no puedes abrir los enlaces, dímelo y los exportaremos en HTML a la carpeta design/.
- Prioridad entre los dos:
  - El Design System sigue en media fidelidad (grises, Roboto Flex). La Alta fidelitat MANDA en colores y tipografía.
  - Del Design System toma los nombres de tokens, el espaciado, las formas, la elevación, el movimiento, la iconografía, los estados, la accesibilidad y el tono de los textos.
  - Cualquier otra contradicción, pregúntamela.
- Muchas mesas de trabajo son variantes de una misma pantalla. No las dupliques:
  - «· des d'Inici / des de Calendari / des d'Exàmens…»: es la misma pantalla con otro origen. «Enrere» vuelve al origen y, si viene del calendario, la fecha llega ya puesta.
  - «Tasca del dia 4/6/13/17/20 de novembre»: es la misma pantalla con otros datos.
  - «Compartir · des de X»: es el mismo flujo de compartir abierto desde varias pantallas.
  - «(buit)» y «(error)»: son estados de la pantalla, no pantallas aparte.
  - Propón la lista real de pantallas y rutas.
- Algunas pantallas no tienen acceso desde la navegación del diseño (Checklist, Marcar tasca feta, Personalització, Sincronitzar…). Propón cómo llegar a cada una y pregúntame.
- Reglas de la alta fidelidad que hay que respetar:
  - Tipografías: Nunito para títulos y Roboto para textos.
  - Solo tema claro. Sin modo oscuro y sin opción «Aparença».
  - El rojo de error se usa solo para errores.
  - El verde de marca del logotipo es el mismo que el del FAB.
  - Las casillas de verificación son cuadradas (MD3).
  - En las pantallas Apuntar, el aviso va en una sola fila, «Avisa'm abans · 1 dia abans · 08:00», que abre una hoja inferior para elegir días y hora.
  - Colores de asignatura: Castellà #CC5500, Català #B08800, Anglès #9A6ADE, Socials #2E8540, Plàstica #00879A, Música #D02670, Mates #1F4FB8. Solo se usan en el punto de la fila, en los puntos del calendario y en la muestra del selector. El nombre de la asignatura siempre va escrito.
  - Accesibilidad: zona táctil mínima de 48 dp, aria-label en los botones de icono, contraste AA y foco visible.
  - Iconos: Material Symbols Rounded, como indica el Design System (no Ionicons).
  - Textos de la interfaz exactamente como en el diseño.

## 3. Stack (ya decidido)
- Un solo repositorio, apunta-mes/, con backend/ y frontend/.
- Backend: NestJS + Mongoose + MongoDB Atlas. Se desplegará en Render como Web Service. API documentada con Swagger/OpenAPI.
- Frontend: Ionic + Angular + Capacitor (Android), en modo md. Tema con variables CSS creadas a partir de los tokens.
- Si Ionic no da un resultado aceptable, rehremos el frontend en nativo. Por eso la API no puede depender de nada del frontend.
- Código y nombres internos en inglés. Textos de la interfaz en catalán, todos reunidos en un solo sitio.

## 4. Autenticación (email y contraseña)
- Registre: Nom, Rol (Alumne / Pares / Profe; se guarda, pero no cambia nada), Correu electrònic, Contrasenya (mínimo 8 caracteres) y Repeteix la contrasenya. Al terminar va a «Compte creat».
- Iniciar sessió: correo y contraseña, que llevan a Inici. Enlace «Registra't».
- Backend:
  - contraseñas con hash (bcrypt);
  - JWT con caducidad;
  - un guard que proteja las rutas;
  - cada usuario solo ve sus propios datos;
  - correo único.
- Validaciones con los mismos mensajes que el diseño, por ejemplo «Format de correu no vàlid (ex.: nom@exemple.cat).» o «Ha de tenir almenys 8 caràcters.». Los mensajes que no estén en el diseño (por ejemplo, credenciales incorrectas) propónmelos con el tono del Design System: qué ha pasado y qué hacer.
- Frontend: propón dónde guardar el token de forma segura, protege las rutas y propón dónde va «Tancar la sessió» si no aparece en el diseño.

## 5. Datos mock
Esto es una propuesta inicial. Revísala contra los campos reales de las pantallas y propón cambios antes de programar.
- Fecha «de hoy» para la demo: dimecres 4 de novembre de 2026, configurable desde una variable de entorno para que las pantallas coincidan con el diseño. Pregúntame cómo pasar a la fecha real.
- Entidades:
  - User: name, email, passwordHash, role (student | parent | teacher), createdAt.
  - Subject: user, name, colorToken, colorHex. ¿Se crean las 7 asignaturas por defecto al registrarse? Pregúntamelo.
  - Entry, con type task | exam | trip | birthday. Campos comunes: user, title, date, notes y reminder (daysBefore, time).
    - task: subject, done, doneAt, steps (para Checklist).
    - exam: subject, topics.
    - trip: place, whatToBring.
    - birthday: personName, se repite cada año.
  - Solo mock, sin lógica real: Contact (Compartir), ShareLink (Generar enllaç), AiSuggestion (pantalla IA), SyncStatus (Sincronitzar), Preferences (Personalització).
- Script de carga con un usuario de demo y datos repartidos por noviembre de 2026 (con los días 4, 6, 13, 17 y 20 del diseño), más una forma de reiniciarlo. Enséñame los datos antes de crearlos.
- Propón también una forma de forzar los estados vacío y error en modo demo, para poder enseñarlos.

## 6. Fases (para al final de cada una y espera mi OK)
0. Lectura y preguntas. Sin cambios.
1. Repositorio base: estructura, .gitignore, .env.example y CLAUDE.md con este documento más las decisiones que aprobemos.
2. Backend: autenticación, modelos, script de datos mock y Swagger. Guíame paso a paso para crear el clúster de Atlas (las cuentas las creo yo).
3. Frontend base: Ionic Angular + Capacitor, tema con tokens, tipografías, iconos y componentes compartidos del Design System.
4. Acceso: Iniciar sessió, Registre y Compte creat, conectadas a la API.
5. Nivel 1: Inici, Calendari, Tasques, IA y El meu espai, con la barra de navegación y el FAB.
   → PUNTO DE CONTROL: compara Inici y Calendari con la alta fidelidad, lista las diferencias y decidimos si seguimos con Ionic o pasamos a nativo.
6. Niveles 2 y 3:
   - Calendari setmanal/mensual, Exàmens, Excursions, Historial, Tasca d'avui/setmanal, Llistat de tasques;
   - Checklist, Marcar tasca feta;
   - Apuntar (tasca, examen, excursió, aniversari) y sus pantallas de «creat»;
   - Triar el dia, Crear nova assignatura, Personalització, Avís de pendents, Sincronitzar.
7. Flujos que atraviesan varias pantallas:
   - Buscar/Filtrar;
   - Compartir (Privacitat, Compartir tasques, Generar enllaç, Compartir enllaç);
   - todos los estados vacío y error.
8. Despliegue: backend en Render + Atlas, guiándome paso a paso.

---

# PARTE 2 · Decisiones aprobadas (fase 0, 23/11/2026)

## 2.1 Contradicciones del diseño
1. **Badge de pendientes en coral `#C4432B`** (token `color.warning-badge`, texto blanco). Es un aviso, no un error: el rojo `#BA1A1A` queda solo para errores.
2. **Chip «Prioritat alta»**: fondo `#FFDBCE`, texto `#6B2400` (tokens `color.priority-container` / `color.on-priority-container`).
3. **Las medidas siguen Material 3.** Los colores y las tipografías siguen siendo los de la alta fidelidad.
   - Botón principal a ancho completo: `button/filled` M de 56 dp, etiqueta `title-medium` 500. El resto de botones, S de 40 dp con zona táctil de 48.
   - Navigation bar: 64 dp, indicador de 56 × 32, icono relleno (FILL 1) y etiqueta `label-medium-emphasized` en la pestaña activa.
   - Título de los estados vacíos: `title-large` 22/28, en Nunito.
   - List items de 56 dp (una línea) y 72 dp (dos líneas). Los accesos con chevron son `list-item` de navegación.
   - Celdas del calendario mensual de 56 dp (círculo de 40) y del date picker de 48. Badge de 16 dp con `label-small`. FAB con esquina de 16 dp.
4. **Datos coordinados:**
   - Mates: examen de fraccions el **13 de novembre**;
   - Català: examen el **17**;
   - Socials: excursión el **20**;
   - Anglès: redacción para el 6;
   - la IA dice «el 13 de novembre tens examen de Mates»;
   - «Examen creat» muestra el examen que se acaba de crear.

## 2.2 Respuestas a las 14 preguntas
1. **Fecha de la demo**: `DEMO_TODAY` en el backend, que la expone en `GET /api/config`. Si está vacía, se usa la fecha real. El frontend nunca usa `new Date()` para el «hoy»: lo pide al backend.
2. Al registrarse se crean **las 7 asignaturas** con sus colores. «Crear nova assignatura» añade más.
3. El badge coral se mantiene (ver 2.1).
4. El chip de prioridad se guarda como token (ver 2.1).
5. Las medidas siguen MD3 (ver 2.1).
6. Los datos quedan coordinados (ver 2.1).
7. **Token**: `@capacitor/preferences` en Android y `localStorage` en la web. JWT de 7 días, sin refresh token. Si la API responde 401, se cierra la sesión y aparece «La sessió ha caducat. Torna a iniciar sessió.».
8. **Tancar la sessió**: fila al final de El meu espai. Abre un diálogo con «Vols tancar la sessió?» y los botones «Cancel·lar» / «Tancar la sessió».
9. **Mensajes nuevos**:
   - credenciales incorrectas: «El correu o la contrasenya no són correctes. Revisa-ho i torna-ho a provar.»;
   - correo ya registrado: «Aquest correu ja té un compte. Inicia sessió o fes servir un altre correu.»;
   - sesión caducada: «La sessió ha caducat. Torna a iniciar sessió.».
10. **Estados vacío y error en la demo**: si `DEMO_MODE=true`, el backend acepta la cabecera `X-Demo-State: empty|error`. El frontend la envía desde un ajuste de demo en El meu espai, o desde la URL con `?demo=empty|error`.
11. **Accesos que faltan**: Checklist y Marcar tasca feta, con dos filas nuevas en Tasques («Obrir la checklist», «Marcar tasques fetes»). Personalització, Sincronitzar y Avís de pendents, desde las pestañas de El meu espai.
12. **Reinicio de los datos**: `npm run seed` (borra y vuelve a crear el usuario de demo) y `POST /api/demo/reset`, este último solo en modo demo. Usuario de demo: `demo@apunta.cat`, con la contraseña en `.env`.
13. **`design/`**: copia de referencia del diseño (ver `design/README.md`). Los enlaces de la parte 1 siguen siendo la fuente de verdad.
14. **Git**: el repositorio está inicializado. Ni commit ni push sin el OK del grupo.

## 2.3 Pantallas y rutas (30 pantallas reales)
- `· des de X` se convierte en `?from=x`, y «Enrere» vuelve al origen.
- Los días son un parámetro.
- `(buit)` y `(error)` son estados de la pantalla.

| Pantalla | Ruta | Variantes / estados |
|---|---|---|
| Iniciar sessió | `/login` | — |
| Registre | `/register` | — |
| Compte creat | `/register/done` | — |
| Inici | `/tabs/home` | hoja inferior de tarea (ver, editar, esborrar + snackbar), menú del FAB |
| Calendari (semana) | `/tabs/calendar` | — |
| Tasques | `/tabs/tasks` | — |
| IA | `/tabs/ai` | — |
| El meu espai | `/me` | pestañas Avisos / Compartir / Personalitzar / Contactes |
| Calendari setmanal/mensual | `/calendar/month` | buit, error |
| Tasques del dia | `/calendar/day/:date` | «Dia sense tasques» (buit) |
| Exàmens | `/exams` | buit, error |
| Excursions | `/trips` | buit, error |
| Historial de tasques | `/tasks/history` | buit |
| Tasca d'avui/setmanal | `/tasks/today` | Avui / Setmana |
| Llistat de tasques | `/tasks/list` | buit, error |
| Checklist | `/tasks/checklist` | buit |
| Marcar tasca feta | `/tasks/mark-done` | buit |
| Apuntar | `/new/:type` (task, exam, trip, birthday) | hoja «Avisa'm abans», date picker |
| … creat/creada | `/new/:type/done/:id` | — |
| Triar el dia | modal (date picker) | — |
| Crear nova assignatura | `/subjects/new` | — |
| Personalització | `/me/customize` | — |
| Avís de pendents | `/me/reminders` | buit |
| Sincronitzar | `/me/sync` | — |
| Buscar/Filtrar | `/search` | buit, error |
| Tasca trobada | `/search/results` | — |
| Compartir | `/share` | — |
| Compartir/Privacitat | `/share/privacy` | — |
| Compartir tasques | `/share/tasks` | — |
| Generar enllaç | `/share/link` | — |
| Compartir enllaç | `/share/link/copied` | — |

## 2.4 Modelo de datos
- **User**: `name, email (único), passwordHash, role (student|parent|teacher), createdAt`.
- **Subject**: `user, name, colorToken (taronja|groc|lila|verd|turquesa|rosa|blau), colorHex`.
- **Entry** (común): `user, type (task|exam|trip|birthday), title, date, notes, reminder {daysBefore: 0|1|2|3|7, time "HH:mm"}, priority ('high'|null), shared (bool), createdAt`.
  - **task**: `subject, page, done, doneAt, steps[] {name, done}`.
  - **exam**: `subject, topic, examType (written|oral|project → «Escrit/Oral/Treball»), toStudy, done`.
  - **trip**: `place, departureTime, returnTime, whatToBring[] {name, done}`. La Checklist usa esta lista.
  - **birthday**: `personName, age, relation (family|class|friend → «Família/De classe/Amic/ga»), giftIdeas`. Se repite cada año.
- **Solo mock**:
  - `Preferences {groupBy, markWith, visibleTags[]}`;
  - `Contact {user, name, emailOrPhone, role}`;
  - `SyncStatus {lastSyncAt}`;
  - `ShareLink {scope, url}`;
  - `AiConversation`: guion fijo.

## 2.5 Endpoints (prefijo `/api`, Swagger en `/api/docs`)
Todos llevan JWT, salvo auth, config y health.
- `POST /auth/register` · `POST /auth/login` · `GET /auth/me`
- `GET/POST /subjects` · `PATCH/DELETE /subjects/:id`
- `GET /entries?type=&from=&to=&subject=&q=&done=` · `POST /entries` · `GET/PATCH/DELETE /entries/:id` · `PATCH /entries/:id/done`
- `GET /calendar?month=YYYY-MM` · `GET /entries/today` · `GET /entries/week` · `GET /entries/history?year=&month=` · `GET /reminders`
- `GET/PUT /preferences` · `GET/POST/PATCH/DELETE /contacts` · `POST /share-links` · `GET/POST /sync` · `GET /ai/conversation`
- `GET /config` · `GET /health` · `POST /demo/reset` (solo en modo demo)

## 2.6 Tokens de alta fidelidad (solo tema claro)
Los nombres siguen el Design System y los valores son los de la alta fidelidad. En CSS: `--color-primary`, etc.

| Token | Valor | Uso |
|---|---|---|
| `color.surface` | `#FFFBF0` | Fondo de pantalla |
| `color.on-surface` | `#1C1B1B` | Texto principal |
| `color.on-surface-variant` | `#434844` | Texto secundario, iconos |
| `color.primary` | `#1E5739` | Botón principal, foco de campo |
| `color.on-primary` | `#FFFFFF` | — |
| `color.primary-container` (FAB, logotipo, «Feta») | `#387050` | Verde de marca |
| `color.on-primary-container` | `#F4F6F3` | — |
| `color.secondary-container` (indicador de nav., opción elegida) | `#F6C945` | — |
| `color.on-secondary-container` | `#6D5400` | Icono activo |
| `color.secondary` (etiqueta activa, anillo de foco) | `#755B00` | — |
| `color.surface-container` (navigation bar) | `#E0E3DF` | — |
| `color.surface-container-high` (accesos, campos) | `#F1EDEC` | — |
| `color.outline` | `#747874` | Bordes de control |
| `color.outline-variant` | `#C4C7C3` | Divisores |
| `color.error` / `on-error` | `#BA1A1A` / `#FFFFFF` | Solo errores |
| `color.error-container` / `on-error-container` | `#FFDAD6` / `#93000A` | Banner de borrado |
| `color.warning-badge` | `#C4432B` | Badge de pendientes |
| `color.priority-container` / `on-priority-container` | `#FFDBCE` / `#6B2400` | «Prioritat alta» |
| `color.inverse-surface` / `inverse-on-surface` | `#313030` / `#F4F0EF` | Snackbar |

Asignaturas: `color.castella` #CC5500 · `color.catala` #B08800 · `color.angles` #9A6ADE · `color.socials` #2E8540 · `color.plastica` #00879A · `color.musica` #D02670 · `color.mates` #1F4FB8. Siempre con un anillo interior de 1 dp en `color.outline`.

- **Tipografía**: Nunito en los títulos (top app bar, cabeceras, estados vacíos) y Roboto en el resto, con la escala MD3 del Design System.
- **Espaciado, formas, elevación, movimiento y estados**: los del Design System.
- **Iconos**: Material Symbols Rounded.

## 2.7 Versiones (comprobadas el 23/11/2026; volver a comprobar antes de instalar)
- Node 26
- NestJS 12.6, @nestjs/mongoose 12, Mongoose 9.12, @nestjs/swagger 12, @nestjs/jwt 12, passport-jwt 4, bcrypt 6, class-validator 0.15
- Angular 22.3, Ionic 9.0, Capacitor 8.6, @capacitor/preferences 8

## 2.7b Notas técnicas
- El backend es **ESM**: los imports relativos terminan en `.js` (`./app.module.js`) y los tests usan **Vitest** (`vi.fn()`, no `jest.fn()`).
- **Errores de la API como códigos, no como textos**: `{ statusCode, code, errors: { campo: "email.invalid" } }`. El frontend traduce cada código al mensaje del diseño (todos los textos en catalán viven en el frontend).
- Mongoose: poner siempre `type` en cada `@Prop` (`@Prop({ type: String, … })`). Sin él, Vitest no sabe el tipo de las uniones (`role`, `colorToken`).
- Mongoose 9: las referencias usan `type: MongooseSchema.Types.ObjectId` (`import { Schema as MongooseSchema } from 'mongoose'`), **nunca `Types.ObjectId`**: con este último no convierte los ids de texto al buscar y las consultas devuelven listas vacías. Para los filtros, el tipo es `QueryFilter` (ya no existe `FilterQuery`). En `findOneAndUpdate`, `returnDocument: 'after'`.
- Las fechas de calendario se guardan como texto `AAAA-MM-DD` (sin hora ni zona horaria). Los aniversarios se repiten cada año: en las consultas por fechas salen el día de ese año, con la edad ajustada.
- class-validator ejecuta los decoradores **de abajo arriba**: el de «obligatorio» va justo encima de la propiedad, para que con `stopAtFirstError` salga `email.required` y no `email.invalid`.
- Tests e2e: usan `TEST_MONGODB_URI` (una base de datos que contenga «test») y vacían sus colecciones en cada ejecución. El usuario de Atlas no tiene permiso para `dropDatabase`.
- No usar `@nestjs/observe` ni `@nestjs/mau` (la CLI de Nest 12 los añade por defecto; se quitaron en la fase 2).
- El calendario mensual (`GET /calendar`) solo pone puntos de lo **pendiente**; las tareas hechas no salen.

## 2.7c Frontend (fase 3)
- Angular 22 **sin zone.js** (zoneless), componentes standalone y signals (`input()`, `output()`, `model()`).
- Ionic 9: se importa desde `@ionic/angular` (que ya es la versión standalone) y se configura con `provideIonicAngular({ mode: 'md' })`. Solo se usan `ion-app`, `ion-router-outlet` e `ion-content`. Los componentes visuales son propios (`src/app/shared/components`), sobre elementos HTML nativos, para seguir el diseño al píxel.
- Tema en `src/theme/`: `tokens.scss` (variables `--color-*`, `--space-*`, `--shape-*`, `--elevation-*`, `--motion-*`, `--size-*`), `ionic.scss` (conecta los tokens con Ionic) y `typography.scss` (clases de la escala MD3: `.title-large`, `.body-medium`…). Nunca se escriben colores en hexadecimal en los componentes: siempre `var(--color-…)`.
- En `styles.scss`, los `@use` de archivos `.css` necesitan un `as nombre` (si no, Sass da el error «There's already a module with namespace "index"»).
- Fuentes (Nunito y Roboto variables) e iconos (Material Symbols Rounded) van dentro de la app con `@fontsource-variable/*` y `material-symbols`.
- Textos: todos en `src/app/i18n/ca.ts`, incluida la tabla `apiErrors` (código de la API → mensaje del diseño).
- En pantallas anchas (≥ 600 px) la app se ve dentro de un marco de 412 × 892 dp. Para probar a 360 dp: DevTools de Chrome, modo dispositivo, ancho 360.
- Página de desarrollo con todos los componentes: `/dev/components`.
- Capacitor configurado (`capacitor.config.ts`, id `cat.apuntames.app`). La plataforma Android **todavía no está añadida**: de momento la app solo se prueba en el navegador.

## 2.7d Acceso (fase 4)
- La URL de la API está en `src/environments/` (desarrollo: `http://localhost:3000/api`; la de producción se pone en la fase 8). `CORS_ORIGINS` del backend incluye `http://localhost:4200`.
- Sesión (`core/auth/`): el token se guarda con `@capacitor/preferences` y dura 7 días. Al abrir la app, `provideAppInitializer` llama a `GET /auth/me`; si responde 401, se borra el token.
- El interceptor añade `Authorization: Bearer …`. Un 401 fuera de login y registro cierra la sesión, muestra «La sessió ha caducat. Torna a iniciar sessió.» y lleva a `/login`.
- Guards: `authGuard` (pantallas de la app y «Compte creat») y `guestGuard` (login y registro; con sesión, llevan a Inici).
- Validación del cliente (`core/validation/validators.ts`) con los **mismos códigos que la API**; los mensajes salen de `apiErrors`. Los errores aparecen al pulsar el botón o cuando el campo ya tiene texto (`features/auth/form-state.ts`).
- Error general del formulario (credenciales incorrectas, sin conexión, error del servidor): mensaje con icono encima del botón y `role="alert"`; con credenciales incorrectas, los dos campos se marcan en rojo.
- Etiquetas de los campos al estilo MD3 (sobre el borde), no encima de la caja como en la alta fidelidad.
- Después de registrarse, la sesión queda abierta: «Compte creat» → «Començar» → Inici.
- Navegación con `NavController` de Ionic (`navigateRoot` tras entrar, registrarse o salir), para que «Enrere» no vuelva al formulario.
- `/tabs/home` era una Inici provisional; en la fase 5 se sustituye por la Inici real.

## 2.7e Nivel 1 y punto de control (fase 5, 24/11/2026)
- **Decisión del punto de control: seguimos con Ionic.** Las diferencias con la alta fidelidad eran de estilo, no de Ionic.
- **Filas de tarea como en la alta fidelidad:** sin punto de color; el nombre de la asignatura va en verde (`--color-primary`) y peso normal. Por tanto, el color de asignatura solo se usa en los puntos del calendario, en el selector de color y en la vista previa de Personalitzar.
- Se mantienen las medidas de MD3: filas de 72 dp, FAB con esquina de 16 y «Setmana / Mes» como grupo conectado MD3 Expressive.
- Chips de Inici: salen las 7 asignaturas, sin punto de color, y el número solo cuando tienen pendientes. Cabeceras de sección con icono (`sentiment_satisfied`, `date_range`) sobre `--color-section-header` (#FFDF90).
- Rutas: `/tabs/home`, `/tabs/calendar`, `/tabs/tasks`, `/tabs/ai` y `/tabs/me` (El meu espai, dentro de las pestañas, con la barra sin destino activo; acepta `?tab=reminders|share|customize|contacts`). Cambiar de pestaña no anima la pantalla.
- Los accesos a pantallas de las fases 6 y 7 llevan a «Aquesta pantalla arriba aviat.» (`soon()` en `app.routes.ts`), con el título del diseño.
- La hoja inferior de tarea vive en la raíz de la app (`TaskSheetService`), para cubrir la barra de navegación. «Desfer» vuelve a crear la tarea con los mismos datos.
- Estado compartido de hoy y esta semana: `core/data/tasks.store.ts` (Inici, Tasques, Compartir y el badge del perfil). La fecha de hoy sale siempre de `TodayService` (`/config`).
- Si aparece un snackbar, el FAB sube para no quedar tapado.
- Preferencias de la API alineadas con el diseño: `groupBy` = subjects | priority | date; `markWith` = colors (por defecto) | tags; `visibleTags` = todo, done, highPriority, lowPriority (por defecto, todas menos lowPriority).
- Seed: «Socials: fer el resum» y «Plàstica: acabar el dibuix» pasan a los días 10 y 11, para que «Tasques d'aquesta setmana» solo tenga Anglès, como en el diseño.
- `npm run seed` compila en `dist-seed/`, para no romper `npm run start:dev` (que usa `dist/`).
- API: en `POST /entries`, los campos vacíos que no son del tipo de entrada se ignoran (por ejemplo, `personName: ""` en una tarea).
- IA: las preguntas nuevas reciben «De moment només sóc una demostració. Aviat podré respondre més preguntes.». «Sí, apunta-ho» lleva a Apuntar examen (`?from=ai&date=2026-11-13`).

## 2.7f Fase 6 · bloque 6A (Apuntar)
- **Todas las pantallas con sesión van dentro del marco con la barra de navegación** (`TabsShell` en la ruta `''`), como en el diseño. Las URL no cambian. En las pestañas se marca su destino; en el resto, el de `?from=` (`shared/utils/origin.ts`: `originUrl()` y `originTab()`).
- **Apuntar = una pantalla** `/new/:type` (task | exam | trip | birthday) con pestañas con icono. Cambiar de pestaña actualiza la URL con `Location.replaceState`, sin añadir otra pantalla al historial. Los campos comunes (data y avís) se conservan.
- Opciones de «Avisa'm abans» por tipo, según el diseño: tasca 0/1/2 (por defecto 1) · examen 1/3/7 (3) · excursió 1/3/7 (1) · aniversari 0/1/7 (1). Hora por defecto: 08:00.
- Campo nuevo de la API `activity` («Activitat» de la tarea).
- Campos por tipo:
  - tasca: assignatura, nom, data, pàg., activitat y descripció;
  - examen: assignatura, «Examen de» (`topic`), data, tipus y «Què he d'estudiar»;
  - excursió: nom, data, sortida/tornada, «Què cal portar» y observacions (`notes`);
  - aniversari: qui fa anys (`personName`), edat, data, «És…» (`relation`) e idees de regal (`giftIdeas`).
- «…creada / creat» (`/new/:type/done/:id`): «No» vuelve al origen y «Sí» lleva a Compartir. Al guardar se navega con `replaceUrl`, para que «Enrere» no vuelva al formulario.
- Crear nova assignatura (`/subjects/new`): al volver a Apuntar, la nueva asignatura queda elegida (`TasksStore.lastCreatedSubjectId`).
- Avís de pendents, Personalització y Sincronitzar (`/me/reminders`, `/me/customize`, `/me/sync`) abren El meu espai en su pestaña.
- Componente `ap-bottom-sheet` (sobre `<dialog>`, alineado con el marco del móvil en el ordenador) y `ap-select` con muestra de color en las opciones.
- Fila de tarea: `lowercaseTitle` (por defecto, true) pone en minúscula la primera letra solo en tareas («Mates: exercicis»). Los nombres propios se mantienen («Excursió: Museu de la Ciència»).

## 2.7g Fase 6 · bloque 6B (calendario y listas)
- **Calendari mensual** (`/calendar/month`): «Setmana / Mes» con Mes elegido; «Setmana» y «Enrere» vuelven a `/tabs/calendar`. Flechas para cambiar de mes (no salen en el diseño, pero hacen falta para usarlo). Estados: «No hi ha tasques aquest mes» (vacío) y «No s'ha pogut carregar el calendari» (error).
- Componente `ap-month-calendar` (MD3): celda de 56 dp, círculo de 40 y puntos debajo; hoy, con borde verde; el día elegido, relleno.
- **Tasques del dia** (`/calendar/day/:date`): título «Tasca del dia 13 de novembre» (texto del diseño) o, si no hay nada, «Dia sense tasques». Texto de apoyo: tareas «Per al 6 de novembre» / «Per a avui»; exámenes y excursiones, «13 de novembre». «Nova tasca» lleva a Apuntar con la fecha.
- **Exàmens / Excursions** (`/exams`, `/trips`): la misma página (`EntryListPage`, tipo en `data`). Muestra desde hoy en adelante, ordenado por fecha, con divisores y el extended FAB «Nou examen» / «Nova excursió» (`ap-extended-fab`).
- `TasksStore.changes`: contador que sube al marcar, editar, borrar o restaurar. Las pantallas con lista propia (mes, día, exámenes, excursiones) lo vigilan y recargan.

## 2.7h Fase 6 · bloques 6C y 6D (vistas de tareas y nivel 3 de El meu espai)
- Todas en `features/task-views/`, con estilos comunes en `task-views.scss`. La acción principal («Buscar o filtrar tasques», «Veure el llistat de tasques») va fija al pie, encima de la barra.
- **Tasca d'avui/setmanal** (`/tasks/today`): «Avui / Setmana» (grupo de botones). Setmana = de dilluns a diumenge, también lo ya hecho.
- **Llistat de tasques** (`/tasks/list`): todas las tareas pendientes, por fecha.
- **Historial** (`/tasks/history`): desplegable de mes y año con flechas (no se puede pasar del año actual). Por defecto, el mes de hoy. Orden: lo más reciente primero (en el diseño, los del mismo mes salen de más antiguo a más reciente). Texto de apoyo: «Feta el 2 de novembre» (fecha en que se marcó). Estados: «Cap tasca feta en aquest mes» y «Encara no has fet cap tasca».
- **Checklist** (`/tasks/checklist`): tareas de hoy a 7 días vista, también las hechas, con el contador «N de M fetes».
- **Marcar tasca feta** (`/tasks/mark-done`): tareas pendientes. Al marcarlas se quedan en la lista hasta salir de la pantalla, para poder desmarcarlas.
- **6D:** Avís de pendents, Personalització y Sincronitzar abren El meu espai en su pestaña (redirecciones de `app.routes.ts`, comprobadas).

## 2.7i Fase 7 · bloque 7A (Buscar/Filtrar)
- **Buscar/Filtrar** (`/search?from=`): «Buscar» (nombre), «Assignatura» (Totes + asignaturas) y «Data» (un día o «Totes les dates», con `ap-date-field` y la opción de quitar la fecha). «Buscar la tasca» abre los resultados; «Enrere» vuelve al formulario con lo escrito.
- Se busca en todo lo apuntado (tareas, exámenes, excursiones y aniversarios), por nombre y por asignatura (`GET /entries?q=&subject=&from=&to=`).
- **Tasca trobada** (`/search/results`): «Resultat de la cerca», filas y «Nova tasca» (con la fecha si se filtró por día). Sin resultados: «No s'ha trobat res» / «Prova amb un altre nom, assignatura o data.» (nou).
- «Revisar la llista d'avisos» (El meu espai · Avisos) lleva a Buscar/Filtrar, como en el diseño.
- Componente `ap-date-field`: campo que abre «Tria el dia» (reutilizable; con `clearable`, permite «Totes les dates»).

## 2.7j Fase 7 · bloque 7B (Compartir, simulado)
- **Compartir** (`/share?from=`): «Tipus de contingut» (Tasques / Calendari) y «Contactes». Contactes es una elección múltiple por grupos (Alumnes, Pares, Professors y, si hay, Altres), con contador «2/3», «Afegir contacte», editar y borrar; los cambios van a la API real de contactos. El campo resume la elección («Jordi (pare), Núria (mare)» o «3 contactes»). El diseño lo dibuja como un desplegable simple, pero la lógica de la pantalla es esta.
- Validación (nou): «Tria què vols compartir.» y «Tria almenys un contacte.».
- **Generar enllaç** (`/share/link?url=`): `POST /share-links` (simulado, no se guarda) y «Copiar l'enllaç» con `navigator.clipboard`. Si no hay permiso, aparece un snackbar y el enlace sigue a la vista. **Compartir enllaç** (`/share/link/copied`): «Enllaç copiat» y «Tornar a Inici».
- **Compartir tasques** (`/share/tasks`): la lista de Diàries / Setmanals (`MeShare` con `showFooter=false`) más el mismo formulario (`ShareForm`).
- **Compartir/Privacitat** (`/share/privacy`) abre la pestaña «Compartir» de El meu espai.
- Ya no queda ninguna pantalla provisional: se han borrado `soon()` y la página «Aquesta pantalla arriba aviat.».

## 2.7k Fase 7 · bloque 7C (modo demo y estados)
- **Modo demostració**: sección al final de El meu espai («Normal / Buit / Error»), visible solo si el backend tiene `DEMO_MODE=true` (`TodayService.demoMode`, de `/config`). Atajo: `?demo=empty|error|normal` en cualquier URL. Se guarda en `sessionStorage` (dura mientras la pestaña está abierta).
- `core/demo/`: `DemoStateService` y `demoStateInterceptor`. El interceptor añade `X-Demo-State` solo a las lecturas (GET) de la API, nunca a `/config`, `/health` ni `/auth/*`. Marcar, crear y borrar funcionan igual.
- Revisados todos los estados vacío y error con los textos del diseño: Inici, Calendari (semana y mes), Tasques del dia, Exàmens, Excursions, Tasques, Llistat, Historial, Checklist, Marcar tasca feta, IA y El meu espai (Avisos, Contactes).
- Ajustes según el diseño: con error, Exàmens/Excursions no muestran «Nou examen» / «Nova excursió», y el Calendari mensual no muestra «Setmana / Mes». La fecha de hoy se muestra aunque fallen las listas.
- Con «Buit», Inici no muestra los chips de asignatura (la API devuelve también las asignaturas vacías).

## 2.7l Fase 8 (despliegue, 24/11/2026)
- Repositorio en GitHub: https://github.com/ladynaiky/apunta-mes (privado, rama `main`). El push lo hace el grupo con su token. El historial se revisó antes: sin `.env` ni credenciales.
- Render con Blueprint (`render.yaml`):
  - **API**: https://apunta-mes-api.onrender.com/api (Swagger en `/api/docs`), Web Service Node 24, Frankfurt, plan gratuito, health check `/api/health`;
  - **App**: https://apunta-mes.onrender.com, Static Site con todas las rutas redirigidas a `index.html`.
- Secretos solo en el panel de Render: `MONGODB_URI` (la misma base de datos `apunta-mes` que en local), un `JWT_SECRET` nuevo y `DEMO_USER_PASSWORD`. Variables públicas en `render.yaml`: `DEMO_MODE=true`, `DEMO_TODAY=2026-11-04` y `CORS_ORIGINS` (app de Render + local).
- Atlas: *Network Access* con `0.0.0.0/0` (Render no tiene una IP fija).
- Cada push a `main` vuelve a desplegar los dos servicios automáticamente.
- Plan gratuito: la API se duerme tras 15 minutos sin uso; la primera petición tarda alrededor de un minuto.
- Comprobado tras el despliegue: health (`database: up`), `/config`, Swagger, app, rutas internas, CORS y 401 sin token.

## 2.9 Iteración 1 (24/11/2026): 21 cambios pedidos por el grupo
Decisiones (respuestas del grupo):
1. Logo: `Isotipo.png` (1024×1024, transparente) es el recurso; `logo horizontal.png` y `logotipo.png` son solo referencia.
2. Isotipo encima de «Apunta+» en Iniciar sessió.
3. Color de cada asignatura tal cual: borde de los chips de Inici y nombre de la asignatura en las tareas. Se revisa el contraste después de verlo.
4. No se puede eliminar una asignatura con tareas (aviso).
5. Se eliminan las pantallas Checklist y Marcar tasca feta.
6. Sincronitzar va al principio de la pestaña Compartir de El meu espai (siguen 4 pestañas, con icono encima).
7. Roles: Alumne/Alumna, Pare/Mare, Tutor/Tutora, Professor/Professora, Altres (Registre y Contactes).
8. Modales centrados con fondo oscuro semitransparente (se ve la pantalla anterior) y X arriba a la derecha.
9. Sin verificación del correo. 10. «Has oblidat la contrasenya?» simulado.
11. Al final se actualiza el Design System.

Roadmap: A errores → B identidad visual → C fecha real → D navegación y contenido → E editar → F modales → G contraseña olvidada → Design System.

Bloque A (hecho):
- FAB: al abrir, esquina de 28 px (no `corner-full`), y la capa interior anima igual. Antes, al cerrar pasaba de 9999px a 16 y salía un cuadrado de pico.
- Origen `calendar-month`: el mensual lo pasa al día y a Apuntar; después de apuntar se vuelve a `/calendar/month`.
- Aniversarios visibles en Inici y Tasques d'avui/setmana: «Aniversari de l'Anna», «Fa 12 anys», sin casilla ni etiquetas (`rowTitle`, `birthdaySupport` en `task-title.ts`).
- iOS: el desplegable se cierra con `pointerdown` (Safari no envía `click` al tocar zonas que no son botones) y se desplaza para verse. Campos con 16 px como mínimo solo en iOS (`@supports (-webkit-touch-callout: none)` en `styles.scss`), para evitar el zoom automático. No se bloquea el zoom con los dedos.

Bloque B (hecho):
- Logo: `frontend/public/isotipo.png` (256 px, redondo y transparente). El PNG original tenía las esquinas blancas, así que los iconos se recortan en círculo. Las referencias están en `design/logo/`.
- Iconos: `favicon.ico` (16/32/48), `icon-32/48/192/512.png`, `apple-touch-icon.png` (180, fondo crema: iOS pinta de negro la transparencia), `icon-maskable-512.png` y `manifest.webmanifest`. Los iconos de Android (Capacitor) se harán al crear la plataforma Android.
- Iniciar sessió: isotipo de 72 dp encima de «Apunta+» (decorativo, `alt=""`).
- Chips de Inici: borde del color de la asignatura (`outlineColor` en `chip`). Filas de tarea: nombre de la asignatura de su color (`subjectColor` en `task-row`). Contraste pendiente de revisar con el grupo (el groc de Català sobre crema se lee poco).
- `ap-tabs` acepta `icon` (pestañas de 64 dp con el icono relleno en la activa). El meu espai: notifications, share, palette, group. Caben a 360 dp.
- Avisos: los aniversarios salen como «Aniversari de …», sin casilla.

Bloque C (hecho):
- Fecha real: `DEMO_TODAY` vacía en `backend/.env`, `.env.example` y `render.yaml`. La app usa la fecha de hoy (Europe/Madrid).
- Seed relativo: `demo-data.ts` sigue escrito para el 4/11/2026 (`DEMO_REFERENCE_TODAY`), y `DemoSeedService` desplaza todas las fechas (y `lastSyncAt`) a la fecha de la app. Las 3 tareas siempre son de hoy.
- Los tests e2e fijan `DEMO_TODAY=2026-11-04`, así que los resultados no cambian.
- Datos de demo reiniciados el 24/11/2026: se borraron las pruebas del grupo, con su OK.

Bloque D (hecho):
- Eliminadas las pantallas Checklist y Marcar tasca feta (rutas, archivos y textos). Tasques: Buscar, Llistat, Historial, Compartir.
- Calendari (semana y mes): «Veure l'historial de tasques».
- Sincronitzar: componente `me-sync`, al principio de la pestaña Compartir (ya no está en Contactes).
- Compartir: debajo, la lista «Tasques ja compartides» (`GET /entries?shared=true`, solo pendientes) con su estado vacío y de error. Se recarga con `store.changes`.
- Roles: `student, student_f, father, mother, tutor_m, tutor_f, teacher_m, teacher_f` (+ `other` en contactos). `parent` y `teacher` (los de antes) se aceptan y se muestran como «Pare/Mare» y «Professor/a». Los grupos de Compartir son Alumnes / Família / Professors / Altres (`roleGroup` en `shared/utils/roles.ts`). Contactos de demo con los roles nuevos.

Bloque E (hecho):
- `ap-modal` (shared/components/modal): modal centrado sobre `<dialog>` nativo, con velo oscuro y X arriba a la derecha (decisión 8). Lo reutilizará el bloque F.
- Personalitzar: la lista de asignaturas se ve siempre. Cada fila abre «Editar assignatura» (nombre, color, Desar, Esborrar l'assignatura) y hay un enlace «Nova assignatura». Borrar pide confirmación; con cosas apuntadas, la API responde 409 SUBJECT_IN_USE y el aviso sale dentro del modal (decisión 4).
- Editar: ruta `/entries/:id/edit` con `NewEntryPage` en modo edición: todos los campos rellenos, sin pestañas de tipo, «Desar els canvis», «Prioritat alta» (solo al editar) y vuelta atrás con «Canvis desats». El PATCH no envía `type`, porque la API no lo acepta. En un examen con nombre automático («Examen de X»), el nombre sigue a la asignatura.
- La hoja de la tarea ya no tiene el formulario corto: «Editar» abre la pantalla de edición.
- Los errores de campos que no se ven en el formulario se muestran arriba de los botones.
- Los botones de texto destructivos (`.destructive`) salen en rojo de error, también en los diálogos.

Bloque F (hecho):
- Flujo de crear y compartir en un modal centrado (`ap-share-flow` + `ShareFlowService`, en la raíz de la app, como la hoja de la tarea). Pasos: «Tasca creada» → Compartir (el `ShareForm`, con desplazamiento dentro de la caja: opción A) → Generar enllaç → Compartir enllaç (Fet). Cada paso tiene la X arriba a la derecha.
- Apuntar: al desar, `nav.back()` a la pantalla de origen y se abre «Tasca creada». «No» cierra el modal.
- La hoja de la tarea («Compartir»), El meu espai · Compartir («Compartir les tasques marcades») y Compartir tasques abren el modal en el paso Compartir.
- `ShareForm` emite `generated(url)` en lugar de navegar.
- Eliminadas las rutas `/new/:type/done/:id`, `/share`, `/share/link` y `/share/link/copied`, y `created-page.ts`. Queda `/share/tasks` (lista para marcar y botón).

Bloque G (hecho):
- «Has oblidat la contrasenya?» (simulado): enlace de texto en Iniciar sessió → `/forgot-password` (guestGuard). Tiene el campo de correo con validación y, al enviarlo, «T'hem enviat un correu» y «Tornar a iniciar sessió».
- API `POST /api/auth/forgot-password` (pública): siempre 202 `{ sent: true }`, exista o no la cuenta, para no revelar qué correos están registrados. No envía nada y tiene sus tests e2e. Un envío real necesitaría un servicio de correo (fase futura).

Design System actualizado (24/11/2026, https://claude.ai/artifact/VM7DnKfQr83Afa1AJgQF15, versión 16):
- `tokens.json` v2: valores de la app (`frontend/src/theme/tokens.scss`), solo tema claro, Nunito (títulos, `--font-title`) y Roboto (`--font-sans`), tokens nuevos (`section-header`, `assistant-bubble`, `warning-badge`, `priority-container`).
- README (brand book) reescrito, sección «Iteració 1», isotipo PNG en Logos y en la portada.
- Componentes: Chip, ListItem, Tabs, Fab y Dialog actualizados, y Modal nuevo. `bundle.css` con las clases nuevas.
- Contraste pendiente (decisión 3): como texto sobre crema, solo Mates (7.1) y Música (4.8) llegan a 4.5:1; Socials 4.47, Castellà 4.2, Plàstica 4.1, Anglès 3.7, Català 3.2.

## 2.10 Iteración 2 (25/11/2026)
Decisiones: (1) iconos de Android e iPhone con fondo **verde** (`#387050`), no crema · (2) chip de asignatura elegido = color lleno (texto `--color-on-<color>`) · (3) FAB MD3: cerrado esquina 16, abierto círculo y el «+» gira a «×» · (4) connected button group MD3 Expressive manteniendo colores · (5) Alta fidelitat: pantallas principales; Checklist y Marcar tasca feta a «Arxiu (eliminades)».
Roadmap: A ajustes · B MD3 (FAB, button group) · C icono · D Alta fidelitat.

Bloque A (hecho):
- Personalitzar: la lista de asignaturas solo sale con «Colors».
- Chips de Inici: borde de su color y relleno del 20 % (`color-mix`); el elegido, con el color lleno y `--color-on-<color>` (nuevos tokens `--color-on-taronja…blau`: blanco, salvo groc y lila en casi negro).
- Editar: `.page.editing` con margen arriba (la etiqueta del primer campo ya no se corta) y descripción/«Què he d’estudiar» de 3 líneas.
- Nombre de la asignatura en negrita (700) en filas de tarea, checklist de Compartir y vista previa de Personalitzar.

Bloques B y C (hechos):
- FAB MD3: cerrado esquina 16 y `primary-container`; abierto círculo (`size-fab / 2`) en `primary` y el «+» (un solo icono) gira 45° hasta «×». Sin giro con «reducir movimiento».
- Connected button group: radios en px reales (`--round` = mitad de la altura). Con 9999px el navegador reducía todas las esquinas y la opción no elegida parecía cortada. 2 dp entre opciones, interiores 8, elegida redonda con ✓.
- Iconos: `apple-touch-icon.png` y `icon-maskable-512.png` sobre verde `#387050` (sin el borde del círculo); `manifest.webmanifest` `background_color` verde.
- Reinicio diario de los datos de demo: `DemoDailyResetService` (al arrancar y cada 30 min) compara `preferences.demoSeededOn` con hoy y llama a `DemoSeedService.reset`. Solo en modo demo; `DEMO_DAILY_RESET=false` lo apaga (los tests e2e lo apagan). Lo apuntado se conserva hasta el día siguiente.

Bloque D (hecho):
- Alta fidelitat (https://claude.ai/artifact/5H9N23VZZNuTvPSPTmeUMy, versión 278): rehechas con el aspecto de la app 10 mesas (Iniciar sessió, Inici, Calendari, Calendari setmanal/mensual, Tasques, El meu espai, Personalització, Apuntar nova tasca, Tasca creada y Compartir como modales), con los mismos enlaces de Play. Cuatro mesas nuevas en «Iteració 2 · pantalles noves»: Editar tasca, Recuperar la contrasenya, El meu espai · Compartir y Editar assignatura (modal). Checklist y Marcar tasca feta (y sus «buit») movidas a «Arxiu (eliminades a l’app)». Nota verde a la derecha del lienzo.
- Las mesas se generan con un script (componentes comunes, datos del 4 de noviembre). El resto de mesas (variantes, estados, componentes) siguen siendo las de antes.
- Design System versión 19: Chip (relleno del 20 %, elegido lleno), Fab (gira a círculo), ButtonGroup (radios en px).

Ajustes tras la iteración 2 (25/11/2026):
- Pantalla de carga de Android: `manifest.webmanifest` `background_color` vuelve a crema `#FFFBF0` (Android pinta la pantalla de carga con ese color y el isotipo redondo); el icono de la app (maskable e iPhone) sigue sobre verde. Hay que reinstalar la app para verlo.
- Button group: todas las opciones en píldora, separadas 8 dp (button group estándar MD3), con escala 0,97 al pulsar. También en la Alta fidelitat (Calendari, Calendari setmanal/mensual, Personalització) y en el README de ButtonGroup del Design System.

- Calendari: Setmana ↔ Mes con `navigateRoot(..., { animated: false })` (sin animación ni historial); la vista mes tiene el título «Calendari», sin flecha atrás y con el perfil. Alta fidelitat: mesa «Calendari · Mes» igual.
- Icono de la pantalla de carga: se queda como está (opción b). Android usa el mismo icono y forma que en el escritorio; no se puede tener un círculo en la carga y el cuadrado verde en el escritorio a la vez.

- Se deshizo la hoja inferior de asignaturas en Apuntar/Editar (vuelve `ap-select`), a petición del grupo.
- Prioridad: `PRIORITIES = ['high', 'low']` (null = normal), con test e2e. Apuntar y Editar tienen la fila «Prioritat» con dos chips (alta / baixa; tocar la elegida la quita); no en aniversario. Etiqueta «Prioritat baixa» con `--color-low-priority-container` (#E3EAF2) / `--color-on-low-priority-container` (#2F4A66) en filas, detalle, Compartir y vista previa.
- «Etiquetes que es mostren» ya se aplica: `TasksStore.visibleTags` (cargada con las preferencias y actualizada al guardar en Personalitzar). `task-row` muestra Per fer / Feta / Prioritat alta / Prioritat baixa solo si están activadas. Por defecto, «Prioritat baixa» está apagada.
- Personalitzar: se quita «Agrupar les tasques per» (decisión del grupo, 25/11/2026). El campo `groupBy` sigue en la API pero la app no lo usa. Texto de introducción: «Tria com vols veure les tasques.».
- Aniversarios: icono `cake` en el hueco de la casilla (`task-row` `leadIcon`, 48 dp), así el texto queda alineado con las tareas. Sin casilla porque se repiten cada año.
- Pendiente de decidir: «Marcar-les amb» con Colors y Etiquetes a la vez.

## 2.8 Estado de las fases
- [x] 0. Lectura y preguntas
- [x] 1. Repositorio base
- [x] 2. Backend
- [x] 3. Frontend base
- [x] 4. Acceso
- [x] 5. Nivel 1 + punto de control (seguimos con Ionic)
- [x] 6. Niveles 2 y 3
- [x] 7. Flujos transversales y estados
- [x] 8. Despliegue (Render + Atlas)
- [ ] Iteración 1: [x] A · [x] B · [x] C · [x] D · [x] E · [x] F · [x] G · [x] Design System
- [ ] Iteración 2: [x] A · [x] B · [x] C · [x] D
