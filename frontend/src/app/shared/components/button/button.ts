import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';

export type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text' | 'tonal-error';
export type ButtonSize = 's' | 'm';

/**
 * Botón MD3 Expressive sobre un <button> o <a> nativo:
 *   <button apButton variant="filled" size="m">Entrar</button>
 * Un solo «filled» por pantalla. S = 40 dp (zona táctil 48), M = 56 dp.
 */
@Component({
  selector: 'button[apButton], a[apButton]',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (icon()) {
      <ap-icon [name]="icon()!" [size]="size() === 'm' ? 24 : 20" />
    }
    <span class="label"><ng-content /></span>
  `,
  styleUrl: './button.scss',
  host: {
    '[class]': "'v-' + variant() + ' s-' + size() + (block() ? ' block' : '')",
  },
})
export class Button {
  readonly variant = input<ButtonVariant>('filled');
  readonly size = input<ButtonSize>('s');
  readonly icon = input<string | null>(null);
  /** Ancho completo (acción principal al pie de un formulario). */
  readonly block = input(false);
}
