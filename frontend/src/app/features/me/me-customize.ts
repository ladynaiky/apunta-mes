import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toApiError } from '../../core/api/api-error';
import { ApiService } from '../../core/data/api.service';
import type { GroupBy, MarkWith, Preferences, Subject, TagKey } from '../../core/data/models';
import { TasksStore } from '../../core/data/tasks.store';
import { ca } from '../../i18n/ca';
import { RouterLink } from '@angular/router';
import { Button } from '../../shared/components/button/button';
import { ButtonGroup } from '../../shared/components/button-group/button-group';
import { Dialog } from '../../shared/components/dialog/dialog';
import { Modal } from '../../shared/components/modal/modal';
import { TextField } from '../../shared/components/text-field/text-field';
import { Icon } from '../../shared/components/icon/icon';
import { Select, type SelectOption } from '../../shared/components/select/select';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';
import { StateMessage } from '../../shared/components/state-message/state-message';
import { SubjectDot } from '../../shared/components/subject-dot/subject-dot';
import { SwatchPicker } from '../../shared/components/swatch-picker/swatch-picker';
import { Switch } from '../../shared/components/switch/switch';
import type { SubjectColorToken } from '../../shared/utils/task-title';

/**
 * El meu espai · Personalitzar: agrupar, marcar con colores o etiquetas (se guarda al momento)
 * y editar o esborrar las asignaturas en un modal (iteración 1).
 */
@Component({
  selector: 'ap-me-customize',
  imports: [FormsModule, RouterLink, Button, ButtonGroup, Dialog, Icon, Modal, Select, StateMessage, SubjectDot, SwatchPicker, Switch, TextField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './me-customize.html',
  styleUrl: './me-customize.scss',
})
export class MeCustomize implements OnInit {
  private readonly api = inject(ApiService);
  private readonly store = inject(TasksStore);
  private readonly snackbar = inject(SnackbarService);
  protected readonly t = ca.me;
  protected readonly ca = ca;

  protected readonly status = signal<'loading' | 'ready' | 'error'>('loading');
  protected readonly prefs = signal<Preferences | null>(null);
  // Modal «Editar assignatura»
  protected readonly editing = signal<Subject | null>(null);
  protected readonly draftName = signal('');
  protected readonly draftColor = signal<SubjectColorToken | null>(null);
  protected readonly tried = signal(false);
  protected readonly saving = signal(false);
  protected readonly subjectError = signal<string | null>(null);
  protected readonly confirmDelete = signal(false);
  protected readonly nameError = computed(() =>
    this.tried() && !this.draftName().trim() ? this.t.subjectNameRequired : null,
  );
  protected readonly subjects = this.store.subjects;

  protected readonly groupOptions: SelectOption<GroupBy>[] = (['subjects', 'priority', 'date'] as GroupBy[]).map(
    (v) => ({ value: v, label: this.t.groupOptions[v] }),
  );
  protected readonly markOptions = (['colors', 'tags'] as MarkWith[]).map((v) => ({
    value: v,
    label: this.t.markOptions[v],
  }));
  /** Vista previa: cabecera según la agrupación elegida. */
  protected readonly previewGroup = computed(() => {
    const g = this.prefs()?.groupBy;
    return g === 'priority' ? ca.task.highPriority : g === 'date' ? ca.task.forToday : 'Mates';
  });
  protected readonly mates = computed(() => this.subjects().find((s) => s.name === 'Mates') ?? null);

  async ngOnInit(): Promise<void> {
    if (this.store.status() === 'idle') void this.store.load();
    try {
      this.prefs.set(await this.api.preferences());
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }

  protected tagOn(key: string): boolean {
    return this.prefs()?.visibleTags.includes(key as TagKey) ?? false;
  }

  protected setGroup(groupBy: GroupBy | null): void {
    if (groupBy) void this.save({ groupBy });
  }

  protected setMark(markWith: string): void {
    void this.save({ markWith: markWith as MarkWith });
  }

  protected setTag(key: string, on: boolean): void {
    const tags = this.prefs()!.visibleTags.filter((k) => k !== key);
    void this.save({ visibleTags: on ? [...tags, key as TagKey] : tags });
  }

  protected openEdit(subject: Subject): void {
    this.editing.set(subject);
    this.draftName.set(subject.name);
    this.draftColor.set(subject.colorToken);
    this.tried.set(false);
    this.subjectError.set(null);
  }

  protected closeEdit(): void {
    this.editing.set(null);
    this.confirmDelete.set(false);
  }

  protected async saveSubject(): Promise<void> {
    const subject = this.editing();
    this.tried.set(true);
    if (!subject || this.nameError()) return;
    this.saving.set(true);
    this.subjectError.set(null);
    try {
      await this.api.updateSubject(subject.id, { name: this.draftName().trim(), colorToken: this.draftColor() ?? subject.colorToken });
      await this.store.load();
      this.store.changes.update((n) => n + 1);
      this.closeEdit();
      this.snackbar.show(this.t.subjectSaved);
    } catch (err) {
      this.subjectError.set(toApiError(err).message);
    } finally {
      this.saving.set(false);
    }
  }

  /** Decisión 4: si tiene cosas apuntadas, el backend responde 409 SUBJECT_IN_USE y se avisa. */
  protected async deleteSubject(): Promise<void> {
    const subject = this.editing();
    this.confirmDelete.set(false);
    if (!subject) return;
    try {
      await this.api.deleteSubject(subject.id);
      await this.store.load();
      this.store.changes.update((n) => n + 1);
      this.closeEdit();
      this.snackbar.show(this.t.subjectDeleted);
    } catch (err) {
      this.subjectError.set(toApiError(err).message);
    }
  }

  private async save(patch: Partial<Preferences>): Promise<void> {
    const before = this.prefs();
    this.prefs.set({ ...before!, ...patch });
    try {
      const saved = await this.api.savePreferences(patch);
      this.prefs.set(saved);
      this.store.visibleTags.set(saved.visibleTags);
    } catch (err) {
      this.prefs.set(before);
      this.snackbar.show(toApiError(err).message);
    }
  }
}
