import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { ca } from '../../../i18n/ca';
import { Button } from '../button/button';

/**
 * Diálogo básico MD3 sobre <dialog> nativo (foco atrapado, Escape cierra).
 * Acciones como botones de texto; la destructiva, en rojo de error.
 *   <ap-dialog [open]="…" headline="Vols tancar la sessió?" confirmLabel="Tancar la sessió" …>
 */
@Component({
  selector: 'ap-dialog',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #dialog [attr.aria-labelledby]="'dlg-title'" (cancel)="onCancel($event)" (click)="onBackdrop($event)">
      <h2 id="dlg-title">{{ headline() }}</h2>
      @if (text()) {
        <p>{{ text() }}</p>
      }
      <ng-content />
      <div class="actions">
        <button apButton type="button" variant="text" (click)="cancel.emit()">{{ cancelLabel() }}</button>
        <button apButton type="button" variant="text" [class.destructive]="destructive()" (click)="confirm.emit()">
          {{ confirmLabel() }}
        </button>
      </div>
    </dialog>
  `,
  styles: `
    dialog {
      box-sizing: border-box;
      width: min(312px, calc(100% - 48px));
      padding: var(--space-300);
      border: 0;
      border-radius: var(--shape-corner-extra-large);
      background: var(--color-surface-container-low);
      color: var(--color-on-surface);
      box-shadow: var(--elevation-level3);
    }
    dialog[open] { animation: in var(--motion-spatial-default); }
    dialog::backdrop { background: rgb(0 0 0 / var(--opacity-scrim)); }
    h2 { margin: 0 0 var(--space-200); font: 600 24px/32px var(--font-title); }
    p { margin: 0 0 var(--space-300); color: var(--color-on-surface-variant); font: 400 14px/20px var(--font-text); letter-spacing: 0.25px; }
    .actions { display: flex; justify-content: flex-end; gap: var(--space-100); }
    .destructive { color: var(--color-error); }
    @keyframes in { from { opacity: 0; transform: scale(0.9); } }
    @media (prefers-reduced-motion: reduce) { dialog[open] { animation: none; } }
  `,
})
export class Dialog {
  readonly open = input(false);
  readonly headline = input.required<string>();
  readonly text = input<string | null>(null);
  readonly confirmLabel = input.required<string>();
  readonly cancelLabel = input<string>(ca.common.cancel);
  readonly destructive = input(false);
  readonly confirm = output<void>();
  readonly cancel = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const el = this.dialog().nativeElement;
      if (this.open() && !el.open) el.showModal();
      if (!this.open() && el.open) el.close();
    });
  }

  protected onCancel(event: Event): void {
    event.preventDefault();
    this.cancel.emit();
  }

  /** Clic en el velo (fuera de la caja) = cancelar. */
  protected onBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.cancel.emit();
  }
}
