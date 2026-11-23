import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './decorators/public.decorator.js';

/**
 * Guard global: todas las rutas piden un JWT válido salvo las marcadas con
 * @Public(). Si falta el token o ha caducado → 401 { code: 'UNAUTHORIZED' }
 * (el frontend muestra «La sessió ha caducat. Torna a iniciar sessió.»).
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }

  handleRequest<TUser>(err: unknown, user: TUser | false): TUser {
    if (err || !user) {
      throw new UnauthorizedException({
        statusCode: 401,
        code: 'UNAUTHORIZED',
      });
    }
    return user;
  }
}
