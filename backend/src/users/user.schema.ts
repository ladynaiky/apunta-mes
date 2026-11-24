import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Roles en masculino y femenino (iteración 1). `parent` y `teacher` son los de antes:
 * se siguen aceptando para no romper los datos guardados.
 */
export const PERSON_ROLES = [
  'student',
  'student_f',
  'father',
  'mother',
  'tutor_m',
  'tutor_f',
  'teacher_m',
  'teacher_f',
  'parent',
  'teacher',
] as const;
export const USER_ROLES = PERSON_ROLES;
export type UserRole = (typeof USER_ROLES)[number];

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class User {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  /** Siempre en minúsculas: el correo es único sin distinguir mayúsculas. */
  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  /** Hash de bcrypt; nunca se devuelve en las respuestas. */
  @Prop({ type: String, required: true, select: false })
  passwordHash: string;

  /** Se guarda, pero en esta versión no cambia nada en la app. */
  @Prop({ type: String, required: true, enum: USER_ROLES })
  role: UserRole;

  createdAt: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
