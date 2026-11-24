import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { createTestApp, hasTestDb } from './test-app.js';

describe.skipIf(!hasTestDb)('System (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app?.close();
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
});
