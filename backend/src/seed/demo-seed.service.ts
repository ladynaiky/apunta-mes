import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { addDays, daysBetween } from '../common/dates.js';
import { AppConfigService } from '../config/app-config.service.js';
import { Contact } from '../contacts/contact.schema.js';
import { Entry } from '../entries/entry.schema.js';
import { Preferences } from '../preferences/preferences.schema.js';
import { SubjectsService } from '../subjects/subjects.service.js';
import { User } from '../users/user.schema.js';
import {
  DEMO_CONTACTS,
  DEMO_ENTRIES,
  DEMO_HISTORY,
  DEMO_LAST_SYNC,
  DEMO_REFERENCE_TODAY,
  DEMO_USER,
} from './demo-data.js';

export interface SeedSummary {
  userId: string;
  email: string;
  subjects: number;
  entries: number;
  history: number;
  contacts: number;
}

/**
 * Crea o reinicia el usuario de demo. Solo toca los datos de ese usuario:
 * el resto de cuentas no se modifican. Si el usuario ya existe, conserva su id
 * (los tokens abiertos siguen sirviendo).
 */
@Injectable()
export class DemoSeedService {
  constructor(
    @InjectModel(User.name) private readonly users: Model<User>,
    @InjectModel(Entry.name) private readonly entries: Model<Entry>,
    @InjectModel(Contact.name) private readonly contacts: Model<Contact>,
    @InjectModel(Preferences.name) private readonly prefs: Model<Preferences>,
    private readonly subjects: SubjectsService,
    private readonly appConfig: AppConfigService,
  ) {}

  async reset(email: string, password: string): Promise<SeedSummary> {
    const normalized = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.users
      .findOneAndUpdate(
        { email: normalized },
        { $set: { name: DEMO_USER.name, role: DEMO_USER.role, passwordHash } },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
      )
      .exec();
    const userId = user._id;

    await Promise.all([
      this.entries.deleteMany({ user: userId }).exec(),
      this.contacts.deleteMany({ user: userId }).exec(),
      this.prefs.deleteMany({ user: userId }).exec(),
      this.subjects.deleteByUser(userId),
    ]);

    // Los datos están escritos para «hoy» = 4/11/2026; se desplazan a la fecha
    // de la app (real, o DEMO_TODAY) para que siempre tengan sentido.
    const shift = daysBetween(DEMO_REFERENCE_TODAY, this.appConfig.today);
    const move = (date: string) => addDays(date, shift);

    const subjects = await this.subjects.createDefaults(userId);
    const subjectId = (name?: string): Types.ObjectId | null =>
      name ? (subjects.find((s) => s.name === name)?._id ?? null) : null;

    // createdAt creciente: mantiene el orden del diseño dentro de cada día.
    let tick = 0;
    const createdAt = () => new Date(Date.UTC(2026, 9, 1, 8, 0, tick++));

    const pending = DEMO_ENTRIES.map((e) => ({
      ...e,
      date: move(e.date),
      user: userId,
      subject: subjectId(e.subject),
      createdAt: createdAt(),
    }));
    const history = DEMO_HISTORY.map((h) => ({
      type: 'task' as const,
      user: userId,
      title: h.title,
      date: move(h.date),
      subject: subjectId(h.subject),
      done: true,
      doneAt: new Date(`${move(h.date)}T17:00:00Z`),
      createdAt: createdAt(),
    }));
    await this.entries.insertMany([...history, ...pending]);

    await this.contacts.insertMany(
      DEMO_CONTACTS.map((c) => ({
        ...c,
        user: userId,
        createdAt: createdAt(),
      })),
    );
    await this.prefs.create({
      user: userId,
      groupBy: 'subjects',
      markWith: 'colors',
      lastSyncAt: new Date(DEMO_LAST_SYNC.getTime() + shift * 86_400_000),
    });

    return {
      userId: userId.toHexString(),
      email: normalized,
      subjects: subjects.length,
      entries: pending.length,
      history: history.length,
      contacts: DEMO_CONTACTS.length,
    };
  }
}
