# Menu

Menú de MD3 Expressive anclado a un campo (exposed dropdown) para elegir una opción de una lista corta: rol, asignatura, tipo de contenido, permisos, agrupación.

**En el artefacto:** «Desplegable d’assignatures», «Desplegable de rol», «Desplegable de tipus de contingut», «Desplegable de contactes» y los desplegables de Personalització, Compartir y Buscar/Filtrar.

## Anatomía
1. Campo ancla: `text-field/outlined` con icono `arrow_drop_down` (`arrow_drop_up` abierto).
2. Contenedor del menú: `color.surface-container`, forma `shape.corner.large`, `elevation.level2`, padding `space.50`.
3. Ítem de `size.menu-item` (48 dp), forma `shape.corner.medium`, etiqueta `body-large`.
4. Elemento inicial opcional (punto de asignatura) y check final en el seleccionado.

## Variantes
- `menu/dropdown` · simple (Rol: «Alumne», «Pares», «Profe»; Tipus de contingut: «Tasques», «Calendari»; Permisos: «Només veure»).
- `menu/dropdown` · asignaturas (con punto `color.<asignatura>` delante de cada nombre).

## Color
Ítem: `color.on-surface`. Seleccionado: fondo `color.secondary-container`, texto `color.on-secondary-container` en `body-large-emphasized` + check.

## Estados
| Estado | Cómo se ve |
| --- | --- |
| Enabled | Ver color. |
| Hover | Capa `opacity.state.hover` en el ítem. |
| Pressed | Capa `opacity.state.pressed`. |
| Focused | Capa `opacity.state.focus` + anillo `color.secondary` (navegación con flechas). |
| Disabled | Texto `color.on-surface` al 38 %. |

## Uso en Apunta+
Registre y Sincronitzar: «Rol» con «Tria el teu rol» como placeholder. Apuntar tasca: asignatura con su punto. Personalització: «Agrupar les tasques per» y «Marcar-les amb».

## Accesibilidad
Campo con `aria-haspopup="listbox"` y `aria-expanded`; menú `role="listbox"`, ítems `role="option"` + `aria-selected`. El seleccionado se marca con fondo, peso y check.

## Corrección respecto a la media fidelidad
Menú con esquina 12, ítems de 40 dp separados por divisores y el seleccionado solo en negrita. MD3 Expressive: esquina `shape.corner.large`, ítems de 48 dp sin divisores, seleccionado con `color.secondary-container` y check. El «Desplegable de contactes» ofrece roles (Alumne / Pares / Profe) en vez de contactos: ver sugerencias (input chips).
