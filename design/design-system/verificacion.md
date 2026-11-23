# Verificación

Origen de cada valor del sistema y qué falta comprobar antes de usarlo en pantallas definitivas («un valor que no habéis comprobado no llega a las pantallas»).

## Del Theme Builder (PDF «Apunta+ · Components MD3 Expressive», seed `#808080`)

Copiados sin tocar, claro y oscuro: `color.primary`, `color.primary-container`, `color.secondary`, `color.secondary-container`, `color.tertiary`, `color.tertiary-container`, `color.error`, `color.error-container`, los ocho `color.surface*`, `color.on-surface`, `color.on-surface-variant`, `color.outline`, `color.outline-variant`, `color.inverse-surface`, `color.inverse-primary`; y `color.on-secondary-container`, `color.on-error-container` (claro).

## Derivados (comprobar con el JSON del Theme Builder)

El PDF no lista los roles `on-` completos. Se han calculado con la lógica de tonos de MD3 y comprobado su contraste:

| Token | Claro | Oscuro | Cómo |
| --- | --- | --- | --- |
| `color.on-primary` | `#FFFFFF` | `#303030` | Tono 100 / 20. El PDF confirma onPrimary/primary ≈ 6.6:1 en claro. |
| `color.on-primary-container` | `#FEFCFC` | `#1B1C1C` | Claro: valor que usa el artefacto en el FAB menu. Oscuro: tono 10. |
| `color.on-secondary`, `color.on-tertiary` | `#FFFFFF` | `#313030`, `#323031` | Tono 100 / 20. |
| `color.on-tertiary-container` | `#FFFFFF` | `#1D1B1C` | Tono 100 / 10. |
| `color.on-error` | `#FFFFFF` | `#690005` | Paleta de error estándar de MD3. |
| `color.on-error-container` (oscuro) | — | `#FFDAD6` | Tono 90. |
| `color.on-secondary-container` (oscuro) | — | `#E4E2E1` | Tono 90. |
| `color.inverse-on-surface` | `#F4F0EF` | `#313030` | Claro: valor del snackbar del artefacto. |
| `color.scrim`, `color.shadow` | `#000000` | `#000000` | Estándar MD3. |

## Grises de asignatura (media fidelidad)

- Paleta de alta fidelidad (16/11/2026): Castellà `#CC5500`, Català `#B08800`, Anglès `#9A6ADE`, Socials `#2E8540`, Plàstica `#00879A`, Música `#D02670`, Mates `#1F4FB8`.
- Claro: siete grises ordenados por la luminosidad de esos colores, del más oscuro al más claro: `#2F2F2F` Blau (Mates), `#444444` Rosa (Música), `#595959` Verd (Socials), `#6D6D6D` Taronja (Castellà), `#828282` Turquesa (Plàstica), `#979797` Lila (Anglès), `#ABABAB` Groc (Català). Son los mismos valores del «Selector de color», de «Crear nova assignatura» y de los puntos de la media fidelidad.
- Oscuro (derivado): la misma escala invertida y comprimida entre L* 90 y 45 para que todos superen 3:1 sobre `color.surface` oscuro.
- Contraste sobre `color.surface` claro: `color.groc` 2.2:1 y `color.lila` 2.8:1 (2.4:1 en `color.surface-container-high`). Se resuelve con el anillo `color.outline` de 1 dp en puntos y muestras, sin tocar los valores del artefacto. Alternativa si el grupo prefiere grises que cumplan solos: oscurecer toda la escala (L* 10–59).
- En el artefacto, tres muestras seleccionadas del «Selector de color» cambian de gris al marcarse (Groc, Verd, Lila): es un error del wireframe; aquí la muestra mantiene su gris y solo gana anillo y check.
- Al pasar a alta fidelidad: añadir los siete colores como extended colors en el Theme Builder, regenerar el JSON y sustituir los valores conservando los nombres de token (y añadir entonces los roles `-container`).

## De la especificación MD3 Expressive (comprobar en m3.material.io, pestaña Specs)

- Escala de espacios y de esquinas, escala tipográfica, elevación y opacidades de estado: escala estándar de MD3 (también en los apuntes T21 y en el PDF).
- Medidas de componente (`size.*`): botones S 40 / M 56, FAB 56, app bar 64, navigation bar 64 e indicador 56 × 32, list items 56 / 72, text field 56, chip 32, badge 16 / 6, celdas de día 48.
- Por verificar con más cuidado: radio del botón pulsado (S → 8, M → 12), radio cuadrado (S 12, M 16), ítems del FAB menu (separación 4 dp, sombra), menú Expressive (padding 4, ítem con esquina 12), borde del `button/outlined` (outline frente a outline-variant) y las curvas CSS que aproximan los springs.
