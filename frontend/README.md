# Apunta+ · Frontend

App de Apunta+: Angular 22 + Ionic 9 (modo md) + Capacitor 8. De momento se prueba en el navegador.

## Puesta en marcha
```bash
cd frontend
npm install
npm start        # http://localhost:4200
```

En un ordenador, la app se ve dentro de un marco de 412 × 892 dp. Para probarla a 360 dp, abre las DevTools de Chrome, activa el modo dispositivo y pon un ancho de 360.

## Scripts
| Script | Qué hace |
|---|---|
| `npm start` | Servidor de desarrollo con recarga automática |
| `npm run build` | Compilación de producción (`dist/frontend/browser`) |
| `npm test -- --watch=false` | Tests unitarios (Vitest) |

## Estructura
- `src/theme/`: tokens del Design System como variables CSS, conexión con Ionic y escala tipográfica.
- `src/app/i18n/ca.ts`: todos los textos de la interfaz en catalán y la traducción de los códigos de error de la API.
- `src/app/shared/components/`: componentes compartidos (botones, campos, fila de tarea, barra de navegación, FAB…).
- `src/app/features/`: pantallas. Por ahora solo `dev/components`, una página con todos los componentes y sus estados.

Más decisiones en `../CLAUDE.md` (parte 2).
