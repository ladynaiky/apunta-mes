import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';

/**
 * Acceso que navega («Veure exàmens», «Buscar o filtrar tasques»…).
 * Es un list item de navegación (56 dp) con el aspecto de la alta fidelidad.
 *   <a apNavListItem routerLink="/exams" icon="lightbulb">Veure exàmens</a>
 */
@Component({
  selector: 'a[apNavListItem], button[apNavListItem]',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (icon()) {
      <ap-icon class="lead" [name]="icon()!" />
    }
    <span class="label"><ng-content /></span>
    <ap-icon class="chevron" name="chevron_right" [size]="20" />
  `,
  styles: `
    :host {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--space-150);
      box-sizing: border-box;
      width: 100%;
      min-height: var(--size-list-item-one-line);
      padding: 0 var(--space-150) 0 var(--space-200);
      border: 0;
      border-radius: var(--shape-corner-full);
      background: var(--color-surface-container-high);
      color: var(--color-on-surface);
      font: 400 16px/24px var(--font-text);
      letter-spacing: 0.15px;
      text-align: left;
      text-decoration: none;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    :host::after {
      content: ''; position: absolute; inset: 0; border-radius: inherit;
      background: currentColor; opacity: 0; pointer-events: none;
      transition: opacity var(--motion-effects);
    }
    :host(:hover)::after { opacity: var(--opacity-state-hover); }
    :host(:active)::after { opacity: var(--opacity-state-pressed); }
    .lead, .chevron { color: var(--color-on-surface-variant); }
    .label { flex: 1; min-width: 0; }
  `,
})
export class NavListItem {
  readonly icon = input<string | null>(null);
}
