# ButtonGroup

Grupo de botones conectados de MD3 Expressive para elegir una sola opción entre dos o tres; sustituye al segmented button.

**En el artefacto:** componente «Calendari de setmana i mes» (selector «Setmana / Mes» dibujado como segmented button con borde, divisor y check).

## Anatomía
1. Contenedor del grupo (sin fondo), botones separados `space.25` (2 dp).
2. Botón: altura `size.button.s`, esquinas exteriores redondas y esquinas interiores `shape.corner.small`.
3. Icono de check (20 dp) solo en el seleccionado.
4. Etiqueta `label-large`.

## Variantes
- `button-group/connected` · 2 opciones («Setmana / Mes»). Admite 3 («Dia / Setmana / Mes») si se añade la vista diaria.

## Color
| Parte | No seleccionado | Seleccionado |
| --- | --- | --- |
| Contenedor | `color.secondary-container` | `color.primary` |
| Etiqueta e icono | `color.on-secondary-container` | `color.on-primary` |
| Forma | esquinas interiores `shape.corner.small` | píldora completa (morph) |

## Estados
| Estado | Cómo se ve |
| --- | --- |
| Enabled | Ver tabla de color. |
| Hover | Capa `opacity.state.hover` del color del contenido. |
| Pressed | Capa `opacity.state.pressed`; el botón pulsado se ensancha ligeramente y empuja al vecino (spring rápido). |
| Focused | Anillo `size.focus-ring` `color.secondary`. |
| Disabled | Contenedor `color.on-surface` al 12 %, etiqueta al 38 %. |

## Uso en Apunta+
Calendari (nivel 2): «Setmana / Mes» a ancho completo bajo la top app bar; la opción elegida cambia la rejilla del `Calendar` (semana o mes).

## Accesibilidad
`role="group"` con `aria-label="Vista del calendari"`; cada botón con `aria-pressed`. El seleccionado se distingue por relleno (5.2:1 entre `color.primary` y `color.secondary-container`), check y forma, no solo por color.

## Corrección respecto a la media fidelidad
El artefacto usa un segmented button de 44 dp con borde y divisor. MD3 Expressive lo sustituye por el connected button group: 40 dp (área 48), botones separados 2 dp y el seleccionado en píldora.
