import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import type { Connection } from 'mongoose';
import type { App } from 'supertest/types.js';

export const hasTestDb = Boolean(process.env.TEST_MONGODB_URI);

/** Crea la app como en producción y vacía la base de datos de pruebas. */
export async function createTestApp(): Promise<INestApplication<App>> {
  // Import dinámico: la validación del .env se ejecuta al cargar el módulo.
  const { AppModule } = await import('../src/app.module.js');
  const { setupApp } = await import('../src/setup-app.js');
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleRef.createNestApplication<INestApplication<App>>();
  setupApp(app);
  await app.init();

  const connection = app.get<Connection>(getConnectionToken());
  // Vaciar cada colección (el usuario de Atlas no tiene permiso para dropDatabase).
  for (const collection of Object.values(connection.collections)) {
    await collection.deleteMany({});
  }
  await connection.syncIndexes();
  return app;
}
