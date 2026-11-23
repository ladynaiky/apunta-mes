# Sugerencias

Componentes que **no están** en la media fidelidad y que harían falta para cerrar los flujos. No forman parte de la librería hasta que el grupo los apruebe y se añadan a las pantallas de baja/media fidelidad.

| Componente MD3 | Por qué hace falta | Dónde | Tokens que usaría |
| --- | --- | --- | --- |
| `icon-button/filled` «Enviar» dentro del campo de la IA | La pantalla IA tiene «Escriu la teva pregunta» pero ninguna forma de enviarla. | IA | `text-field` con `shape.corner.full` + `icon-button/filled` (`color.primary`), icono `send`. |
| `loading-indicator` (Expressive) | Hay estados de error («No s’han pogut carregar…») pero ningún estado de carga: sincronizar, abrir el calendario, esperar a la IA. | Calendari, Examens/excursions, Sincronitzar, IA | Forma expresiva que se transforma, `color.primary`; versión «contained» sobre `color.secondary-container`. |
| `search-bar` → `search-view` | «Buscar/Filtrar» es un formulario con botón; el patrón MD3 es una barra de búsqueda que abre una vista con resultados y filter chips. | Buscar/Filtrar desde cada pantalla | `color.surface-container-high`, `shape.corner.full`, 56 dp; `chip/filter` para «Assignatura» y «Data». |
| `chip/input` (contactos) | «Desplegable de contactes» es una selección múltiple y hoy ofrece roles (Alumne / Pares / Profe) en vez de personas. | Compartir | `chip/input` con nombre y `close`, sobre `text-field/outlined`. |
| `switch` | Si «Avisos» debe permitir activar o desactivar notificaciones (avisos de tareas, de exámenes), el control MD3 es el switch, no un desplegable. | El meu espai · Avisos | `color.primary` / `color.on-primary`, pista `color.surface-container-highest`, borde `color.outline`. |
| `progress-indicator` (lineal, wavy) | Opcional: progreso de la checklist («2 de 5 fetes»). | Checklist | `color.primary` sobre `color.secondary-container`. |
| ~~Séptima muestra de asignatura~~ (aplicada el 16/11/2026) | Resuelto: la paleta tiene siete colores y Plàstica pasa a `color.turquesa`, distinta de Castellà (`color.taronja`). | Selector de color | `color.turquesa` / `color.on-turquesa`. |
| `navigation-rail` | Solo si Apunta+ se adapta a tableta o web (ventana ampliada ≥ 840 dp). | Sesión de responsive | `color.surface`, indicador `color.secondary-container`. |
