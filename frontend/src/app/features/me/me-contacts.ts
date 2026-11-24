import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toApiError } from '../../core/api/api-error';
import { ApiService } from '../../core/data/api.service';
import type { Contact, ContactRole } from '../../core/data/models';
import { ca } from '../../i18n/ca';
import { Button } from '../../shared/components/button/button';
import { Dialog } from '../../shared/components/dialog/dialog';
import { IconButton } from '../../shared/components/icon-button/icon-button';
import { Select, type SelectOption } from '../../shared/components/select/select';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';
import { StateMessage } from '../../shared/components/state-message/state-message';
import { TextField } from '../../shared/components/text-field/text-field';
import { roleLabel, roleOptions } from '../../shared/utils/roles';

/** El meu espai · Contactes: añadir, editar o borrar contactos (Sincronitzar está en Compartir). */
@Component({
  selector: 'ap-me-contacts',
  imports: [FormsModule, Button, Dialog, IconButton, Select, StateMessage, TextField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './me-contacts.html',
  styleUrl: './me-contacts.scss',
})
export class MeContacts implements OnInit {
  private readonly api = inject(ApiService);
  private readonly snackbar = inject(SnackbarService);
  protected readonly t = ca.me;
  protected readonly ca = ca;

  protected readonly status = signal<'loading' | 'ready' | 'error'>('loading');
  protected readonly contacts = signal<Contact[]>([]);

  // Formulario (añadir o editar)
  protected readonly editing = signal<Contact | null>(null);
  protected readonly email = signal('');
  protected readonly name = signal('');
  protected readonly role = signal<ContactRole | null>(null);
  protected readonly tried = signal(false);
  protected readonly saving = signal(false);
  protected readonly toDelete = signal<Contact | null>(null);

  protected readonly roles: SelectOption<ContactRole>[] = roleOptions(true);
  protected readonly nameError = computed(() =>
    this.tried() && !this.name().trim() ? this.t.contactNameRequired : null,
  );

  async ngOnInit(): Promise<void> {
    await this.load();
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

  protected detail(c: Contact): string {
    return [c.emailOrPhone, roleLabel(c.role)].filter(Boolean).join(' · ');
  }

  protected edit(c: Contact): void {
    this.editing.set(c);
    this.email.set(c.emailOrPhone);
    this.name.set(c.name);
    this.role.set(c.role);
    this.tried.set(false);
  }

  protected cancelEdit(): void {
    this.editing.set(null);
    this.resetForm();
  }

  protected async submit(): Promise<void> {
    this.tried.set(true);
    if (!this.name().trim() || this.saving()) return;
    this.saving.set(true);
    const data = { name: this.name().trim(), emailOrPhone: this.email().trim(), role: this.role() ?? 'other' };
    try {
      const editing = this.editing();
      if (editing) {
        const saved = await this.api.updateContact(editing.id, data);
        this.contacts.update((l) => l.map((c) => (c.id === saved.id ? saved : c)));
        this.snackbar.show(this.t.saved);
      } else {
        const created = await this.api.createContact(data);
        this.contacts.update((l) => [...l, created]);
      }
      this.editing.set(null);
      this.resetForm();
    } catch (err) {
      this.snackbar.show(toApiError(err).message);
    } finally {
      this.saving.set(false);
    }
  }

  protected async confirmDelete(): Promise<void> {
    const c = this.toDelete();
    this.toDelete.set(null);
    if (!c) return;
    try {
      await this.api.deleteContact(c.id);
      this.contacts.update((l) => l.filter((x) => x.id !== c.id));
      if (this.editing()?.id === c.id) this.cancelEdit();
    } catch (err) {
      this.snackbar.show(toApiError(err).message);
    }
  }

  private resetForm(): void {
    this.email.set('');
    this.name.set('');
    this.role.set(null);
    this.tried.set(false);
  }

}
