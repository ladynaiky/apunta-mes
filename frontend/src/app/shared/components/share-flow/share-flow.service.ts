import { Injectable, signal } from '@angular/core';
import type { Entry } from '../../../core/data/models';

/** Pasos del modal de crear y compartir (iteración 1, #15 y #17). */
export type ShareStep = 'created' | 'share' | 'link' | 'copied';

/**
 * Controla el modal centrado de «Tasca creada → Compartir → Enllaç generat → Enllaç copiat».
 * Vive en la raíz de la app (como la hoja de la tarea): se ve encima de cualquier pantalla.
 */
@Injectable({ providedIn: 'root' })
export class ShareFlowService {
  readonly step = signal<ShareStep | null>(null);
  readonly entry = signal<Entry | null>(null);
  readonly url = signal('');

  /** Después de apuntar algo: «Tasca creada» y «Vols compartir?». */
  created(entry: Entry): void {
    this.entry.set(entry);
    this.step.set('created');
  }

  /** Directamente al formulario de Compartir (hoja de la tarea, El meu espai, Compartir tasques). */
  share(): void {
    this.step.set('share');
  }

  linkReady(url: string): void {
    this.url.set(url);
    this.step.set('link');
  }

  copied(): void {
    this.step.set('copied');
  }

  close(): void {
    this.step.set(null);
    this.entry.set(null);
    this.url.set('');
  }
}
