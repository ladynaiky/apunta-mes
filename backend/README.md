# Apunta+ · Backend

API de la agenda escolar Apunta+: NestJS 12 + Mongoose 9 + MongoDB Atlas. Documentación interactiva en **`/api/docs`** (Swagger).

## Puesta en marcha
```bash
cd backend
npm install
cp .env.example .env   # y rellena los valores (ver abajo)
npm run seed           # crea el usuario de demo con los datos de noviembre de 2026
npm run start:dev      # http://localhost:3000/api · Swagger: http://localhost:3000/api/docs
```

Usuario de demo: `demo@apunta.cat`, con la contraseña de `DEMO_USER_PASSWORD`.

## Variables de entorno (`.env`, nunca en git)
| Variable | Para qué |
|---|---|
| `MONGODB_URI` | Base de datos de la app (`…mongodb.net/apunta-mes?…`). **Obligatoria** |
| `TEST_MONGODB_URI` | Base de datos solo para los tests e2e (`…/apunta-mes-test?…`). Se vacía en cada ejecución |
| `JWT_SECRET` | Secreto de los tokens (mínimo 32 caracteres). **Obligatoria** |
| `JWT_EXPIRES_IN` | Duración del token (`7d`) |
| `CORS_ORIGINS` | Orígenes del frontend, separados por comas |
| `DEMO_MODE` | `true`: activa `X-Demo-State` y `POST /api/demo/reset` |
| `DEMO_TODAY` | Fecha «de hoy» (`2026-11-04`). Vacía = fecha real |
| `DEMO_USER_EMAIL` / `DEMO_USER_PASSWORD` | Usuario que crea el seed |

## Scripts
| Script | Qué hace |
|---|---|
| `npm run start:dev` | API con recarga automática |
| `npm run seed` | Borra y vuelve a crear **solo** el usuario de demo |
| `npm test` | Tests unitarios (Vitest) |
| `npm run test:e2e` | Tests e2e contra `TEST_MONGODB_URI` (se saltan si no existe) |
| `npm run lint` | Linter (oxlint) |
| `npm run build` / `npm run start:prod` | Compilar y arrancar en producción (Render) |

## Endpoints (prefijo `/api`)
- **Públicos:** `POST /auth/register` · `POST /auth/login` · `GET /health` · `GET /config`
- **Con token** (`Authorization: Bearer …`), y cada usuario solo ve lo suyo:
  - `GET /auth/me`
  - `GET/POST /subjects` · `PATCH/DELETE /subjects/:id`
  - `GET /entries` (filtros `type`, `from`, `to`, `subject`, `q`, `done`) · `POST /entries` · `GET/PATCH/DELETE /entries/:id` · `PATCH /entries/:id/done`
  - `GET /entries/today` · `/entries/week` · `/entries/day/:date` · `/entries/history?year=&month=`
  - `GET /calendar?month=AAAA-MM` · `GET /reminders`
  - Simulados: `GET/PUT /preferences` · `GET/POST /sync` · CRUD `/contacts` · `POST /share-links` · `GET /ai/conversation`
  - `POST /demo/reset` (solo modo demo y solo el usuario de demo)

## Errores
Siempre con un **código**, nunca con texto: el frontend traduce cada código al mensaje del diseño.
```json
{ "statusCode": 400, "code": "VALIDATION_ERROR", "errors": { "email": "email.invalid" } }
```
Otros códigos: `EMAIL_TAKEN` (409), `INVALID_CREDENTIALS` (401), `UNAUTHORIZED` (401), `NOT_FOUND` (404), `SUBJECT_EXISTS` / `SUBJECT_IN_USE` (409), `DEMO_ONLY` (403), `DEMO_ERROR` y `DATABASE_DOWN` (503).

## Modo demo
Con `DEMO_MODE=true`, las lecturas aceptan la cabecera **`X-Demo-State`**:
- `empty`: devuelve una lista vacía (estado «buit»);
- `error`: devuelve `503 DEMO_ERROR` (estado «error»).

## Notas técnicas
- **ESM:** los imports relativos terminan en `.js`.
- Fechas de calendario guardadas como texto `AAAA-MM-DD`. Los aniversarios se repiten cada año.
- Más decisiones en `../CLAUDE.md` (parte 2).
