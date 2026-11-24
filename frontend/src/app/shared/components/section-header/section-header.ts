import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';

/** Cabecera de sección («Tasques d’avui»): banda amarilla clara, esquina 12. */
@Component({
  selector: 'ap-section-header',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2 [id]="headingId()">
    @if (icon()) {
      <ap-icon [name]="icon()!" />
    }
    {{ title() }}
  </h2>`,
  styles: `
    h2 {
      display: flex;
      align-items: center;
      gap: var(--space-100);
      box-sizing: border-box;
      min-height: var(--size-touch-target);
      margin: 0;
      padding: 0 var(--space-150);
      border-radius: var(--shape-corner-medium);
      background: var(--color-section-header);
      color: var(--color-on-surface);
      font: 500 16px/24px var(--font-title);
      letter-spacing: 0.15px;
    }
  `,
})
export class SectionHeader {
  readonly title = input.required<string>();
  readonly headingId = input<string | null>(null);
  readonly icon = input<string | null>(null);
}
