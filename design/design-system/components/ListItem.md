# ListItem

List item de MD3 para tareas, información y accesos: una o dos líneas, con checkbox, punto de asignatura y una sola acción final.

**En el artefacto:** «Fila de tasca», «Fila d’informació», «Fila per compartir», las filas de Inici, Checklist, Llistat de tasques, Avisos y Sincronitzar, las cabeceras «Tasques d’avui» y las etiquetas «Diàries / Setmanals», y el primer estilo de «Botó» (píldora con chevron: «Veure el llistat de tasques», «Obrir la checklist»).

## Anatomía
1. Contenedor: `size.list-item.one-line` (56 dp) o `size.list-item.two-line` (72 dp); padding `space.200` izquierda y `space.300` derecha.
2. Elemento inicial: `checkbox`, icono de 24 dp o nada.
3. Punto de asignatura (`size.subject-dot`) antes del texto, separado `space.150`.
4. Titular `body-large` en `color.on-surface`.
5. Texto de apoyo `body-medium` en `color.on-surface-variant` («Per a avui», «Acaba avui»).
6. Acción final: `icon-button/standard` (`more_vert` o `share`) o `chevron_right` en filas de navegación.
7. Divisor opcional 1 dp `color.outline-variant`.

## Variantes
| Nombre | Uso |
| --- | --- |
| `list-item/one-line` · checkbox | Tarea en Inici, Checklist, Marcar tasca feta. |
| `list-item/one-line` · selección | Tarea para compartir (checkbox sin acción final). |
| `list-item/two-line` · información | Tarea con fecha o estado: Tasca trobada, Avisos, Historial, contactos de Sincronitzar. |
| `list-item/one-line` · navegación (lista segmentada) | Accesos de Tasques: «Veure el llistat de tasques», «Obrir la checklist», «Compartir tasques». Ítems en `color.surface-container`, separados `space.25`, esquinas exteriores `shape.corner.large` e interiores `shape.corner.extra-small`. |
| `list-subheader` · sección | «Tasques d’avui», «Tasques d’aquesta setmana»: 48 dp, `color.surface-container`, `shape.corner.medium`, `title-medium-emphasized`. |
| `list-subheader` · grupo | «Diàries», «Setmanals», «Assignatures», «Contactes afegits»: `title-small` en `color.on-surface-variant`. |

## Estados
| Estado | Cómo se ve |
| --- | --- |
| Enabled | Ver anatomía. |
| Hover | Capa `opacity.state.hover` en toda la fila (filas de navegación) o en el control (checkbox, icon button). |
| Pressed | Capa `opacity.state.pressed`. |
| Focused | Capa `opacity.state.focus` + anillo `color.secondary`. |
| Disabled | Texto e iconos `color.on-surface` al 38 %. |
| Hecha (tarea) | Titular tachado en `color.on-surface-variant`; checkbox en on. |

## Uso en Apunta+
Formato de la tarea: «Assignatura: acció» («Mates: exercicis, pàg. 12»), con el punto de su asignatura. En Inici la acción final es `more_vert` y abre el bottom sheet de la tarea.

## Accesibilidad
Cada control de la fila tiene su propio nombre; la fila entera no es un botón cuando contiene un checkbox y un icon button. El punto de color nunca sustituye al nombre de la asignatura escrito en el titular.

## Corrección respecto a la media fidelidad
Las filas miden 48 dp (una línea) y 55 dp (dos líneas): pasan a 56 y 72 dp. Las acciones «Veure… / Obrir…» del componente «Botó» son list items con icono y chevron, no botones. Las cabeceras «Tasques d’avui» usan `title-medium-emphasized` en vez de 16 px / 600.
