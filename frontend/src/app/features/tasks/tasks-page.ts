import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, ViewWillEnter } from '@ionic/angular';
import type { Entry } from '../../core/data/models';
import { TasksStore } from '../../core/data/tasks.store';
import { ca } from '../../i18n/ca';
import { Fab } from '../../shared/components/fab/fab';
import { NavListItem } from '../../shared/components/nav-list-item/nav-list-item';
import { Progress } from '../../shared/components/progress/progress';
import { StateMessage } from '../../shared/components/state-message/state-message';
import { TaskRow } from '../../shared/components/task-row/task-row';
import { TaskSheetService } from '../../shared/components/task-sheet/task-sheet.service';
import { TopBar } from '../../shared/components/top-bar/top-bar';
import { dueLabel, longDate } from '../../shared/utils/dates-ca';

/** Tasques: lo de hoy y los accesos a las demás vistas de tareas. */
@Component({
  selector: 'ap-tasks-page',
  imports: [RouterLink, IonContent, Fab, NavListItem, Progress, StateMessage, TaskRow, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t.title" [showBack]="false" [showProfile]="true" [pending]="store.pendingToday()" />
    <ap-progress [active]="store.status() === 'loading'" />
    <ion-content>
      <main class="page">
        <h2 class="date">{{ date() }}</h2>

        @if (store.status() === 'error') {
          <ap-state-message kind="error" [title]="ca.home.loadError" [text]="ca.state.checkConnection" (retry)="store.load()" />
        } @else {
          <section aria-labelledby="tasks-today">
            <h3 id="tasks-today" class="label">{{ t.todayTasks }}</h3>
            @for (e of today(); track e.id) {
              <ap-task-row
                [subjectName]="e.subject?.name ?? null"
                [title]="e.title"
                [supporting]="due(e)"
                [done]="e.done"
                [highPriority]="e.priority === 'high'"
                (doneChange)="store.setDone(e, $event)"
                (open)="sheet.open(e, 'tasks')"
                (menu)="sheet.open(e, 'tasks')"
              />
            } @empty {
              @if (store.status() === 'ready') {
                <ap-state-message [title]="t.noToday" [text]="t.noTodayText" />
              }
            }
          </section>
        }

        <nav class="links">
          <a apNavListItem routerLink="/search" [queryParams]="{ from: 'tasks' }" icon="manage_search">{{ t.search }}</a>
          <a apNavListItem routerLink="/tasks/list" [queryParams]="{ from: 'tasks' }" icon="format_list_bulleted">{{ t.list }}</a>
          <a apNavListItem routerLink="/tasks/history" [queryParams]="{ from: 'tasks' }" icon="history">{{ t.history }}</a>
          <a apNavListItem routerLink="/tasks/checklist" [queryParams]="{ from: 'tasks' }" icon="checklist">{{ t.checklist }}</a>
          <a apNavListItem routerLink="/tasks/mark-done" [queryParams]="{ from: 'tasks' }" icon="task_alt">{{ t.markDone }}</a>
          <a apNavListItem routerLink="/share/tasks" [queryParams]="{ from: 'tasks' }" icon="share">{{ t.share }}</a>
        </nav>
      </main>
    </ion-content>
    <ap-fab from="tasks" />
  `,
  styles: `
    :host { --fab-bottom: var(--space-200); display: flex; flex-direction: column; height: 100%; }
    ion-content { flex: 1; }
    .page { padding: var(--space-100) var(--size-layout-margin) 96px; }
    .date { margin: 0; font: 600 16px/24px var(--font-title); letter-spacing: 0.15px; }
    .label { margin: var(--space-200) 0 var(--space-50); color: var(--color-on-surface-variant); font: 500 14px/20px var(--font-text); letter-spacing: 0.1px; }
    .links { display: flex; flex-direction: column; gap: var(--space-100); margin-top: var(--space-200); }
  `,
})
export class TasksPage implements ViewWillEnter {
  protected readonly store = inject(TasksStore);
  protected readonly sheet = inject(TaskSheetService);
  protected readonly t = ca.tasks;
  protected readonly ca = ca;

  protected readonly date = computed(() => (this.store.today() ? longDate(this.store.today()) : ''));
  protected readonly today = computed(() => this.store.todayEntries().filter((e) => e.type !== 'birthday'));

  ionViewWillEnter(): void {
    void this.store.load();
  }

  protected due(e: Entry): string {
    return dueLabel(e.date, this.store.today());
  }
}
