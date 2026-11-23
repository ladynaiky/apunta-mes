import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Types } from 'mongoose';
import { daysBetween, monthRange, weekRange } from '../common/dates.js';
import { notFound } from '../common/errors.js';
import { AppConfigService } from '../config/app-config.service.js';
import { Subject } from '../subjects/subject.schema.js';
import type { CreateEntryDto } from './dto/create-entry.dto.js';
import type {
  CalendarDayDto,
  EntryDto,
  ReminderEntryDto,
} from './dto/entry.dto.js';
import type { EntryQueryDto } from './dto/entry-query.dto.js';
import type { UpdateEntryDto } from './dto/update-entry.dto.js';
import { Entry, EntryDocument } from './entry.schema.js';

type PopulatedSubject = {
  _id: Types.ObjectId;
  name: string;
  colorToken: string;
  colorHex: string;
};
type EntryLean = Omit<Entry, 'subject'> & {
  _id: Types.ObjectId;
  subject: PopulatedSubject | null;
};

/** Quita las claves sin valor: un campo que no llega no debe borrar lo guardado. */
const defined = <T extends object>(o: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(o).filter(([, v]) => v !== undefined),
  ) as Partial<T>;

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const sortByDate = (a: EntryDto, b: EntryDto) =>
  a.date.localeCompare(b.date) || a.createdAt.getTime() - b.createdAt.getTime();

function validationError(errors: Record<string, string>): BadRequestException {
  return new BadRequestException({
    statusCode: 400,
    code: 'VALIDATION_ERROR',
    errors,
  });
}

@Injectable()
export class EntriesService {
  constructor(
    @InjectModel(Entry.name) private readonly entries: Model<Entry>,
    @InjectModel(Subject.name) private readonly subjects: Model<Subject>,
    private readonly appConfig: AppConfigService,
  ) {}

  // ───────── Lecturas ─────────

  /**
   * Búsqueda con filtros. Con from/to, los aniversarios salen en el día que
   * caen dentro del rango (se repiten cada año).
   */
  async list(userId: string, q: EntryQueryDto): Promise<EntryDto[]> {
    const filter: QueryFilter<Entry> = { user: userId };
    if (q.type) filter.type = q.type;
    if (q.subject) filter.subject = q.subject;
    if (q.done !== undefined) filter.done = q.done;
    if (q.q) {
      const re = new RegExp(escapeRegex(q.q.trim()), 'i');
      const subjectIds = await this.subjects
        .find({ user: userId, name: re })
        .distinct('_id')
        .exec();
      filter.$or = [
        { title: re },
        { personName: re },
        { subject: { $in: subjectIds } },
      ];
    }

    if (!q.from && !q.to) {
      return (await this.find(filter))
        .map((e) => this.toDto(e))
        .sort(sortByDate);
    }
    const from = q.from ?? '0000-01-01';
    const to = q.to ?? '9999-12-31';
    if (from > to) throw validationError({ to: 'to.beforeFrom' });
    return this.inRange(filter, from, to);
  }

  /** Lo de hoy (Inici, Tasques d’avui, día del calendario). */
  today(userId: string): Promise<EntryDto[]> {
    const today = this.appConfig.today;
    return this.inRange({ user: userId }, today, today);
  }

  /** De dilluns a diumenge de la semana de hoy. */
  week(userId: string): Promise<EntryDto[]> {
    const { from, to } = weekRange(this.appConfig.today);
    return this.inRange({ user: userId }, from, to);
  }

  /** Un día concreto (Tasques del dia). */
  day(userId: string, date: string): Promise<EntryDto[]> {
    return this.inRange({ user: userId }, date, date);
  }

  /** Historial: tareas hechas, de la más reciente a la más antigua. */
  async history(
    userId: string,
    year?: number,
    month?: number,
  ): Promise<EntryDto[]> {
    const filter: QueryFilter<Entry> = {
      user: userId,
      type: 'task',
      done: true,
    };
    if (year) {
      const start = new Date(Date.UTC(year, month ? month - 1 : 0, 1));
      const end = new Date(Date.UTC(year, month ? month : 12, 1));
      filter.doneAt = { $gte: start, $lt: end };
    }
    const docs = await this.find(filter, { doneAt: -1, date: -1 });
    return docs.map((e) => this.toDto(e));
  }

  /** Puntos del calendario mensual: un punto por cosa apuntada y día. */
  async calendar(userId: string, month?: string): Promise<CalendarDayDto[]> {
    const { from, to } = monthRange(month ?? this.appConfig.today.slice(0, 7));
    const items = await this.inRange({ user: userId }, from, to);
    const days = new Map<string, CalendarDayDto>();
    for (const e of items) {
      const day = days.get(e.date) ?? { date: e.date, count: 0, dots: [] };
      day.count += 1;
      day.dots.push({
        type: e.type,
        subjectName: e.subject?.name ?? null,
        colorToken: e.subject?.colorToken ?? null,
        colorHex: e.subject?.colorHex ?? null,
      });
      days.set(e.date, day);
    }
    return [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Avís de pendents: lo que no está hecho y cuyo aviso ya ha empezado
   * (desde «N dies abans» hasta el mismo día).
   */
  async reminders(userId: string): Promise<ReminderEntryDto[]> {
    const today = this.appConfig.today;
    const horizon = `${Number(today.slice(0, 4)) + 1}${today.slice(4)}`;
    const items = await this.inRange(
      { user: userId, done: false, reminder: { $ne: null } },
      today,
      horizon,
    );
    return items
      .map((e) => Object.assign(e, { daysLeft: daysBetween(today, e.date) }))
      .filter((e) => e.reminder && e.daysLeft <= e.reminder.daysBefore);
  }

  async get(userId: string, id: string): Promise<EntryDto> {
    return this.toDto(await this.findOneLean(userId, id));
  }

  // ───────── Escrituras ─────────

  async create(userId: string, dto: CreateEntryDto): Promise<EntryDto> {
    const subject = dto.subject
      ? await this.ownedSubject(userId, dto.subject)
      : null;
    const title =
      dto.title ||
      (dto.type === 'exam' && subject ? `Examen de ${subject.name}` : '') ||
      (dto.type === 'birthday' ? (dto.personName ?? '') : '');

    const doc = await this.entries.create({
      ...defined(dto),
      user: userId,
      title,
      subject: subject?._id ?? null,
      examType: dto.type === 'exam' ? (dto.examType ?? 'written') : null,
      doneAt: dto.done ? new Date() : null,
    });
    return this.get(userId, doc.id as string);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateEntryDto,
  ): Promise<EntryDto> {
    const doc = await this.findOneDoc(userId, id);
    if (dto.subject !== undefined) {
      doc.subject = dto.subject
        ? (await this.ownedSubject(userId, dto.subject))._id
        : null;
    }
    const { subject: _subject, done, ...rest } = dto;
    doc.set(defined(rest));
    if (done !== undefined) this.applyDone(doc, done);
    this.assertRequiredByType(doc);
    await doc.save();
    return this.get(userId, id);
  }

  async setDone(userId: string, id: string, done: boolean): Promise<EntryDto> {
    const doc = await this.findOneDoc(userId, id);
    this.applyDone(doc, done);
    await doc.save();
    return this.get(userId, id);
  }

  async remove(userId: string, id: string): Promise<void> {
    const res = await this.entries.deleteOne({ _id: id, user: userId }).exec();
    if (res.deletedCount === 0) throw notFound();
  }

  // ───────── Ayudas ─────────

  private applyDone(doc: EntryDocument, done: boolean) {
    if (doc.done === done) return;
    doc.done = done;
    doc.doneAt = done ? new Date() : null;
  }

  /** Mismas reglas que al crear, comprobadas tras mezclar la edición. */
  private assertRequiredByType(doc: EntryDocument) {
    const errors: Record<string, string> = {};
    if ((doc.type === 'task' || doc.type === 'trip') && !doc.title?.trim()) {
      errors.title = 'title.required';
    }
    if ((doc.type === 'task' || doc.type === 'exam') && !doc.subject) {
      errors.subject = 'subject.required';
    }
    if (doc.type === 'birthday' && !doc.personName?.trim()) {
      errors.personName = 'personName.required';
    }
    if (Object.keys(errors).length) throw validationError(errors);
  }

  private async ownedSubject(userId: string, subjectId: string) {
    const subject = await this.subjects
      .findOne({ _id: subjectId, user: userId })
      .exec();
    if (!subject) throw validationError({ subject: 'subject.notFound' });
    return subject;
  }

  private find(
    filter: QueryFilter<Entry>,
    sort: Record<string, 1 | -1> = { date: 1, createdAt: 1 },
  ) {
    return this.entries
      .find(filter)
      .sort(sort)
      .populate('subject', 'name colorToken colorHex')
      .lean<EntryLean[]>()
      .exec();
  }

  private async findOneLean(userId: string, id: string): Promise<EntryLean> {
    const [doc] = await this.find({ _id: id, user: userId });
    if (!doc) throw notFound();
    return doc;
  }

  private async findOneDoc(userId: string, id: string): Promise<EntryDocument> {
    const doc = await this.entries.findOne({ _id: id, user: userId }).exec();
    if (!doc) throw notFound();
    return doc;
  }

  /**
   * Entradas entre dos fechas (incluidas). Los aniversarios se buscan por día
   * y mes en cada año del rango, y su edad se ajusta a ese año.
   */
  private async inRange(
    filter: QueryFilter<Entry>,
    from: string,
    to: string,
  ): Promise<EntryDto[]> {
    const wantsBirthdays = !filter.type || filter.type === 'birthday';
    const [regular, birthdays] = await Promise.all([
      filter.type === 'birthday'
        ? Promise.resolve([])
        : this.find({
            ...filter,
            type: filter.type ?? { $ne: 'birthday' },
            date: { $gte: from, $lte: to },
          }),
      wantsBirthdays
        ? this.find({ ...filter, type: 'birthday' })
        : Promise.resolve([]),
    ]);

    const result = regular.map((e) => this.toDto(e));
    const fromYear = Math.max(Number(from.slice(0, 4)), 1900);
    const toYear = Math.min(Number(to.slice(0, 4)), fromYear + 2);
    for (const b of birthdays) {
      for (let year = fromYear; year <= toYear; year++) {
        const date = `${year}${b.date.slice(4)}`;
        if (date < from || date > to || date.endsWith('02-29')) continue;
        const dto = this.toDto(b);
        const storedYear = Number(b.date.slice(0, 4));
        result.push(
          Object.assign(dto, {
            date,
            age: dto.age === null ? null : dto.age + (year - storedYear),
          }),
        );
      }
    }
    return result.sort(sortByDate);
  }

  private toDto(e: EntryLean): EntryDto {
    return {
      id: e._id.toHexString(),
      type: e.type,
      title: e.title,
      date: e.date,
      notes: e.notes ?? '',
      reminder: e.reminder
        ? { daysBefore: e.reminder.daysBefore, time: e.reminder.time }
        : null,
      priority: e.priority ?? null,
      shared: e.shared ?? false,
      subject: e.subject
        ? {
            id: e.subject._id.toHexString(),
            name: e.subject.name,
            colorToken: e.subject.colorToken,
            colorHex: e.subject.colorHex,
          }
        : null,
      done: e.done ?? false,
      doneAt: e.doneAt ?? null,
      page: e.page ?? '',
      topic: e.topic ?? '',
      examType: e.examType ?? null,
      toStudy: e.toStudy ?? '',
      place: e.place ?? '',
      departureTime: e.departureTime ?? '',
      returnTime: e.returnTime ?? '',
      whatToBring: (e.whatToBring ?? []).map((i) => ({
        name: i.name,
        done: i.done,
      })),
      personName: e.personName ?? '',
      age: e.age ?? null,
      relation: e.relation ?? null,
      giftIdeas: e.giftIdeas ?? '',
      createdAt: e.createdAt,
    };
  }
}
