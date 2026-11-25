import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Entry, EntrySchema } from '../entries/entry.schema.js';
import { Tag, TagSchema } from './tag.schema.js';
import { TagsController } from './tags.controller.js';
import { TagsService } from './tags.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tag.name, schema: TagSchema },
      { name: Entry.name, schema: EntrySchema },
    ]),
  ],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
