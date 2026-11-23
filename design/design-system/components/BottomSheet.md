# BottomSheet

Modal bottom sheet de MD3 con el detalle de una tarea y sus acciones (Editar, Compartir, Esborrar), sin salir de la lista.

**En el artefacto:** hoja que se abre con «⋮ Opcions de la tasca» en Inici y en Tasca creada (vista, edición con fecha y notas, confirmación de borrado) y su snackbar.

## Anatomía
1. Velo `color.scrim` al `opacity.scrim`.
2. Contenedor `color.surface-container-low`, esquinas superiores `shape.corner.extra-large`, `elevation.level1`, padding lateral `space.300`.
3. Tirador 32 × 4 dp, `color.on-surface-variant` al `opacity.drag-handle`.
4. Asignatura: punto + nombre `label-large` en `color.on-surface-variant`.
5. Título de la tarea `title-large`.
6. Filas de información: icono 24 dp + `body-large` (fecha `calendar_today`, notas `notes`).
7. Acciones: tres botones M — `button/tonal` «Editar», `button/tonal` «Compartir», `button/tonal-error` «Esborrar».
8. Banner de confirmación: `color.error-container` / `color.on-error-container`, `shape.corner.large`.
9. Pie con divisor `color.outline-variant`: `button/outlined` «Tornar enrere» + `button/filled` de confirmación.

## Variantes
- `bottom-sheet/modal` · vista de tarea.
- `bottom-sheet/modal` · edición (campos «Tasca», «Data» con date picker integrado, «Notes»; confirmación «Desar»).
- `bottom-sheet/modal` · confirmar borrado (banner visible, confirmación «Esborrar»).

## Estados
El contenedor no tiene estados; tirador arrastrable (dragged: capa `opacity.state.dragged`). Botones según Button.

## Uso en Apunta+
Toca `more_vert` en una fila de Inici → hoja con la tarea. Tras guardar o borrar, la hoja se cierra y aparece un `Snackbar` («Tasca esborrada.» + «Desfer»).

## Accesibilidad
`role="dialog"` + `aria-modal`, nombre = título de la tarea; foco al abrir en el título, Esc y el velo cierran, el foco vuelve al botón que la abrió. Botones con icono y texto.

## Notas MD3
`button/tonal-error` no es una variante estándar de MD3: es un button/tonal con los roles de error. Mantén un único `button/filled` por hoja (el del pie).
