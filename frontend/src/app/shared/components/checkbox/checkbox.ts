import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { Icon } from '../icon/icon';

/**
 * Casilla cuadrada MD3 (18 dp, esquina 2) con zona táctil de 48 × 48.
 * Usa un <input type="checkbox"> nativo para teclado y lectores de pantalla.
 */
@Component({
  selector: 'ap-checkbox',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="touch">
      <input
        type="checkbox"
        class="visually-hidden"
        [checked]="checked()"
        [disabled]="disabled()"
        [attr.aria-label]="label()"
        (change)="checked.set($any($event.target).checked)"
      />
      <span class="box" [class.on]="checked()" aria-hidden="true">
        @if (checked()) {
          <ap-icon name="check" [size]="16" />
        }
      </span>
    </label>
  `,
  styles: `
    :host { display: inline-flex; flex: none; }
    .touch {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--size-touch-target);
      height: var(--size-touch-target);
      border-radius: 50%;
      cursor: pointer;
    }
    .touch::after {
      content: ''; position: absolute; inset: 4px; border-radius: 50%;
      background: var(--color-on-surface); opacity: 0; transition: opacity var(--motion-effects);
    }
    .touch:hover::after { opacity: var(--opacity-state-hover); }
    .touch:active::after { opacity: var(--opacity-state-pressed); }
    .box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: var(--size-checkbox);
      height: var(--size-checkbox);
      border: 2px solid var(--color-on-surface-variant);
      border-radius: var(--shape-corner-checkbox);
      color: var(--color-on-primary);
      transition: background-color var(--motion-effects), border-color var(--motion-effects);
    }
    .box.on { border-color: var(--color-primary); background: var(--color-primary); }
    input:focus-visible + .box { outline: var(--size-focus-ring) solid var(--color-secondary); outline-offset: 6px; }
    input:disabled + .box { opacity: var(--opacity-disabled-content); }
  `,
})
export class Checkbox {
  readonly checked = model(false);
  /** Nombre accesible: «Marcar com a feta: Mates: exercicis, pàg. 12». */
  readonly label = input.required<string>();
  readonly disabled = input(false);
}
