import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { createTestApp, hasTestDb } from './test-app.js';

const laia = {
  name: '  Laia ',
  role: 'student',
  email: 'Laia@Exemple.CAT',
  password: 'contrasenya1',
};

describe.skipIf(!hasTestDb)('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app?.close();
  });

  const http = () => request(app.getHttpServer());

  describe('POST /api/auth/register', () => {
    it('crea la cuenta, normaliza los datos y devuelve un token', async () => {
      const res = await http()
        .post('/api/auth/register')
        .send(laia)
        .expect(201);
      expect(res.body.accessToken).toEqual(expect.any(String));
      expect(res.body.user).toMatchObject({
        name: 'Laia',
        email: 'laia@exemple.cat',
        role: 'student',
      });
      expect(res.body.user).not.toHaveProperty('passwordHash');
      token = res.body.accessToken;
    });

    it('crea las 7 asignaturas con sus colores', async () => {
      const conn = app.get<Connection>(getConnectionToken());
      const subjects = await conn.collection('subjects').find().toArray();
      expect(subjects.map((s) => s.name)).toEqual([
        'Castellà',
        'Català',
        'Anglès',
        'Socials',
        'Plàstica',
        'Música',
        'Mates',
      ]);
      expect(subjects.find((s) => s.name === 'Mates')).toMatchObject({
        colorToken: 'blau',
        colorHex: '#1F4FB8',
      });
    });

    it('guarda la contraseña con hash de bcrypt', async () => {
      const conn = app.get<Connection>(getConnectionToken());
      const user = await conn
        .collection('users')
        .findOne({ email: 'laia@exemple.cat' });
      expect(user?.passwordHash).toMatch(/^\$2[aby]\$10\$/);
      expect(user?.passwordHash).not.toContain('contrasenya1');
    });

    it('409 EMAIL_TAKEN si el correo ya existe (sin distinguir mayúsculas)', async () => {
      const res = await http()
        .post('/api/auth/register')
        .send({ ...laia, email: 'LAIA@exemple.cat' })
        .expect(409);
      expect(res.body.code).toBe('EMAIL_TAKEN');
    });

    it('400 con un código por campo', async () => {
      const res = await http()
        .post('/api/auth/register')
        .send({
          name: ' ',
          role: 'admin',
          email: 'no-es-un-correu',
          password: '1234567',
        })
        .expect(400);
      expect(res.body).toEqual({
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        errors: {
          name: 'name.required',
          role: 'role.required',
          email: 'email.invalid',
          password: 'password.minLength',
        },
      });
    });

    it('400 si llegan campos que no existen', async () => {
      const res = await http()
        .post('/api/auth/register')
        .send({ ...laia, email: 'otra@exemple.cat', isAdmin: true })
        .expect(400);
      expect(res.body.code).toBe('VALIDATION_ERROR');
      expect(res.body.errors).toHaveProperty('isAdmin');
    });
  });

  describe('POST /api/auth/forgot-password (simulado)', () => {
    it('202 igual exista o no la cuenta', async () => {
      const known = await request(app.getHttpServer())
        .post('/api/auth/forgot-password')
        .send({ email: laia.email })
        .expect(202);
      const unknown = await request(app.getHttpServer())
        .post('/api/auth/forgot-password')
        .send({ email: 'ningu@exemple.cat' })
        .expect(202);
      expect(known.body).toEqual(unknown.body);
    });

    it('400 con un correo vacío o mal escrito', async () => {
      const empty = await request(app.getHttpServer())
        .post('/api/auth/forgot-password')
        .send({ email: '' })
        .expect(400);
      expect(empty.body.errors).toEqual({ email: 'email.required' });
      const bad = await request(app.getHttpServer())
        .post('/api/auth/forgot-password')
        .send({ email: 'no-es-un-correu' })
        .expect(400);
      expect(bad.body.errors).toEqual({ email: 'email.invalid' });
    });
  });

  describe('POST /api/auth/login', () => {
    it('inicia sesión con correo y contraseña', async () => {
      const res = await http()
        .post('/api/auth/login')
        .send({ email: ' laia@exemple.cat ', password: 'contrasenya1' })
        .expect(200);
      expect(res.body.accessToken).toEqual(expect.any(String));
      expect(res.body.user.email).toBe('laia@exemple.cat');
    });

    it('401 INVALID_CREDENTIALS con la contraseña incorrecta', async () => {
      const res = await http()
        .post('/api/auth/login')
        .send({ email: 'laia@exemple.cat', password: 'incorrecta' })
        .expect(401);
      expect(res.body.code).toBe('INVALID_CREDENTIALS');
    });

    it('401 INVALID_CREDENTIALS si el correo no existe (mismo mensaje)', async () => {
      const res = await http()
        .post('/api/auth/login')
        .send({ email: 'ningu@exemple.cat', password: 'contrasenya1' })
        .expect(401);
      expect(res.body.code).toBe('INVALID_CREDENTIALS');
    });

    it('400 si faltan los campos', async () => {
      const res = await http().post('/api/auth/login').send({}).expect(400);
      expect(res.body.errors).toEqual({
        email: 'email.required',
        password: 'password.required',
      });
    });
  });

  describe('GET /api/auth/me (ruta protegida)', () => {
    it('devuelve el usuario con un token válido', async () => {
      const res = await http()
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(res.body).toMatchObject({
        name: 'Laia',
        email: 'laia@exemple.cat',
      });
    });

    it('401 UNAUTHORIZED sin token', async () => {
      const res = await http().get('/api/auth/me').expect(401);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });

    it('401 UNAUTHORIZED con un token falso', async () => {
      const res = await http()
        .get('/api/auth/me')
        .set('Authorization', 'Bearer abc.def.ghi')
        .expect(401);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });

    it('las rutas públicas no piden token', async () => {
      await http().get('/api/health').expect(200);
    });
  });
});
