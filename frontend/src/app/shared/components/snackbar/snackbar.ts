import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SnackbarService } from './snackbar.service';

/** Snackbar MD3: una sola línea, acción opcional, encima de la navigation bar. */
@Component({
  selector: 'ap-snackbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="live" role="status" aria-live="polite">
      @if (snackbar.current(); as msg) {
        <div class="snack">
          <span class="text">{{ msg.text }}</span>
          @if (msg.actionLabel) {
            <button type="button" (click)="msg.action?.(); snackbar.dismiss()">{{ msg.actionLabel }}</button>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .live {
      position: absolute;
      left: var(--space-200);
      right: var(--space-200);
      bottom: calc(var(--size-navigation-bar) + var(--space-200) + env(safe-area-inset-bottom));
      z-index: 50;
      pointer-events: none;
    }
    .snack {
      display: flex;
      align-items: center;
      gap: var(--space-100);
      min-height: 48px;
      padding: 0 var(--space-100) 0 var(--space-200);
      border-radius: var(--shape-corner-extra-small);
      background: var(--color-inverse-surface);
      color: var(--color-inverse-on-surface);
      box-shadow: var(--elevation-level3);
      pointer-events: auto;
      animation: pop var(--motion-spatial-fast);
    }
    .text { flex: 1; font: 400 14px/20px var(--font-text); letter-spacing: 0.25px; }
    button {
      height: 40px;
      padding: 0 var(--space-150);
      border: 0;
      border-radius: var(--shape-corner-full);
      background: transparent;
      color: #c4e8cf;
      font: 500 14px/20px var(--font-text);
      cursor: pointer;
    }
    @keyframes pop { from { opacity: 0; transform: translateY(16px); } }
    @media (prefers-reduced-motion: reduce) { .snack { animation: none; } }
  `,
})
export class Snackbar {
  protected readonly snackbar = inject(SnackbarService);
}
