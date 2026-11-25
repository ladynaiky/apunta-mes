import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toApiError } from '../../core/api/api-error';
import { ApiService } from '../../core/data/api.service';
import { TAG_COLORS, type MarkWith, type Preferences, type Subject, type Tag, type TagColor, type TagKey } from '../../core/data/models';
import { TasksStore } from '../../core/data/tasks.store';
import { ca } from '../../i18n/ca';
import { RouterLink } from '@angular/router';
import { Button } from '../../shared/components/button/button';
import { ButtonGroup } from '../../shared/components/button-group/button-group';
import { Dialog } from '../../shared/components/dialog/dialog';
import { Modal } from '../../shared/components/modal/modal';
import { TextField } from '../../shared/components/text-field/text-field';
import { Icon } from '../../shared/components/icon/icon';
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
  imports: [FormsModule, RouterLink, Button, ButtonGroup, Dialog, Icon, Modal, StateMessage, SubjectDot, SwatchPicker, Switch, TextField],
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

  // Etiquetes pròpies: modal «Nova etiqueta» / «Editar etiqueta»
  protected readonly tags = this.store.tags;
  protected readonly tagColors = TAG_COLORS;
  protected readonly tagOpen = signal(false);
  protected readonly tagEditing = signal<Tag | null>(null);
  protected readonly tagName = signal('');
  protected readonly tagColor = signal<TagColor>('menta');
  protected readonly tagTried = signal(false);
  protected readonly tagError = signal<string | null>(null);
  protected readonly confirmTagDelete = signal(false);
  protected readonly tagNameError = computed(() => {
    if (!this.tagTried()) return null;
    const name = this.tagName().trim();
    if (!name) return this.t.tagNameRequired;
    return name.length > 20 ? this.t.tagNameTooLong : null;
  });

  /** Vista elegida (Colors / Etiquetes): solo cambia lo que se ve en esta pantalla. */
  protected readonly view = signal<MarkWith>('colors');
  protected readonly markOptions = (['colors', 'tags'] as MarkWith[]).map((v) => ({
    value: v,
    label: this.t.markOptions[v],
  }));
  /** Vista previa: todas las etiquetas propias que se muestran. */
  protected readonly previewTags = computed(() => this.tags().filter((t) => t.visible));
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


  protected setTag(key: string, on: boolean): void {
    const tags = this.prefs()!.visibleTags.filter((k) => k !== key);
    void this.save({ visibleTags: on ? [...tags, key as TagKey] : tags });
  }

  protected openTag(tag: Tag | null): void {
    this.tagEditing.set(tag);
    this.tagName.set(tag?.name ?? '');
    this.tagColor.set(tag?.color ?? 'menta');
    this.tagTried.set(false);
    this.tagError.set(null);
    this.tagOpen.set(true);
  }

  protected closeTag(): void {
    this.tagOpen.set(false);
    this.confirmTagDelete.set(false);
  }

  protected async saveTag(): Promise<void> {
    this.tagTried.set(true);
    if (this.tagNameError() || this.saving()) return;
    this.saving.set(true);
    this.tagError.set(null);
    const data = { name: this.tagName().trim(), color: this.tagColor() };
    try {
      const editing = this.tagEditing();
      if (editing) await this.api.updateTag(editing.id, data);
      else await this.api.createTag(data);
      await this.reloadTags();
      this.closeTag();
      this.snackbar.show(this.t.tagSaved);
    } catch (err) {
      this.tagError.set(toApiError(err).message);
    } finally {
      this.saving.set(false);
    }
  }

  protected async deleteTag(): Promise<void> {
    const tag = this.tagEditing();
    this.confirmTagDelete.set(false);
    if (!tag) return;
    try {
      await this.api.deleteTag(tag.id);
      await this.reloadTags();
      this.closeTag();
      this.snackbar.show(this.t.tagDeleted);
    } catch (err) {
      this.tagError.set(toApiError(err).message);
    }
  }

  protected async setTagVisible(tag: Tag, visible: boolean): Promise<void> {
    this.tags.update((l) => l.map((t) => (t.id === tag.id ? { ...t, visible } : t)));
    try {
      await this.api.updateTag(tag.id, { visible });
      await this.reloadTags();
    } catch (err) {
      this.tags.update((l) => l.map((t) => (t.id === tag.id ? tag : t)));
      this.snackbar.show(toApiError(err).message);
    }
  }

  /** Recarga las etiquetas y las tareas (las filas muestran las etiquetas con su nombre y color). */
  private async reloadTags(): Promise<void> {
    await this.store.load();
    this.store.changes.update((n) => n + 1);
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
