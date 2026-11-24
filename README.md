# Apunta+

Agenda escolar digital para el alumnado: tareas, exámenes, excursiones y aniversarios en un calendario. Interfaz en catalán, diseñada para Android (412 × 892 dp).

| Carpeta | Qué hay |
|---|---|
| `backend/` | API: NestJS 12 + Mongoose 9 + MongoDB Atlas, con Swagger en `/api/docs` ([README](backend/README.md)) |
| `frontend/` | App: Angular 22 + Ionic 9 (modo md) + Capacitor 8 ([README](frontend/README.md)) |
| `design/` | Copia de referencia de la Alta fidelitat y del Design System |
| `CLAUDE.md` | Instrucciones del proyecto y todas las decisiones aprobadas |

## En local
```bash
cd backend && npm install && cp .env.example .env   # rellena el .env
npm run seed && npm run start:dev                    # API: http://localhost:3000/api
cd ../frontend && npm install && npm start           # App: http://localhost:4200
```
Usuario de demo: `demo@apunta.cat`, con la contraseña de `DEMO_USER_PASSWORD`.

## Desplegament (Render + MongoDB Atlas)
El archivo `render.yaml` describe los dos servicios:
- **apunta-mes-api**: la API (Web Service, Node 24, Frankfurt). Health check: `/api/health`;
- **apunta-mes**: el frontend (Static Site), con todas las rutas redirigidas a `index.html`.

Pasos:
1. En Render: **New → Blueprint** → elegir este repositorio.
2. Pegar los valores secretos que pide: `MONGODB_URI`, `JWT_SECRET` (nuevo, por ejemplo con `openssl rand -hex 48`) y `DEMO_USER_PASSWORD`.
3. En MongoDB Atlas → *Network Access*: permitir `0.0.0.0/0` (Render no tiene una IP fija).
4. Si Render asigna otras URL, cambiarlas en `frontend/src/environments/environment.ts` (API) y en `CORS_ORIGINS` (frontend).

En el plan gratuito la API se duerme tras 15 minutos sin uso: la primera petición tarda alrededor de un minuto.
