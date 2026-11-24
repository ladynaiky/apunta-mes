import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, NavController } from '@ionic/angular';
import { toApiError } from '../../../core/api/api-error';
import type { UserRole } from '../../../core/auth/auth.models';
import { AuthService } from '../../../core/auth/auth.service';
import {
  validateEmail,
  validateName,
  validateNewPassword,
  validateRepeatPassword,
  validateRole,
} from '../../../core/validation/validators';
import { ca } from '../../../i18n/ca';
import { Button } from '../../../shared/components/button/button';
import { Icon } from '../../../shared/components/icon/icon';
import { Select, type SelectOption } from '../../../shared/components/select/select';
import { TextField } from '../../../shared/components/text-field/text-field';
import { TopBar } from '../../../shared/components/top-bar/top-bar';
import { FormState } from '../form-state';

/** Registre: crea la cuenta y lleva a «Compte creat» con la sesión ya abierta. */
@Component({
  selector: 'ap-register-page',
  imports: [FormsModule, IonContent, Button, Icon, Select, TextField, TopBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  private readonly auth = inject(AuthService);
  private readonly nav = inject(NavController);
  protected readonly t = ca.register;

  protected readonly roles: SelectOption<UserRole>[] = [
    { value: 'student', label: ca.register.roles.student },
    { value: 'parent', label: ca.register.roles.parent },
    { value: 'teacher', label: ca.register.roles.teacher },
  ];

  protected readonly name = signal('');
  protected readonly role = signal<UserRole | null>(null);
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly password2 = signal('');

  protected readonly form = new FormState({
    name: { value: this.name, validate: () => validateName(this.name()) },
    role: { value: this.role, validate: () => validateRole(this.role()) },
    email: { value: this.email, validate: () => validateEmail(this.email()) },
    password: { value: this.password, validate: () => validateNewPassword(this.password()) },
    password2: {
      value: this.password2,
      validate: () => validateRepeatPassword(this.password2(), this.password()),
    },
  });
  protected readonly nameError = this.form.error('name');
  protected readonly roleError = this.form.error('role');
  protected readonly emailError = this.form.error('email');
  protected readonly passwordError = this.form.error('password');
  protected readonly password2Error = this.form.error('password2');
  /** «✓ Les contrasenyes coincideixen.» */
  protected readonly passwordsMatch = computed(
    () => !!this.password2() && this.password2() === this.password() && !this.passwordError(),
  );

  protected back(): void {
    void this.nav.navigateBack('/login');
  }

  protected async submit(): Promise<void> {
    this.form.tried.set(true);
    this.form.formError.set(null);
    if (!this.form.valid() || this.form.sending()) return;

    this.form.sending.set(true);
    try {
      await this.auth.register({
        name: this.name().trim(),
        role: this.role()!,
        email: this.email().trim(),
        password: this.password(),
      });
      await this.nav.navigateRoot('/register/done');
    } catch (err) {
      const e = toApiError(err);
      if (e.code === 'EMAIL_TAKEN') this.form.serverErrors.set({ email: e.message });
      else if (e.code === 'VALIDATION_ERROR') this.form.serverErrors.set(e.fields);
      else this.form.formError.set(e.message);
    } finally {
      this.form.sending.set(false);
    }
  }
}
