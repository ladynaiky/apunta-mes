import { ChangeDetectionStrategy, Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ca } from '../../../i18n/ca';
import { IconButton } from '../icon-button/icon-button';

let nextId = 0;

/**
 * Campo de texto outlined MD3 (56 dp) con la etiqueta sobre el borde,
 * texto de ayuda, error (icono y texto, nunca solo color) y, en las
 * contraseñas, el botón «Mostrar / Amagar la contrasenya».
 */
@Component({
  selector: 'ap-text-field',
  imports: [IconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextField), multi: true }],
  templateUrl: './text-field.html',
  styleUrl: './text-field.scss',
})
export class TextField implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly type = input<'text' | 'email' | 'password' | 'search'>('text');
  readonly placeholder = input('');
  readonly helper = input<string | null>(null);
  /** Mensaje de error ya traducido; si hay, el campo se marca en rojo. */
  readonly error = input<string | null>(null);
  readonly autocomplete = input<string | null>(null);
  /** Mensaje de éxito bajo el campo («✓ Les contrasenyes coincideixen.»). */
  readonly success = input<string | null>(null);

  protected readonly id = `ap-field-${nextId++}`;
  protected readonly value = signal('');
  protected readonly disabled = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly t = ca.field;

  protected readonly inputType = computed(() =>
    this.type() === 'password' && this.showPassword() ? 'text' : this.type(),
  );
  protected readonly describedBy = computed(() =>
    this.error() || this.helper() || this.success() ? `${this.id}-support` : null,
  );

  private onChange: (v: string) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(v: string | null): void {
    this.value.set(v ?? '');
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.disabled.set(d);
  }

  protected onInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.value.set(v);
    this.onChange(v);
  }
}
