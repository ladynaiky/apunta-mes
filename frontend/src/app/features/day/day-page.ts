import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
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
import { dayMonth, dueLabel } from '../../shared/utils/dates-ca';

/** Tasques del dia (des del calendari): lo apuntado ese día, o «Dia sense tasques». */
@Component({
  selector: 'ap-day-page',
  imports: [RouterLink, IonContent, Button, Progress, StateMessage, TaskRow, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="title()" (back)="nav.back()" />
    <ap-progress [active]="status() === 'loading'" />
    <ion-content>
      <main class="page">
        @if (status() === 'error') {
          <ap-state-message kind="error" [title]="t.loadError" [text]="ca.state.checkConnection" (retry)="load()" />
        } @else if (status() === 'ready') {
          @if (entries().length) {
            <h2 class="label">{{ t.label }}</h2>
            @for (e of entries(); track e.id) {
              <ap-task-row
                [subjectName]="e.type === 'task' ? (e.subject?.name ?? null) : null"
                [subjectColor]="e.subject?.colorToken ?? null"
                [title]="e.title"
                [supporting]="supporting(e)"
                [done]="e.done"
                [highPriority]="e.priority === 'high'"
                [showCheckbox]="e.type !== 'birthday'"
                (doneChange)="store.setDone(e, $event)"
                (open)="sheet.open(e, from() ?? 'calendar')"
                (menu)="sheet.open(e, from() ?? 'calendar')"
              />
            }
          } @else {
            <ap-state-message class="empty" [title]="t.empty" [text]="t.emptyText" />
          }
          <div class="cta">
            <a apButton variant="filled" routerLink="/new/task" [queryParams]="{ from: from() ?? 'calendar', date: date() }">{{ t.newTask }}</a>
          </div>
        }
      </main>
    </ion-content>
  `,
  styles: `
    :host { display: flex; flex-direction: column; height: 100%; }
    ion-content { flex: 1; }
    .page { padding: var(--space-100) var(--size-layout-margin) var(--space-300); }
    .label { margin: var(--space-100) 0 var(--space-50); color: var(--color-on-surface-variant); font: 500 14px/20px var(--font-text); }
    .empty { margin-top: 30%; }
    .cta { display: flex; justify-content: center; margin-top: var(--space-300); }
  `,
})
export class DayPage implements ViewWillEnter {
  readonly date = input.required<string>();
  /** Origen (?from=calendar | calendar-month): a dónde vuelve después de apuntar. */
  readonly from = input<string | undefined>();

  private readonly api = inject(ApiService);
  private readonly todayService = inject(TodayService);
  protected readonly store = inject(TasksStore);
  protected readonly sheet = inject(TaskSheetService);
  protected readonly nav = inject(NavController);
  protected readonly t = ca.day;
  protected readonly ca = ca;

  protected readonly status = signal<'loading' | 'ready' | 'error'>('loading');
  protected readonly entries = signal<Entry[]>([]);
  private today = '';
  /** «Tasca del dia 4 de novembre» o, si no hay nada, «Dia sense tasques» (diseño). */
  protected readonly title = computed(() =>
    this.status() === 'ready' && !this.entries().length ? this.t.emptyTitle : this.t.title(dayMonth(this.date())),
  );

  constructor() {
    effect(() => {
      this.store.changes();
      untracked(() => this.status() !== 'loading' && void this.load());
    });
  }

  async ionViewWillEnter(): Promise<void> {
    this.today = await this.todayService.load();
    await this.load();
  }

  protected async load(): Promise<void> {
    this.status.set('loading');
    try {
      this.entries.set(await this.api.day(this.date()));
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }

  /** Tareas: «Per a avui» / «Per al 6 de novembre». Exámenes y excursiones: «13 de novembre». */
  protected supporting(e: Entry): string {
    return e.type === 'task' ? dueLabel(e.date, this.today) : dayMonth(e.date);
  }
}
