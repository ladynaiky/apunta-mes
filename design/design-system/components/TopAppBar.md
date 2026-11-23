# TopAppBar

Small top app bar de MD3: título de la pantalla, «Enrere» cuando hay jerarquía y como máximo una o dos acciones a la derecha.

**En el artefacto:** componente «Capçalera» (con enrere + acción con badge, con enrere, solo título) y la cabecera de todas las pantallas.

## Anatomía
1. Contenedor de `size.app-bar.small` (64 dp), padding lateral `space.50`.
2. Icono de navegación opcional (`icon-button/standard`, `arrow_back`, color `color.on-surface`).
3. Título `title-large`, `color.on-surface`, alineado a la izquierda (empieza a 16 dp si no hay icono, a 56 dp si lo hay).
4. Acción final opcional: `account_circle` con `badge/large` de avisos pendientes.

## Variantes
- `top-app-bar/small` · solo título (pantallas de nivel 1 sin acción y confirmaciones).
- `top-app-bar/small` · título + acción (Inici, IA: acceso a El meu espai con badge).
- `top-app-bar/small` · enrere + título (nivel 2 y 3).

## Color
Reposo: `color.surface`. Con contenido desplazado debajo: `color.surface-container` (sin sombra). Icono de navegación `color.on-surface`; acción `color.on-surface-variant`.

## Estados
La barra no tiene estados propios; sus icon buttons siguen IconButton (hover, pressed, focused y disabled).

## Uso en Apunta+
«Apunta+» en Inici con la acción de perfil y el badge «3»; «Personalització», «Sincronitzar», «Buscar/Filtrar» con «Enrere».

## Accesibilidad
El título es el `h1` de la pantalla. La acción de perfil anuncia el número: «El meu espai, 3 avisos pendents».

## Corrección respecto a la media fidelidad
Medidas correctas (64 dp, `title-large`). Solo cambia el badge (20 px → `size.badge.large`, 16 dp) y el icono de persona pasa a Material Symbols `account_circle`.
