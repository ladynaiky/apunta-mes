import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { conflict, notFound } from '../common/errors.js';
import { Entry } from '../entries/entry.schema.js';
import { DEFAULT_SUBJECTS, SUBJECT_COLORS } from './default-subjects.js';
import type { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto.js';
import { Subject, SubjectDocument } from './subject.schema.js';

const DUPLICATE_KEY = 11000;
const isDuplicate = (err: unknown) =>
  (err as { code?: number }).code === DUPLICATE_KEY;

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private readonly subjects: Model<Subject>,
    @InjectModel(Entry.name) private readonly entries: Model<Entry>,
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

  async findOwned(userId: string, id: string): Promise<SubjectDocument> {
    const subject = await this.subjects
      .findOne({ _id: id, user: userId })
      .exec();
    if (!subject) throw notFound();
    return subject;
  }

  async create(
    userId: string,
    dto: CreateSubjectDto,
  ): Promise<SubjectDocument> {
    try {
      return await this.subjects.create({
        user: userId,
        name: dto.name,
        colorToken: dto.colorToken,
        colorHex: SUBJECT_COLORS[dto.colorToken],
      });
    } catch (err) {
      if (isDuplicate(err)) throw conflict('SUBJECT_EXISTS');
      throw err;
    }
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateSubjectDto,
  ): Promise<SubjectDocument> {
    const subject = await this.findOwned(userId, id);
    if (dto.name !== undefined) subject.name = dto.name;
    if (dto.colorToken !== undefined) {
      subject.colorToken = dto.colorToken;
      subject.colorHex = SUBJECT_COLORS[dto.colorToken];
    }
    try {
      return await subject.save();
    } catch (err) {
      if (isDuplicate(err)) throw conflict('SUBJECT_EXISTS');
      throw err;
    }
  }

  /** No se puede borrar una asignatura que tiene cosas apuntadas. */
  async remove(userId: string, id: string): Promise<void> {
    const subject = await this.findOwned(userId, id);
    const inUse = await this.entries.exists({
      user: userId,
      subject: subject._id,
    });
    if (inUse) throw conflict('SUBJECT_IN_USE');
    await subject.deleteOne();
  }

  async deleteByUser(userId: Types.ObjectId | string): Promise<void> {
    await this.subjects.deleteMany({ user: userId }).exec();
  }
}
