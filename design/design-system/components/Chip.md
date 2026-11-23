# Chip

Filter chip de MD3 para mostrar las asignaturas y filtrar las tareas por asignatura; lleva el punto de color y, si hay pendientes, un badge.

**En el artefacto:** bloque «Assignatures» de Inici (componente «Resum d’avui»): etiquetas de 32 px con borde, esquina 8 y badge rojo; botón «+» al final.

## Anatomía
1. Contenedor de `size.chip` (32 dp), forma `shape.corner.small`, borde 1 dp `color.outline-variant`.
2. Elemento inicial: punto de asignatura `size.subject-dot` en su gris `color.<asignatura>` con anillo 1 dp `color.outline`; en seleccionado, icono `check` de 18 dp.
3. Etiqueta `label-large`.
4. Badge final opcional (`badge/large`).
5. Área táctil de 48 dp.

## Variantes
- `chip/filter` · asignatura (punto + nombre [+ badge]).
- `chip/filter` sin punto para filtros de fecha o tipo («Totes les dates»).

## Color (media fidelidad: grises)
| Parte | No seleccionado | Seleccionado |
| --- | --- | --- |
| Contenedor | transparente, borde `color.outline-variant` | `color.secondary-container`, sin borde |
| Etiqueta / icono | `color.on-surface-variant` | `color.on-secondary-container` (7.2:1) |
| Inicial | punto gris `color.<asignatura>` + anillo `color.outline` | `check` |

La asignatura no tiñe el chip: el único color de la interfaz es `color.error` (el badge).

## Estados
| Estado | Cómo se ve |
| --- | --- |
| Enabled | Ver color. |
| Hover | Capa `opacity.state.hover`. |
| Pressed | Capa `opacity.state.pressed`. |
| Focused | Capa `opacity.state.focus` + anillo `color.secondary`. |
| Disabled | Borde `color.on-surface` al 12 %, etiqueta al 38 %, punto al 38 %. |

## Uso en Apunta+
Inici, bloque «Assignatures»: los siete chips en orden del curso, separados `space.100`, y al final `icon-button/outlined` «Crear nova assignatura». Tocar un chip filtra «Tasques d’avui» y «Tasques d’aquesta setmana».

## Accesibilidad
`aria-pressed` en cada chip. El gris nunca va solo: el nombre está siempre escrito y el seleccionado lleva check. Los grises vecinos se parecen (1.3–1.4:1): se distinguen por el nombre.

## Corrección respecto a la media fidelidad
En el artefacto las etiquetas no son interactivas (son `div`). En MD3 un chip siempre es interactivo: conviértelas en filter chips (como propone el PDF) o, si no deben filtrar, en texto plano dentro de un list item.
