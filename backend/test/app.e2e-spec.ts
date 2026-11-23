import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { setupApp } from './../src/setup-app.js';

describe('System (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    process.env.DEMO_TODAY = '2026-11-04';
    process.env.DEMO_MODE = 'true';
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
      .expect({ status: 'ok' });
  });

  it('GET /api/config devuelve la fecha de la demo', () => {
    return request(app.getHttpServer())
      .get('/api/config')
      .expect(200)
      .expect({
        today: '2026-11-04',
        timeZone: 'Europe/Madrid',
        demoMode: true,
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
