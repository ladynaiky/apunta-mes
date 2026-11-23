# Tabs

Primary tabs de MD3 para cambiar entre las cuatro secciones de El meu espai sin salir de la pantalla.

**En el artefacto:** componente «Contingut d’El meu espai» (pestañas Avisos, Compartir, Personalitzar, Sincronitzar con icono en línea y subrayado).

## Anatomía
1. Contenedor `color.surface` con divisor inferior de 1 dp `color.outline-variant`.
2. Tab de `size.tab` (48 dp), ancho repartido (tabs fijas).
3. Etiqueta `title-small`.
4. Indicador de `size.tab-indicator` (3 dp) bajo la etiqueta activa, con esquinas superiores redondeadas.

## Variantes
- `tabs/primary` · solo texto (48 dp) — la recomendada para Apunta+.
- `tabs/primary` · icono encima + texto (64 dp) si se quieren conservar los iconos `notifications`, `share`, `edit`, `sync`.

## Color
Activa: etiqueta e indicador `color.primary`. Inactiva: `color.on-surface-variant`.

## Estados
| Estado | Cómo se ve |
| --- | --- |
| Enabled | Ver color. |
| Hover | Capa `opacity.state.hover` en toda la tab. |
| Pressed | Capa `opacity.state.pressed`. |
| Focused | Capa `opacity.state.focus` + anillo `color.secondary`. |
| Disabled | Etiqueta `color.on-surface` al 38 %. |

## Uso en Apunta+
El meu espai: «Avisos», «Compartir», «Personalitzar», «Sincronitzar». El contenido de cada tab va debajo, con margen `space.200`.

## Accesibilidad
`role="tablist"`, `role="tab"` y `aria-selected`; flechas izquierda/derecha para moverse. Prueba a 360 dp: «Personalitzar» y «Sincronitzar» son largas; si no caben, pasa a tabs desplazables, nunca reduzcas la letra.

## Corrección respecto a la media fidelidad
Etiquetas a 12 px (activa 700) con icono de 16 px en línea, e inactivas en `color.on-surface`. En MD3: `title-small` (14 / 20, 500), iconos de 24 dp y encima (o sin icono), inactivas en `color.on-surface-variant`.
