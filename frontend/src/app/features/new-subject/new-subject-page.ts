import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, NavController } from '@ionic/angular';
import { toApiError } from '../../core/api/api-error';
import { ApiService } from '../../core/data/api.service';
import { TasksStore } from '../../core/data/tasks.store';
import { apiErrors, ca } from '../../i18n/ca';
import { Button } from '../../shared/components/button/button';
import { Icon } from '../../shared/components/icon/icon';
import { SwatchPicker } from '../../shared/components/swatch-picker/swatch-picker';
import { TextField } from '../../shared/components/text-field/text-field';
import { TopBar } from '../../shared/components/top-bar/top-bar';
import type { SubjectColorToken } from '../../shared/utils/task-title';

/** Crear nova assignatura: nombre y color. Al volver a Apuntar, queda elegida. */
@Component({
  selector: 'ap-new-subject-page',
  imports: [FormsModule, IonContent, Button, Icon, SwatchPicker, TextField, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t.title" (back)="nav.back()" />
    <ion-content>
      <form class="page" novalidate (ngSubmit)="submit()">
        <ap-text-field
          [label]="t.name"
          [placeholder]="t.namePlaceholder"
          name="name"
          [(ngModel)]="name"
          (ngModelChange)="serverError.set(null)"
          [error]="nameError()"
        />
        <div>
          <p class="label" id="color-label">{{ t.color }}</p>
          <ap-swatch-picker [label]="t.color" [value]="color()" (valueChange)="color.set($event)" />
          @if (tried() && !color()) {
            <p class="error" role="alert"><ap-icon name="error" [size]="16" />{{ colorError }}</p>
          }
        </div>
        <div class="actions">
          <button apButton type="button" variant="outlined" size="m" (click)="nav.back()">{{ ca.common.cancel }}</button>
          <button apButton type="submit" variant="filled" size="m" [disabled]="sending()" [attr.aria-busy]="sending()">
            {{ t.create }}
          </button>
        </div>
      </form>
    </ion-content>
  `,
  styles: `
    :host { display: flex; flex-direction: column; height: 100%; }
    ion-content { flex: 1; }
    .page { display: flex; flex-direction: column; gap: var(--space-300); padding: var(--space-300) var(--size-layout-margin); }
    .label { margin: 0 0 var(--space-100); font: 500 14px/20px var(--font-text); }
    .error { display: flex; gap: var(--space-50); margin: var(--space-50) 0 0; color: var(--color-error); font: 400 12px/16px var(--font-text); }
    .actions { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-150); margin-top: var(--space-200); }
  `,
})
export class NewSubjectPage {
  private readonly api = inject(ApiService);
  private readonly store = inject(TasksStore);
  protected readonly nav = inject(NavController);
  protected readonly t = ca.newSubject;
  protected readonly ca = ca;

  protected readonly name = signal('');
  protected readonly color = signal<SubjectColorToken | null>(null);
  protected readonly tried = signal(false);
  protected readonly sending = signal(false);
  protected readonly serverError = signal<string | null>(null);
  protected readonly colorError = apiErrors['colorToken.required'];
  protected readonly nameError = computed(
    () => this.serverError() ?? (this.tried() && !this.name().trim() ? this.t.nameRequired : null),
  );

  protected async submit(): Promise<void> {
    this.tried.set(true);
    if (!this.name().trim() || !this.color() || this.sending()) return;
    this.sending.set(true);
    try {
      const subject = await this.api.createSubject({ name: this.name().trim(), colorToken: this.color()! });
      this.store.lastCreatedSubjectId.set(subject.id);
      await this.store.load();
      void this.nav.back();
    } catch (err) {
      this.serverError.set(toApiError(err).message);
    } finally {
      this.sending.set(false);
    }
  }
}
