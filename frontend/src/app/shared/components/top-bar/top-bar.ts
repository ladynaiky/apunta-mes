import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ca } from '../../../i18n/ca';
import { Badge } from '../badge/badge';
import { IconButton } from '../icon-button/icon-button';

/**
 * Capçalera (top app bar small, 64 dp).
 * - Con «Enrere» (back) o con la marca «Apunta+» (brand, en Inici).
 * - Acción de perfil «El meu espai» con badge de pendientes.
 */
@Component({
  selector: 'ap-top-bar',
  imports: [RouterLink, IconButton, Badge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bar">
      @if (showBack()) {
        <button apIconButton type="button" icon="arrow_back" [label]="t.back" (click)="back.emit()"></button>
      }
      <h1 [class.brand]="brand()" [class.no-back]="!showBack()">{{ title() }}</h1>
      <span class="actions">
        <ng-content />
        @if (showProfile()) {
          <a
            apIconButton
            routerLink="/tabs/me"
            icon="account_circle"
            [label]="pending() ? t.meWithPending(pending()) : nav.me"
          >
            @if (pending()) {
              <ap-badge class="badge" [count]="pending()" />
            }
          </a>
        }
      </span>
    </header>
  `,
  styles: `
    :host { display: block; background: var(--color-surface); }
    .bar {
      display: flex;
      align-items: center;
      height: var(--size-app-bar-small);
      padding: 0 var(--space-50);
      gap: var(--space-50);
    }
    h1 {
      flex: 1;
      min-width: 0;
      margin: 0;
      font: 600 22px/28px var(--font-title);
      color: var(--color-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    h1.no-back { padding-left: var(--space-150); }
    h1.brand { color: var(--color-primary); font-weight: 700; }
    .actions { display: inline-flex; align-items: center; }
    .badge { position: absolute; top: 2px; right: 0; }
  `,
})
export class TopBar {
  readonly title = input.required<string>();
  readonly showBack = input(true);
  /** Título con el color de la marca (Inici). */
  readonly brand = input(false);
  readonly showProfile = input(false);
  /** Tareas pendientes de hoy (badge del perfil). */
  readonly pending = input(0);
  readonly back = output<void>();

  protected readonly t = ca.topBar;
  protected readonly nav = ca.nav;
}
