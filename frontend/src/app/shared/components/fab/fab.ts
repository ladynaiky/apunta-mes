import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ca } from '../../../i18n/ca';
import { Icon } from '../icon/icon';
import { SnackbarService } from '../snackbar/snackbar.service';

/**
 * FAB «Apuntar» (verde de marca, esquina 16) con su menú:
 * Tasca · Exàmens · Excursions · Aniversaris.
 * `from` indica el origen (?from=home…) y `date` la fecha si viene del calendario.
 */
@Component({
  selector: 'ap-fab',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="scrim" (click)="open.set(false)" aria-hidden="true"></div>
      <nav class="menu" [attr.aria-label]="t.menuLabel">
        @for (item of items; track item.type) {
          <a [routerLink]="['/new', item.type]" [queryParams]="query()" (click)="open.set(false)">
            <ap-icon [name]="item.icon" />
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>
    }
    <button
      type="button"
      class="fab"
      [class.open]="open()"
      [attr.aria-label]="open() ? t.close : t.open"
      [attr.aria-expanded]="open()"
      (click)="open.set(!open())"
      (keydown.escape)="open.set(false)"
    >
      <ap-icon [name]="open() ? 'close' : 'add'" />
    </button>
  `,
  styleUrl: './fab.scss',
  // Si hay un snackbar, el FAB sube para no quedar tapado (MD3).
  host: { '[class.lifted]': 'snackbar.current() !== null' },
})
export class Fab {
  readonly from = input<string | null>(null);
  readonly date = input<string | null>(null);
  protected readonly open = signal(false);
  protected readonly snackbar = inject(SnackbarService);
  protected readonly t = ca.fab;
  protected readonly items = [
    { type: 'task', icon: 'assignment', label: ca.fab.task },
    { type: 'exam', icon: 'lightbulb', label: ca.fab.exams },
    { type: 'trip', icon: 'landscape', label: ca.fab.trips },
    { type: 'birthday', icon: 'cake', label: ca.fab.birthdays },
  ];

  protected query() {
    const q: Record<string, string> = {};
    if (this.from()) q['from'] = this.from()!;
    if (this.date()) q['date'] = this.date()!;
    return q;
  }
}
