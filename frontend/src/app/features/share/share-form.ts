import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { toApiError } from '../../core/api/api-error';
import { ApiService } from '../../core/data/api.service';
import type { Contact, ContactRole } from '../../core/data/models';
import { ca } from '../../i18n/ca';
import { Button } from '../../shared/components/button/button';
import { Checkbox } from '../../shared/components/checkbox/checkbox';
import { Dialog } from '../../shared/components/dialog/dialog';
import { Icon } from '../../shared/components/icon/icon';
import { IconButton } from '../../shared/components/icon-button/icon-button';
import { Select, type SelectOption } from '../../shared/components/select/select';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';
import { StateMessage } from '../../shared/components/state-message/state-message';
import { TextField } from '../../shared/components/text-field/text-field';

const GROUPS: ContactRole[] = ['student', 'parent', 'teacher', 'other'];

/**
 * Formulario de Compartir (simulado): «Tipus de contingut», «Contactes»
 * (elección múltiple por grupos, con añadir/editar/borrar) y «Generar l’enllaç».
 */
@Component({
  selector: 'ap-share-form',
  imports: [FormsModule, Button, Checkbox, Dialog, Icon, IconButton, Select, StateMessage, TextField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './share-form.html',
  styleUrl: './share-form.scss',
})
export class ShareForm implements OnInit {
  readonly from = input('home');

  private readonly api = inject(ApiService);
  private readonly nav = inject(NavController);
  private readonly snackbar = inject(SnackbarService);
  protected readonly t = ca.share;
  protected readonly ca = ca;

  protected readonly typeOptions: SelectOption<'tasks' | 'calendar'>[] = [
    { value: 'tasks', label: ca.share.types['tasks'] },
    { value: 'calendar', label: ca.share.types['calendar'] },
  ];
  protected readonly type = signal<'tasks' | 'calendar' | null>(null);
  protected readonly contacts = signal<Contact[]>([]);
  protected readonly status = signal<'loading' | 'ready' | 'error'>('loading');
  protected readonly selected = signal<string[]>([]);
  protected readonly pickerOpen = signal(false);
  protected readonly openGroup = signal<ContactRole | null>(null);
  protected readonly tried = signal(false);
  protected readonly sending = signal(false);

  // Diálogo de contacto (añadir / editar) y de borrado
  protected readonly dialogOpen = signal(false);
  protected readonly editing = signal<Contact | null>(null);
  protected readonly draftName = signal('');
  protected readonly draftData = signal('');
  protected readonly draftRole = signal<ContactRole | null>(null);
  protected readonly draftTried = signal(false);
  protected readonly toDelete = signal<Contact | null>(null);
  protected readonly roleOptions: SelectOption<ContactRole>[] = (['student', 'parent', 'teacher'] as ContactRole[]).map(
    (r) => ({ value: r, label: ca.share.roles[r] }),
  );

  protected readonly groups = computed(() =>
    GROUPS.map((role) => {
      const items = this.contacts().filter((c) => c.role === role);
      return {
        role,
        name: this.t.groups[role],
        items,
        selected: items.filter((c) => this.selected().includes(c.id)).length,
      };
    }).filter((g) => g.role !== 'other' || g.items.length),
  );
  protected readonly summary = computed(() => {
    const names = this.contacts().filter((c) => this.selected().includes(c.id)).map((c) => c.name);
    if (!names.length) return null;
    return names.length <= 2 ? names.join(', ') : this.t.contactsSelected(names.length);
  });
  protected readonly typeError = computed(() => (this.tried() && !this.type() ? this.t.typeRequired : null));
  protected readonly contactsError = computed(() =>
    this.tried() && !this.selected().length ? this.t.contactsRequired : null,
  );

  ngOnInit(): void {
    void this.load();
  }

  protected async load(): Promise<void> {
    this.status.set('loading');
    try {
      this.contacts.set(await this.api.contacts());
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }

  protected toggle(c: Contact, on: boolean): void {
    this.selected.update((l) => (on ? [...l, c.id] : l.filter((id) => id !== c.id)));
  }

  protected openAdd(role: ContactRole | null): void {
    this.editing.set(null);
    this.draftName.set('');
    this.draftData.set('');
    this.draftRole.set(role === 'other' ? null : role);
    this.draftTried.set(false);
    this.dialogOpen.set(true);
  }

  protected openEdit(c: Contact): void {
    this.editing.set(c);
    this.draftName.set(c.name);
    this.draftData.set(c.emailOrPhone);
    this.draftRole.set(c.role === 'other' ? null : c.role);
    this.draftTried.set(false);
    this.dialogOpen.set(true);
  }

  protected async saveContact(): Promise<void> {
    this.draftTried.set(true);
    if (!this.draftName().trim()) return;
    const data = { name: this.draftName().trim(), emailOrPhone: this.draftData().trim(), role: this.draftRole() ?? 'other' };
    try {
      const editing = this.editing();
      if (editing) {
        const saved = await this.api.updateContact(editing.id, data);
        this.contacts.update((l) => l.map((c) => (c.id === saved.id ? saved : c)));
      } else {
        const created = await this.api.createContact(data);
        this.contacts.update((l) => [...l, created]);
        this.selected.update((l) => [...l, created.id]);
        this.openGroup.set(created.role);
      }
      this.dialogOpen.set(false);
    } catch (err) {
      this.snackbar.show(toApiError(err).message);
    }
  }

  protected async confirmDelete(): Promise<void> {
    const c = this.toDelete();
    this.toDelete.set(null);
    if (!c) return;
    try {
      await this.api.deleteContact(c.id);
      this.contacts.update((l) => l.filter((x) => x.id !== c.id));
      this.selected.update((l) => l.filter((id) => id !== c.id));
    } catch (err) {
      this.snackbar.show(toApiError(err).message);
    }
  }

  protected async generate(): Promise<void> {
    this.tried.set(true);
    if (!this.type() || !this.selected().length || this.sending()) return;
    this.sending.set(true);
    try {
      const link = await this.api.createShareLink(this.type()!, this.selected());
      await this.nav.navigateForward('/share/link', { queryParams: { url: link.url, from: this.from() } });
    } catch (err) {
      this.snackbar.show(toApiError(err).message);
    } finally {
      this.sending.set(false);
    }
  }
}
