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
      @for (o of options(); track o.value; let first = $first; let last = $last) {
        <button
          type="button"
          class="option"
          [class.first]="first"
          [class.last]="last"
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
    /* Connected button group (MD3 Expressive): 2 dp entre opciones, extremos redondos, interiores de 8.
       Radios en px reales (mitad de la altura): con 9999px el navegador reducía también las esquinas
       interiores y la opción no elegida parecía cortada. */
    .group { --round: calc(var(--size-button-s) / 2); display: flex; gap: var(--space-25); }
    .option {
      position: relative;
      flex: 1;
      display: inline-flex; align-items: center; justify-content: center; gap: var(--space-100);
      height: var(--size-button-s);
      border: 0;
      border-radius: var(--shape-corner-small);
      background: var(--color-secondary-container);
      color: var(--color-on-secondary-container);
      font: 500 14px/20px var(--font-text);
      letter-spacing: 0.1px;
      cursor: pointer;
      transition: border-radius var(--motion-spatial-fast), background-color var(--motion-effects);
    }
    .option::before { content: ''; position: absolute; inset: -4px 0; }
    .option::after { content: ''; position: absolute; inset: 0; border-radius: inherit; background: currentColor; opacity: 0; transition: opacity var(--motion-effects); }
    .option:hover::after { opacity: var(--opacity-state-hover); }
    .option:active::after { opacity: var(--opacity-state-pressed); }
    .first { border-top-left-radius: var(--round); border-bottom-left-radius: var(--round); }
    .last { border-top-right-radius: var(--round); border-bottom-right-radius: var(--round); }
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
