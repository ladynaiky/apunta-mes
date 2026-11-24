import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, NavController } from '@ionic/angular';
import { toApiError } from '../../../core/api/api-error';
import { AuthService } from '../../../core/auth/auth.service';
import { validateEmail } from '../../../core/validation/validators';
import { ca } from '../../../i18n/ca';
import { Button } from '../../../shared/components/button/button';
import { Icon } from '../../../shared/components/icon/icon';
import { TextField } from '../../../shared/components/text-field/text-field';
import { TopBar } from '../../../shared/components/top-bar/top-bar';
import { FormState } from '../form-state';

/**
 * «Has oblidat la contrasenya?» (iteración 1, simulado): correo → «T'hem enviat un correu».
 * La API responde igual exista o no la cuenta (no revela qué correos están registrados).
 */
@Component({
  selector: 'ap-forgot-password-page',
  imports: [FormsModule, IonContent, Button, Icon, TextField, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ap-top-bar [title]="t.title" (back)="back()" />
    <ion-content>
      <main class="page">
        @if (!sent()) {
          <p class="intro">{{ t.intro }}</p>
          <form class="form" novalidate (ngSubmit)="submit()">
            <ap-text-field
              [label]="ca.login.email"
              type="email"
              autocomplete="email"
              [placeholder]="ca.login.emailPlaceholder"
              name="email"
              [(ngModel)]="email"
              (ngModelChange)="form.edited('email')"
              [error]="emailError()"
            />
            @if (form.formError(); as message) {
              <p class="form-error" role="alert"><ap-icon name="error" [size]="20" /><span>{{ message }}</span></p>
            }
            <button apButton type="submit" variant="filled" size="m" [block]="true" [disabled]="form.sending()" [attr.aria-busy]="form.sending()">
              {{ t.submit }}
            </button>
          </form>
        } @else {
          <section class="done" aria-live="polite">
            <ap-icon name="mark_email_read" [size]="48" />
            <h2>{{ t.sentTitle }}</h2>
            <p>{{ t.sentText(email().trim()) }}</p>
          </section>
          <button apButton type="button" variant="filled" size="m" [block]="true" (click)="back()">{{ t.backToLogin }}</button>
        }
      </main>
    </ion-content>
  `,
  styles: `
    :host { display: flex; flex-direction: column; height: 100%; }
    ion-content { flex: 1; }
    .page { display: flex; flex-direction: column; gap: var(--space-300); padding: var(--space-300) var(--size-layout-margin) var(--space-400); }
    .intro { margin: 0; font: 400 16px/24px var(--font-text); letter-spacing: 0.5px; }
    .form { display: flex; flex-direction: column; gap: var(--space-300); }
    .form-error { display: flex; align-items: flex-start; gap: var(--space-100); margin: 0; color: var(--color-error); font: 400 14px/20px var(--font-text); }
    .done { display: flex; flex-direction: column; align-items: center; gap: var(--space-100); padding-top: var(--space-400); text-align: center; }
    .done ap-icon { color: var(--color-primary-container); }
    .done h2 { margin: 0; font: 600 22px/28px var(--font-title); }
    .done p { margin: 0; color: var(--color-on-surface-variant); font: 400 14px/20px var(--font-text); }
  `,
})
export class ForgotPasswordPage {
  private readonly auth = inject(AuthService);
  private readonly nav = inject(NavController);
  protected readonly t = ca.forgot;
  protected readonly ca = ca;

  protected readonly email = signal('');
  protected readonly sent = signal(false);
  protected readonly form = new FormState({
    email: { value: this.email, validate: () => validateEmail(this.email()) },
  });
  protected readonly emailError = this.form.error('email');

  protected async submit(): Promise<void> {
    this.form.tried.set(true);
    this.form.formError.set(null);
    if (!this.form.valid() || this.form.sending()) return;
    this.form.sending.set(true);
    try {
      await this.auth.forgotPassword(this.email().trim());
      this.sent.set(true);
    } catch (err) {
      const e = toApiError(err);
      this.form.serverErrors.set(e.fields);
      if (e.code !== 'VALIDATION_ERROR') this.form.formError.set(e.message);
    } finally {
      this.form.sending.set(false);
    }
  }

  protected back(): void {
    void this.nav.navigateBack('/login');
  }
}
