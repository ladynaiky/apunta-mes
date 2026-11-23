# IconButton

Botón solo con icono para acciones compactas y repetidas (compartir, opciones, volver, editar); siempre con nombre accesible.

**En el artefacto:** componente «Botó de compartir»; icono «Enrere» y icono de persona con badge en la capçalera; «⋮ Opcions de la tasca» en Inici; editar / esborrar contacte en Sincronitzar; ojo de la contraseña; «+» para crear asignatura en Inici.

## Anatomía
1. Contenedor de `size.button.s` (40 dp), forma `shape.corner.full`.
2. Icono Material Symbols de `size.icon` (24 dp).
3. Área táctil de `size.touch-target` (48 dp).

## Variantes
| Nombre MD3 | Color | Uso |
| --- | --- | --- |
| `icon-button/standard` | icono `color.on-surface-variant` | Compartir, opciones (⋮), editar, ojo de contraseña, perfil. |
| `icon-button/standard` (navegación) | icono `color.on-surface` | «Enrere» en la top app bar. |
| `icon-button/standard` (destructivo) | icono `color.error` | Esborrar contacte. |
| `icon-button/outlined` | borde `color.outline-variant`, icono `color.on-surface-variant` | «Crear nova assignatura» junto a los chips. |

## Estados
| Estado | Cómo se ve |
| --- | --- |
| Enabled | Icono en su color. |
| Hover | Capa circular `opacity.state.hover`. |
| Pressed | Capa `opacity.state.pressed` y la forma pasa a `shape.corner.small`. |
| Focused | Anillo `size.focus-ring` `color.secondary`. |
| Disabled | Icono `color.on-surface` al 38 %. |

## Uso en Apunta+
- Fila de tarea en Inici: `more_vert` abre el bottom sheet de la tarea (Editar / Compartir / Esborrar).
- Pantallas de compartir: `share` en la fila.
- Top app bar: `arrow_back` a la izquierda, `account_circle` con badge a la derecha (El meu espai).

## Accesibilidad
`aria-label` obligatorio y específico: «Esborrar contacte: Laia», «Opcions de la tasca». El icono va con `aria-hidden`. Icono ≥ 3:1 sobre su fondo (on-surface-variant: 8.9:1).

## Corrección respecto a la media fidelidad
Los iconos de «Botó de compartir» y de editar/esborrar se dibujan a 20 dp dentro de 40 dp: en MD3 el icono del icon button es de 24 dp. Una sola acción final por fila: el artefacto alterna «compartir» (componente) y «⋮» (Inici); usa `more_vert` como acción final por defecto y deja `share` para las listas de compartir.
