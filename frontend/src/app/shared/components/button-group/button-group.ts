import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Icon } from '../icon/icon';

export interface ButtonGroupOption {
  value: string;
  label: string;
}

/**
 * Connected button group de MD3 Expressive («Setmana / Mes»): 40 dp, botones
 * separados 2 dp; el elegido en primary, con check y forma de píldora.
 */
@Component({
  selector: 'ap-button-group',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="group" role="group" [attr.aria-label]="label()">
      @for (o of options(); track o.value) {
        <button
          type="button"
          class="option"
          [class.selected]="o.value === value()"
          [attr.aria-pressed]="o.value === value()"
          (click)="valueChange.emit(o.value)"
        >
          @if (o.value === value()) {
            <ap-icon name="check" [size]="20" />
          }
          {{ o.label }}
        </button>
      }
    </div>
  `,
  styles: `
    /* Button group estándar (MD3 Expressive, iteración 2): todas las opciones son píldoras separadas 8 dp.
       Radio en px reales (mitad de la altura), nunca 9999px. */
    .group { --round: calc(var(--size-button-s) / 2); display: flex; gap: var(--space-100); }
    .option {
      position: relative;
      flex: 1;
      display: inline-flex; align-items: center; justify-content: center; gap: var(--space-100);
      height: var(--size-button-s);
      border: 0;
      border-radius: var(--round);
      background: var(--color-secondary-container);
      color: var(--color-on-secondary-container);
      font: 500 14px/20px var(--font-text);
      letter-spacing: 0.1px;
      cursor: pointer;
      transition: transform var(--motion-spatial-fast), background-color var(--motion-effects);
    }
    .option::before { content: ''; position: absolute; inset: -4px 0; }
    .option::after { content: ''; position: absolute; inset: 0; border-radius: inherit; background: currentColor; opacity: 0; transition: opacity var(--motion-effects); }
    .option:hover::after { opacity: var(--opacity-state-hover); }
    .option:active::after { opacity: var(--opacity-state-pressed); }
    .option:active { transform: scale(0.97); }
    @media (prefers-reduced-motion: reduce) { .option:active { transform: none; } }
    .selected { border-radius: var(--round); background: var(--color-primary); color: var(--color-on-primary); }
    .option:focus-visible { outline: var(--size-focus-ring, 3px) solid var(--color-secondary); outline-offset: 2px; }
  `,
})
export class ButtonGroup {
  readonly options = input.required<ButtonGroupOption[]>();
  readonly value = input<string | null>(null);
  readonly label = input.required<string>();
  readonly valueChange = output<string>();
}
