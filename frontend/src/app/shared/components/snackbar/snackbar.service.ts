import { Injectable, signal } from '@angular/core';

export interface SnackbarMessage {
  id: number;
  text: string;
  actionLabel?: string;
  action?: () => void;
}

/** Avisos breves («Tasca desada», «Tasca esborrada.» + «Desfer»). */
@Injectable({ providedIn: 'root' })
export class SnackbarService {
  readonly current = signal<SnackbarMessage | null>(null);
  private timer: ReturnType<typeof setTimeout> | undefined;
  private nextId = 0;

  show(text: string, options: { actionLabel?: string; action?: () => void; durationMs?: number } = {}): void {
    clearTimeout(this.timer);
    this.current.set({ id: this.nextId++, text, actionLabel: options.actionLabel, action: options.action });
    this.timer = setTimeout(() => this.dismiss(), options.durationMs ?? 4000);
  }

  dismiss(): void {
    clearTimeout(this.timer);
    this.current.set(null);
  }
}
