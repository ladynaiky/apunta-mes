import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import type { SubjectsService } from '../subjects/subjects.service.js';
import type { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';

const userId = new Types.ObjectId();
const fakeUser = (extra: Record<string, unknown> = {}) => ({
  _id: userId,
  id: userId.toHexString(),
  name: 'Laia',
  email: 'laia@exemple.cat',
  role: 'student',
  createdAt: new Date('2026-11-04T08:00:00Z'),
  ...extra,
});

function setup() {
  const users = {
    existsByEmail: vi.fn().mockResolvedValue(false),
    create: vi.fn().mockResolvedValue(fakeUser()),
    findByEmailWithPassword: vi.fn(),
    findById: vi.fn(),
    deleteById: vi.fn(),
  };
  const subjects = {
    createDefaults: vi.fn().mockResolvedValue([]),
    deleteByUser: vi.fn(),
  };
  const jwt = new JwtService({
    secret: 'x'.repeat(32),
    signOptions: { expiresIn: '7d' },
  });
  const service = new AuthService(
    users as unknown as UsersService,
    subjects as unknown as SubjectsService,
    jwt,
  );
  return { service, users, subjects, jwt };
}

const dto = {
  name: 'Laia',
  role: 'student' as const,
  email: 'laia@exemple.cat',
  password: 'contrasenya1',
};

describe('AuthService', () => {
  it('register: guarda el hash (no la contraseña) y crea las asignaturas', async () => {
    const { service, users, subjects, jwt } = setup();
    const res = await service.register(dto);

    const saved = users.create.mock.calls[0][0];
    expect(saved.passwordHash).not.toBe(dto.password);
    expect(await bcrypt.compare(dto.password, saved.passwordHash)).toBe(true);
    expect(subjects.createDefaults).toHaveBeenCalledWith(userId);
    expect(jwt.verify(res.accessToken).sub).toBe(userId.toHexString());
    expect(res.user).toEqual({
      id: userId.toHexString(),
      name: 'Laia',
      email: 'laia@exemple.cat',
      role: 'student',
      createdAt: new Date('2026-11-04T08:00:00Z'),
    });
  });

  it('register: EMAIL_TAKEN si el correo ya existe', async () => {
    const { service, users } = setup();
    users.existsByEmail.mockResolvedValue(true);
    await expect(service.register(dto)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(users.create).not.toHaveBeenCalled();
  });

  it('register: EMAIL_TAKEN si dos registros llegan a la vez (clave duplicada)', async () => {
    const { service, users } = setup();
    users.create.mockRejectedValue({ code: 11000 });
    await expect(service.register(dto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('register: deshace el usuario si fallan las asignaturas', async () => {
    const { service, users, subjects } = setup();
    subjects.createDefaults.mockRejectedValue(new Error('db'));
    await expect(service.register(dto)).rejects.toThrow('db');
    expect(users.deleteById).toHaveBeenCalledWith(userId);
  });

  it('login: correcto con la contraseña buena', async () => {
    const { service, users } = setup();
    const passwordHash = await bcrypt.hash('contrasenya1', 4);
    users.findByEmailWithPassword.mockResolvedValue(fakeUser({ passwordHash }));
    const res = await service.login({
      email: 'laia@exemple.cat',
      password: 'contrasenya1',
    });
    expect(res.user.email).toBe('laia@exemple.cat');
  });

  it('login: INVALID_CREDENTIALS con la contraseña mala o el correo inexistente', async () => {
    const { service, users } = setup();
    const passwordHash = await bcrypt.hash('contrasenya1', 4);
    users.findByEmailWithPassword.mockResolvedValueOnce(
      fakeUser({ passwordHash }),
    );
    await expect(
      service.login({ email: 'laia@exemple.cat', password: 'mala' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    users.findByEmailWithPassword.mockResolvedValueOnce(null);
    await expect(
      service.login({ email: 'ningu@exemple.cat', password: 'contrasenya1' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
