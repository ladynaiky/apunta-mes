import { ConfigService } from '@nestjs/config';
import type { Model } from 'mongoose';
import { AppConfigService } from '../config/app-config.service.js';
import type { Preferences } from '../preferences/preferences.schema.js';
import type { User } from '../users/user.schema.js';
import { DemoDailyResetService } from './demo-daily-reset.service.js';
import type { DemoSeedService } from './demo-seed.service.js';

const env = {
  DEMO_MODE: 'true',
  DEMO_TODAY: '2026-11-25',
  DEMO_USER_EMAIL: 'demo@apunta.cat',
  DEMO_USER_PASSWORD: 'contrasenya-demo',
};
const query = <T>(value: T) => ({
  lean: () => ({ exec: () => Promise.resolve(value) }),
});

function make(seededOn: string | null, userExists = true) {
  const reset = vi.fn().mockResolvedValue({});
  const users = {
    findOne: () => query(userExists ? { _id: 'u1' } : null),
  } as unknown as Model<User>;
  const prefs = {
    findOne: () => query(seededOn === undefined ? null : { demoSeededOn: seededOn }),
  } as unknown as Model<Preferences>;
  const service = new DemoDailyResetService(
    new AppConfigService(new ConfigService(env)),
    { reset } as unknown as DemoSeedService,
    users,
    prefs,
  );
  return { service, reset };
}

describe('DemoDailyResetService', () => {
  it('reinicia si los datos de demo son de otro día', async () => {
    const { service, reset } = make('2026-11-24');
    expect(await service.check()).toBe(true);
    expect(reset).toHaveBeenCalledWith('demo@apunta.cat', 'contrasenya-demo');
  });

  it('no reinicia si ya son de hoy', async () => {
    const { service, reset } = make('2026-11-25');
    expect(await service.check()).toBe(false);
    expect(reset).not.toHaveBeenCalled();
  });

  it('crea los datos si el usuario de demo no existe', async () => {
    const { service, reset } = make(null, false);
    expect(await service.check()).toBe(true);
    expect(reset).toHaveBeenCalled();
  });

  it('DEMO_DAILY_RESET=false lo apaga', () => {
    const config = new AppConfigService(
      new ConfigService({ ...env, DEMO_DAILY_RESET: 'false' }),
    );
    expect(config.demoDailyReset).toBe(false);
  });
});
