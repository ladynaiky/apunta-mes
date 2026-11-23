import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ca } from '../../../i18n/ca';
import { Icon } from '../icon/icon';

export type NavDestination = 'home' | 'calendar' | 'tasks' | 'ai';

const ITEMS: { id: NavDestination; icon: string; link: string; label: string }[] = [
  { id: 'home', icon: 'home', link: '/tabs/home', label: ca.nav.home },
  { id: 'calendar', icon: 'calendar_month', link: '/tabs/calendar', label: ca.nav.calendar },
  { id: 'tasks', icon: 'checklist', link: '/tabs/tasks', label: ca.nav.tasks },
  { id: 'ai', icon: 'auto_awesome', link: '/tabs/ai', label: ca.nav.ai },
];

/**
 * Navigation bar (MD3 flexible, 64 dp). Destino activo: indicador amarillo
 * de 56 × 32, icono relleno y etiqueta en negrita con color secondary.
 */
@Component({
  selector: 'ap-navigation-bar',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav [attr.aria-label]="'Navegació principal'">
      @for (item of items; track item.id) {
        <a
          [routerLink]="item.link"
          class="item"
          [class.active]="item.id === active()"
          [attr.aria-current]="item.id === active() ? 'page' : null"
        >
          <span class="indicator">
            <ap-icon [name]="item.icon" [filled]="item.id === active()" />
          </span>
          <span class="label">{{ item.label }}</span>
        </a>
      }
    </nav>
  `,
  styles: `
    :host { display: block; background: var(--color-surface-container); padding-bottom: env(safe-area-inset-bottom); }
    nav { display: flex; height: var(--size-navigation-bar); }
    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-50);
      color: var(--color-on-surface-variant);
      text-decoration: none;
      -webkit-tap-highlight-color: transparent;
    }
    .item:focus-visible { outline-offset: -4px; border-radius: var(--shape-corner-medium); }
    .indicator {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--size-nav-indicator-width);
      height: var(--size-nav-indicator-height);
      border-radius: var(--shape-corner-full);
      transition: background-color var(--motion-effects);
    }
    .indicator::after {
      content: ''; position: absolute; inset: 0; border-radius: inherit;
      background: var(--color-on-surface); opacity: 0; transition: opacity var(--motion-effects);
    }
    .item:hover .indicator::after { opacity: var(--opacity-state-hover); }
    .item:active .indicator::after { opacity: var(--opacity-state-pressed); }
    .label { font: 500 12px/16px var(--font-text); letter-spacing: 0.5px; }
    .active .indicator {
      background: var(--color-secondary-container);
      color: var(--color-on-secondary-container);
      animation: grow var(--motion-spatial-fast);
    }
    .active .label { font-weight: 700; color: var(--color-secondary); }
    @keyframes grow { from { transform: scaleX(0.4); opacity: 0.4; } }
    @media (prefers-reduced-motion: reduce) { .active .indicator { animation: none; } }
  `,
})
export class NavigationBar {
  readonly active = input<NavDestination | null>(null);
  protected readonly items = ITEMS;
}
