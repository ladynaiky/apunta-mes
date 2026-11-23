# TextField

Outlined text field de MD3 para escribir datos: correo, contraseña, nombre de la tarea, notas, búsqueda y la pregunta a la IA.

**En el artefacto:** componente «Camp» (texto, desplegable, fecha) y los campos de Iniciar sessió, Registre, Sincronitzar, Buscar/Filtrar, IA y el editor del bottom sheet.

## Anatomía
1. Contenedor de `size.text-field` (56 dp), forma `shape.corner.extra-small`, borde 1 dp `color.outline`.
2. Etiqueta flotante `body-small` sobre el borde (en reposo y vacío, dentro del campo en `body-large`).
3. Valor `body-large` en `color.on-surface`; placeholder en `color.on-surface-variant`.
4. Icono final opcional de 24 dp (ojo, calendario, desplegable, error).
5. Texto de apoyo o de error `body-small`, a `space.200` del borde izquierdo.

## Variantes
- `text-field/outlined` · texto, correo, contraseña (icono `visibility` / `visibility_off`).
- `text-field/outlined` · fecha (solo lectura, icono `calendar_today`, abre `DatePicker`).
- `text-field/outlined` · desplegable: ver Menu (exposed dropdown).
- `text-field/outlined` · IA: forma `shape.corner.full` + `icon-button/filled` de enviar (ver sugerencias: falta en el artefacto).

## Estados
| Estado | Cómo se ve |
| --- | --- |
| Enabled | Borde 1 dp `color.outline`. |
| Hover | Borde 1 dp `color.on-surface`. |
| Pressed | No aplica: al tocar pasa a Focused. |
| Focused | Borde 2 dp `color.primary`, etiqueta en `color.primary`. |
| Disabled | Borde `color.on-surface` al 12 %, texto al 38 %. |
| Error | Borde `color.error` (2 dp con foco), etiqueta, icono y texto de error en `color.error`. |

## Uso en Apunta+
Iniciar sessió: «Correu electrònic» (placeholder «nom@exemple.com») y «Contrasenya» (con ojo). Error de formato: «Format de correu no vàlid (ex.: nom@exemple.cat).». Margen vertical entre campos `space.200`.

## Accesibilidad
La etiqueta es un `<label>` real, nunca solo placeholder. El error se anuncia con `role="alert"` y `aria-invalid`. Borde `color.outline` 4.2:1 sobre surface (≥ 3:1).

## Corrección respecto a la media fidelidad
El artefacto pone la etiqueta encima del campo (14 px / 500) y el campo mide 48 dp. En MD3 el outlined text field mide 56 dp y la etiqueta vive dentro y flota sobre el borde al enfocar o rellenar.
