import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { toApiError } from '../../../core/api/api-error';
import type { Entry } from '../../../core/data/models';
import { TasksStore } from '../../../core/data/tasks.store';
import { ca } from '../../../i18n/ca';
import { dueLabel } from '../../utils/dates-ca';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';
import { IconButton } from '../icon-button/icon-button';
import { SubjectDot } from '../subject-dot/subject-dot';

type Mode = 'view' | 'delete';

/**
 * Hoja inferior de una tarea (bottom sheet modal del Design System):
 * ver el detalle, ir a «Editar» (pantalla completa, iteración 1) y confirmar el borrado.
 * Se abre con ⋮ o tocando la fila; Escape y el velo la cierran.
 */
@Component({
  selector: 'ap-task-sheet',
  imports: [Button, Icon, IconButton, SubjectDot],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-sheet.html',
  styleUrl: './task-sheet.scss',
  host: { '(document:keydown.escape)': 'entry() && close()' },
})
export class TaskSheet {
  readonly entry = input<Entry | null>(null);
  /** Origen para Compartir (?from=home…). */
  readonly from = input('home');
  readonly closed = output<void>();

  private readonly store = inject(TasksStore);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly titleEl = viewChild<ElementRef<HTMLElement>>('title');
  private opener: HTMLElement | null = null;

  protected readonly t = ca.sheet;
  protected readonly ca = ca;
  protected readonly mode = signal<Mode>('view');
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly today = this.store.today;
  protected readonly due = computed(() => {
    const e = this.entry();
    return e ? dueLabel(e.date, this.today()) : '';
  });
  protected readonly kind = computed(() => this.t.kind[this.entry()?.type ?? 'task']);

  constructor() {
    effect(() => {
      const e = this.entry();
      if (!e) return;
      this.opener = document.activeElement as HTMLElement | null;
      this.mode.set('view');
      this.error.set(null);
      afterNextRender(() => this.titleEl()?.nativeElement.focus(), { injector: this.injector });
    });
  }

  /** Iteración 1 (#8): editar todos los campos en la pantalla de Apuntar. */
  protected startEdit(): void {
    const e = this.entry()!;
    this.close();
    void this.router.navigate(['/entries', e.id, 'edit'], { queryParams: { from: this.from() } });
  }

  protected share(): void {
    this.close();
    void this.router.navigate(['/share'], { queryParams: { from: this.from() } });
  }

  protected async confirm(): Promise<void> {
    const e = this.entry()!;
    this.saving.set(true);
    this.error.set(null);
    try {
      await this.store.remove(e);
      this.close();
    } catch (err) {
      const apiError = toApiError(err);
      this.error.set(Object.values(apiError.fields)[0] ?? apiError.message);
    } finally {
      this.saving.set(false);
    }
  }

  protected close(): void {
    this.closed.emit();
    this.opener?.focus();
  }
}
