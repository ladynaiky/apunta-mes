Apunta+ es la agenda escolar del alumnado y su familia: tareas, exámenes, excursiones y aniversarios en un solo lugar, en catalán y en un móvil Android de 412 × 892 dp. Este sistema recoge los 20 componentes de la media fidelidad («Apunta+ · Mitja fidelitat») corregidos según Material Design 3 Expressive. Seguimos en media fidelidad: todo es gris y el único color es el rojo de error. Los tokens ya llevan sus nombres definitivos, así que al pasar a alta fidelidad bastará con cambiar sus valores. Regla de oro: si un elemento no está aquí, no va en la pantalla; si falta, se propone en «Sugerencias».

## Principios

- **Todo en grises salvo el error.** Seguimos en media fidelidad: la interfaz usa el esquema monocromo del Theme Builder (seed `#808080`), las asignaturas usan siete grises (uno por asignatura) y el único color activo es el rojo de `color.error`.
- **Jerarquía por forma, tamaño y tono, no por color.** `color.primary`, `color.secondary` y `color.tertiary` son grises casi iguales: destaca con tamaño de texto, peso enfatizado, contenedor y forma.
- **Una sola acción fuerte.** Un `button/filled` por pantalla, abajo, en la zona del pulgar; el resto, tonal, outlined o text.
- **Nunca solo el tono.** Todo punto o chip de asignatura tiene el nombre escrito en algún lugar visible; todo error lleva icono y texto.
- **48 dp para todo lo que se toca**, aunque el elemento visible mida 18, 36 o 40.
- **Roles, nunca hexadecimales.** En Figma y en código, asigna siempre el token (`color.surface-container`): así el tema oscuro y el paso a color funcionan sin retoques.

## Contenido y tono

- Interfaz en catalán; mayúscula solo en la primera palabra: «Tasques d’avui», «Generar l’enllaç», «Crear nova assignatura».
- Acciones con verbo en infinitivo y objeto cuando haga falta: «Buscar la tasca», «Revisar la llista d’avisos», «Compartir». Nunca «OK» ni «Acceptar» a secas.
- Mensajes en segunda persona, cercanos y cortos: «Quan apuntis una tasca, la veuràs aquí.», «Així no has d’apuntar el mateix a diversos llocs.»
- Preguntas de confirmación directas: «Vols compartir?», «Esborrar contacte?». La acción que confirma repite el verbo: «Esborrar».
- Errores = qué ha pasado + qué hacer: «No s’han pogut carregar els exàmens.» / «Comprova la connexió i torna-ho a provar.»
- Tarea = «Assignatura: acció»: «Mates: exercicis, pàg. 12», «Anglès: preparar la redacció (dv. 6)».
- Fechas largas en títulos («Dimecres 4 de novembre», «Setmana del 2 al 8 de novembre») y abreviadas donde falta sitio («Dc., 4 de nov.», «dv. 6»). Días de la semana: Dl Dt Dc Dj Dv Ds Dg; la semana empieza en lunes.
- Sin emoji en los textos; los iconos son Material Symbols.

## Color

### Roles MD3 (esquema monocromo)

| Uso | Token |
| --- | --- |
| Fondo de pantalla y top app bar en reposo | `color.surface` |
| Navigation bar, top app bar con scroll, cabeceras de sección, menús, lista segmentada | `color.surface-container` |
| Bottom sheet, píldoras de semana | `color.surface-container-low` |
| Diálogos y date picker | `color.surface-container-high` |
| Texto principal | `color.on-surface` |
| Texto secundario, iconos inactivos, placeholders | `color.on-surface-variant` |
| Acción principal, checkbox marcado, día elegido, opción elegida del button group, indicador de tab, campo con foco | `color.primary` / `color.on-primary` |
| FAB y FAB menu | `color.primary-container` / `color.on-primary-container` |
| Indicador activo de navegación, chip seleccionado, opción elegida del menú, button/tonal, opción no elegida del button group | `color.secondary-container` / `color.on-secondary-container` |
| Etiqueta activa de navegación y anillo de foco | `color.secondary` |
| Borde de campos y de button/outlined; anillo de puntos y muestras de asignatura | `color.outline` |
| Divisores, borde de chips y de icon-button/outlined (decorativo) | `color.outline-variant` |
| Errores, badges de pendientes, esborrar | `color.error`, `color.error-container` y sus `on-` |
| Snackbar | `color.inverse-surface`, `color.inverse-on-surface`, `color.inverse-primary` |
| Velo de diálogos, bottom sheet y FAB menu | `color.scrim` al `opacity.scrim` |

- No uses `color.tertiary` para jerarquía: en este tema es un gris más.
- `color.outline-variant` mide 1.6:1 sobre `color.surface`: sirve para separar, nunca como único límite de un control sin texto.
- El indicador activo de la navigation bar (`color.secondary-container` sobre `color.surface-container`) queda en 1.1:1 en claro y 1.8:1 en oscuro: el destino activo se marca también con el icono relleno y la etiqueta `label-medium-emphasized` en `color.secondary`.

### Asignaturas en grises (media fidelidad)

Cada asignatura tiene ya su color de alta fidelidad (paleta del 16/11/2026, columna «Alta fidelidad»), pero mientras el proyecto siga en media fidelidad se pinta con uno de los siete grises del selector de color. Los grises siguen el orden de luminosidad de su color, del más oscuro (Mates) al más claro (Català). Los tokens llevan el nombre del color (`color.blau`, `color.turquesa`…): al pasar a color solo cambiarán los valores, no los nombres ni los componentes.

| Asignatura | Alias | Token | Claro | Oscuro | Alta fidelidad |
| --- | --- | --- | --- | --- | --- |
| Castellà | `color.castella` | `color.taronja` | `#6D6D6D` | `#A7A7A7` | `#CC5500` |
| Català | `color.catala` | `color.groc` | `#ABABAB` | `#6C6C6C` | `#B08800` |
| Anglès | `color.angles` | `color.lila` | `#979797` | `#838383` | `#9A6ADE` |
| Socials | `color.socials` | `color.verd` | `#595959` | `#BBBBBB` | `#2E8540` |
| Plàstica | `color.plastica` | `color.turquesa` | `#828282` | `#959595` | `#00879A` |
| Música | `color.musica` | `color.rosa` | `#444444` | `#CFCFCF` | `#D02670` |
| Mates | `color.mates` | `color.blau` | `#2F2F2F` | `#E3E3E3` | `#1F4FB8` |

- Usa `color.<asignatura>` solo en tres sitios: el punto de la fila, los puntos del calendario y la muestra del selector. Ningún otro elemento se tiñe de asignatura: chips seleccionados, fondos y textos usan los roles neutros (`color.secondary-container`, `color.on-surface`…).
- Todo punto y toda muestra llevan un anillo interior de 1 dp en `color.outline`. `color.groc` (2.2:1) y `color.lila` (2.8:1; 2.4:1 en diálogos) no llegan solos al 3:1; con el anillo, el contorno se ve a 3.5:1 o más sobre cualquier superficie (4.2:1 sobre `color.surface`).
- Los grises vecinos se parecen (1.3–1.4:1 entre sí): la asignatura se identifica por su nombre escrito; el punto es apoyo.
- Las siete asignaturas tienen ahora gris propio: Castellà (`color.taronja`) y Plàstica (`color.turquesa`) ya no lo comparten.
- Los colores de alta fidelidad tienen una luminosidad parecida (de 3.3:1 a 7.3:1 sobre blanco): pasados a escala de grises directa, varios coincidirían. Por eso cada uno tiene un escalón de gris fijo en vez de su equivalente exacto.
- En pantalla nombra siempre la asignatura por su alias (`color.mates`), no por el gris (`color.blau`): si el alumno elige otra muestra, solo cambia el alias.
- Sobre una muestra, el check usa `color.on-<color>`.

### El único color: error

`color.error`, `color.error-container` y sus `on-` son el único color de la interfaz: validaciones («Format de correu no vàlid»), estados de error, badges de pendientes, el icono de esborrar y el banner de borrado. No los uses para decorar ni para destacar algo que no sea un aviso.

### Tema oscuro

Todos los roles tienen valor oscuro (columna «Oscuro» de Colores). No ajustes nada a mano: cambia el tema y los componentes siguen. En oscuro la elevación se nota sobre todo por el tono del contenedor (`color.surface-container-*`), no por la sombra. El artefacto solo define los grises de asignatura en claro: los del tema oscuro son derivados (ver «Verificación»).

## Tipografía

Familia: **Roboto Flex** (`--font-sans`), la de referencia de MD3 Expressive; el artefacto la sustituye por Inter. La familia definitiva se decide en la sesión de tipografía; hasta entonces, Roboto Flex. Escala MD3 (tamaño / interlineado / peso):

| Rol | Uso en Apunta+ |
| --- | --- |
| `display-small` 36/44 | Nombre de la app en la pantalla de bienvenida. |
| `headline-large` 32/40 | Fecha elegida en el date picker. |
| `headline-small` 24/32 | Título de diálogo. |
| `title-large` 22/28 | Título de top app bar, de bottom sheet y de estado vacío. |
| `title-medium` 16/24 · 500 | Fecha del día en Inici («Dimecres 4 de novembre»), título de periodo del calendario, botón M, ítem del FAB menu. |
| `title-small` 14/20 · 500 | Tabs, etiquetas de grupo («Diàries», «Assignatures»). |
| `body-large` 16/24 | Tarea en listas, valor de campo, ítem de menú, día del calendario. |
| `body-medium` 14/20 | Texto de apoyo («Per a avui»), diálogos, snackbar. |
| `body-small` 12/16 | Ayuda y error de campo, etiqueta flotante. |
| `label-large` 14/20 · 500 | Botones S, chips, acciones. |
| `label-medium` 12/16 · 500 | Navigation bar, días de la semana, nombre de muestra. |
| `label-small` 11/16 · 500 | Número del badge. |

- Enfatizado (Expressive): mismo tamaño, más peso (400 → 500, 500 → 700). Úsalo para estados elegidos y cabeceras: `title-medium-emphasized` en «Tasques d’avui», `label-medium-emphasized` en el destino activo, `body-large-emphasized` en la opción elegida de un menú.
- No uses tamaños fuera de la escala (18 px / 600 del artefacto pasa a `title-large`).
- El texto se mide en sp: deja que crezca con la letra del sistema; no fijes alturas que lo corten.

## Espaciado y layout

- Marco 412 × 892 dp; prueba también a 360 dp. 1 px = 1 dp. Las pantallas del artefacto miden 402 × 874: pásalas al marco de 412 del curso.
- Cada pantalla: top app bar de 64 dp, un único panel desplazable con márgenes laterales `space.200` y navigation bar de 64 dp; el FAB flota a `space.200` de los bordes sobre la navigation bar.
- Solo valores de la escala: `space.25` (2) … `space.900` (72).
- El espacio de dentro siempre menor que el de fuera: dentro de un grupo `space.50`–`space.100`; padding de contenedor `space.200`; entre componentes iguales `space.100`; entre componentes distintos `space.150`–`space.200`; entre secciones `space.300`–`space.400`.
- Título, chips, listas y botones empiezan en el margen de 16 dp.

## Forma (Expressive)

| Token | Dónde |
| --- | --- |
| `shape.corner.extra-small` 4 | Text field, snackbar, ítems internos de lista segmentada |
| `shape.corner.small` 8 | Chips, esquinas internas del button group, botón S pulsado |
| `shape.corner.medium` 12 | Cabeceras de sección, ítems de menú, botón S cuadrado |
| `shape.corner.large` 16 | FAB, menús, extremos de lista segmentada, banners |
| `shape.corner.extra-large` 28 | Diálogos, date picker, bottom sheet |
| `shape.corner.full` | Botones, icon buttons, badges, indicadores, píldoras |

Los botones son redondos por defecto y se comprimen al pulsar (shape morph). Las formas expresivas (soft burst, cookie, pill…) quedan reservadas para un futuro loading indicator (ver «Sugerencias»); el isotipo es un cuadrado redondeado propio, no usa la escala.

## Elevación

`elevation.level0` listas y superficies planas · `elevation.level1` bottom sheet · `elevation.level2` menús · `elevation.level3` FAB, FAB menu, diálogos, date picker, snackbar · `elevation.level4` FAB en hover. No inventes sombras.

## Movimiento

Expressive usa springs en lugar de curvas. Aproximación CSS para prototipos:
- Espacial rápido (botones, chips, icon buttons, morph de forma): `cubic-bezier(0.42, 1.67, 0.21, 0.9)`, 350 ms.
- Espacial por defecto (bottom sheet, diálogos, FAB menu): `cubic-bezier(0.38, 1.21, 0.22, 1)`, 500 ms.
- Efectos (color, opacidad, capas de estado): `cubic-bezier(0.31, 0.94, 0.34, 1)`, 150 ms; sin rebote.
- Respeta «reducir movimiento» del sistema: sin rebote ni morph, solo fundidos.

## Iconografía

- **Material Symbols Rounded**, tamaño `size.icon` (24 dp), peso 400, grade 0, opsz 24; 20 dp dentro de botones S, 48 dp en estados vacíos.
- Contorno (FILL 0) por defecto; relleno (FILL 1) solo para el estado activo (navigation bar).
- Color por rol: `color.on-surface-variant` (iconos de apoyo), `color.on-surface` (navegación), el `on-` de su contenedor dentro de botones.

| Uso | Icono |
| --- | --- |
| Inici · Calendari · Tasques · IA | `home` · `calendar_month` · `checklist` · `auto_awesome` |
| El meu espai (perfil) | `account_circle` |
| Enrere · Abrir | `arrow_back` · `chevron_right` |
| Apuntar · Cerrar | `add` · `close` |
| Tasca · Examens · Excursions · Aniversaris | `assignment` · `lightbulb` · `landscape` · `cake` |
| Compartir · Opciones · Editar · Esborrar | `share` · `more_vert` · `edit` · `delete` |
| Avisos · Personalitzar · Sincronitzar | `notifications` · `edit` · `sync` |
| Fecha · Notas · Desplegable | `calendar_today` · `notes` · `arrow_drop_down` |
| Mostrar / ocultar contraseña | `visibility` · `visibility_off` |
| Vacío · Error · Hecho | `inbox` · `warning` · `check_circle` |
| Tasques d’avui · d’aquesta setmana | `sentiment_satisfied` · `date_range` |

Los iconos del artefacto están dibujados a mano (los de las filas y botones, a 20 dp); sustitúyelos por estos.

## Estados

- Capa de estado del color del contenido: hover `opacity.state.hover` (8 %), foco `opacity.state.focus` (10 %), pulsado `opacity.state.pressed` (10 %), arrastre `opacity.state.dragged` (16 %).
- Foco de teclado: anillo de `size.focus-ring` (3 dp) en `color.secondary`, separado 2 dp del elemento (≥ 5:1 sobre cualquier surface en claro, ≥ 7:1 en oscuro).
- Desactivado: contenedor `color.on-surface` al `opacity.disabled.container` (12 %), contenido al `opacity.disabled.content` (38 %). El FAB no se desactiva: se oculta.

## Accesibilidad

- Contraste AA verificado en los dos temas. Texto: todos los pares `on-` superan 4.5:1 (el más justo, 4.6:1, es la etiqueta del FAB; la mayoría, más de 6:1) y `color.on-surface-variant` da ≥ 7.2:1 sobre cualquier surface. Iconos y bordes de control ≥ 3:1. Checks sobre las muestras ≥ 4.4:1. Puntos y muestras de asignatura ≥ 3.5:1 gracias al anillo `color.outline`.
- Área táctil mínima `size.touch-target` en checkbox, icon buttons, chips, días del calendario y muestras de color.
- Los grises de asignatura no se distinguen bien entre sí: por eso el nombre va siempre escrito.
- Todo icon button lleva `aria-label` específico; los puntos de asignatura van con `aria-hidden` y su información está en el texto («4 de novembre, 3 tasques»).

## Nomenclatura

- Tokens con la convención MD3 por puntos; en Figma el punto es una barra: `color.primary` = `color/primary`, `shape.corner.large` = `shape/corner/large`, `space.200` = `space/200`. En CSS: `var(--color\.primary)`.
- Componentes por familia MD3 (`Button`, `IconButton`, `NavigationBar`…); las variantes se nombran `familia/variante`: `button/filled`, `icon-button/outlined`, `chip/filter`, `top-app-bar/small`, `navigation-bar/flexible`, `list-item/two-line`.
- Estilos de texto con el nombre del rol MD3 (`body-large`); en HTML se aplican con la clase del mismo nombre.

## Secciones de este sistema

- **Correcciones MD3**: cada contradicción entre la media fidelidad y MD3 Expressive, con su solución.
- **Sugerencias**: componentes que faltan en el artefacto y harían falta.
- **Verificación**: qué valores salen del Theme Builder o del artefacto, cuáles son derivados y qué hay que comprobar en m3.material.io antes de llevarlos a pantalla.
