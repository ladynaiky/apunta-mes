import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { SubjectColorToken } from '../../utils/task-title';

/**
 * Punto de color de la asignatura (decorativo: el nombre siempre va escrito).
 * Lleva un anillo interior de 1 dp en color.outline para el contraste.
 */
@Component({
  selector: 'ap-subject-dot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styles: `
    :host {
      display: inline-block;
      flex: none;
      border-radius: 50%;
      background: var(--dot-color);
      box-shadow: inset 0 0 0 1px rgb(116 120 116 / 0.55);
    }
  `,
  host: {
    'aria-hidden': 'true',
    '[style.--dot-color]': "'var(--color-' + (color() ?? 'outline-variant') + ')'",
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
  },
})
export class SubjectDot {
  readonly color = input<SubjectColorToken | null>(null);
  readonly size = input(12);
}
