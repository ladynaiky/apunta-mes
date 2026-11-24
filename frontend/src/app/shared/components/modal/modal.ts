import { ChangeDetectionStrategy, Component, effect, ElementRef, input, output, viewChild } from '@angular/core';
import { ca } from '../../../i18n/ca';
import { IconButton } from '../icon-button/icon-button';

let nextId = 0;

/**
 * Modal centrado (iteración 1, decisión 8): caja sobre un velo oscuro semitransparente
 * que deja ver la pantalla anterior, con la X arriba a la derecha.
 * Sobre <dialog> nativo: foco atrapado, Escape y el velo cierran.
 *   <ap-modal [open]="…" headline="Editar assignatura" (closed)="…">…</ap-modal>
 */
@Component({
  selector: 'ap-modal',
  imports: [IconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #dialog [attr.aria-labelledby]="id" (cancel)="onCancel($event)" (click)="onBackdrop($event)">
      <header>
        <h2 [id]="id">{{ headline() }}</h2>
        <button apIconButton type="button" class="close" icon="close" [label]="closeLabel()" (click)="closed.emit()"></button>
      </header>
      <div class="body"><ng-content /></div>
    </dialog>
  `,
  styles: `
    dialog {
      box-sizing: border-box;
      width: min(360px, calc(100% - 32px));
      max-height: calc(100% - 48px);
      padding: var(--space-300);
      overflow: auto;
      border: 0;
      border-radius: var(--shape-corner-extra-large);
      background: var(--color-surface-container-low);
      color: var(--color-on-surface);
      box-shadow: var(--elevation-level3);
    }
    dialog[open] { animation: in var(--motion-spatial-default); }
    dialog::backdrop { background: rgb(0 0 0 / var(--opacity-scrim)); }
    header { display: flex; align-items: flex-start; gap: var(--space-100); margin: 0 0 var(--space-200); }
    h2 { flex: 1; margin: var(--space-50) 0 0; font: 600 24px/32px var(--font-title); }
    .close { margin: calc(-1 * var(--space-100)) calc(-1 * var(--space-150)) 0 0; }
    .body { display: flex; flex-direction: column; gap: var(--space-200); }
    @keyframes in { from { opacity: 0; transform: scale(0.9); } }
    @media (prefers-reduced-motion: reduce) { dialog[open] { animation: none; } }
  `,
})
export class Modal {
  readonly open = input(false);
  readonly headline = input.required<string>();
  readonly closeLabel = input<string>(ca.common.close);
  readonly closed = output<void>();

  protected readonly id = `ap-modal-${nextId++}`;
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
    this.closed.emit();
  }

  /** Clic en el velo (fuera de la caja) = cerrar. */
  protected onBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.closed.emit();
  }
}
