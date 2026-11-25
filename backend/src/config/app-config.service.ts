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

  get jwtSecret(): string {
    return this.config.getOrThrow<string>('JWT_SECRET');
  }

  /** Duración del token: número + unidad (s, m, h, d). Por defecto, 7 días. */
  get jwtExpiresIn(): `${number}${'s' | 'm' | 'h' | 'd'}` {
    return (this.config.get<string>('JWT_EXPIRES_IN') ||
      '7d') as `${number}${'s' | 'm' | 'h' | 'd'}`;
  }

  get demoUserEmail(): string {
    return this.config.get<string>('DEMO_USER_EMAIL') ?? '';
  }

  get demoUserPassword(): string {
    return this.config.get<string>('DEMO_USER_PASSWORD') ?? '';
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

  /** En modo demo, los datos del usuario de demo se reinician cada día (DEMO_DAILY_RESET=false lo apaga). */
  get demoDailyReset(): boolean {
    return this.demoMode && this.config.get<string>('DEMO_DAILY_RESET') !== 'false';
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
