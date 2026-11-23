# SwatchPicker

Selector de color de asignatura: siete muestras circulares que funcionan como un grupo de radio; componente propio de Apunta+ construido con tokens MD3. En media fidelidad las muestras son grises.

**En el artefacto:** componente «Selector de color» (Taronja, Groc, Lila, Verd, Turquesa, Rosa, Blau, cada uno con su gris) en «Crear nova assignatura».

## Anatomía
1. Grupo `role="radiogroup"` con muestras separadas `space.100`.
2. Muestra: área de `size.touch-target` (48 dp) con relleno circular de `size.swatch` (36 dp) en el gris `color.<color>` y anillo interior de 1 dp `color.outline`.
3. Anillo de selección de 2 dp en `color.on-surface` sobre el área de 48.
4. Check de 20 dp en `color.on-<color>` dentro de la muestra elegida.
5. Nombre `label-medium` debajo; elegido en `label-medium-emphasized`.

## Variantes
Una sola: siete muestras, en este orden = `color.taronja` (#6D6D6D → alta fidelidad #CC5500), `color.groc` (#ABABAB → #B08800), `color.lila` (#979797 → #9A6ADE), `color.verd` (#595959 → #2E8540), `color.turquesa` (#828282 → #00879A), `color.rosa` (#444444 → #D02670), `color.blau` (#2F2F2F → #1F4FB8). Los nombres son los del color que tendrán en alta fidelidad; al pasar a color solo cambian los valores. Cada muestra es, por defecto, la de una asignatura (Castellà, Català, Anglès, Socials, Plàstica, Música, Mates).

## Estados
| Estado | Cómo se ve |
| --- | --- |
| Enabled | Relleno del color; nombre en `color.on-surface`. |
| Hover | Capa circular `color.on-surface` a `opacity.state.hover` en el área de 48. |
| Pressed | Capa a `opacity.state.pressed`. |
| Focused | Anillo `size.focus-ring` `color.secondary` alrededor del área. |
| Disabled | Relleno y nombre al 38 % (p. ej., si se limita el color a uno por asignatura). |
| Seleccionada | Anillo 2 dp `color.on-surface` + check + nombre enfatizado. |

## Uso en Apunta+
Diálogo «Crear nova assignatura»: campo «Nom de l’assignatura» y debajo «Color» con las siete muestras en una fila (celdas de 52 dp dentro de los 370 dp del contenido); «Crear assignatura» como acción principal.

## Accesibilidad
`role="radio"` + `aria-checked`, flechas para moverse. Cada muestra lleva su nombre escrito: los grises vecinos se parecen (1.4:1). `color.groc` (2.2:1) y `color.lila` (2.8:1) no llegan solos al 3:1 sobre surface; el anillo `color.outline` (4.2:1) hace visible la forma. El check usa `color.on-<color>` (≥ 4.5:1).

## Notas MD3
MD3 no tiene un componente de muestras de color: este se apoya en la semántica de radio button y en los extended colors del Theme Builder. En el artefacto el área de toque de cada muestra es de 36 dp: ampliar a 48.
