import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from '../config/app-config.service.js';
import { UsersService } from '../users/users.service.js';
import type { AuthUser } from './decorators/current-user.decorator.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    appConfig: AppConfigService,
    private readonly users: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwtSecret,
    });
  }

  /** Comprueba que el usuario del token sigue existiendo. */
  async validate(payload: { sub: string }): Promise<AuthUser> {
    const user = await this.users.findById(payload.sub);
    if (!user)
      throw new UnauthorizedException({
        statusCode: 401,
        code: 'UNAUTHORIZED',
      });
    return { userId: user.id as string };
  }
}
