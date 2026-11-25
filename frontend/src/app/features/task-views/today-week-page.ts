import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { IonContent, NavController, ViewWillEnter } from '@ionic/angular';
import type { Entry } from '../../core/data/models';
import { TasksStore } from '../../core/data/tasks.store';
import { ca } from '../../i18n/ca';
import { ButtonGroup } from '../../shared/components/button-group/button-group';
import { Progress } from '../../shared/components/progress/progress';
import { StateMessage } from '../../shared/components/state-message/state-message';
import { TaskRow } from '../../shared/components/task-row/task-row';
import { TaskSheetService } from '../../shared/components/task-sheet/task-sheet.service';
import { TopBar } from '../../shared/components/top-bar/top-bar';
import { dueLabel, longDate, weekTitle } from '../../shared/utils/dates-ca';
import { birthdaySupport, rowTitle } from '../../shared/utils/task-title';

/** Tasca d’avui/setmanal: lo de hoy o lo de esta semana (de dilluns a diumenge). */
@Component({
  selector: 'ap-today-week-page',
  imports: [IonContent, ButtonGroup, Progress, StateMessage, TaskRow, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t.todayWeekTitle" (back)="nav.back()" />
    <ap-progress [active]="store.status() === 'loading'" />
    <ion-content>
      <main class="page">
        <ap-button-group [label]="t.viewLabel" [options]="views" [value]="view()" (valueChange)="view.set($any($event))" />
        @if (store.status() === 'error') {
          <ap-state-message class="state" kind="error" [title]="t.loadError" [text]="ca.state.checkConnection" (retry)="store.load()" />
        } @else {
          <h2 class="title">{{ heading() }}</h2>
          @for (e of list(); track e.id) {
            <ap-task-row
              [subjectName]="e.subject?.name ?? null"
              [subjectColor]="e.subject?.colorToken ?? null"
              [title]="rowTitle(e)"
              [supporting]="support(e)"
              [showCheckbox]="e.type !== 'birthday'"
              [leadIcon]="e.type === 'birthday' ? 'cake' : null"
              [showTags]="e.type !== 'birthday'"
              [done]="e.done"
              [highPriority]="e.priority === 'high'"
              [lowPriority]="e.priority === 'low'"
              (doneChange)="store.setDone(e, $event)"
              (open)="sheet.open(e, 'tasks')"
              (menu)="sheet.open(e, 'tasks')"
            />
          } @empty {
            @if (store.status() === 'ready') {
              <ap-state-message [title]="view() === 'today' ? t.noToday : t.noWeek" [text]="t.noTasksText" />
            }
          }
        }
      </main>
    </ion-content>
  `,
  styleUrl: './task-views.scss',
})
export class TodayWeekPage implements ViewWillEnter {
  protected readonly store = inject(TasksStore);
  protected readonly sheet = inject(TaskSheetService);
  protected readonly nav = inject(NavController);
  protected readonly t = ca.taskViews;
  protected readonly ca = ca;
  protected readonly views = [
    { value: 'today', label: ca.taskViews.today },
    { value: 'week', label: ca.taskViews.week },
  ];
  protected readonly view = signal<'today' | 'week'>('today');

  protected readonly heading = computed(() => {
    const today = this.store.today();
    if (!today) return '';
    return this.view() === 'today' ? longDate(today) : weekTitle(today);
  });
  protected readonly list = computed(() =>
    (this.view() === 'today' ? this.store.todayEntries() : this.store.weekEntries()),
  );

  ionViewWillEnter(): void {
    void this.store.load();
  }

  protected readonly rowTitle = rowTitle;

  protected support(e: Entry): string | null {
    const due = this.view() === 'week' ? this.due(e) : null;
    const age = birthdaySupport(e);
    return [due, age].filter(Boolean).join(' · ') || null;
  }

  protected due(e: Entry): string {
    return dueLabel(e.date, this.store.today());
  }
}
