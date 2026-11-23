# Snackbar

Snackbar de MD3: confirma en una línea lo que acaba de pasar y ofrece, como mucho, una acción («Desfer»).

**En el artefacto:** mensaje inferior tras editar o borrar en el bottom sheet de Inici y Tasca creada.

## Anatomía
1. Contenedor `color.inverse-surface`, forma `shape.corner.extra-small`, `elevation.level3`, alto mínimo 48 dp (68 dp en dos líneas).
2. Texto `body-medium` en `color.inverse-on-surface`.
3. Acción opcional `button/text` en `color.inverse-primary`.
4. Icono de cierre opcional (`close`) en `color.inverse-on-surface`.

## Variantes
- `snackbar` · una línea · con acción · dos líneas con cierre.

## Estados
El contenedor no tiene estados; la acción y el cierre siguen Button / IconButton.

## Uso en Apunta+
A `space.200` de los bordes, por encima de la navigation bar (y del FAB). Textos: «Enllaç copiat», «Tasca creada. Ja la tens al calendari.» + «Desfer». Desaparece a los 4–10 s; con acción, no antes de 10 s.

## Accesibilidad
`role="status"` (no roba el foco). Texto 11.6:1 y acción 7.7:1 sobre `color.inverse-surface`.

## Recomendación
Las pantallas intermedias «Tasca creada» y «Enllaç copiat» pueden sustituirse por este snackbar para no cortar el flujo (propuesta del PDF); la decisión de flujo es del grupo.
