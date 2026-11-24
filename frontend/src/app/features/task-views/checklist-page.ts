import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
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
import { addDays } from '../../shared/utils/dates-ca';

/** Checklist: las tareas de hoy a 7 días vista (también las hechas) y «2 de 5 fetes». */
@Component({
  selector: 'ap-checklist-page',
  imports: [RouterLink, IonContent, Button, Progress, StateMessage, TaskRow, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t.checklistTitle" (back)="nav.back()" />
    <ap-progress [active]="status() === 'loading'" />
    <ion-content>
      <main class="page">
        @if (status() === 'error') {
          <ap-state-message class="state" kind="error" [title]="t.loadError" [text]="ca.state.checkConnection" (retry)="load()" />
        } @else if (status() === 'ready') {
          @if (entries().length) {
            <p class="count" aria-live="polite">{{ t.checklistCount(doneCount(), entries().length) }}</p>
            @for (e of entries(); track e.id) {
              <ap-task-row
                [subjectName]="e.subject?.name ?? null"
                [title]="e.title"
                [done]="e.done"
                [highPriority]="e.priority === 'high'"
                (doneChange)="store.setDone(e, $event)"
                (open)="sheet.open(e, 'tasks')"
                (menu)="sheet.open(e, 'tasks')"
              />
            }
          } @else {
            <ap-state-message class="state" [title]="t.checklistEmpty" [text]="t.checklistEmptyText" />
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
export class ChecklistPage implements ViewWillEnter {
  private readonly api = inject(ApiService);
  private readonly todayService = inject(TodayService);
  protected readonly store = inject(TasksStore);
  protected readonly sheet = inject(TaskSheetService);
  protected readonly nav = inject(NavController);
  protected readonly t = ca.taskViews;
  protected readonly ca = ca;
  protected readonly status = signal<'loading' | 'ready' | 'error'>('loading');
  protected readonly entries = signal<Entry[]>([]);
  protected readonly doneCount = computed(() => this.entries().filter((e) => e.done).length);

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
      const today = await this.todayService.load();
      this.entries.set(await this.api.entries({ type: 'task', from: today, to: addDays(today, 7) }));
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }
}
