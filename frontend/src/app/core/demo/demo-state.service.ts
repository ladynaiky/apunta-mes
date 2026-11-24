import { Injectable, signal } from '@angular/core';

export type DemoState = 'normal' | 'empty' | 'error';

const KEY = 'apunta.demoState';
const isState = (v: unknown): v is DemoState => v === 'normal' || v === 'empty' || v === 'error';

/**
 * Modo demo: fuerza los estados «buit» y «error» de las pantallas para
 * enseñarlos. Se elige en El meu espai o con `?demo=empty|error|normal` en la
 * URL, y dura mientras la pestaña está abierta (sessionStorage).
 * Solo afecta a las lecturas: marcar, crear o borrar funciona igual.
 */
@Injectable({ providedIn: 'root' })
export class DemoStateService {
  readonly state = signal<DemoState>(this.initial());

  set(state: DemoState): void {
    this.state.set(state);
    try {
      sessionStorage.setItem(KEY, state);
    } catch {
      /* sin almacenamiento: solo para esta sesión */
    }
  }

  private initial(): DemoState {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('demo');
      if (isState(fromUrl)) {
        sessionStorage.setItem(KEY, fromUrl);
        return fromUrl;
      }
      const saved = sessionStorage.getItem(KEY);
      return isState(saved) ? saved : 'normal';
    } catch {
      return 'normal';
    }
  }
}
