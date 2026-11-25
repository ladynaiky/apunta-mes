import { ChangeDetectionStrategy, Component, effect, inject, input, signal, untracked } from '@angular/core';
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

/** Tasca trobada: resultado de Buscar/Filtrar (`?q=&subject=&date=`). */
@Component({
  selector: 'ap-search-results-page',
  imports: [RouterLink, IonContent, Button, Progress, StateMessage, TaskRow, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t.resultsTitle" (back)="nav.back()" />
    <ap-progress [active]="status() === 'loading'" />
    <ion-content>
      <main class="page">
        @if (status() === 'error') {
          <ap-state-message class="state" kind="error" [title]="t.error" [text]="ca.state.checkConnection" (retry)="load()" />
        } @else if (status() === 'ready') {
          @if (entries().length) {
            <h2 class="label">{{ t.resultsLabel }}</h2>
            @for (e of entries(); track e.id + e.date) {
              <ap-task-row
                [subjectName]="e.type === 'task' || e.type === 'trip' ? (e.subject?.name ?? null) : null"
                [subjectColor]="e.subject?.colorToken ?? null"
                [entryType]="e.type"
                [title]="e.title"
                [supporting]="supporting(e)"
                [done]="e.done"
                [highPriority]="e.priority === 'high'"
                [lowPriority]="e.priority === 'low'"
                [tags]="e.tags"
                [showCheckbox]="e.type !== 'birthday'"
                [leadIcon]="e.type === 'birthday' ? 'cake' : null"
                (doneChange)="store.setDone(e, $event)"
                (open)="sheet.open(e, 'tasks')"
                (menu)="sheet.open(e, 'tasks')"
              />
            }
          } @else {
            <ap-state-message class="state" [title]="t.noResults" [text]="t.noResultsText" />
          }
          <div class="cta">
            <a apButton variant="filled" routerLink="/new/task" [queryParams]="newTaskQuery()">{{ t.newTask }}</a>
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
    .state { display: block; margin-top: 25%; }
    .cta { display: flex; justify-content: center; margin-top: var(--space-300); }
  `,
})
export class SearchResultsPage implements ViewWillEnter {
  readonly q = input<string | undefined>();
  readonly subject = input<string | undefined>();
  readonly date = input<string | undefined>();
  readonly from = input<string | undefined>();

  private readonly api = inject(ApiService);
  private readonly todayService = inject(TodayService);
  protected readonly store = inject(TasksStore);
  protected readonly sheet = inject(TaskSheetService);
  protected readonly nav = inject(NavController);
  protected readonly t = ca.search;
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
      this.entries.set(
        await this.api.entries({
          q: this.q() || undefined,
          subject: this.subject() || undefined,
          from: this.date() || undefined,
          to: this.date() || undefined,
        }),
      );
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }

  protected supporting(e: Entry): string {
    return e.type === 'task' ? dueLabel(e.date, this.today) : dayMonth(e.date);
  }

  protected newTaskQuery(): Record<string, string> {
    const q: Record<string, string> = { from: this.from() ?? 'tasks' };
    if (this.date()) q['date'] = this.date()!;
    return q;
  }
}
