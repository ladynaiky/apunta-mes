import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, ViewWillEnter } from '@ionic/angular';
import type { Entry, Subject } from '../../core/data/models';
import { TasksStore } from '../../core/data/tasks.store';
import { ca } from '../../i18n/ca';
import { Chip } from '../../shared/components/chip/chip';
import { Fab } from '../../shared/components/fab/fab';
import { IconButton } from '../../shared/components/icon-button/icon-button';
import { Progress } from '../../shared/components/progress/progress';
import { SectionHeader } from '../../shared/components/section-header/section-header';
import { StateMessage } from '../../shared/components/state-message/state-message';
import { TaskRow } from '../../shared/components/task-row/task-row';
import { TaskSheetService } from '../../shared/components/task-sheet/task-sheet.service';
import { TopBar } from '../../shared/components/top-bar/top-bar';
import { dayMonth, greeting, shortDay } from '../../shared/utils/dates-ca';

/** Inici: saludo, asignaturas con pendientes, tareas de hoy y de esta semana. */
@Component({
  selector: 'ap-home-page',
  imports: [
    RouterLink,
    IonContent,
    Chip,
    Fab,
    IconButton,
    Progress,
    SectionHeader,
    StateMessage,
    TaskRow,
    TopBar,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements ViewWillEnter {
  protected readonly store = inject(TasksStore);
  protected readonly t = ca.home;
  protected readonly ca = ca;

  /** Asignatura elegida en los chips (filtra las dos listas). */
  protected readonly filter = signal<string | null>(null);
  private readonly sheet = inject(TaskSheetService);

  protected readonly hello = greeting(new Date().getHours());
  protected readonly todayText = computed(() => (this.store.today() ? this.t.today(dayMonth(this.store.today())) : ''));

  private readonly visible = (list: Entry[]) =>
    list.filter((e) => e.type !== 'birthday' && (!this.filter() || e.subject?.id === this.filter()));
  protected readonly todayList = computed(() => this.visible(this.store.todayEntries()));
  protected readonly weekList = computed(() => this.visible(this.store.upcomingWeek()));

  /** Chips: todas las asignaturas; el número, solo si tienen algo pendiente hoy o esta semana. */
  protected readonly chips = computed(() => {
    const pending = [...this.store.todayEntries(), ...this.store.upcomingWeek()].filter(
      (e) => e.subject && !e.done,
    );
    const count = new Map<string, number>();
    for (const e of pending) count.set(e.subject!.id, (count.get(e.subject!.id) ?? 0) + 1);
    return this.store.subjects().map((s: Subject) => ({ subject: s, count: count.get(s.id) ?? null }));
  });

  ionViewWillEnter(): void {
    void this.store.load();
  }

  protected open(e: Entry): void {
    this.sheet.open(e, 'home');
  }

  protected toggleFilter(id: string): void {
    this.filter.set(this.filter() === id ? null : id);
  }

  /** En la semana, el día va en el título: «Anglès: preparar la redacció (dv. 6)». */
  protected weekTitle(e: Entry): string {
    return `${e.title} (${shortDay(e.date)})`;
  }
}
