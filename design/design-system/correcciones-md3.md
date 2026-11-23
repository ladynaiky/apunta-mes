# Correcciones MD3

Contradicciones entre «Apunta+ · Mitja fidelitat» y Material Design 3 Expressive. Manda MD3: aplica la columna «Solución» al pasar cada pantalla a alta fidelidad.

| # | En la media fidelidad | Qué dice MD3 Expressive | Solución en el sistema |
| --- | --- | --- | --- |
| 1 | Botones de 48 dp con etiqueta 16 px / 600 («Entrar», «Buscar la tasca», «Generar l’enllaç»). | Tamaños de botón: XS 32, S 40, M 56, L 96, XL 136. Etiqueta `label-large` (S) o `title-medium` (M), peso 500. | Acción principal a ancho completo = `button/filled` M (56 dp). Acciones en pareja o en línea = S (40 dp + área de 48). Ver **Button**. |
| 2 | Primer estilo de «Botó»: píldora gris con texto y chevron («Veure el llistat de tasques», «Obrir la checklist»). | Un acceso que navega es un list item, no un botón. | `list-item` de navegación en lista segmentada Expressive. Ver **ListItem**. |
| 3 | Etiqueta del campo encima de la caja (14 px / 500) y caja de 48 dp. | Outlined text field de 56 dp con la etiqueta dentro, que flota sobre el borde. | `text-field/outlined` de 56 dp; aplica a «Camp» y a todos los desplegables. Ver **TextField** y **Menu**. |
| 4 | Navigation bar de 72 dp; etiqueta activa en 700 y `color.on-surface`; icono activo igual que el inactivo. | Navigation bar flexible de 64 dp (la de 80 ya no se recomienda); indicador 56 × 32; activo: icono relleno y etiqueta en secondary. | `navigation-bar/flexible` de 64 dp, icono FILL 1 y `label-medium-emphasized` en `color.secondary`. Ver **NavigationBar**. |
| 5 | El componente se llama «Barra de pestanyes». | Navigation bar ≠ tabs. | Renombrar a `navigation-bar`; «tabs» queda solo para El meu espai. |
| 6 | FAB circular. | El FAB tiene esquina `large` (16 dp); solo el botón de cierre del FAB menu es redondo. | `fab/primary-container` con `shape.corner.large`. Ver **Fab**. |
| 7 | Ítems del FAB menu con etiqueta 16 px / 600. | `title-medium` (500). | `fab-menu/item` con `title-medium`. |
| 8 | Badge de 20 × 20 px con número 12 px / 600. | Large badge de 16 dp, `label-small` (11 / 16, 500). | `badge/large`. Ver **Badge**. |
| 9 | Filas de lista de 48 dp (una línea) y 55 dp (dos líneas). | List item de 56 dp (una línea) y 72 dp (dos líneas). | `list-item/one-line` y `list-item/two-line`. |
| 10 | Iconos de 20 dp en icon buttons de 40 dp (compartir, editar, esborrar). | Icon button S: contenedor 40, icono 24, área 48. | Iconos de 24 dp (Material Symbols). Ver **IconButton**. |
| 11 | Acción final de la fila de tarea: «compartir» en el componente y «⋮» en Inici. | Una sola acción final por list item. | `more_vert` por defecto (abre el bottom sheet, que ya incluye «Compartir»); `share` solo en listas de compartir. |
| 12 | Filas del calendario y del date picker de 32–36 dp. | Celdas de día de 48 dp (círculo de 40). | `calendar/month` con celda de 56 dp y `date-picker/modal` con celda de 48. Ver **Calendar** y **DatePicker**. |
| 13 | En el día seleccionado, los puntos de asignatura se pintan en blanco. | — (accesibilidad: el color es información). | Mes: puntos fuera del círculo. Semana: anillo `color.on-primary` alrededor del punto. |
| 14 | «Tria el dia»: título 18 px / 600 y acciones outlined + filled de 48 dp con icono. | Date picker: cabecera con `headline-large`; acciones `button/text` a la derecha. | `date-picker/modal`. |
| 15 | Selector «Setmana / Mes» como segmented button con borde y divisor (44 dp). | Expressive sustituye el segmented button por el connected button group (40 dp). | `button-group/connected`. Ver **ButtonGroup**. |
| 16 | Menú con esquina 12, ítems de 40 dp con divisores; elegido solo en negrita. | Menú Expressive: esquina 16, ítems de 48 dp sin divisores, elegido con secondary-container. | `menu/dropdown`. Ver **Menu**. |
| 17 | Tabs de El meu espai a 12 px con icono de 16 px en línea; inactivas en on-surface. | Primary tabs: `title-small` (14 / 20, 500), icono de 24 dp encima o sin icono; inactivas en on-surface-variant. | `tabs/primary` solo texto (48 dp). Ver **Tabs**. |
| 18 | Títulos a 18 px / 600 (fecha de Inici, estados vacíos, «Vols compartir?», «Tria el dia»). | Fuera de la escala tipográfica. | Fecha de Inici → `title-medium` (como indica el PDF); estados vacíos y «Vols compartir?» → `title-large` (22 / 28); «Tria el dia» → texto de apoyo `label-large` del date picker. |
| 19 | Diálogo «Esborrar contacte?» sobre `#F7F3F2` con «Esborrar» como botón relleno rojo. | Diálogo en surface-container-high; acciones como text buttons. | `dialog/basic`: `color.surface-container-high`, «Cancel·lar» y «Esborrar» como `button/text` (la destructiva en `color.error`). Ver **Dialog**. |
| 20 | Chips de asignatura no interactivos (son `div`). | Los chips son siempre interactivos. | `chip/filter` que filtra las tareas por asignatura. Ver **Chip**. |
| 21 | Checkbox dentro de un botón de 36 × 48. | Área táctil de 48 × 48. | `checkbox` con área de 48. |
| 22 | Capa de estado al pulsar al 12 %; anillo de foco en primary. | Pulsado 10 %; indicador de foco de 3 dp en secondary. | `opacity.state.pressed` 0.1 y anillo `color.secondary`. |
| 23 | «Registra’t»: texto subrayado 14 px / 600. | Text button. | `button/text` con `label-large`. |
| 24 | Tipografía Inter. | Familia de referencia: Roboto Flex. | `--font-sans` = Roboto Flex. |
| 25 | Muestras de color con área de toque de 36 dp. | Área mínima de 48 dp. | `SwatchPicker` con área de 48 y relleno de 36. |
| 26 | Pantallas intermedias «Tasca creada» y «Enllaç copiat». | Feedback breve sin interrumpir: snackbar. | Recomendado (decisión de flujo del grupo): `snackbar` con «Desfer». |
