import { Injectable, signal } from '@angular/core';
import type { Entry } from '../../../core/data/models';

/**
 * Abre la hoja de tarea desde cualquier pantalla. La hoja vive en la raíz de
 * la app para cubrir también la barra de navegación (bottom sheet modal MD3).
 */
@Injectable({ providedIn: 'root' })
export class TaskSheetService {
  readonly entry = signal<Entry | null>(null);
  readonly from = signal('home');

  open(entry: Entry, from: string): void {
    this.from.set(from);
    this.entry.set(entry);
  }

  close(): void {
    this.entry.set(null);
  }
}
