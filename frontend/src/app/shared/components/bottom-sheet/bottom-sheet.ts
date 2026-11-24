import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';

/**
 * Bottom sheet modal (MD3) sobre <dialog> nativo: queda por encima de todo
 * (también de la barra de navegación), atrapa el foco y se cierra con Escape
 * o tocando el velo. En el ordenador se alinea con el marco de 412 × 892.
 */
@Component({
  selector: 'ap-bottom-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #dialog [attr.aria-labelledby]="headingId()" (cancel)="onCancel($event)" (click)="onBackdrop($event)">
      <div class="handle" aria-hidden="true"></div>
      <h2 [id]="headingId()">{{ headline() }}</h2>
      <ng-content />
    </dialog>
  `,
  styles: `
    dialog {
      box-sizing: border-box;
      width: 100%;
      max-width: var(--size-frame-width);
      max-height: 85vh;
      margin: auto auto 0;
      padding: var(--space-100) var(--space-300) calc(var(--space-300) + env(safe-area-inset-bottom));
      border: 0;
      border-radius: var(--shape-corner-extra-large) var(--shape-corner-extra-large) 0 0;
      background: var(--color-surface-container-low);
      color: var(--color-on-surface);
      box-shadow: var(--elevation-level1);
    }
    dialog[open] { animation: up var(--motion-spatial-default); }
    dialog::backdrop { background: rgb(0 0 0 / var(--opacity-scrim)); }
    @media (min-width: 600px) {
      /* Alineada con el borde inferior del marco del móvil. */
      dialog { margin-bottom: calc((100vh - min(var(--size-frame-height), 100vh)) / 2); }
    }
    .handle { width: 32px; height: 4px; margin: 0 auto var(--space-200); border-radius: var(--shape-corner-full); background: rgb(67 72 68 / var(--opacity-drag-handle)); }
    h2 { margin: 0 0 var(--space-200); font: 600 22px/28px var(--font-title); }
    @keyframes up { from { transform: translateY(100%); } }
    @media (prefers-reduced-motion: reduce) { dialog[open] { animation: none; } }
  `,
})
export class BottomSheet {
  readonly open = input(false);
  readonly headline = input.required<string>();
  readonly headingId = input('sheet-title');
  readonly closed = output<void>();

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

  protected onBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.closed.emit();
  }
}
