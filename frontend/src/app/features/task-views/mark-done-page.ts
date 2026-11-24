import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { IonContent, NavController, ViewWillEnter } from '@ionic/angular';
import { toApiError } from '../../core/api/api-error';
import { ApiService } from '../../core/data/api.service';
import type { Entry } from '../../core/data/models';
import { TasksStore } from '../../core/data/tasks.store';
import { TodayService } from '../../core/data/today.service';
import { ca } from '../../i18n/ca';
import { Progress } from '../../shared/components/progress/progress';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';
import { StateMessage } from '../../shared/components/state-message/state-message';
import { TaskRow } from '../../shared/components/task-row/task-row';
import { TaskSheetService } from '../../shared/components/task-sheet/task-sheet.service';
import { TopBar } from '../../shared/components/top-bar/top-bar';
import { dueLabel } from '../../shared/utils/dates-ca';

/**
 * Marcar tasca feta: las tareas pendientes. Las que se marcan se quedan en la
 * lista hasta salir de la pantalla, para poder desmarcarlas.
 */
@Component({
  selector: 'ap-mark-done-page',
  imports: [IonContent, Progress, StateMessage, TaskRow, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t.markTitle" (back)="nav.back()" />
    <ap-progress [active]="status() === 'loading'" />
    <ion-content>
      <main class="page">
        @if (status() === 'error') {
          <ap-state-message class="state" kind="error" [title]="t.loadError" [text]="ca.state.checkConnection" (retry)="load()" />
        } @else if (status() === 'ready') {
          @if (entries().length) {
            <p class="intro">{{ t.markIntro }}</p>
            @for (e of entries(); track e.id) {
              <ap-task-row
                [subjectName]="e.subject?.name ?? null"
                [subjectColor]="e.subject?.colorToken ?? null"
                [title]="e.title"
                [supporting]="due(e)"
                [done]="e.done"
                [highPriority]="e.priority === 'high'"
                (doneChange)="toggle(e, $event)"
                (open)="sheet.open(e, 'tasks')"
                (menu)="sheet.open(e, 'tasks')"
              />
            }
          } @else {
            <ap-state-message class="state" [title]="t.markEmpty" [text]="t.markEmptyText" />
          }
        }
      </main>
    </ion-content>
  `,
  styleUrl: './task-views.scss',
})
export class MarkDonePage implements ViewWillEnter {
  private readonly api = inject(ApiService);
  private readonly todayService = inject(TodayService);
  private readonly store = inject(TasksStore);
  private readonly snackbar = inject(SnackbarService);
  protected readonly sheet = inject(TaskSheetService);
  protected readonly nav = inject(NavController);
  protected readonly t = ca.taskViews;
  protected readonly ca = ca;
  protected readonly status = signal<'loading' | 'ready' | 'error'>('loading');
  protected readonly entries = signal<Entry[]>([]);
  private today = '';

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

  protected async toggle(e: Entry, done: boolean): Promise<void> {
    const patch = (value: boolean) =>
      this.entries.update((l) => l.map((x) => (x.id === e.id ? { ...x, done: value } : x)));
    patch(done);
    try {
      await this.api.setDone(e.id, done);
      void this.store.load(); // badge del perfil e Inici
    } catch (err) {
      patch(!done);
      this.snackbar.show(toApiError(err).message);
    }
  }
}
