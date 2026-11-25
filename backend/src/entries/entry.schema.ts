import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export const ENTRY_TYPES = ['task', 'exam', 'trip', 'birthday'] as const;
export type EntryType = (typeof ENTRY_TYPES)[number];

export const REMINDER_DAYS = [0, 1, 2, 3, 7] as const; // «El mateix dia», «1 dia»… «1 setmana»
export const EXAM_TYPES = ['written', 'oral', 'project'] as const; // Escrit / Oral / Treball
export const BIRTHDAY_RELATIONS = ['family', 'class', 'friend'] as const; // Família / De classe / Amic/ga
/** Prioridad: alta, baja o ninguna (null = normal). «low» añadido el 25/11/2026. */
export const PRIORITIES = ['high', 'low'] as const;

@Schema({ _id: false })
export class Reminder {
  @Prop({ type: Number, required: true, enum: REMINDER_DAYS })
  daysBefore: number;

  /** HH:mm */
  @Prop({ type: String, required: true })
  time: string;
}
const ReminderSchema = SchemaFactory.createForClass(Reminder);

@Schema({ _id: false })
export class CheckItem {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: Boolean, default: false })
  done: boolean;
}
const CheckItemSchema = SchemaFactory.createForClass(CheckItem);

/**
 * Una sola colección para todo lo que se apunta. Los campos que no son de su
 * tipo quedan vacíos.
 */
@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Entry {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  user: Types.ObjectId;

  @Prop({ type: String, required: true, enum: ENTRY_TYPES })
  type: (typeof ENTRY_TYPES)[number];

  /** Tarea: «Exercicis, pàg. 12». Examen: «Examen de Mates». Aniversari: el nombre. */
  @Prop({ type: String, required: true, trim: true })
  title: string;

  /** AAAA-MM-DD. Los aniversarios se repiten cada año en este día y mes. */
  @Prop({ type: String, required: true })
  date: string;

  @Prop({ type: String, default: '' })
  notes: string;

  @Prop({ type: ReminderSchema, default: null })
  reminder: Reminder | null;

  @Prop({ type: String, enum: PRIORITIES, default: null })
  priority: (typeof PRIORITIES)[number] | null;

  /** Marcada en Compartir/Privacitat para compartirla con la familia. */
  @Prop({ type: Boolean, default: false })
  shared: boolean;

  /** Tarea, examen y excursión. */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Subject', default: null })
  subject: Types.ObjectId | null;

  /** Etiquetas propias (máximo 3). */
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Tag' }],
    default: [],
  })
  tags: Types.ObjectId[];

  /** «Per fer» / «Feta». */
  @Prop({ type: Boolean, default: false })
  done: boolean;

  @Prop({ type: Date, default: null })
  doneAt: Date | null;

  // — task —
  @Prop({ type: String, default: '' })
  page: string;

  /** «Activitat» (p. ej., el número de ejercicio). */
  @Prop({ type: String, default: '' })
  activity: string;

  // — exam —
  @Prop({ type: String, default: '' })
  topic: string;

  @Prop({ type: String, enum: EXAM_TYPES, default: null })
  examType: (typeof EXAM_TYPES)[number] | null;

  @Prop({ type: String, default: '' })
  toStudy: string;

  // — trip —
  @Prop({ type: String, default: '' })
  place: string;

  @Prop({ type: String, default: '' })
  departureTime: string;

  @Prop({ type: String, default: '' })
  returnTime: string;

  @Prop({ type: [CheckItemSchema], default: [] })
  whatToBring: CheckItem[];

  // — birthday —
  @Prop({ type: String, default: '' })
  personName: string;

  @Prop({ type: Number, default: null })
  age: number | null;

  @Prop({ type: String, enum: BIRTHDAY_RELATIONS, default: null })
  relation: (typeof BIRTHDAY_RELATIONS)[number] | null;

  @Prop({ type: String, default: '' })
  giftIdeas: string;

  createdAt: Date;
}

export type EntryDocument = HydratedDocument<Entry>;
export const EntrySchema = SchemaFactory.createForClass(Entry);
EntrySchema.index({ user: 1, date: 1 });
EntrySchema.index({ user: 1, type: 1, date: 1 });
