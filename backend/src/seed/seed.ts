/**
 * npm run seed → borra y vuelve a crear el usuario de demo (DEMO_USER_EMAIL,
 * DEMO_USER_PASSWORD del .env) con los datos de noviembre de 2026.
 * No toca ninguna otra cuenta.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';
import { AppConfigService } from '../config/app-config.service.js';
import { DemoSeedService } from './demo-seed.service.js';

const app = await NestFactory.createApplicationContext(AppModule, {
  logger: ['error', 'warn'],
});
try {
  const { demoUserEmail, demoUserPassword } = app.get(AppConfigService);
  if (!demoUserEmail || !demoUserPassword || demoUserPassword.length < 8) {
    throw new Error(
      'Cal DEMO_USER_EMAIL i DEMO_USER_PASSWORD (mínim 8 caràcters) al .env',
    );
  }
  const summary = await app
    .get(DemoSeedService)
    .reset(demoUserEmail, demoUserPassword);
  console.log('Dades de demo creades:');
  console.table(summary);
} finally {
  await app.close();
}
