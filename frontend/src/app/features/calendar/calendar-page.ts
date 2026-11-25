import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, NavController, ViewWillEnter } from '@ionic/angular';
import { ApiService } from '../../core/data/api.service';
import type { CalendarDot } from '../../core/data/models';
import { TasksStore } from '../../core/data/tasks.store';
import { TodayService } from '../../core/data/today.service';
import { ca } from '../../i18n/ca';
import { ButtonGroup } from '../../shared/components/button-group/button-group';
import { Fab } from '../../shared/components/fab/fab';
import { NavListItem } from '../../shared/components/nav-list-item/nav-list-item';
import { Progress } from '../../shared/components/progress/progress';
import { StateMessage } from '../../shared/components/state-message/state-message';
import { TopBar } from '../../shared/components/top-bar/top-bar';
import { WeekCalendar } from '../../shared/components/week-calendar/week-calendar';
import { dayMonth, weekDays, weekTitle } from '../../shared/utils/dates-ca';

/** Calendari (vista setmana): la semana de hoy con los puntos de cada día y los accesos. */
@Component({
  selector: 'ap-calendar-page',
  imports: [RouterLink, IonContent, ButtonGroup, Fab, NavListItem, Progress, StateMessage, TopBar, WeekCalendar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar-page.html',
  styleUrl: './calendar-page.scss',
})
export class CalendarPage implements ViewWillEnter {
  private readonly api = inject(ApiService);
  private readonly todayService = inject(TodayService);
  private readonly nav = inject(NavController);
  protected readonly store = inject(TasksStore);
  protected readonly t = ca.calendar;
  protected readonly ca = ca;

  protected readonly status = signal<'loading' | 'ready' | 'error'>('loading');
  protected readonly today = signal('');
  protected readonly dots = signal<Record<string, CalendarDot[]>>({});

  protected readonly days = computed(() => (this.today() ? weekDays(this.today()) : []));
  protected readonly title = computed(() => (this.today() ? weekTitle(this.today()) : ''));
  protected readonly views = [
    { value: 'week', label: ca.calendar.week },
    { value: 'month', label: ca.calendar.month },
  ];
  protected readonly dayLabel = (date: string, n: number) => this.t.dayLabel(dayMonth(date), n);

  ionViewWillEnter(): void {
    void this.load();
    if (this.store.status() === 'idle') void this.store.load();
  }

  protected async load(): Promise<void> {
    this.status.set('loading');
    try {
      const today = await this.todayService.load();
      this.today.set(today);
      // La semana puede tocar dos meses (p. ej., del 30 de novembre al 6 de desembre).
      const months = [...new Set(weekDays(today).map((d) => d.slice(0, 7)))];
      const results = await Promise.all(months.map((m) => this.api.calendar(m)));
      const map: Record<string, CalendarDot[]> = {};
      for (const day of results.flat()) map[day.date] = day.dots;
      this.dots.set(map);
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }

  protected changeView(view: string): void {
    // Setmana ↔ Mes: se cambia el contenido en el sitio (sin animación ni historial), sin «salir» de Calendari.
    if (view === 'month') void this.nav.navigateRoot('/calendar/month', { animated: false, queryParams: { from: 'calendar' } });
  }

  protected openDay(date: string): void {
    void this.nav.navigateForward(['/calendar/day', date], { queryParams: { from: 'calendar' } });
  }
}
