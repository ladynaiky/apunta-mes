import { ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Connection } from 'mongoose';
import { AppConfigService } from '../config/app-config.service.js';
import { SystemController } from './system.controller.js';

const make = (readyState: number) =>
  new SystemController(
    new AppConfigService(
      new ConfigService({ DEMO_TODAY: '2026-11-04', DEMO_MODE: 'true' }),
    ),
    { readyState } as unknown as Connection,
  );

describe('SystemController', () => {
  it('health: ok si la base de datos está conectada', () => {
    expect(make(1).health()).toEqual({ status: 'ok', database: 'up' });
  });

  it('health: 503 si la base de datos no responde', () => {
    expect(() => make(0).health()).toThrow(ServiceUnavailableException);
  });

  it('config: devuelve la fecha de la demo', () => {
    expect(make(1).config()).toEqual({
      today: '2026-11-04',
      timeZone: 'Europe/Madrid',
      demoMode: true,
    });
  });
});
