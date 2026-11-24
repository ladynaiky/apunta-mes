import { ChangeDetectionStrategy, Component, ElementRef, computed, input, output, viewChildren } from '@angular/core';
import { Icon } from '../icon/icon';

export interface TabOption {
  value: string;
  label: string;
  /** Material Symbol encima del texto (pestañas de 64 dp). */
  icon?: string;
}

/**
 * Primary tabs MD3 (solo texto, 48 dp, indicador de 3 dp en primary).
 * Teclado: flechas izquierda/derecha cambian de pestaña.
 */
@Component({
  selector: 'ap-tabs',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tabs" role="tablist" [class.with-icons]="withIcons()" [attr.aria-label]="label()">
      @for (tab of tabs(); track tab.value; let i = $index) {
        <button
          #tabButton
          type="button"
          role="tab"
          [id]="idPrefix() + '-tab-' + tab.value"
          [attr.aria-selected]="tab.value === value()"
          [attr.aria-controls]="idPrefix() + '-panel'"
          [tabindex]="tab.value === value() ? 0 : -1"
          [class.active]="tab.value === value()"
          (click)="valueChange.emit(tab.value)"
          (keydown)="onKey($event, i)"
        >
          <span class="content">
            @if (tab.icon) {
              <ap-icon [name]="tab.icon" [filled]="tab.value === value()" />
            }
            <span>{{ tab.label }}</span>
          </span>
        </button>
      }
    </div>
  `,
  styles: `
    .tabs { display: flex; border-bottom: 1px solid var(--color-outline-variant); }
    button {
      position: relative;
      flex: 1;
      height: var(--size-tab);
      padding: 0 var(--space-100);
      border: 0;
      background: transparent;
      color: var(--color-on-surface-variant);
      font: 600 14px/20px var(--font-title);
      letter-spacing: 0.1px;
      cursor: pointer;
    }
    button::after { content: ''; position: absolute; inset: 0; background: var(--color-on-surface); opacity: 0; transition: opacity var(--motion-effects); }
    button:hover::after { opacity: var(--opacity-state-hover); }
    button.active { color: var(--color-primary); }
    button.active .content::after {
      content: '';
      position: absolute;
      left: 0; right: 0; bottom: -14px;
      height: var(--size-tab-indicator, 3px);
      border-radius: 3px 3px 0 0;
      background: var(--color-primary);
    }
    .content { position: relative; display: inline-flex; flex-direction: column; align-items: center; gap: 2px; }
    /* Con icono: 64 dp (MD3) y el indicador debajo del texto. */
    .with-icons button { height: 64px; padding: 0 var(--space-50); }
    .with-icons button.active .content::after { bottom: -9px; }
  `,
})
export class Tabs {
  readonly tabs = input.required<TabOption[]>();
  readonly value = input.required<string>();
  readonly label = input.required<string>();
  readonly idPrefix = input('tabs');
  protected readonly withIcons = computed(() => this.tabs().some((t) => !!t.icon));
  readonly valueChange = output<string>();

  private readonly buttons = viewChildren<ElementRef<HTMLButtonElement>>('tabButton');

  protected onKey(event: KeyboardEvent, index: number): void {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    const tabs = this.tabs();
    const next = (index + delta + tabs.length) % tabs.length;
    this.valueChange.emit(tabs[next].value);
    this.buttons()[next]?.nativeElement.focus();
    event.preventDefault();
  }
}
