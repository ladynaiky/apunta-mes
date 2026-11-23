import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DEFAULT_SUBJECTS, SUBJECT_COLORS } from './default-subjects.js';
import { Subject, SubjectDocument } from './subject.schema.js';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private readonly subjects: Model<Subject>,
  ) {}

  /** Crea las 7 asignaturas por defecto de un usuario nuevo. */
  createDefaults(userId: Types.ObjectId): Promise<SubjectDocument[]> {
    return this.subjects.insertMany(
      DEFAULT_SUBJECTS.map((s) => ({
        user: userId,
        name: s.name,
        colorToken: s.colorToken,
        colorHex: SUBJECT_COLORS[s.colorToken],
      })),
    ) as Promise<SubjectDocument[]>;
  }

  findByUser(userId: Types.ObjectId | string): Promise<SubjectDocument[]> {
    return this.subjects
      .find({ user: userId })
      .sort({ createdAt: 1, _id: 1 })
      .exec();
  }

  async deleteByUser(userId: Types.ObjectId | string): Promise<void> {
    await this.subjects.deleteMany({ user: userId }).exec();
  }
}
