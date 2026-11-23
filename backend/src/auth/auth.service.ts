import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { SubjectsService } from '../subjects/subjects.service.js';
import type { UserDocument } from '../users/user.schema.js';
import { UsersService } from '../users/users.service.js';
import { AuthResponseDto, UserDto } from './dto/auth-response.dto.js';
import type { LoginDto } from './dto/login.dto.js';
import type { RegisterDto } from './dto/register.dto.js';

const BCRYPT_ROUNDS = 10;
const DUPLICATE_KEY = 11000;

/** Hash fijo para comparar cuando el correo no existe (misma duración de respuesta). */
const DUMMY_HASH = bcrypt.hashSync('apunta-dummy-password', BCRYPT_ROUNDS);

export const emailTaken = () =>
  new ConflictException({ statusCode: 409, code: 'EMAIL_TAKEN' });
export const invalidCredentials = () =>
  new UnauthorizedException({ statusCode: 401, code: 'INVALID_CREDENTIALS' });

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly subjects: SubjectsService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    if (await this.users.existsByEmail(dto.email)) throw emailTaken();

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    let user: UserDocument;
    try {
      user = await this.users.create({
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: dto.role,
      });
    } catch (err) {
      // Dos registros simultáneos con el mismo correo: el índice único lo frena.
      if ((err as { code?: number }).code === DUPLICATE_KEY) throw emailTaken();
      throw err;
    }

    try {
      await this.subjects.createDefaults(user._id);
    } catch (err) {
      // Sin asignaturas el usuario quedaría a medias: se deshace el registro.
      await this.subjects.deleteByUser(user._id);
      await this.users.deleteById(user._id);
      throw err;
    }

    return this.buildResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.users.findByEmailWithPassword(dto.email);
    const ok = await bcrypt.compare(
      dto.password,
      user?.passwordHash ?? DUMMY_HASH,
    );
    if (!user || !ok) throw invalidCredentials();
    return this.buildResponse(user);
  }

  async me(userId: string): Promise<UserDto> {
    const user = await this.users.findById(userId);
    if (!user)
      throw new UnauthorizedException({
        statusCode: 401,
        code: 'UNAUTHORIZED',
      });
    return UserDto.from(user);
  }

  private async buildResponse(user: UserDocument): Promise<AuthResponseDto> {
    const accessToken = await this.jwt.signAsync({ sub: user.id as string });
    return { accessToken, user: UserDto.from(user) };
  }
}
