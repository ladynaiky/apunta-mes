import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { AppConfigService } from '../config/app-config.service.js';
import { DEMO_EMPTY_KEY } from './demo-state.decorator.js';

@Injectable()
export class DemoStateInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly appConfig: AppConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const meta = this.reflector.get<{ emptyValue: unknown } | undefined>(
      DEMO_EMPTY_KEY,
      context.getHandler(),
    );
    if (!meta || !this.appConfig.demoMode) return next.handle();

    const header = context
      .switchToHttp()
      .getRequest<{ headers: Record<string, string | undefined> }>().headers[
      'x-demo-state'
    ];

    if (header === 'error') {
      throw new ServiceUnavailableException({
        statusCode: 503,
        code: 'DEMO_ERROR',
      });
    }
    if (header === 'empty') return of(structuredClone(meta.emptyValue));
    return next.handle();
  }
}
