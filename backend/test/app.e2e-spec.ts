import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';

/**
 * Los tests e2e necesitan una base de datos de pruebas (nunca la de demo).
 * Se ejecutan solo si existe TEST_MONGODB_URI; si no, se saltan.
 */
const testUri = process.env.TEST_MONGODB_URI;

describe.skipIf(!testUri)('System (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    process.env.MONGODB_URI = testUri;
    process.env.DEMO_TODAY = '2026-11-04';
    process.env.DEMO_MODE = 'true';
    // Import dinámico: la validación del .env se ejecuta al cargar el módulo.
    const { AppModule } = await import('./../src/app.module.js');
    const { setupApp } = await import('./../src/setup-app.js');
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();
  });

  it('GET /api/health', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect({ status: 'ok', database: 'up' });
  });

  it('GET /api/config devuelve la fecha de la demo', () => {
    return request(app.getHttpServer()).get('/api/config').expect(200).expect({
      today: '2026-11-04',
      timeZone: 'Europe/Madrid',
      demoMode: true,
    });
  });

  afterAll(async () => {
    await app?.close();
  });
});
