import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, NavController, ViewWillEnter } from '@ionic/angular';
import { ApiService } from '../../core/data/api.service';
import type { Entry } from '../../core/data/models';
import { TasksStore } from '../../core/data/tasks.store';
import { TodayService } from '../../core/data/today.service';
import { ca } from '../../i18n/ca';
import { ExtendedFab } from '../../shared/components/extended-fab/extended-fab';
import { Progress } from '../../shared/components/progress/progress';
import { StateMessage } from '../../shared/components/state-message/state-message';
import { TaskRow } from '../../shared/components/task-row/task-row';
import { TaskSheetService } from '../../shared/components/task-sheet/task-sheet.service';
import { TopBar } from '../../shared/components/top-bar/top-bar';
import { dayMonth } from '../../shared/utils/dates-ca';

/**
 * Exàmens y Excursions (misma pantalla, distinto tipo): desde hoy en adelante,
 * por fecha, con «Nou examen» / «Nova excursió». Estados buit y error.
 */
@Component({
  selector: 'ap-entry-list-page',
  imports: [RouterLink, IonContent, ExtendedFab, Progress, StateMessage, TaskRow, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t().title" (back)="nav.back()" />
    <ap-progress [active]="status() === 'loading'" />
    <ion-content>
      <main class="page">
        @if (status() === 'error') {
          <ap-state-message class="state" kind="error" [title]="t().error" [text]="ca.state.checkConnection" (retry)="load()" />
        } @else if (status() === 'ready') {
          <ul class="list" [attr.aria-label]="t().title">
            @for (e of entries(); track e.id) {
              <li>
                <ap-task-row
                  [title]="e.title"
                  [supporting]="when(e)"
                  [done]="e.done"
                  [highPriority]="e.priority === 'high'"
                  [lowPriority]="e.priority === 'low'"
                  [tags]="e.tags"
                  (doneChange)="store.setDone(e, $event)"
                  (open)="sheet.open(e, kind())"
                  (menu)="sheet.open(e, kind())"
                />
              </li>
            } @empty {
              <ap-state-message class="state" [title]="t().empty" [text]="t().emptyText" />
            }
          </ul>
        }
      </main>
    </ion-content>
    @if (status() !== 'error') {
      <a apExtendedFab routerLink="/new/{{ type() }}" [queryParams]="{ from: kind() }">{{ t().add }}</a>
    }
  `,
  styles: `
    :host { display: flex; flex-direction: column; height: 100%; }
    ion-content { flex: 1; }
    .page { padding: var(--space-100) var(--size-layout-margin) 96px; }
    .list { margin: 0; padding: 0; list-style: none; }
    li + li { border-top: 1px solid var(--color-outline-variant); }
    .state { margin-top: 30%; }
  `,
})
export class EntryListPage implements ViewWillEnter {
  /** De `data` de la ruta: 'exam' o 'trip'. */
  readonly type = input.required<'exam' | 'trip'>();

  private readonly api = inject(ApiService);
  private readonly todayService = inject(TodayService);
  protected readonly store = inject(TasksStore);
  protected readonly sheet = inject(TaskSheetService);
  protected readonly nav = inject(NavController);
  protected readonly ca = ca;

  protected readonly t = computed(() => (this.type() === 'exam' ? ca.exams : ca.trips));
  /** Origen para las pantallas que se abren desde aquí (`?from=exams`). */
  protected readonly kind = computed(() => (this.type() === 'exam' ? 'exams' : 'trips'));
  protected readonly status = signal<'loading' | 'ready' | 'error'>('loading');
  protected readonly entries = signal<Entry[]>([]);

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
      this.entries.set(await this.api.entries({ type: this.type(), from: today }));
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }

  protected when(e: Entry): string {
    return dayMonth(e.date);
  }
}
