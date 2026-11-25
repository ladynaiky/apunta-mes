import { Module } from '@nestjs/common';
import { AiModule } from './ai/ai.js';
import { AuthModule } from './auth/auth.module.js';
import { AppConfigModule } from './config/app-config.module.js';
import { ContactsModule } from './contacts/contacts.module.js';
import { DatabaseModule } from './database/database.module.js';
import { DemoModule } from './demo/demo.module.js';
import { EntriesModule } from './entries/entries.module.js';
import { PreferencesModule } from './preferences/preferences.module.js';
import { SeedModule } from './seed/seed.module.js';
import { ShareLinksModule } from './share-links/share-links.js';
import { SubjectsModule } from './subjects/subjects.module.js';
import { TagsModule } from './tags/tags.module.js';
import { SystemModule } from './system/system.module.js';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AuthModule,
    DemoModule,
    SubjectsModule,
    TagsModule,
    EntriesModule,
    PreferencesModule,
    ContactsModule,
    ShareLinksModule,
    AiModule,
    SeedModule,
    SystemModule,
  ],
})
export class AppModule {}
