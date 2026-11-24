import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { createTestApp, hasTestDb } from './test-app.js';

type Subject = {
  id: string;
  name: string;
  colorToken: string;
  colorHex: string;
};

describe.skipIf(!hasTestDb)('Entries, subjects y mocks (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;
  let otherToken: string;
  let subjects: Record<string, Subject>;
  const ids: Record<string, string> = {};

  const http = () => request(app.getHttpServer());
  const auth = (t = token) => ({ Authorization: `Bearer ${t}` });

  async function register(email: string) {
    const res = await http()
      .post('/api/auth/register')
      .send({ name: 'Prova', role: 'student', email, password: 'contrasenya1' })
      .expect(201);
    return res.body.accessToken as string;
  }

  beforeAll(async () => {
    app = await createTestApp();
    token = await register('alumna@exemple.cat');
    otherToken = await register('altra@exemple.cat');
    const res = await http().get('/api/subjects').set(auth()).expect(200);
    subjects = Object.fromEntries(
      (res.body as Subject[]).map((s) => [s.name, s]),
    );
  });

  afterAll(async () => {
    await app?.close();
  });

  describe('Apuntar', () => {
    it('tasca', async () => {
      const res = await http()
        .post('/api/entries')
        .set(auth())
        .send({
          type: 'task',
          title: 'Exercicis, pàg. 12',
          date: '2026-11-04',
          subject: subjects.Mates.id,
          page: '12',
          activity: '3',
          reminder: { daysBefore: 1, time: '08:00' },
        })
        .expect(201);
      expect(res.body).toMatchObject({ page: '12', activity: '3' });
      expect(res.body).toMatchObject({
        type: 'task',
        title: 'Exercicis, pàg. 12',
        date: '2026-11-04',
        done: false,
        subject: { name: 'Mates', colorToken: 'blau', colorHex: '#1F4FB8' },
        reminder: { daysBefore: 1, time: '08:00' },
      });
      ids.task = res.body.id;
    });

    it('examen: sin title → «Examen de <assignatura>» y tipo Escrit por defecto', async () => {
      const res = await http()
        .post('/api/entries')
        .set(auth())
        .send({
          type: 'exam',
          date: '2026-11-13',
          subject: subjects.Mates.id,
          topic: 'Fraccions i decimals',
        })
        .expect(201);
      expect(res.body).toMatchObject({
        title: 'Examen de Mates',
        examType: 'written',
      });
      ids.exam = res.body.id;
    });

    it('excursió con «Què cal portar»', async () => {
      const res = await http()
        .post('/api/entries')
        .set(auth())
        .send({
          type: 'trip',
          title: 'Excursió de Socials',
          date: '2026-11-20',
          subject: subjects.Socials.id,
          place: 'Museu d’Història de Catalunya',
          departureTime: '09:00',
          returnTime: '17:00',
          whatToBring: [
            { name: 'Autorització signada' },
            { name: 'Dinar i aigua' },
          ],
        })
        .expect(201);
      expect(res.body.whatToBring).toEqual([
        { name: 'Autorització signada', done: false },
        { name: 'Dinar i aigua', done: false },
      ]);
      ids.trip = res.body.id;
    });

    it('aniversari: sin title → el nombre', async () => {
      const res = await http()
        .post('/api/entries')
        .set(auth())
        .send({
          type: 'birthday',
          date: '2025-11-24',
          personName: 'l’Anna',
          age: 11,
          relation: 'class',
        })
        .expect(201);
      expect(res.body).toMatchObject({ title: 'l’Anna', subject: null });
      ids.birthday = res.body.id;
    });

    it('400: campos obligatorios según el tipo', async () => {
      const task = await http()
        .post('/api/entries')
        .set(auth())
        .send({ type: 'task', date: '2026-11-31' })
        .expect(400);
      expect(task.body.errors).toEqual({
        title: 'title.required',
        date: 'date.invalid',
        subject: 'subject.required',
      });
      const birthday = await http()
        .post('/api/entries')
        .set(auth())
        .send({ type: 'birthday', date: '2026-11-24' })
        .expect(400);
      expect(birthday.body.errors).toEqual({
        personName: 'personName.required',
      });
    });

    it('los campos vacíos de otros tipos se ignoran (p. ej., «Desfer» reenvía todo)', async () => {
      const res = await http()
        .post('/api/entries')
        .set(auth())
        .send({
          type: 'task',
          title: 'Repetida',
          date: '2026-11-05',
          subject: subjects.Mates.id,
          personName: '',
          examType: null,
          relation: null,
          age: null,
          departureTime: '',
          whatToBring: [],
        })
        .expect(201);
      await http()
        .delete(`/api/entries/${res.body.id}`)
        .set(auth())
        .expect(204);
    });

    it('400: aviso con valores no permitidos (errores anidados)', async () => {
      const res = await http()
        .post('/api/entries')
        .set(auth())
        .send({
          type: 'task',
          title: 'X',
          date: '2026-11-05',
          subject: subjects.Mates.id,
          reminder: { daysBefore: 5, time: '25:00' },
        })
        .expect(400);
      expect(res.body.errors).toMatchObject({
        'reminder.daysBefore': 'reminder.daysBefore.invalid',
      });
    });

    it('400: no se puede usar la asignatura de otro usuario', async () => {
      const res = await http()
        .post('/api/entries')
        .set(auth(otherToken))
        .send({
          type: 'task',
          title: 'X',
          date: '2026-11-05',
          subject: subjects.Mates.id,
        })
        .expect(400);
      expect(res.body.errors).toEqual({ subject: 'subject.notFound' });
    });
  });

  describe('Lecturas', () => {
    it('today: lo del 4 de novembre', async () => {
      const res = await http()
        .get('/api/entries/today')
        .set(auth())
        .expect(200);
      expect(res.body.map((e: { id: string }) => e.id)).toEqual([ids.task]);
    });

    it('week: de dilluns 2 a diumenge 8 (no incluye el examen del 13)', async () => {
      const res = await http().get('/api/entries/week').set(auth()).expect(200);
      expect(res.body.map((e: { id: string }) => e.id)).toEqual([ids.task]);
    });

    it('day: el aniversario se repite y la edad se ajusta al año', async () => {
      const res = await http()
        .get('/api/entries/day/2026-11-24')
        .set(auth())
        .expect(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toMatchObject({
        id: ids.birthday,
        date: '2026-11-24',
        age: 12,
      });
    });

    it('calendar: un punto por cosa apuntada y día', async () => {
      const res = await http()
        .get('/api/calendar?month=2026-11')
        .set(auth())
        .expect(200);
      expect(res.body.map((d: { date: string }) => d.date)).toEqual([
        '2026-11-04',
        '2026-11-13',
        '2026-11-20',
        '2026-11-24',
      ]);
      expect(res.body[0]).toEqual({
        date: '2026-11-04',
        count: 1,
        dots: [
          {
            type: 'task',
            subjectName: 'Mates',
            colorToken: 'blau',
            colorHex: '#1F4FB8',
          },
        ],
      });
    });

    it('list: buscar por el nombre de la asignatura y filtrar por tipo', async () => {
      const byName = await http()
        .get('/api/entries?q=mates')
        .set(auth())
        .expect(200);
      expect(byName.body.map((e: { id: string }) => e.id).sort()).toEqual(
        [ids.task, ids.exam].sort(),
      );
      const exams = await http()
        .get('/api/entries?type=exam')
        .set(auth())
        .expect(200);
      expect(exams.body).toHaveLength(1);
    });

    it('reminders: la tarea de hoy con aviso «1 dia abans»', async () => {
      const res = await http().get('/api/reminders').set(auth()).expect(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toMatchObject({ id: ids.task, daysLeft: 0 });
    });

    it('cada usuario solo ve lo suyo', async () => {
      const list = await http()
        .get('/api/entries')
        .set(auth(otherToken))
        .expect(200);
      expect(list.body).toEqual([]);
      await http()
        .get(`/api/entries/${ids.task}`)
        .set(auth(otherToken))
        .expect(404);
      await http()
        .patch(`/api/entries/${ids.task}`)
        .set(auth(otherToken))
        .send({ title: 'X' })
        .expect(404);
      await http()
        .delete(`/api/entries/${ids.task}`)
        .set(auth(otherToken))
        .expect(404);
    });

    it('404 con un id mal formado', async () => {
      const res = await http()
        .get('/api/entries/no-es-un-id')
        .set(auth())
        .expect(404);
      expect(res.body.code).toBe('NOT_FOUND');
    });
  });

  describe('Editar, marcar y esborrar', () => {
    it('PATCH solo cambia lo que llega', async () => {
      const res = await http()
        .patch(`/api/entries/${ids.task}`)
        .set(auth())
        .send({ notes: 'Fer-ho a la biblioteca', priority: 'high' })
        .expect(200);
      expect(res.body).toMatchObject({
        title: 'Exercicis, pàg. 12',
        notes: 'Fer-ho a la biblioteca',
        priority: 'high',
        page: '12',
      });
    });

    it('PATCH no puede dejar una tarea sin título', async () => {
      const res = await http()
        .patch(`/api/entries/${ids.task}`)
        .set(auth())
        .send({ title: ' ' })
        .expect(400);
      expect(res.body.errors).toEqual({ title: 'title.required' });
    });

    it('done: marca, pasa al historial y desaparece de los avisos', async () => {
      const res = await http()
        .patch(`/api/entries/${ids.task}/done`)
        .set(auth())
        .send({ done: true })
        .expect(200);
      expect(res.body.done).toBe(true);
      expect(res.body.doneAt).toEqual(expect.any(String));

      const history = await http()
        .get('/api/entries/history')
        .set(auth())
        .expect(200);
      expect(history.body.map((e: { id: string }) => e.id)).toEqual([ids.task]);
      const reminders = await http()
        .get('/api/reminders')
        .set(auth())
        .expect(200);
      expect(reminders.body).toEqual([]);

      const undone = await http()
        .patch(`/api/entries/${ids.task}/done`)
        .set(auth())
        .send({ done: false })
        .expect(200);
      expect(undone.body).toMatchObject({ done: false, doneAt: null });
    });

    it('asignatura con cosas apuntadas: 409 SUBJECT_IN_USE', async () => {
      const res = await http()
        .delete(`/api/subjects/${subjects.Mates.id}`)
        .set(auth())
        .expect(409);
      expect(res.body.code).toBe('SUBJECT_IN_USE');
    });

    it('esborrar', async () => {
      await http()
        .delete(`/api/entries/${ids.birthday}`)
        .set(auth())
        .expect(204);
      await http().get(`/api/entries/${ids.birthday}`).set(auth()).expect(404);
    });
  });

  describe('Assignatures', () => {
    it('crear, nombre repetido (409) y borrar', async () => {
      const res = await http()
        .post('/api/subjects')
        .set(auth())
        .send({ name: 'Tecnologia', colorToken: 'turquesa' })
        .expect(201);
      expect(res.body).toMatchObject({
        name: 'Tecnologia',
        colorHex: '#00879A',
      });
      const dup = await http()
        .post('/api/subjects')
        .set(auth())
        .send({ name: 'Tecnologia', colorToken: 'blau' })
        .expect(409);
      expect(dup.body.code).toBe('SUBJECT_EXISTS');
      await http()
        .delete(`/api/subjects/${res.body.id}`)
        .set(auth())
        .expect(204);
    });
  });

  describe('Modo demo (X-Demo-State)', () => {
    it('empty → lista vacía', async () => {
      const res = await http()
        .get('/api/entries/today')
        .set(auth())
        .set('X-Demo-State', 'empty')
        .expect(200);
      expect(res.body).toEqual([]);
    });

    it('error → 503 DEMO_ERROR', async () => {
      const res = await http()
        .get('/api/calendar')
        .set(auth())
        .set('X-Demo-State', 'error')
        .expect(503);
      expect(res.body.code).toBe('DEMO_ERROR');
    });

    it('no afecta a las escrituras', async () => {
      await http()
        .post('/api/subjects')
        .set(auth())
        .set('X-Demo-State', 'error')
        .send({ name: 'Robòtica', colorToken: 'rosa' })
        .expect(201);
    });
  });

  describe('Simulados', () => {
    it('preferences: valores por defecto y guardar', async () => {
      const def = await http().get('/api/preferences').set(auth()).expect(200);
      expect(def.body).toEqual({
        groupBy: 'subjects',
        markWith: 'colors',
        visibleTags: ['todo', 'done', 'highPriority'],
      });
      const res = await http()
        .put('/api/preferences')
        .set(auth())
        .send({ groupBy: 'date' })
        .expect(200);
      expect(res.body.groupBy).toBe('date');
    });

    it('sync: guarda la hora', async () => {
      const before = await http().get('/api/sync').set(auth()).expect(200);
      expect(before.body.lastSyncAt).toBeNull();
      const res = await http().post('/api/sync').set(auth()).expect(200);
      expect(res.body.lastSyncAt).toEqual(expect.any(String));
    });

    it('contacts: crear, editar y borrar', async () => {
      const res = await http()
        .post('/api/contacts')
        .set(auth())
        .send({
          name: 'Jordi (pare)',
          emailOrPhone: 'jordi@exemple.cat',
          role: 'parent',
        })
        .expect(201);
      const upd = await http()
        .patch(`/api/contacts/${res.body.id}`)
        .set(auth())
        .send({ name: 'Jordi' })
        .expect(200);
      expect(upd.body).toMatchObject({ name: 'Jordi', role: 'parent' });
      const empty = await http()
        .post('/api/contacts')
        .set(auth())
        .send({ name: '' })
        .expect(400);
      expect(empty.body.errors).toEqual({ name: 'name.required' });
      await http()
        .delete(`/api/contacts/${res.body.id}`)
        .set(auth())
        .expect(204);
    });

    it('share-links: genera un enlace', async () => {
      const res = await http()
        .post('/api/share-links')
        .set(auth())
        .send({ scope: 'calendar' })
        .expect(201);
      expect(res.body.url).toMatch(/^https:\/\/apunta\.app\/c\/[a-z2-9]{8}$/);
    });

    it('ai: conversación fija con la sugerencia del examen del 13', async () => {
      const res = await http()
        .get('/api/ai/conversation')
        .set(auth())
        .expect(200);
      expect(res.body.messages.at(-1)).toMatchObject({ suggestion: true });
      expect(res.body.messages.at(-1).text).toContain('13 de novembre');
    });
  });
});
