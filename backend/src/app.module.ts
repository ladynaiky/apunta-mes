import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app-config.module.js';
import { SystemModule } from './system/system.module.js';

@Module({
  imports: [AppConfigModule, SystemModule],
})
export class AppModule {}
