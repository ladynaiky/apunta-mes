import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ca } from '../../../i18n/ca';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';

/**
 * Missatge d'estat: vacío («No tens cap tasca pendent») o error
 * («No s’ha pogut carregar…» + «Torna-ho a provar»). Todo error lleva icono y texto.
 */
@Component({
  selector: 'ap-state-message',
  imports: [Icon, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-icon [name]="kind() === 'error' ? 'warning' : 'inbox'" [size]="48" />
    <h2>{{ title() }}</h2>
    @if (text()) {
      <p>{{ text() }}</p>
    }
    @if (kind() === 'error') {
      <button apButton type="button" variant="outlined" icon="refresh" (click)="retry.emit()">
        {{ retryLabel }}
      </button>
    }
    <ng-content />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-100);
      padding: var(--space-300) var(--space-200);
      text-align: center;
    }
    ap-icon { color: var(--color-primary); margin-bottom: var(--space-100); }
    :host(.error) ap-icon { color: var(--color-error); }
    h2 { margin: 0; font: 600 22px/28px var(--font-title); color: var(--color-on-surface); }
    p { margin: 0 0 var(--space-150); font: 400 14px/20px var(--font-text); letter-spacing: 0.25px; color: var(--color-on-surface-variant); }
  `,
  host: {
    '[class.error]': "kind() === 'error'",
    '[attr.role]': "kind() === 'error' ? 'alert' : 'status'",
  },
})
export class StateMessage {
  readonly kind = input<'empty' | 'error'>('empty');
  readonly title = input.required<string>();
  readonly text = input<string | null>(null);
  readonly retry = output<void>();
  protected readonly retryLabel = ca.state.retry;
}
