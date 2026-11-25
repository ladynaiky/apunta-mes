import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Entry } from '../../core/data/models';
import { TasksStore } from '../../core/data/tasks.store';
import { ca } from '../../i18n/ca';
import { Button } from '../../shared/components/button/button';
import { StateMessage } from '../../shared/components/state-message/state-message';
import { TaskRow } from '../../shared/components/task-row/task-row';
import { TaskSheetService } from '../../shared/components/task-sheet/task-sheet.service';
import { rowTitle } from '../../shared/utils/task-title';

/**
 * El meu espai · Avisos: dos grupos, «Diàries» (las de hoy) y «Setmanals» (el resto de la semana).
 * Usa los mismos datos que Inici (TasksStore), así marcar una tarea se ve en las dos pantallas.
 */
@Component({
  selector: 'ap-me-reminders',
  imports: [RouterLink, Button, StateMessage, TaskRow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (store.status() === 'error') {
      <ap-state-message kind="error" [title]="t.loadError" [text]="ca.state.checkConnection" (retry)="store.load()" />
    } @else if (store.status() === 'ready') {
      @for (g of groups(); track g.title) {
        @if (g.items.length) {
          <h3 class="label">{{ g.title }}</h3>
          @for (e of g.items; track e.id) {
            <ap-task-row
              [subjectName]="e.subject?.name ?? null"
              [subjectColor]="e.subject?.colorToken ?? null"
              [entryType]="e.type"
              [title]="rowTitle(e)"
              [supporting]="due(e)"
              [showCheckbox]="e.type !== 'birthday'"
              [leadIcon]="e.type === 'birthday' ? 'cake' : null"
              [showTags]="e.type !== 'birthday'"
              [done]="e.done"
              [highPriority]="e.priority === 'high'"
              [lowPriority]="e.priority === 'low'"
              [tags]="e.tags"
              (doneChange)="store.setDone(e, $event)"
              (open)="sheet.open(e, 'me')"
              (menu)="sheet.open(e, 'me')"
            />
          }
        }
      }
      @if (empty()) {
        <ap-state-message [title]="t.noReminders" [text]="t.noRemindersText" />
      }
      <a apButton variant="filled" size="m" [block]="true" class="cta" routerLink="/search" [queryParams]="{ from: 'me' }">
        {{ t.reviewReminders }}
      </a>
    }
  `,
  styles: `
    .label { margin: var(--space-200) 0 var(--space-50); color: var(--color-on-surface-variant); font: 500 14px/20px var(--font-text); }
    .label:first-child { margin-top: var(--space-100); }
    .cta { margin-top: var(--space-300); }
  `,
})
export class MeReminders implements OnInit {
  protected readonly store = inject(TasksStore);
  protected readonly sheet = inject(TaskSheetService);
  protected readonly rowTitle = rowTitle;
  protected readonly t = ca.me;
  protected readonly ca = ca;

  protected readonly groups = computed(() => [
    { title: this.t.daily, items: this.store.todayEntries() },
    { title: this.t.weekly, items: this.store.upcomingWeek() },
  ]);
  protected readonly empty = computed(() => this.groups().every((g) => !g.items.length));

  ngOnInit(): void {
    void this.store.load();
  }

  /** «Acaba avui», «Acaba demà», «Acaba d’aquí a 3 dies». */
  protected due(e: Entry): string {
    const days = Math.round((Date.parse(e.date) - Date.parse(this.store.today())) / 86_400_000);
    return this.t.daysLeft(Math.max(0, days));
  }
}
