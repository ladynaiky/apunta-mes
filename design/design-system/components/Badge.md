# Badge

Badge de MD3 para contar tareas o avisos pendientes sobre un icono o dentro de un chip.

**En el artefacto:** círculo rojo de 20 px con el número en la acción de perfil de la capçalera («3») y en los chips de asignatura de Inici («Català 1», «Mates 1»…).

## Anatomía
1. Contenedor `color.error`, forma `shape.corner.full`.
2. Número `label-small` en `color.on-error` (solo en large).

## Variantes
| Nombre MD3 | Medidas | Uso |
| --- | --- | --- |
| `badge/large` | alto `size.badge.large` (16 dp), ancho mínimo 16, padding `space.50` | Número de avisos o tareas pendientes. Máximo 4 caracteres («99+»). |
| `badge/small` | `size.badge.small` (6 dp) | Novedad sin número. |

## Estados
No es interactivo: no tiene hover, pressed, focused ni disabled; hereda el estado de su contenedor.

## Uso en Apunta+
- Acción `account_circle` de la top app bar: avisos pendientes de El meu espai.
- Dentro de un chip de asignatura, al final: tareas pendientes de esa asignatura.

## Accesibilidad
El número se anuncia en el nombre del control que lo lleva («El meu espai, 3 avisos pendents»); el badge va con `aria-hidden` o con su propio `aria-label` si está dentro de un chip. `color.on-error` sobre `color.error`: 6.5:1 (claro) / 7.7:1 (oscuro).

## Corrección respecto a la media fidelidad
El artefacto usa 20 × 20 px y texto 12 px / 600. MD3: 16 dp de alto y `label-small` (11 / 16, 500).
