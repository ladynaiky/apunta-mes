import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** Usuario autenticado (lo pone JwtStrategy en request.user). */
export interface AuthUser {
  userId: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser =>
    ctx.switchToHttp().getRequest<{ user: AuthUser }>().user,
);
