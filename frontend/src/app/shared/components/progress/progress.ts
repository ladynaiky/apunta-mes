import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';

/**
 * Barra fina de progreso bajo la cabecera. Solo aparece si la carga tarda
 * más de 300 ms (así no parpadea en las cargas rápidas).
 */
@Component({
  selector: 'ap-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="track" role="progressbar" aria-label="Carregant"><div class="bar"></div></div>
    }
  `,
  styles: `
    :host { display: block; height: 4px; }
    .track { position: relative; height: 4px; overflow: hidden; background: var(--color-secondary-container); }
    .bar {
      position: absolute; top: 0; bottom: 0; width: 40%;
      border-radius: var(--shape-corner-full);
      background: var(--color-primary);
      animation: slide 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    @keyframes slide { from { left: -40%; } to { left: 100%; } }
    @media (prefers-reduced-motion: reduce) { .bar { animation-duration: 3s; } }
  `,
})
export class Progress {
  readonly active = input(false);
  protected readonly visible = signal(false);

  constructor() {
    effect((onCleanup) => {
      if (!this.active()) {
        this.visible.set(false);
        return;
      }
      const timer = setTimeout(() => this.visible.set(true), 300);
      onCleanup(() => clearTimeout(timer));
    });
  }
}
