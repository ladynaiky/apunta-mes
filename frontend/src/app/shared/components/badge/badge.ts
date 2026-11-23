import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Badge de pendientes en coral (#C4432B): aviso, no error.
 * Large (con número, 16 dp) o small (punto de 6 dp). El número se anuncia en
 * el nombre del control que lo lleva, así que el badge es decorativo.
 */
@Component({
  selector: 'ap-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ text() }}`,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      min-width: var(--size-badge-large);
      height: var(--size-badge-large);
      padding: 0 var(--space-50);
      border-radius: var(--shape-corner-full);
      background: var(--color-warning-badge);
      color: var(--color-on-warning-badge);
      font: 500 11px/16px var(--font-text);
      letter-spacing: 0.5px;
    }
    :host(.small) { min-width: var(--size-badge-small); width: var(--size-badge-small); height: var(--size-badge-small); padding: 0; }
  `,
  host: { 'aria-hidden': 'true', '[class.small]': 'count() === null' },
})
export class Badge {
  /** null = badge pequeño sin número. */
  readonly count = input<number | null>(null);
  protected readonly text = computed(() => {
    const n = this.count();
    return n === null ? '' : n > 99 ? '99+' : String(n);
  });
}
