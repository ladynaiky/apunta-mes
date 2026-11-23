import { ConfigService } from '@nestjs/config';
import { AppConfigService } from './app-config.service.js';

const make = (env: Record<string, string>) =>
  new AppConfigService(new ConfigService(env));

describe('AppConfigService', () => {
  it('usa DEMO_TODAY si tiene valor', () => {
    expect(make({ DEMO_TODAY: '2026-11-04' }).today).toBe('2026-11-04');
  });

  it('usa la fecha real si DEMO_TODAY está vacía', () => {
    expect(make({ DEMO_TODAY: '' }).today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('separa los orígenes de CORS', () => {
    expect(make({ CORS_ORIGINS: 'http://a, http://b' }).corsOrigins).toEqual([
      'http://a',
      'http://b',
    ]);
  });

  it('DEMO_MODE solo es true con "true"', () => {
    expect(make({ DEMO_MODE: 'true' }).demoMode).toBe(true);
    expect(make({ DEMO_MODE: 'false' }).demoMode).toBe(false);
  });
});
