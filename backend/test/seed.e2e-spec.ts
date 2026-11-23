import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { DemoSeedService } from '../src/seed/demo-seed.service.js';
import { createTestApp, hasTestDb } from './test-app.js';

const DEMO = { email: 'demo@apunta.cat', password: 'contrasenya-demo' };

describe.skipIf(!hasTestDb)('Datos de demo (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;
  const http = () => request(app.getHttpServer());
  const auth = (t = token) => ({ Authorization: `Bearer ${t}` });
  const titles = (
    body: { subject: { name: string } | null; title: string }[],
  ) => body.map((e) => (e.subject ? `${e.subject.name}: ${e.title}` : e.title));

  beforeAll(async () => {
    process.env.DEMO_USER_EMAIL = DEMO.email;
    process.env.DEMO_USER_PASSWORD = DEMO.password;
    app = await createTestApp();
    const summary = await app
      .get(DemoSeedService)
      .reset(DEMO.email, DEMO.password);
    expect(summary).toMatchObject({
      subjects: 7,
      entries: 11,
      history: 14,
      contacts: 5,
    });
    const res = await http().post('/api/auth/login').send(DEMO).expect(200);
    token = res.body.accessToken;
  });

  afterAll(async () => {
    await app?.close();
  });

  it('Inici: las 3 tareas del dimecres 4, en el orden del diseño', async () => {
    const res = await http().get('/api/entries/today').set(auth()).expect(200);
    expect(titles(res.body)).toEqual([
      'Mates: Exercicis, pàg. 12',
      'Català: Llegir el capítol 3',
      'Música: Practicar la cançó',
    ]);
  });

  it('Calendari: puntos en los días del diseño', async () => {
    const res = await http()
      .get('/api/calendar?month=2026-11')
      .set(auth())
      .expect(200);
    const days = Object.fromEntries(
      res.body.map((d: { date: string; count: number }) => [
        d.date.slice(8),
        d.count,
      ]),
    );
    expect(days).toMatchObject({
      '04': 3,
      '06': 1,
      '13': 1,
      '17': 1,
      '20': 1,
      '24': 1,
    });
  });

  it('Tasques del dia 13: examen de Mates', async () => {
    const res = await http()
      .get('/api/entries/day/2026-11-13')
      .set(auth())
      .expect(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({
      type: 'exam',
      title: 'Examen de Mates',
      topic: 'Fraccions i decimals',
    });
  });

  it('Avís de pendents: las 3 tareas de hoy', async () => {
    const res = await http().get('/api/reminders').set(auth()).expect(200);
    expect(res.body).toHaveLength(3);
  });

  it('Historial: 14 tareas hechas, de noviembre hacia atrás', async () => {
    const res = await http()
      .get('/api/entries/history')
      .set(auth())
      .expect(200);
    expect(res.body).toHaveLength(14);
    expect(res.body[res.body.length - 1].title).toBe('Acabar la làmina');
    const oct = await http()
      .get('/api/entries/history?year=2026&month=10')
      .set(auth())
      .expect(200);
    expect(oct.body).toHaveLength(4);
  });

  it('contactos, personalización y sincronización', async () => {
    const contacts = await http().get('/api/contacts').set(auth()).expect(200);
    expect(contacts.body.map((c: { name: string }) => c.name)[0]).toBe(
      'Jordi (pare)',
    );
    const sync = await http().get('/api/sync').set(auth()).expect(200);
    expect(sync.body.lastSyncAt).toBe('2026-11-04T07:15:00.000Z');
  });

  it('POST /api/demo/reset deshace los cambios y el token sigue sirviendo', async () => {
    const [first] = (await http().get('/api/entries/today').set(auth())).body;
    await http().delete(`/api/entries/${first.id}`).set(auth()).expect(204);
    expect(
      (await http().get('/api/entries/today').set(auth())).body,
    ).toHaveLength(2);

    await http().post('/api/demo/reset').set(auth()).expect(200);
    expect(
      (await http().get('/api/entries/today').set(auth())).body,
    ).toHaveLength(3);
  });

  it('POST /api/demo/reset: 403 DEMO_ONLY para otros usuarios (sin tocar sus datos)', async () => {
    const other = await http()
      .post('/api/auth/register')
      .send({
        name: 'Altra',
        role: 'student',
        email: 'altra@exemple.cat',
        password: 'contrasenya1',
      })
      .expect(201);
    const res = await http()
      .post('/api/demo/reset')
      .set(auth(other.body.accessToken))
      .expect(403);
    expect(res.body.code).toBe('DEMO_ONLY');
    const subjects = await http()
      .get('/api/subjects')
      .set(auth(other.body.accessToken))
      .expect(200);
    expect(subjects.body).toHaveLength(7);
  });
});
