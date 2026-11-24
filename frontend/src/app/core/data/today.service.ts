import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';

/**
 * La fecha «de hoy» de la app. Sale siempre de GET /api/config (DEMO_TODAY
 * en la demo), nunca de new Date(), para que coincida con el diseño.
 */
@Injectable({ providedIn: 'root' })
export class TodayService {
  private readonly api = inject(ApiService);
  private readonly _today = signal<string | null>(null);
  readonly today = this._today.asReadonly();
  /** El backend tiene DEMO_MODE=true (se puede forzar «buit» y «error»). */
  readonly demoMode = signal(false);

  async load(): Promise<string> {
    const cached = this._today();
    if (cached) return cached;
    try {
      const { today, demoMode } = await this.api.config();
      this._today.set(today);
      this.demoMode.set(demoMode);
      return today;
    } catch {
      // Sin conexión: fecha real del dispositivo (hora de Madrid).
      const local = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date());
      return local;
    }
  }
}
