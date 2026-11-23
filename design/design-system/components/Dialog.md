# Dialog

Basic dialog de MD3 para confirmar una decisión que interrumpe: esborrar un contacte, descartar cambios, compartir.

**En el artefacto:** diálogo «Esborrar contacte?» de Sincronitzar; la pregunta «Vols compartir?» de Tasca creada encaja también en este patrón.

## Anatomía
1. Velo `color.scrim` al `opacity.scrim`.
2. Contenedor `color.surface-container-high`, forma `shape.corner.extra-large`, `elevation.level3`, padding `space.300`, ancho 280–560 dp.
3. Título `headline-small` en `color.on-surface`.
4. Texto `body-medium` en `color.on-surface-variant`.
5. Acciones `button/text` alineadas a la derecha, separadas `space.100`; la confirmativa a la derecha.

## Variantes
- `dialog/basic` · confirmación.
- `dialog/basic` · destructivo: la acción que borra usa `button/text` con etiqueta en `color.error`.
- `dialog/form` (con campos) para «Crear nova assignatura»: mismo contenedor, `TextField` + `SwatchPicker`, acciones «Cancel·lar» / «Crear assignatura».

## Estados
El contenedor no tiene estados; las acciones siguen Button (`button/text`).

## Uso en Apunta+
«Esborrar contacte?» — «Vols esborrar Laia dels teus contactes? Aquesta acció no es pot desfer.» — «Cancel·lar» · «Esborrar».

## Accesibilidad
`role="alertdialog"` en destructivos, `aria-modal`, foco inicial en la acción segura («Cancel·lar»), Esc cierra. Texto 8.4:1 sobre `color.surface-container-high`.

## Corrección respecto a la media fidelidad
El contenedor usa `#F7F3F2` (surface-container-low) y la acción «Esborrar» es un botón relleno rojo. MD3: `color.surface-container-high` y acciones como `button/text`.
