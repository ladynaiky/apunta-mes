import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

/** Agrupar les tasques per: Assignatures / Prioritat / Data de lliurament. */
export const GROUP_BY = ['subjects', 'priority', 'date'] as const;
/** Marcar-les amb: Colors / Etiquetes. */
export const MARK_WITH = ['colors', 'tags'] as const;
/** Etiquetes: Per fer, Feta, Prioritat alta, Prioritat baixa. */
export const TAGS = ['todo', 'done', 'highPriority', 'lowPriority'] as const;
/** Por defecto se muestran todas menos «Prioritat baixa» (como en el diseño). */
export const DEFAULT_TAGS: (typeof TAGS)[number][] = [
  'todo',
  'done',
  'highPriority',
];

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

  @Prop({ type: String, enum: MARK_WITH, default: 'colors' })
  markWith: (typeof MARK_WITH)[number];

  @Prop({ type: [String], enum: TAGS, default: () => [...DEFAULT_TAGS] })
  visibleTags: (typeof TAGS)[number][];

  @Prop({ type: Date, default: null })
  lastSyncAt: Date | null;

  /** Solo usuario de demo: día (AAAA-MM-DD) en que se crearon sus datos. */
  @Prop({ type: String, default: null })
  demoSeededOn: string | null;
}

export type PreferencesDocument = HydratedDocument<Preferences>;
export const PreferencesSchema = SchemaFactory.createForClass(Preferences);
