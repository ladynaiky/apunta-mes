import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const TIME_ZONE = 'Europe/Madrid';

/** Acceso tipado a la configuración de la app. */
@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get port(): number {
    return Number(this.config.get('PORT') ?? 3000);
  }

  get mongoUri(): string {
    return this.config.getOrThrow<string>('MONGODB_URI');
  }

  get corsOrigins(): string[] {
    const raw = this.config.get<string>('CORS_ORIGINS') ?? '';
    return raw
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);
  }

  get demoMode(): boolean {
    return this.config.get<string>('DEMO_MODE') === 'true';
  }

  /**
   * Fecha «de hoy» en formato AAAA-MM-DD (hora de Madrid).
   * Si DEMO_TODAY tiene valor, se usa esa fecha; si está vacía, la real.
   */
  get today(): string {
    const demoToday = this.config.get<string>('DEMO_TODAY');
    if (demoToday) return demoToday;
    return new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(
      new Date(),
    );
  }

  get timeZone(): string {
    return TIME_ZONE;
  }
}
