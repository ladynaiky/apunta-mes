import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ca } from '../../../i18n/ca';
import type { SubjectColorToken } from '../../utils/task-title';
import { Icon } from '../icon/icon';

export const SWATCHES: SubjectColorToken[] = ['taronja', 'groc', 'lila', 'verd', 'turquesa', 'rosa', 'blau', 'marro'];

/**
 * Selector de color de asignatura: 7 muestras de 36 dp (zona táctil 48),
 * cada una con su nombre escrito; la elegida, con anillo y check.
 */
@Component({
  selector: 'ap-swatch-picker',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="swatches" role="radiogroup" [attr.aria-label]="label()">
      @for (c of swatches; track c) {
        <button
          type="button"
          role="radio"
          class="swatch"
          [attr.aria-checked]="c === value()"
          [attr.aria-label]="names[c]"
          (click)="valueChange.emit(c)"
        >
          <span
            class="color"
            [class.on]="c === value()"
            [style.background]="'var(--color-' + c + ')'"
            [style.color]="c === 'groc' ? 'var(--color-on-surface)' : '#fff'"
          >
            @if (c === value()) {
              <ap-icon name="check" [size]="20" />
            }
          </span>
          <span class="name">{{ names[c] }}</span>
        </button>
      }
    </div>
  `,
  styles: `
    .swatches { display: flex; flex-wrap: wrap; gap: var(--space-50); }
    .swatch {
      display: flex; flex-direction: column; align-items: center; gap: var(--space-50);
      min-width: var(--size-touch-target);
      padding: var(--space-50) 0;
      border: 0; background: transparent; cursor: pointer;
    }
    .color {
      display: inline-flex; align-items: center; justify-content: center;
      width: var(--size-swatch); height: var(--size-swatch);
      border-radius: 50%;
      box-shadow: inset 0 0 0 1px var(--color-outline);
    }
    .color.on { box-shadow: 0 0 0 2px var(--color-surface), 0 0 0 4px var(--color-on-surface); }
    .name { font: 500 12px/16px var(--font-text); letter-spacing: 0.5px; color: var(--color-on-surface-variant); }
    .swatch[aria-checked='true'] .name { font-weight: 700; color: var(--color-on-surface); }
  `,
})
export class SwatchPicker {
  readonly value = input<SubjectColorToken | null>(null);
  readonly label = input.required<string>();
  readonly valueChange = output<SubjectColorToken>();
  protected readonly swatches = SWATCHES;
  protected readonly names = ca.me.colorNames;
}
