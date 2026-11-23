# Button

Botón de acción de MD3 Expressive: lanza una acción con una etiqueta verbal; hay un solo `button/filled` por pantalla.

**En el artefacto:** componente «Botó» (relleno, contorno, con icono) y botones de pantallas: «Entrar», «Buscar la tasca», «Generar l’enllaç», «Revisar la llista d’avisos», «Sí / No», «Descartar / Confirmar», «Editar / Compartir / Esborrar», «Cancel·lar», «Registra’t».

## Anatomía
1. Contenedor (forma `shape.corner.full`; square: `shape.corner.medium` en S, `shape.corner.large` en M).
2. Icono opcional a la izquierda (20 dp en S, 24 dp en M).
3. Etiqueta: `label-large` en S, `title-medium` en M.
4. Área táctil invisible de `size.touch-target` (48 dp).

## Variantes
| Nombre MD3 | Contenedor / contenido | Uso en Apunta+ |
| --- | --- | --- |
| `button/filled` | `color.primary` / `color.on-primary` | La acción principal de la pantalla: «Entrar», «Buscar la tasca», «Generar l’enllaç», «Confirmar». |
| `button/tonal` | `color.secondary-container` / `color.on-secondary-container` | Acciones secundarias destacadas: «Editar», «Compartir» en el bottom sheet. |
| `button/outlined` | borde `color.outline` / `color.on-surface-variant` | Alternativa a la principal: «No», «Tornar enrere». |
| `button/text` | sin contenedor / `color.primary` | Acciones de baja prioridad y de diálogo: «Cancel·lar», «Registra’t». |
| `button/tonal-error` (extensión) | `color.error-container` / `color.on-error-container` | Acción destructiva dentro del bottom sheet: «Esborrar». |

Tamaños: **S** = `size.button.s` (40 dp), padding `space.200`; **M** = `size.button.m` (56 dp), padding `space.300`. Usa M para la acción principal a ancho completo al pie de un formulario y S para el resto.

## Estados
| Estado | Cómo se ve |
| --- | --- |
| Enabled | Colores de la variante. |
| Hover | Capa del color del contenido a `opacity.state.hover`. |
| Pressed | Capa a `opacity.state.pressed` y la forma se comprime: S → `shape.corner.small`, M → `shape.corner.medium` (spring rápido). |
| Focused | Capa a `opacity.state.focus` + anillo `size.focus-ring` en `color.secondary`, separado 2 dp. |
| Disabled | Contenedor `color.on-surface` al `opacity.disabled.container`; texto al `opacity.disabled.content`. |

## Uso en Apunta+
- Iniciar sessió: «Entrar» = `button/filled` M a ancho completo; «Registra’t» = `button/text`.
- Tasca creada: «Sí» (`button/filled` S) y «No» (`button/outlined` S), mismo ancho, «Sí» a la derecha.
- Bottom sheet de tarea: «Editar» y «Compartir» `button/tonal` M; «Esborrar» `button/tonal-error` M; pie con «Tornar enrere» (`button/outlined`) y la confirmación (`button/filled`).

## Accesibilidad
- Etiqueta con verbo y, si hace falta, objeto: «Buscar la tasca», nunca «OK».
- Un botón solo con icono es un `icon-button`, no un button.
- Contraste de etiqueta ≥ 4.5:1 en todas las variantes y temas (ver tokens).

## Corrección respecto a la media fidelidad
Los botones miden 48 dp con etiqueta 16 px / 600. 48 dp no existe en la escala Expressive (32 / 40 / 56 / 96 / 136): pasa a M (56) cuando es la acción principal a ancho completo y a S (40 + área de 48) en el resto; la etiqueta usa `label-large` o `title-medium` (peso 500). El primer estilo del componente «Botó» (píldora gris con chevron) no es un botón: es un `list-item` de navegación (ver ListItem).
