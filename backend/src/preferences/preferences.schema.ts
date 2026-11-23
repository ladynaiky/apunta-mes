import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

/** Agrupar les tasques per: Assignatures / Data / Prioritat / Estat. */
export const GROUP_BY = ['subjects', 'date', 'priority', 'status'] as const;
/** Marcar-les amb: Etiquetes / Colors. */
export const MARK_WITH = ['tags', 'colors'] as const;
/** Etiquetes que es mostren: Per fer, Feta, Prioritat alta, Data de lliurament. */
export const TAGS = ['todo', 'done', 'priority', 'dueDate'] as const;

/** Personalització y estado de Sincronitzar (uno por usuario). */
@Schema({ timestamps: false })
export class Preferences {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  user: Types.ObjectId;

  @Prop({ type: String, enum: GROUP_BY, default: 'subjects' })
  groupBy: (typeof GROUP_BY)[number];

  @Prop({ type: String, enum: MARK_WITH, default: 'tags' })
  markWith: (typeof MARK_WITH)[number];

  @Prop({ type: [String], enum: TAGS, default: [...TAGS] })
  visibleTags: (typeof TAGS)[number][];

  @Prop({ type: Date, default: null })
  lastSyncAt: Date | null;
}

export type PreferencesDocument = HydratedDocument<Preferences>;
export const PreferencesSchema = SchemaFactory.createForClass(Preferences);
