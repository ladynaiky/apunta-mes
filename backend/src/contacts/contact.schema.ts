import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

/** Alumne / Pares / Profe / Altres (grupos de «Contactes» en Compartir). */
export const CONTACT_ROLES = ['student', 'parent', 'teacher', 'other'] as const;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Contact {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  user: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  name: string;

  /** «Correu o telèfon». */
  @Prop({ type: String, default: '', trim: true })
  emailOrPhone: string;

  @Prop({ type: String, enum: CONTACT_ROLES, default: 'other' })
  role: (typeof CONTACT_ROLES)[number];

  createdAt: Date;
}

export type ContactDocument = HydratedDocument<Contact>;
export const ContactSchema = SchemaFactory.createForClass(Contact);
