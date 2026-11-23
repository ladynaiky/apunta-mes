# Fab

Floating action button de MD3 Expressive: el único punto de entrada para apuntar algo nuevo; al pulsarlo se abre un FAB menu con los cuatro tipos.

**En el artefacto:** componente «Botó flotant» (cerrado «+», abierto «×» y opciones «Tasca», «Examens», «Excursions», «Aniversaris») en Inici, Calendari y Tasques.

## Anatomía
1. Contenedor de `size.fab` (56 dp), forma `shape.corner.large`, elevación `elevation.level3`.
2. Icono `add` de 24 dp.
3. FAB menu: columna alineada a la derecha, ítems separados `space.50`.
4. Ítem del menú: píldora de 56 dp, icono 24 dp + etiqueta `title-medium`.
5. Botón de cierre: 56 dp redondo (`shape.corner.full`), icono `close`.
6. Velo `color.scrim` al `opacity.scrim` detrás del menú.

## Variantes
| Nombre | Color |
| --- | --- |
| `fab/primary-container` | `color.primary-container` / `color.on-primary-container` |
| `fab-menu/item` | `color.primary-container` / `color.on-primary-container` |
| `fab-menu/close` | `color.primary` / `color.on-primary` |

Medium (`size.fab.medium`, 80 dp, `shape.corner.large-increased`) queda disponible si el FAB debe ganar presencia; en móvil usa el de 56.

## Estados
| Estado | Cómo se ve |
| --- | --- |
| Enabled | `elevation.level3`. |
| Hover | Capa `opacity.state.hover` y `elevation.level4`. |
| Pressed | Capa `opacity.state.pressed`, forma `shape.corner.medium`, vuelve a `elevation.level3`. |
| Focused | Anillo `size.focus-ring` `color.secondary`. |
| Disabled | No aplica: si no se puede crear, el FAB se oculta. |

## Uso en Apunta+
Abajo a la derecha, a `space.200` de los bordes y por encima de la navigation bar. Opciones del menú en este orden, de abajo arriba: «Tasca», «Examens», «Excursions», «Aniversaris» (icono `assignment`, `lightbulb`, `landscape`, `cake`). Cada opción abre su modal «Apuntar…».

## Accesibilidad
`aria-label="Què vols apuntar?"` y `aria-expanded`. Al abrir, el foco pasa al primer ítem; Esc o el velo cierran. Contraste de etiqueta 4.6:1 (valor `color.on-primary-container` por verificar con el JSON).

## Corrección respecto a la media fidelidad
El FAB cerrado es un círculo: en MD3 el FAB tiene esquina `shape.corner.large` (16 dp); solo el botón de cierre del menú es redondo. Las etiquetas de los ítems pasan de 16 px / 600 a `title-medium` (16 / 24, 500).
