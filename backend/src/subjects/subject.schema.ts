import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  SUBJECT_COLOR_TOKENS,
  type SubjectColorToken,
} from './default-subjects.js';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Subject {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, enum: SUBJECT_COLOR_TOKENS })
  colorToken: SubjectColorToken;

  @Prop({ type: String, required: true })
  colorHex: string;

  createdAt: Date;
}

export type SubjectDocument = HydratedDocument<Subject>;
export const SubjectSchema = SchemaFactory.createForClass(Subject);
/** Un mismo usuario no puede tener dos asignaturas con el mismo nombre. */
SubjectSchema.index({ user: 1, name: 1 }, { unique: true });
