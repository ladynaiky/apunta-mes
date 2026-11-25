import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subject, SubjectSchema } from '../subjects/subject.schema.js';
import { Tag, TagSchema } from '../tags/tag.schema.js';
import { EntriesController } from './entries.controller.js';
import { EntriesService } from './entries.service.js';
import { Entry, EntrySchema } from './entry.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entry.name, schema: EntrySchema },
      { name: Subject.name, schema: SubjectSchema },
      { name: Tag.name, schema: TagSchema },
    ]),
  ],
  controllers: [EntriesController],
  providers: [EntriesService],
  exports: [EntriesService],
})
export class EntriesModule {}
