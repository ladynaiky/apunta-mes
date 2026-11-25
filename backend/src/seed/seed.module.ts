import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from '../contacts/contact.schema.js';
import { Entry, EntrySchema } from '../entries/entry.schema.js';
import {
  Preferences,
  PreferencesSchema,
} from '../preferences/preferences.schema.js';
import { SubjectsModule } from '../subjects/subjects.module.js';
import { Tag, TagSchema } from '../tags/tag.schema.js';
import { User, UserSchema } from '../users/user.schema.js';
import { UsersModule } from '../users/users.module.js';
import { DemoDailyResetService } from './demo-daily-reset.service.js';
import { DemoSeedService } from './demo-seed.service.js';
import { DemoController } from './demo.controller.js';

@Module({
  imports: [
    UsersModule,
    SubjectsModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Entry.name, schema: EntrySchema },
      { name: Contact.name, schema: ContactSchema },
      { name: Preferences.name, schema: PreferencesSchema },
      { name: Tag.name, schema: TagSchema },
    ]),
  ],
  controllers: [DemoController],
  providers: [DemoSeedService, DemoDailyResetService],
  exports: [DemoSeedService],
})
export class SeedModule {}
