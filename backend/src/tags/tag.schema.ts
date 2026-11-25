import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

/** Colores suaves de las etiquetas propias (distintos de los de asignatura). */
export const TAG_COLORS = [
  'rosat',
  'menta',
  'lavanda',
  'sorra',
  'cel',
] as const;
export type TagColor = (typeof TAG_COLORS)[number];

/** Etiqueta creada por el usuario (El meu espai · Personalitzar · Etiquetes). */
@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Tag {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  user: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, enum: TAG_COLORS })
  color: TagColor;

  /** «Mostrar» en las filas de tarea (interruptor de Personalitzar). */
  @Prop({ type: Boolean, default: true })
  visible: boolean;

  createdAt: Date;
}

export type TagDocument = HydratedDocument<Tag>;
export const TagSchema = SchemaFactory.createForClass(Tag);
/** Un mismo usuario no puede tener dos etiquetas con el mismo nombre (sin distinguir mayúsculas). */
TagSchema.index(
  { user: 1, name: 1 },
  { unique: true, collation: { locale: 'ca', strength: 2 } },
);
