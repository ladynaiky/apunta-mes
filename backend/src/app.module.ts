import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app-config.module.js';
import { DatabaseModule } from './database/database.module.js';
import { SystemModule } from './system/system.module.js';

@Module({
  imports: [AppConfigModule, DatabaseModule, SystemModule],
})
export class AppModule {}
