# Checkbox

Checkbox de MD3 para marcar una tarea como hecha o elegir varias tareas para compartir.

**En el artefacto:** casilla de «Fila de tasca», «Fila per compartir», listas de Inici y Checklist, y lista «Diàries / Setmanals» de Compartir.

## Anatomía
1. Caja de `size.checkbox` (18 dp), borde 2 dp, esquina `shape.corner.checkbox` (2 dp).
2. Marca de check en `color.on-primary` (cuando está marcado).
3. Capa de estado circular de 40 dp.
4. Área táctil de 48 dp.

## Variantes
- `checkbox` · off / on (el estado indeterminado no se usa en Apunta+).
- `checkbox` · error (validación de un grupo obligatorio).

## Color
| Parte | Off | On | Error |
| --- | --- | --- | --- |
| Borde | `color.on-surface-variant` | — | `color.error` |
| Relleno | — | `color.primary` | `color.error` (on) |
| Check | — | `color.on-primary` | `color.on-error` |

## Estados
| Estado | Cómo se ve |
| --- | --- |
| Enabled | Ver color. |
| Hover | Capa circular `opacity.state.hover` (del color de la caja). |
| Pressed | Capa `opacity.state.pressed`. |
| Focused | Capa `opacity.state.focus` + anillo `color.secondary`. |
| Disabled | Borde o relleno `color.on-surface` al 38 %. |

## Uso en Apunta+
En la fila de tarea, marcar = tarea hecha: el texto pasa a `color.on-surface-variant` tachado. En Compartir, marcar = la tarea se comparte con la familia.

## Accesibilidad
`role="checkbox"` + `aria-checked`, con nombre que incluye la tarea: «Marcar com a feta: Mates: exercicis, pàg. 12». Borde de la caja 8.9:1 sobre surface.

## Corrección respecto a la media fidelidad
Medidas de la caja correctas. El botón que la contiene mide 36 × 48 en Inici: amplíalo a 48 × 48.
