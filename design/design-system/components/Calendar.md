# Calendar

Rejilla de calendario (mes y semana) donde cada punto es una tarea con el gris de su asignatura; se basa en las celdas del date picker de MD3.

**En el artefacto:** «Calendari mensual», «Calendari de setmana i mes» y las pantallas Calendari y Calendari setmanal/mensual (con estados vacío y error).

## Anatomía
1. Título del periodo `title-medium`: «Novembre 2026», «Setmana del 2 al 8 de novembre».
2. Días de la semana `label-medium` en `color.on-surface-variant` (Dl Dt Dc Dj Dv Ds Dg; la semana empieza en lunes).
3. **Mes:** celda de `size.calendar-cell` (56 dp) con círculo de `size.day` (40 dp) y fila de puntos debajo.
4. **Semana:** píldora de 72 dp (`space.900`), forma `shape.corner.full`, fondo `color.surface-container-low`, día de la semana + número `title-medium` + puntos.
5. Puntos de `size.calendar-dot` (6 dp) en el gris `color.<asignatura>` con anillo 1 dp `color.outline`, separados `space.25`, máximo 3 (con más, el tercero se sustituye por «+»).

## Variantes
- `calendar/month`
- `calendar/week`

## Color
| Parte | Normal | Hoy | Seleccionado |
| --- | --- | --- | --- |
| Círculo / píldora | — / `color.surface-container-low` | borde `color.primary` | `color.primary` |
| Número | `color.on-surface` | `color.primary` | `color.on-primary` |
| Puntos | gris `color.<asignatura>` + anillo `color.outline` | igual | en mes, fuera del círculo; en semana, con anillo exterior 1.5 dp `color.on-primary` |

## Estados
| Estado | Cómo se ve |
| --- | --- |
| Enabled | Ver color. |
| Hover | Capa `opacity.state.hover` en el círculo (mes) o la píldora (semana). |
| Pressed | Capa `opacity.state.pressed`. |
| Focused | Anillo `size.focus-ring` `color.secondary` en el círculo o la píldora. |
| Disabled | Número y puntos al 38 % (días fuera del curso). |

## Uso en Apunta+
Calendari: `button-group/connected` «Setmana / Mes» arriba y la rejilla elegida debajo. Tocar un día abre «Tasca trobada · <día>» con las tareas de ese día (list items). Día sin tareas → `EmptyState` «Aquest dia no hi ha res apuntat».

## Accesibilidad
El nombre de cada día incluye cuántas tareas tiene («4 de novembre, 3 tasques»); los puntos van con `aria-hidden`. Los puntos son información de apoyo: en grises se distinguen poco entre sí, así que el detalle con nombres está en la pantalla del día. El anillo `color.outline` (4.2:1) garantiza que todo punto se vea, también los grises claros (`color.groc`, `color.lila`).

## Corrección respecto a la media fidelidad
Filas de 32–34 dp (por debajo de 48) y, en el día seleccionado, los puntos se pintan en blanco y pierden el gris de la asignatura. Ahora la celda de mes mide 56 dp y los puntos quedan debajo del círculo; en la semana, el anillo `color.on-primary` mantiene el punto visible sobre `color.primary`.
