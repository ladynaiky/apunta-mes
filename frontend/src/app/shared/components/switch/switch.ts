import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { Icon } from '../icon/icon';

/** Switch MD3 (pista 52 × 32, zona táctil 48) sobre un checkbox nativo con role="switch". */
@Component({
  selector: 'ap-switch',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="touch">
      <input
        type="checkbox"
        role="switch"
        class="visually-hidden"
        [checked]="checked()"
        [attr.aria-label]="label()"
        (change)="checked.set($any($event.target).checked)"
      />
      <span class="track" [class.on]="checked()" aria-hidden="true">
        <span class="thumb">
          @if (checked()) {
            <ap-icon name="check" [size]="16" />
          }
        </span>
      </span>
    </label>
  `,
  styles: `
    :host { display: inline-flex; flex: none; }
    .touch { display: inline-flex; align-items: center; height: var(--size-touch-target); cursor: pointer; }
    .track {
      position: relative;
      box-sizing: border-box;
      width: 52px; height: 32px;
      border: 2px solid var(--color-outline);
      border-radius: var(--shape-corner-full);
      background: var(--color-surface-container);
      transition: background-color var(--motion-effects), border-color var(--motion-effects);
    }
    .thumb {
      position: absolute;
      top: 50%; left: 6px;
      display: inline-flex; align-items: center; justify-content: center;
      width: 16px; height: 16px;
      border-radius: 50%;
      background: var(--color-outline);
      transform: translateY(-50%);
      transition: left var(--motion-spatial-fast), width var(--motion-spatial-fast), height var(--motion-spatial-fast);
    }
    .track.on { border-color: var(--color-primary); background: var(--color-primary); }
    .track.on .thumb { left: 22px; width: 24px; height: 24px; background: var(--color-on-primary); color: var(--color-primary); }
    input:focus-visible + .track { outline: var(--size-focus-ring) solid var(--color-secondary); outline-offset: 2px; }
  `,
})
export class Switch {
  readonly checked = model(false);
  readonly label = input.required<string>();
}
