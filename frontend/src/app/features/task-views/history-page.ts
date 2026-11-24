import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, NavController, ViewWillEnter } from '@ionic/angular';
import { ApiService } from '../../core/data/api.service';
import type { Entry } from '../../core/data/models';
import { TasksStore } from '../../core/data/tasks.store';
import { TodayService } from '../../core/data/today.service';
import { ca } from '../../i18n/ca';
import { Button } from '../../shared/components/button/button';
import { IconButton } from '../../shared/components/icon-button/icon-button';
import { Progress } from '../../shared/components/progress/progress';
import { Select, type SelectOption } from '../../shared/components/select/select';
import { StateMessage } from '../../shared/components/state-message/state-message';
import { TaskRow } from '../../shared/components/task-row/task-row';
import { TaskSheetService } from '../../shared/components/task-sheet/task-sheet.service';
import { TopBar } from '../../shared/components/top-bar/top-bar';
import { dayMonth } from '../../shared/utils/dates-ca';

/** Historial de tasques: las tareas hechas de un mes y un año. */
@Component({
  selector: 'ap-history-page',
  imports: [FormsModule, RouterLink, IonContent, Button, IconButton, Progress, Select, StateMessage, TaskRow, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t.historyTitle" (back)="nav.back()" />
    <ap-progress [active]="status() === 'loading'" />
    <ion-content>
      <main class="page">
        @if (year()) {
          <div class="filters">
            <ap-select class="month" [label]="t.month" [options]="monthOptions" [ngModel]="month()" (ngModelChange)="setMonth($event)" />
            <div class="year" role="group" [attr.aria-label]="t.year">
              <button apIconButton type="button" icon="chevron_left" [label]="t.prevYear" (click)="setYear(year() - 1)"></button>
              <span aria-live="polite">{{ year() }}</span>
              <button apIconButton type="button" icon="chevron_right" [label]="t.nextYear" [disabled]="year() >= maxYear()" (click)="setYear(year() + 1)"></button>
            </div>
          </div>
        }

        @if (status() === 'error') {
          <ap-state-message class="state" kind="error" [title]="t.historyError" [text]="ca.state.checkConnection" (retry)="load()" />
        } @else if (status() === 'ready') {
          @if (entries().length) {
            <ul class="list divided" [attr.aria-label]="t.historyListLabel">
              @for (e of entries(); track e.id) {
                <li>
                  <ap-task-row
                    [subjectName]="e.subject?.name ?? null"
                    [title]="e.title"
                    [supporting]="doneOn(e)"
                    [done]="true"
                    (doneChange)="store.setDone(e, $event)"
                    (open)="sheet.open(e, 'tasks')"
                    (menu)="sheet.open(e, 'tasks')"
                  />
                </li>
              }
            </ul>
          } @else if (hasAny()) {
            <ap-state-message class="state" [title]="t.historyMonthEmpty" [text]="t.historyMonthEmptyText(label())" />
          } @else {
            <ap-state-message class="state" [title]="t.historyEmpty" [text]="t.historyEmptyText" />
          }
        }
      </main>
    </ion-content>
    <div class="bottom">
      <a apButton variant="filled" size="m" [block]="true" routerLink="/tasks/list" [queryParams]="{ from: 'tasks' }">{{ t.seeList }}</a>
    </div>
  `,
  styleUrl: './task-views.scss',
  styles: `
    .filters { display: flex; align-items: center; gap: var(--space-150); margin: var(--space-100) 0 var(--space-100); }
    .month { flex: 1; }
    .year {
      display: flex; align-items: center; justify-content: space-between;
      box-sizing: border-box; width: 156px; height: var(--size-text-field);
      border: 1px solid var(--color-outline); border-radius: var(--shape-corner-extra-small);
      font: 600 16px/24px var(--font-text);
    }
  `,
})
export class HistoryPage implements ViewWillEnter {
  private readonly api = inject(ApiService);
  private readonly todayService = inject(TodayService);
  protected readonly store = inject(TasksStore);
  protected readonly sheet = inject(TaskSheetService);
  protected readonly nav = inject(NavController);
  protected readonly t = ca.taskViews;
  protected readonly ca = ca;

  protected readonly status = signal<'loading' | 'ready' | 'error'>('loading');
  protected readonly entries = signal<Entry[]>([]);
  protected readonly hasAny = signal(true);
  protected readonly month = signal(1);
  protected readonly year = signal(0);
  protected readonly maxYear = signal(0);
  protected readonly monthOptions: SelectOption<number>[] = ca.taskViews.months.map((m, i) => ({ value: i + 1, label: m }));
  protected readonly label = computed(() => `${this.t.months[this.month() - 1]} ${this.year()}`);

  constructor() {
    effect(() => {
      this.store.changes();
      untracked(() => this.status() !== 'loading' && this.year() && void this.load());
    });
  }

  async ionViewWillEnter(): Promise<void> {
    if (!this.year()) {
      const today = await this.todayService.load();
      this.year.set(Number(today.slice(0, 4)));
      this.maxYear.set(this.year());
      this.month.set(Number(today.slice(5, 7)));
    }
    await this.load();
  }

  protected async load(): Promise<void> {
    this.status.set('loading');
    try {
      const list = await this.api.history(this.year(), this.month());
      this.entries.set(list);
      if (!list.length) this.hasAny.set((await this.api.history()).length > 0);
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }

  protected setMonth(m: number | null): void {
    if (!m) return;
    this.month.set(m);
    void this.load();
  }

  protected setYear(y: number): void {
    this.year.set(y);
    void this.load();
  }

  /** «Feta el 2 de novembre» (día en que se marcó, hora de Madrid). */
  protected doneOn(e: Entry): string {
    if (!e.doneAt) return '';
    const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date(e.doneAt));
    return this.t.doneOn(dayMonth(day));
  }
}
