import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnInit, signal, untracked } from '@angular/core';
import { toApiError } from '../../core/api/api-error';
import { ApiService } from '../../core/data/api.service';
import type { Entry } from '../../core/data/models';
import { TasksStore } from '../../core/data/tasks.store';
import { ca } from '../../i18n/ca';
import { Button } from '../../shared/components/button/button';
import { Checkbox } from '../../shared/components/checkbox/checkbox';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';
import { StateMessage } from '../../shared/components/state-message/state-message';
import { TaskRow } from '../../shared/components/task-row/task-row';
import { ShareFlowService } from '../../shared/components/share-flow/share-flow.service';
import { TaskSheetService } from '../../shared/components/task-sheet/task-sheet.service';
import { dueLabel } from '../../shared/utils/dates-ca';
import { roleGroup } from '../../shared/utils/roles';
import { rowTitle, taskLabel } from '../../shared/utils/task-title';

/** El meu espai · Compartir: qué tareas ve la familia (Compartir/Privacitat). */
@Component({
  selector: 'ap-me-share',
  imports: [Button, Checkbox, StateMessage, TaskRow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="intro">{{ t.shareIntro }}</p>
    @for (group of groups(); track group.title) {
      @if (group.items.length) {
        <h3 class="label">{{ group.title }}</h3>
        <ul class="list">
          @for (e of group.items; track e.id) {
            <li>
              <ap-checkbox [checked]="e.shared" [label]="t.shareTask(label(e))" (checkedChange)="toggle(e, $event)" />
              <span class="text">
                <span class="title"><span class="subject" [style.color]="e.subject ? 'var(--color-' + e.subject.colorToken + ')' : null">{{ e.subject?.name }}</span>: {{ rest(e) }}</span>
                <span class="tags">
                  <span class="tag">{{ ca.task.todo }}</span>
                  @if (e.priority === 'high') {
                    <span class="tag priority">{{ ca.task.highPriority }}</span>
                  }
                </span>
              </span>
            </li>
          }
        </ul>
      }
    }
    @if (showFooter()) {
      <button apButton type="button" variant="filled" size="m" [block]="true" class="cta" (click)="shareFlow.share()">
        {{ t.shareMarked }}
      </button>
      <!-- Iteración 1 (#19): lista de las tareas ya compartidas -->
      <h3 class="label shared-title">{{ t.alreadyShared }}</h3>
      <p class="summary">{{ t.sharedSummary(sharedCount(), familyCount()) }}</p>
      @if (sharedStatus() === 'error') {
        <ap-state-message kind="error" [title]="t.sharedLoadError" [text]="ca.state.checkConnection" (retry)="loadShared()" />
      } @else if (sharedStatus() === 'ready') {
        @for (e of shared(); track e.id) {
          <ap-task-row
            [subjectName]="e.subject?.name ?? null"
            [subjectColor]="e.subject?.colorToken ?? null"
            [title]="rowTitle(e)"
            [supporting]="due(e)"
            [done]="e.done"
            [highPriority]="e.priority === 'high'"
            [showCheckbox]="false"
            [showTags]="e.type !== 'birthday'"
            (open)="sheet.open(e, 'me')"
            (menu)="sheet.open(e, 'me')"
          />
        } @empty {
          <ap-state-message class="empty" [title]="t.noShared" [text]="t.noSharedText" />
        }
      }
    }
  `,
  styles: `
    .intro { margin: 0 0 var(--space-100); font: 400 16px/24px var(--font-text); letter-spacing: 0.5px; }
    .label { margin: var(--space-200) 0 var(--space-50); color: var(--color-on-surface-variant); font: 500 14px/20px var(--font-text); }
    .list { margin: 0; padding: 0; list-style: none; }
    li { display: flex; align-items: center; min-height: var(--size-list-item-two-line); }
    .text { display: flex; flex-direction: column; gap: var(--space-50); }
    .title { font: 400 16px/24px var(--font-text); letter-spacing: 0.5px; }
    .subject { color: var(--color-primary); font-weight: 700; }
    .tags { display: flex; gap: var(--space-75); }
    .tag { display: inline-flex; align-items: center; height: 20px; padding: 0 var(--space-100); border: 1px solid var(--color-outline); border-radius: var(--shape-corner-full); color: var(--color-on-surface-variant); font: 500 12px/16px var(--font-text); }
    .tag.priority { border-color: transparent; background: var(--color-priority-container); color: var(--color-on-priority-container); }
    .summary { margin: 0; font: 500 16px/24px var(--font-text); }
    .cta { margin-top: var(--space-300); }
    .shared-title { margin-top: var(--space-400); }
    .summary { margin-bottom: var(--space-100); }
    .empty { padding: var(--space-200) 0; }
  `,
})
export class MeShare implements OnInit {
  /** En «Compartir tasques», solo la lista (el formulario va debajo). */
  readonly showFooter = input(true);
  private readonly api = inject(ApiService);
  private readonly store = inject(TasksStore);
  private readonly snackbar = inject(SnackbarService);
  protected readonly t = ca.me;
  protected readonly ca = ca;
  protected readonly familyCount = signal(0);
  protected readonly sheet = inject(TaskSheetService);
  protected readonly shareFlow = inject(ShareFlowService);
  protected readonly rowTitle = rowTitle;
  protected readonly shared = signal<Entry[]>([]);
  protected readonly sharedStatus = signal<'loading' | 'ready' | 'error'>('loading');

  constructor() {
    // Se recarga cuando cambia una tarea (marcar «compartir», editar, esborrar…).
    effect(() => {
      this.store.changes();
      if (untracked(() => this.showFooter())) void untracked(() => this.loadShared());
    });
  }

  protected async loadShared(): Promise<void> {
    try {
      const list = await this.api.entries({ shared: true });
      this.shared.set(list.filter((e) => !e.done));
      this.sharedStatus.set('ready');
    } catch {
      this.sharedStatus.set('error');
    }
  }

  protected due(e: Entry): string {
    return dueLabel(e.date, this.store.today());
  }

  protected readonly groups = computed(() => [
    { title: this.t.daily, items: this.store.todayEntries().filter((e) => e.type === 'task' && !e.done) },
    { title: this.t.weekly, items: this.weekly() },
  ]);
  /** «Setmanals»: lo que queda de la semana. */
  private readonly weekly = computed(() => this.store.upcomingWeek().filter((e) => e.type === 'task' && !e.done));
  protected readonly sharedCount = computed(
    () => this.groups().flatMap((g) => g.items).filter((e) => e.shared).length,
  );

  async ngOnInit(): Promise<void> {
    if (this.store.status() === 'idle') void this.store.load();
    try {
      // «Família»: los contactos con rol Pares.
      this.familyCount.set((await this.api.contacts()).filter((c) => roleGroup(c.role) === 'family').length);
    } catch {
      this.familyCount.set(0);
    }
  }

  protected label(e: Entry): string {
    return taskLabel(e.subject?.name, e.title);
  }

  protected rest(e: Entry): string {
    return this.label(e).slice((e.subject?.name.length ?? -2) + 2);
  }

  protected async toggle(e: Entry, shared: boolean): Promise<void> {
    try {
      await this.store.update(e.id, { shared });
    } catch (err) {
      this.snackbar.show(toApiError(err).message);
    }
  }
}
