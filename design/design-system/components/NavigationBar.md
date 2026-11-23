# NavigationBar

Navigation bar flexible de MD3 Expressive con los cuatro destinos de nivel 1, siempre visible al pie de la pantalla.

**En el artefacto:** componente «Barra de pestanyes» y la barra inferior de todas las pantallas (Inici, Calendari, Tasques, IA).

## Anatomía
1. Contenedor de `size.navigation-bar` (64 dp), `color.surface-container`.
2. Ítem vertical (móvil): indicador + etiqueta separados `space.50`, padding vertical `space.75`.
3. Indicador activo de `size.nav-indicator.width` × `size.nav-indicator.height` (56 × 32), forma `shape.corner.full`.
4. Icono de 24 dp: contorno en inactivo, relleno (FILL 1) en activo.
5. Etiqueta `label-medium`; activa `label-medium-emphasized`.

## Variantes
- `navigation-bar/flexible` · ítem vertical (móvil, < 600 dp).
- Ítem horizontal (icono y etiqueta en línea) para ventana media; en ampliada pasa a navigation rail (fuera de alcance hasta la sesión de responsive).

## Color
| Parte | Inactivo | Activo |
| --- | --- | --- |
| Indicador | — | `color.secondary-container` |
| Icono | `color.on-surface-variant` | `color.on-secondary-container`, relleno |
| Etiqueta | `color.on-surface-variant` | `color.secondary`, enfatizada |

## Estados
| Estado | Cómo se ve |
| --- | --- |
| Enabled | Ver tabla de color. |
| Hover | Capa `opacity.state.hover` dentro del indicador (56 × 32). |
| Pressed | Capa `opacity.state.pressed` en el indicador. |
| Focused | Anillo `size.focus-ring` `color.secondary` alrededor del indicador. |
| Disabled | No aplica. |

## Uso en Apunta+
Destinos e iconos: Inici `home`, Calendari `calendar_month`, Tasques `checklist`, IA `auto_awesome`. El FAB flota encima, a la derecha.

## Accesibilidad
`<nav aria-label="Navegació principal">`, destino actual con `aria-current="page"`. En el esquema monocromo el indicador (`color.secondary-container`) sobre `color.surface-container` da 1.1:1: el estado activo se comunica además con el icono relleno y la etiqueta enfatizada en `color.secondary`; no quites ninguna de las dos.

## Corrección respecto a la media fidelidad
La barra mide 72 dp: la flexible de MD3 Expressive mide 64 dp (la de 80 ya no se recomienda). El nombre «Barra de pestanyes» confunde con las tabs de El meu espai: llámala `navigation-bar`. El icono activo pasa a relleno y la etiqueta activa usa `color.secondary` (en el artefacto, `color.on-surface` en 700).
