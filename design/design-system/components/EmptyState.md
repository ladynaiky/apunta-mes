# EmptyState

Patrón de mensaje de estado (vacío, error o hecho) centrado en el panel de contenido; MD3 no lo define como componente, se construye con tokens y Button.

**En el artefacto:** componente «Missatge d’estat» (vacío, aviso, check) y todas las pantallas «· buit» y «· error» (Calendari, Examens/excursions, Llistat de tasques, Checklist, Historial, Avís de pendents, Tasca trobada).

## Anatomía
1. Icono de `size.icon.large` (48 dp): `inbox` (vacío), `warning` (error), `check_circle` (hecho).
2. Título `title-large` en `color.on-surface`.
3. Texto `body-medium` en `color.on-surface-variant`.
4. Acción opcional: `button/tonal` (o `button/outlined`) S.
5. Padding `space.400` vertical / `space.300` horizontal; separación interna `space.100`.

## Variantes
| Variante | Icono | Acción |
| --- | --- | --- |
| `empty-state/empty` | `inbox`, `color.on-surface-variant` | Opcional (el FAB ya permite apuntar). |
| `empty-state/error` | `warning`, `color.error` | «Torna-ho a provar» (`button/tonal`). |
| `empty-state/success` | `check_circle`, `color.on-surface-variant` | — |

## Estados
No interactivo; la acción sigue Button.

## Uso en Apunta+
- Vacío: «Aquest mes no hi ha res apuntat» / «Quan apuntis una tasca, la veuràs aquí.»
- Error: «No s’han pogut carregar els exàmens» / «Comprova la connexió i torna-ho a provar.»
- Hecho: «Tasca creada» / «Ja la tens al calendari.»

## Accesibilidad
El error usa `role="alert"`. El icono es decorativo (`aria-hidden`): el título dice lo que pasa. El error no se comunica solo con rojo: lleva icono y texto.

## Corrección respecto a la media fidelidad
Título a 18 px / 600, fuera de la escala MD3: pasa a `title-large` (22 / 28, 400). El icono de error pasa a `color.error`.
