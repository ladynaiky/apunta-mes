import { ChangeDetectionStrategy, Component, effect, inject, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, NavController, ViewWillEnter } from '@ionic/angular';
import { ApiService } from '../../core/data/api.service';
import type { Entry } from '../../core/data/models';
import { TasksStore } from '../../core/data/tasks.store';
import { TodayService } from '../../core/data/today.service';
import { ca } from '../../i18n/ca';
import { Button } from '../../shared/components/button/button';
import { Progress } from '../../shared/components/progress/progress';
import { StateMessage } from '../../shared/components/state-message/state-message';
import { TaskRow } from '../../shared/components/task-row/task-row';
import { TaskSheetService } from '../../shared/components/task-sheet/task-sheet.service';
import { TopBar } from '../../shared/components/top-bar/top-bar';
import { dueLabel } from '../../shared/utils/dates-ca';

/** Llistat de tasques: todas las tareas pendientes, por fecha. */
@Component({
  selector: 'ap-task-list-page',
  imports: [RouterLink, IonContent, Button, Progress, StateMessage, TaskRow, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t.listTitle" (back)="nav.back()" />
    <ap-progress [active]="status() === 'loading'" />
    <ion-content>
      <main class="page">
        @if (status() === 'error') {
          <ap-state-message class="state" kind="error" [title]="t.listError" [text]="ca.state.checkConnection" (retry)="load()" />
        } @else if (status() === 'ready') {
          @for (e of entries(); track e.id) {
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
            <ap-state-message class="state" [title]="t.listEmpty" [text]="t.noTasksText" />
          }
        }
      </main>
    </ion-content>
    <div class="bottom">
      <a apButton variant="filled" size="m" [block]="true" routerLink="/search" [queryParams]="{ from: 'tasks' }">{{ t.search }}</a>
    </div>
  `,
  styleUrl: './task-views.scss',
})
export class TaskListPage implements ViewWillEnter {
  private readonly api = inject(ApiService);
  private readonly todayService = inject(TodayService);
  protected readonly store = inject(TasksStore);
  protected readonly sheet = inject(TaskSheetService);
  protected readonly nav = inject(NavController);
  protected readonly t = ca.taskViews;
  protected readonly ca = ca;
  protected readonly status = signal<'loading' | 'ready' | 'error'>('loading');
  protected readonly entries = signal<Entry[]>([]);
  private today = '';

  constructor() {
    effect(() => {
      this.store.changes();
      untracked(() => this.status() !== 'loading' && void this.load());
    });
  }

  ionViewWillEnter(): void {
    void this.load();
  }

  protected async load(): Promise<void> {
    this.status.set('loading');
    try {
      this.today = await this.todayService.load();
      this.entries.set(await this.api.entries({ type: 'task', done: false }));
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }

  protected due(e: Entry): string {
    return dueLabel(e.date, this.today);
  }
}
