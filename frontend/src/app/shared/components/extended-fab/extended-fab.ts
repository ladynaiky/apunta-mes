import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';

/**
 * Extended FAB («+ Nou examen», «+ Nova excursió»): verde de marca, 56 dp,
 * esquina 16. Sobre un <a> o <button> nativo.
 */
@Component({
  selector: 'a[apExtendedFab], button[apExtendedFab]',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ap-icon [name]="icon()" /><span><ng-content /></span>`,
  styles: `
    :host {
      position: absolute;
      right: var(--space-200);
      bottom: var(--space-200);
      z-index: 10;
      display: inline-flex;
      align-items: center;
      gap: var(--space-150);
      height: var(--size-fab);
      padding: 0 var(--space-250) 0 var(--space-200);
      border: 0;
      border-radius: var(--shape-corner-large);
      background: var(--color-primary-container);
      color: var(--color-on-primary-container);
      box-shadow: var(--elevation-level3);
      font: 600 16px/24px var(--font-title);
      text-decoration: none;
      cursor: pointer;
    }
    :host::after { content: ''; position: absolute; inset: 0; border-radius: inherit; background: currentColor; opacity: 0; transition: opacity var(--motion-effects); }
    :host(:hover) { box-shadow: var(--elevation-level4); }
    :host(:hover)::after { opacity: var(--opacity-state-hover); }
    :host(:active)::after { opacity: var(--opacity-state-pressed); }
  `,
})
export class ExtendedFab {
  readonly icon = input('add');
}
