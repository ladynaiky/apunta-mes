import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { toApiError } from '../../../core/api/api-error';
import { AuthService } from '../../../core/auth/auth.service';
import { validateEmail, validateLoginPassword } from '../../../core/validation/validators';
import { ca } from '../../../i18n/ca';
import { Button } from '../../../shared/components/button/button';
import { Icon } from '../../../shared/components/icon/icon';
import { TextField } from '../../../shared/components/text-field/text-field';
import { FormState } from '../form-state';

/** Iniciar sessió: correo y contraseña → Inici. */
@Component({
  selector: 'ap-login-page',
  imports: [FormsModule, RouterLink, IonContent, Button, Icon, TextField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly nav = inject(NavController);
  protected readonly t = ca.login;

  protected readonly email = signal('');
  protected readonly password = signal('');

  protected readonly form = new FormState({
    email: { value: this.email, validate: () => validateEmail(this.email()) },
    password: { value: this.password, validate: () => validateLoginPassword(this.password()) },
  });
  protected readonly emailError = this.form.error('email');
  protected readonly passwordError = this.form.error('password');

  protected async submit(): Promise<void> {
    this.form.tried.set(true);
    this.form.formError.set(null);
    if (!this.form.valid() || this.form.sending()) return;

    this.form.sending.set(true);
    try {
      await this.auth.login(this.email().trim(), this.password());
      await this.nav.navigateRoot('/tabs/home');
    } catch (err) {
      const e = toApiError(err);
      this.form.serverErrors.set(e.fields);
      if (e.code !== 'VALIDATION_ERROR') this.form.formError.set(e.message);
    } finally {
      this.form.sending.set(false);
    }
  }
}
