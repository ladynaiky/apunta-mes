import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toApiError } from '../../core/api/api-error';
import { ApiService } from '../../core/data/api.service';
import type { Entry } from '../../core/data/models';
import { TasksStore } from '../../core/data/tasks.store';
import { ca } from '../../i18n/ca';
import { Button } from '../../shared/components/button/button';
import { Checkbox } from '../../shared/components/checkbox/checkbox';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';
import { taskLabel } from '../../shared/utils/task-title';

/** El meu espai · Compartir: qué tareas ve la familia (Compartir/Privacitat). */
@Component({
  selector: 'ap-me-share',
  imports: [RouterLink, Button, Checkbox],
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
                <span class="title"><span class="subject">{{ e.subject?.name }}</span>: {{ rest(e) }}</span>
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
    <h3 class="label">{{ t.alreadyShared }}</h3>
    <p class="summary">{{ t.sharedSummary(sharedCount(), familyCount()) }}</p>
    <a apButton variant="filled" size="m" [block]="true" class="cta" routerLink="/share" [queryParams]="{ from: 'me' }">
      {{ t.shareMarked }}
    </a>
  `,
  styles: `
    .intro { margin: 0 0 var(--space-100); font: 400 16px/24px var(--font-text); letter-spacing: 0.5px; }
    .label { margin: var(--space-200) 0 var(--space-50); color: var(--color-on-surface-variant); font: 500 14px/20px var(--font-text); }
    .list { margin: 0; padding: 0; list-style: none; }
    li { display: flex; align-items: center; min-height: var(--size-list-item-two-line); }
    .text { display: flex; flex-direction: column; gap: var(--space-50); }
    .title { font: 400 16px/24px var(--font-text); letter-spacing: 0.5px; }
    .subject { color: var(--color-primary); }
    .tags { display: flex; gap: var(--space-75); }
    .tag { display: inline-flex; align-items: center; height: 20px; padding: 0 var(--space-100); border: 1px solid var(--color-outline); border-radius: var(--shape-corner-full); color: var(--color-on-surface-variant); font: 500 12px/16px var(--font-text); }
    .tag.priority { border-color: transparent; background: var(--color-priority-container); color: var(--color-on-priority-container); }
    .summary { margin: 0; font: 500 16px/24px var(--font-text); }
    .cta { margin-top: var(--space-300); }
  `,
})
export class MeShare implements OnInit {
  private readonly api = inject(ApiService);
  private readonly store = inject(TasksStore);
  private readonly snackbar = inject(SnackbarService);
  protected readonly t = ca.me;
  protected readonly ca = ca;
  protected readonly familyCount = signal(0);

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
      this.familyCount.set((await this.api.contacts()).filter((c) => c.role === 'parent').length);
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
