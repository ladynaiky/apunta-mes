import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
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

    const subjects = await this.subjects.createDefaults(userId);
    const subjectId = (name?: string): Types.ObjectId | null =>
      name ? (subjects.find((s) => s.name === name)?._id ?? null) : null;

    // createdAt creciente: mantiene el orden del diseño dentro de cada día.
    let tick = 0;
    const createdAt = () => new Date(Date.UTC(2026, 9, 1, 8, 0, tick++));

    const pending = DEMO_ENTRIES.map((e) => ({
      ...e,
      user: userId,
      subject: subjectId(e.subject),
      createdAt: createdAt(),
    }));
    const history = DEMO_HISTORY.map((h) => ({
      type: 'task' as const,
      user: userId,
      title: h.title,
      date: h.date,
      subject: subjectId(h.subject),
      done: true,
      doneAt: new Date(`${h.date}T17:00:00Z`),
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
      markWith: 'tags',
      lastSyncAt: DEMO_LAST_SYNC,
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
