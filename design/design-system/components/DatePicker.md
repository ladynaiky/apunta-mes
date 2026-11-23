# DatePicker

Modal date picker de MD3 para elegir el día de una tarea, examen, excursión o aniversario («Tria el dia»).

**En el artefacto:** pantalla «Triar el dia» y componente «Calendari per triar»; versión integrada en el editor del bottom sheet.

## Anatomía
1. Velo `color.scrim` al `opacity.scrim`.
2. Contenedor 360 dp, `color.surface-container-high`, forma `shape.corner.extra-large`, `elevation.level3`.
3. Cabecera: texto de apoyo «Tria el dia» (`label-large`, `color.on-surface-variant`) y fecha elegida «Dc., 4 de nov.» (`headline-large`); divisor `color.outline-variant`.
4. Navegación de mes: «Novembre 2026» (`label-large`) + `icon-button` `chevron_left` / `chevron_right`.
5. Rejilla: días de la semana (`body-large`) y días en círculos de `size.day` (40 dp) dentro de celdas de 48 dp.
6. Acciones: `button/text` «Descartar» y «Confirmar», alineadas a la derecha.

## Variantes
- `date-picker/modal` (Triar el dia).
- `date-picker/docked` dentro del bottom sheet de edición (misma rejilla, contenedor `color.surface-container-high` con `shape.corner.large`).

## Color
Día: `color.on-surface`. Hoy: borde 1 dp y número en `color.primary`. Seleccionado: círculo `color.primary`, número `color.on-primary`.

## Estados
| Estado | Cómo se ve |
| --- | --- |
| Enabled | Ver color. |
| Hover | Capa circular `opacity.state.hover`. |
| Pressed | Capa `opacity.state.pressed`. |
| Focused | Anillo `color.secondary` (flechas mueven el foco por la rejilla). |
| Disabled | Número al 38 % (días no elegibles). |

## Uso en Apunta+
Se abre desde el campo «Data» (icono `calendar_today`) de los modales «Apuntar…» y desde el editor de la tarea. «Confirmar» escribe la fecha en formato largo en el campo.

## Accesibilidad
`role="dialog"` con nombre «Tria el dia»; rejilla `role="grid"`; cada día con nombre completo («13 de novembre»). Celdas de 48 dp.

## Corrección respecto a la media fidelidad
Título 18 px / 600, filas de 36 dp y acciones como botones outlined + filled de 48 dp con icono. MD3: cabecera con `headline-large`, celdas de 48 dp y acciones como `button/text` a la derecha.
