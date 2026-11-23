import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subject, SubjectSchema } from './subject.schema.js';
import { SubjectsService } from './subjects.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]),
  ],
  providers: [SubjectsService],
  exports: [SubjectsService],
})
export class SubjectsModule {}
