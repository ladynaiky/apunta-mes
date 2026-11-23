import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Icon } from '../icon/icon';

export interface SelectOption<T = string> {
  value: T;
  label: string;
}

let nextId = 0;

/**
 * Desplegable (text field outlined + menú MD3 Expressive): Rol, Assignatura…
 * Teclado: Enter/Espacio abre, flechas mueven, Enter elige, Escape cierra.
 */
@Component({
  selector: 'ap-select',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Select), multi: true }],
  templateUrl: './select.html',
  styleUrl: './select.scss',
  host: { '(document:click)': 'onDocumentClick($event)' },
})
export class Select<T = string> implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly placeholder = input('');
  readonly options = input<SelectOption<T>[]>([]);
  readonly error = input<string | null>(null);

  protected readonly id = `ap-select-${nextId++}`;
  protected readonly value = signal<T | null>(null);
  protected readonly open = signal(false);
  protected readonly activeIndex = signal(-1);
  protected readonly disabled = signal(false);
  protected readonly selected = computed(() => this.options().find((o) => o.value === this.value()) ?? null);

  private readonly host = inject(ElementRef<HTMLElement>);
  private onChange: (v: T | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: T | null): void {
    this.value.set(v);
  }
  registerOnChange(fn: (v: T | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.disabled.set(d);
  }

  protected toggle(): void {
    if (this.disabled()) return;
    if (this.open()) return this.close();
    this.open.set(true);
    this.activeIndex.set(Math.max(0, this.options().findIndex((o) => o.value === this.value())));
  }

  protected pick(option: SelectOption<T>): void {
    this.value.set(option.value);
    this.onChange(option.value);
    this.close();
  }

  protected onKeydown(event: KeyboardEvent): void {
    const n = this.options().length;
    if (event.key === 'Escape') return this.close();
    if (!this.open()) {
      if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
        this.toggle();
      }
      return;
    }
    if (event.key === 'ArrowDown') this.activeIndex.set((this.activeIndex() + 1) % n);
    else if (event.key === 'ArrowUp') this.activeIndex.set((this.activeIndex() - 1 + n) % n);
    else if (event.key === 'Enter' || event.key === ' ') {
      const o = this.options()[this.activeIndex()];
      if (o) this.pick(o);
    } else return;
    event.preventDefault();
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) this.close();
  }

  private close(): void {
    this.open.set(false);
    this.onTouched();
  }
}
