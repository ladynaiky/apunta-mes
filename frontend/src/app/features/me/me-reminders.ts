import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toApiError } from '../../core/api/api-error';
import { ApiService } from '../../core/data/api.service';
import type { ReminderEntry } from '../../core/data/models';
import { TasksStore } from '../../core/data/tasks.store';
import { ca } from '../../i18n/ca';
import { Button } from '../../shared/components/button/button';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';
import { StateMessage } from '../../shared/components/state-message/state-message';
import { TaskRow } from '../../shared/components/task-row/task-row';
import { TaskSheetService } from '../../shared/components/task-sheet/task-sheet.service';
import { rowTitle } from '../../shared/utils/task-title';

/** El meu espai · Avisos: lo pendiente cuyo aviso ya ha empezado. */
@Component({
  selector: 'ap-me-reminders',
  imports: [RouterLink, Button, StateMessage, TaskRow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (status() === 'error') {
      <ap-state-message kind="error" [title]="t.loadError" [text]="ca.state.checkConnection" (retry)="load()" />
    } @else if (status() === 'ready') {
      @for (e of items(); track e.id) {
        <ap-task-row
          [subjectName]="e.subject?.name ?? null"
          [subjectColor]="e.subject?.colorToken ?? null"
          [title]="rowTitle(e)"
          [supporting]="t.daysLeft(e.daysLeft)"
          [showCheckbox]="e.type !== 'birthday'"
          [showTags]="e.type !== 'birthday'"
          [done]="e.done"
          [highPriority]="e.priority === 'high'"
          [lowPriority]="e.priority === 'low'"
          (doneChange)="toggle(e, $event)"
          (open)="sheet.open(e, 'me')"
          (menu)="sheet.open(e, 'me')"
        />
      } @empty {
        <ap-state-message [title]="t.noReminders" [text]="t.noRemindersText" />
      }
      <a apButton variant="filled" size="m" [block]="true" class="cta" routerLink="/search" [queryParams]="{ from: 'me' }">
        {{ t.reviewReminders }}
      </a>
    }
  `,
  styles: `.cta { margin-top: var(--space-300); }`,
})
export class MeReminders implements OnInit {
  private readonly api = inject(ApiService);
  private readonly store = inject(TasksStore);
  private readonly snackbar = inject(SnackbarService);
  protected readonly sheet = inject(TaskSheetService);
  protected readonly rowTitle = rowTitle;
  protected readonly t = ca.me;
  protected readonly ca = ca;
  protected readonly status = signal<'loading' | 'ready' | 'error'>('loading');
  protected readonly items = signal<ReminderEntry[]>([]);

  ngOnInit(): void {
    void this.load();
  }

  protected async load(): Promise<void> {
    this.status.set('loading');
    try {
      this.items.set(await this.api.reminders());
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }

  protected async toggle(e: ReminderEntry, done: boolean): Promise<void> {
    this.items.update((l) => l.map((x) => (x.id === e.id ? { ...x, done } : x)));
    try {
      await this.api.setDone(e.id, done);
      void this.store.load();
    } catch (err) {
      this.items.update((l) => l.map((x) => (x.id === e.id ? { ...x, done: !done } : x)));
      this.snackbar.show(toApiError(err).message);
    }
  }
}
