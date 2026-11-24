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

## 2.8 Estado de las fases
- [x] 0. Lectura y preguntas
- [x] 1. Repositorio base
- [x] 2. Backend (falta el despliegue, que es la fase 8)
- [x] 3. Frontend base
- [x] 4. Acceso
- [x] 5. Nivel 1 + punto de control (seguimos con Ionic)
- [ ] 6. Niveles 2 y 3
- [ ] 7. Flujos transversales y estados
- [ ] 8. Despliegue
