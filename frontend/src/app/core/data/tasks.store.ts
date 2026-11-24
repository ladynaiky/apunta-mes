import { computed, inject, Injectable, signal } from '@angular/core';
import { ca } from '../../i18n/ca';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';
import { toApiError } from '../api/api-error';
import { ApiService } from './api.service';
import type { Entry, EntryInput, Subject } from './models';
import { TodayService } from './today.service';

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

/**
 * Estado compartido de lo de hoy y esta semana (Inici, Tasques y el badge
 * del perfil). Marcar como feta se ve al momento y se deshace si la API falla.
 */
@Injectable({ providedIn: 'root' })
export class TasksStore {
  private readonly api = inject(ApiService);
  private readonly todayService = inject(TodayService);
  private readonly snackbar = inject(SnackbarService);

  readonly status = signal<LoadStatus>('idle');
  readonly today = signal<string>('');
  readonly todayEntries = signal<Entry[]>([]);
  readonly weekEntries = signal<Entry[]>([]);
  readonly subjects = signal<Subject[]>([]);
  /**
   * Contador de cambios: sube cada vez que se marca, edita, borra o restaura
   * algo. Las pantallas con sus propias listas (día, exámenes…) lo vigilan.
   */
  readonly changes = signal(0);
  /** La última asignatura creada (Apuntar la deja elegida al volver). */
  readonly lastCreatedSubjectId = signal<string | null>(null);

  /** Lo que queda de la semana después de hoy. */
  readonly upcomingWeek = computed(() => this.weekEntries().filter((e) => e.date > this.today()));
  /** Tareas de hoy sin hacer (badge del perfil). */
  readonly pendingToday = computed(
    () => this.todayEntries().filter((e) => e.type !== 'birthday' && !e.done).length,
  );

  async load(): Promise<void> {
    if (this.status() === 'loading') return;
    this.status.set('loading');
    try {
      const [today, todayEntries, weekEntries, subjects] = await Promise.all([
        this.todayService.load(),
        this.api.today(),
        this.api.week(),
        this.api.subjects(),
      ]);
      this.today.set(today);
      this.todayEntries.set(todayEntries);
      this.weekEntries.set(weekEntries);
      this.subjects.set(subjects);
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }

  async setDone(entry: Entry, done: boolean): Promise<void> {
    this.patchLocal(entry.id, { done });
    try {
      const saved = await this.api.setDone(entry.id, done);
      this.replaceLocal(saved);
      this.changes.update((n) => n + 1);
    } catch (err) {
      this.patchLocal(entry.id, { done: !done });
      this.snackbar.show(toApiError(err).message);
    }
  }

  async update(id: string, input: EntryInput): Promise<Entry> {
    const saved = await this.api.updateEntry(id, input);
    this.replaceLocal(saved);
    this.changes.update((n) => n + 1);
    // Si ha cambiado de día, puede entrar o salir de hoy / esta semana.
    void this.load();
    return saved;
  }

  /** Esborrar con «Desfer» (vuelve a crearla con los mismos datos). */
  async remove(entry: Entry): Promise<void> {
    await this.api.deleteEntry(entry.id);
    this.todayEntries.update((l) => l.filter((e) => e.id !== entry.id));
    this.weekEntries.update((l) => l.filter((e) => e.id !== entry.id));
    this.changes.update((n) => n + 1);
    this.snackbar.show(ca.sheet.deleted, {
      actionLabel: ca.common.undo,
      action: () => void this.restore(entry),
    });
  }

  private async restore(entry: Entry): Promise<void> {
    const { id: _id, createdAt: _c, doneAt: _d, subject, ...rest } = entry;
    // Solo los campos con valor (los vacíos son de otros tipos de entrada).
    const data = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== '' && v !== null && !(Array.isArray(v) && !v.length)),
    );
    try {
      await this.api.createEntry({ ...data, subject: subject?.id ?? null });
      await this.load();
      this.changes.update((n) => n + 1);
    } catch (err) {
      this.snackbar.show(toApiError(err).message);
    }
  }

  private patchLocal(id: string, patch: Partial<Entry>): void {
    const apply = (l: Entry[]) => l.map((e) => (e.id === id ? { ...e, ...patch } : e));
    this.todayEntries.update(apply);
    this.weekEntries.update(apply);
  }

  private replaceLocal(saved: Entry): void {
    const apply = (l: Entry[]) => l.map((e) => (e.id === saved.id ? saved : e));
    this.todayEntries.update(apply);
    this.weekEntries.update(apply);
  }
}
