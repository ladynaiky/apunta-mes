import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Icono Material Symbols Rounded (Design System): contorno por defecto,
 * relleno (filled) solo para el estado activo. Siempre decorativo:
 * el nombre accesible lo pone el botón que lo contiene.
 */
@Component({
  selector: 'ap-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="material-symbols-rounded" aria-hidden="true" [style]="style()">{{ name() }}</span>`,
  styles: `
    :host { display: inline-flex; line-height: 1; }
    span { font-size: inherit; user-select: none; transition: font-variation-settings var(--motion-effects); }
  `,
  host: { '[style.font-size.px]': 'size()' },
})
export class Icon {
  readonly name = input.required<string>();
  readonly filled = input(false);
  readonly size = input(24);

  protected readonly style = computed(
    () => `font-variation-settings: 'FILL' ${this.filled() ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${this.size()};`,
  );
}
