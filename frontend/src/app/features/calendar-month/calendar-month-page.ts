import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, NavController, ViewWillEnter } from '@ionic/angular';
import { ApiService } from '../../core/data/api.service';
import type { CalendarDot } from '../../core/data/models';
import { TasksStore } from '../../core/data/tasks.store';
import { TodayService } from '../../core/data/today.service';
import { ca } from '../../i18n/ca';
import { ButtonGroup } from '../../shared/components/button-group/button-group';
import { IconButton } from '../../shared/components/icon-button/icon-button';
import { MonthCalendar } from '../../shared/components/month-calendar/month-calendar';
import { NavListItem } from '../../shared/components/nav-list-item/nav-list-item';
import { Progress } from '../../shared/components/progress/progress';
import { StateMessage } from '../../shared/components/state-message/state-message';
import { TopBar } from '../../shared/components/top-bar/top-bar';
import { dayMonth, monthTitle } from '../../shared/utils/dates-ca';

/** Calendari setmanal/mensual (vista mes): puntos por día; tocar un día abre sus tareas. */
@Component({
  selector: 'ap-calendar-month-page',
  imports: [RouterLink, IonContent, ButtonGroup, IconButton, MonthCalendar, NavListItem, Progress, StateMessage, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t.title" (back)="toWeek()" />
    <ap-progress [active]="status() === 'loading'" />
    <ion-content>
      <main class="page">
        <ap-button-group [label]="ca.calendar.viewLabel" [options]="views" value="month" (valueChange)="$event === 'week' && toWeek()" />

        @if (status() === 'error') {
          <ap-state-message kind="error" [title]="ca.calendar.loadError" [text]="ca.state.checkConnection" (retry)="load()" />
        } @else if (month()) {
          <div class="head">
            <h2 aria-live="polite">{{ title() }}</h2>
            <button apIconButton type="button" icon="chevron_left" [label]="t.previous" (click)="move(-1)"></button>
            <button apIconButton type="button" icon="chevron_right" [label]="t.next" (click)="move(1)"></button>
          </div>
          <ap-month-calendar
            [month]="month()"
            [today]="today()"
            [selected]="today()"
            [dots]="dots()"
            [label]="title()"
            [ariaLabel]="dayLabel"
            (select)="openDay($event)"
          />
          @if (status() === 'ready' && empty()) {
            <ap-state-message [title]="t.empty" [text]="t.emptyText" />
          }
        }

        <nav class="links">
          <a apNavListItem routerLink="/search" [queryParams]="{ from: 'calendar' }" icon="manage_search">{{ ca.calendar.search }}</a>
          <a apNavListItem routerLink="/exams" [queryParams]="{ from: 'calendar' }" icon="lightbulb">{{ ca.calendar.exams }}</a>
          <a apNavListItem routerLink="/trips" [queryParams]="{ from: 'calendar' }" icon="landscape">{{ ca.calendar.trips }}</a>
          <a apNavListItem routerLink="/tasks/today" [queryParams]="{ from: 'calendar' }" icon="event_available">{{ ca.calendar.todayOrWeek }}</a>
        </nav>
      </main>
    </ion-content>
  `,
  styles: `
    :host { display: flex; flex-direction: column; height: 100%; }
    ion-content { flex: 1; }
    .page { padding: var(--space-100) var(--size-layout-margin) var(--space-300); }
    .head { display: flex; align-items: center; margin-top: var(--space-150); }
    .head h2 { flex: 1; margin: 0; font: 500 16px/24px var(--font-title); }
    .links { display: flex; flex-direction: column; gap: var(--space-100); margin-top: var(--space-200); }
  `,
})
export class CalendarMonthPage implements ViewWillEnter {
  private readonly api = inject(ApiService);
  private readonly todayService = inject(TodayService);
  private readonly store = inject(TasksStore);
  private readonly nav = inject(NavController);
  protected readonly t = ca.month;
  protected readonly ca = ca;

  protected readonly status = signal<'loading' | 'ready' | 'error'>('loading');
  protected readonly today = signal('');
  protected readonly month = signal('');
  protected readonly dots = signal<Record<string, CalendarDot[]>>({});
  protected readonly title = computed(() => (this.month() ? monthTitle(this.month()) : ''));
  protected readonly empty = computed(() => Object.keys(this.dots()).length === 0);
  protected readonly views = [
    { value: 'week', label: ca.calendar.week },
    { value: 'month', label: ca.calendar.month },
  ];
  protected readonly dayLabel = (date: string, n: number) => ca.calendar.dayLabel(dayMonth(date), n);

  constructor() {
    // Si se marca o borra algo desde la hoja de tarea, se recarga.
    effect(() => {
      this.store.changes();
      untracked(() => this.month() && void this.load());
    });
  }

  async ionViewWillEnter(): Promise<void> {
    const today = await this.todayService.load();
    this.today.set(today);
    if (!this.month()) this.month.set(today.slice(0, 7));
    await this.load();
  }

  protected async load(): Promise<void> {
    this.status.set('loading');
    try {
      const days = await this.api.calendar(this.month());
      this.dots.set(Object.fromEntries(days.map((d) => [d.date, d.dots])));
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }

  protected move(delta: number): void {
    const [y, m] = this.month().split('-').map(Number);
    this.month.set(new Date(Date.UTC(y, m - 1 + delta, 1)).toISOString().slice(0, 7));
    void this.load();
  }

  protected toWeek(): void {
    void this.nav.navigateBack('/tabs/calendar');
  }

  protected openDay(date: string): void {
    void this.nav.navigateForward(['/calendar/day', date], { queryParams: { from: 'calendar' } });
  }
}
