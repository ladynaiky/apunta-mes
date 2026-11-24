import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ca } from '../../../i18n/ca';
import { shortDate } from '../../utils/dates-ca';
import { Button } from '../button/button';
import { Dialog } from '../dialog/dialog';
import { Icon } from '../icon/icon';
import { IconButton } from '../icon-button/icon-button';
import { MonthPicker } from '../month-picker/month-picker';

/**
 * Campo de fecha que abre «Tria el dia» (date picker modal).
 * Con `clearable`, permite volver a «Totes les dates».
 */
@Component({
  selector: 'ap-date-field',
  imports: [Button, Dialog, Icon, IconButton, MonthPicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap">
      <button
        type="button"
        class="field"
        [class.invalid]="error()"
        [attr.aria-label]="label() + ': ' + (text() ?? placeholder())"
        (click)="openPicker()"
      >
        <span class="float-label">{{ label() }}</span>
        <span [class.placeholder]="!text()">{{ text() ?? placeholder() }}</span>
        @if (!(clearable() && value())) {
          <ap-icon name="calendar_today" [size]="20" />
        }
      </button>
      @if (clearable() && value()) {
        <button apIconButton type="button" class="clear" icon="close" [label]="clearLabel" (click)="valueChange.emit(null)"></button>
      }
    </div>
    @if (error(); as msg) {
      <p class="error" role="alert"><ap-icon name="error" [size]="16" />{{ msg }}</p>
    }
    <ap-dialog
      [open]="open()"
      [headline]="t.pickDay"
      [confirmLabel]="t.confirmDay"
      [cancelLabel]="t.discard"
      (confirm)="confirm()"
      (cancel)="open.set(false)"
    >
      @if (clearable()) {
        <button apButton type="button" variant="text" class="all" (click)="clear()">{{ allLabel() }}</button>
      }
      <ap-month-picker [value]="pending()" [today]="today()" (valueChange)="pending.set($event)" />
    </ap-dialog>
  `,
  styles: `
    :host { display: block; min-width: 0; }
    .wrap { position: relative; }
    .field {
      position: relative;
      display: flex; align-items: center; justify-content: space-between;
      box-sizing: border-box; width: 100%; height: var(--size-text-field);
      padding: 0 var(--space-150) 0 15px;
      border: 1px solid var(--color-outline); border-radius: var(--shape-corner-extra-small);
      background: transparent; color: var(--color-on-surface);
      font: 400 16px/24px var(--font-text); text-align: left; cursor: pointer;
    }
    .field:hover { border-color: var(--color-on-surface); }
    .field.invalid { border: 2px solid var(--color-error); }
    .field ap-icon { color: var(--color-on-surface-variant); }
    .placeholder { color: var(--color-on-surface-variant); }
    .float-label {
      position: absolute; top: -9px; left: 12px; padding: 0 4px;
      background: var(--label-bg, var(--color-surface)); color: var(--color-on-surface-variant);
      font: 400 12px/16px var(--font-text);
    }
    .clear { position: absolute; top: 4px; right: 0; }
    .error { display: flex; gap: var(--space-50); margin: var(--space-50) 0 0; padding: 0 var(--space-150); color: var(--color-error); font: 400 12px/16px var(--font-text); }
    .all { margin: 0 0 var(--space-100) calc(-1 * var(--space-150)); }
  `,
})
export class DateField {
  readonly value = input<string | null>(null);
  readonly today = input<string | null>(null);
  readonly label = input.required<string>();
  readonly placeholder = input('');
  readonly error = input<string | null>(null);
  readonly clearable = input(false);
  readonly allLabel = input(ca.search.allDates);
  readonly valueChange = output<string | null>();

  protected readonly t = ca.newEntry;
  protected readonly clearLabel = ca.search.clearDate;
  protected readonly open = signal(false);
  protected readonly pending = signal<string | null>(null);
  protected readonly text = computed(() => (this.value() ? shortDate(this.value()!) : null));

  protected openPicker(): void {
    this.pending.set(this.value() ?? this.today());
    this.open.set(true);
  }

  protected confirm(): void {
    this.valueChange.emit(this.pending());
    this.open.set(false);
  }

  protected clear(): void {
    this.valueChange.emit(null);
    this.open.set(false);
  }
}
