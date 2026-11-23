import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';

/**
 * Botón de icono: 40 dp con zona táctil de 48 y aria-label obligatorio.
 *   <button apIconButton icon="more_vert" label="Opcions de la tasca"></button>
 */
@Component({
  selector: 'button[apIconButton], a[apIconButton]',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ap-icon [name]="icon()" [filled]="filled()" /><ng-content />`,
  styles: `
    :host {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--size-button-s);
      height: var(--size-button-s);
      margin: 4px;
      padding: 0;
      border: 0;
      border-radius: var(--shape-corner-full);
      background: transparent;
      color: var(--color-on-surface-variant);
      cursor: pointer;
      text-decoration: none;
      -webkit-tap-highlight-color: transparent;
    }
    :host::before { content: ''; position: absolute; inset: -4px; border-radius: inherit; }
    :host::after {
      content: ''; position: absolute; inset: 0; border-radius: inherit;
      background: currentColor; opacity: 0; pointer-events: none;
      transition: opacity var(--motion-effects);
    }
    :host(:hover)::after { opacity: var(--opacity-state-hover); }
    :host(:focus-visible)::after { opacity: var(--opacity-state-focus); }
    :host(:active)::after { opacity: var(--opacity-state-pressed); }
    :host([disabled]) { opacity: var(--opacity-disabled-content); pointer-events: none; }
  `,
  host: { '[attr.aria-label]': 'label()' },
})
export class IconButton {
  readonly icon = input.required<string>();
  /** Nombre accesible (obligatorio en los botones de icono). */
  readonly label = input.required<string>();
  readonly filled = input(false);
}
