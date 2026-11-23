import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DemoStateInterceptor } from './demo-state.interceptor.js';

@Module({
  providers: [{ provide: APP_INTERCEPTOR, useClass: DemoStateInterceptor }],
})
export class DemoModule {}
