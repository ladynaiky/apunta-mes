import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type {
  PreferencesDto,
  SyncStatusDto,
  UpdatePreferencesDto,
} from './preferences.dto.js';
import { Preferences, PreferencesDocument } from './preferences.schema.js';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectModel(Preferences.name) private readonly prefs: Model<Preferences>,
  ) {}

  /** Crea las preferencias por defecto la primera vez que se piden. */
  private getOrCreate(userId: string): Promise<PreferencesDocument> {
    return this.prefs
      .findOneAndUpdate(
        { user: userId },
        { $setOnInsert: { user: userId } },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
      )
      .exec() as Promise<PreferencesDocument>;
  }

  async get(userId: string): Promise<PreferencesDto> {
    return this.toDto(await this.getOrCreate(userId));
  }

  async update(
    userId: string,
    dto: UpdatePreferencesDto,
  ): Promise<PreferencesDto> {
    const doc = await this.getOrCreate(userId);
    if (dto.groupBy !== undefined) doc.groupBy = dto.groupBy;
    if (dto.markWith !== undefined) doc.markWith = dto.markWith;
    if (dto.visibleTags !== undefined) doc.visibleTags = dto.visibleTags;
    return this.toDto(await doc.save());
  }

  async syncStatus(userId: string): Promise<SyncStatusDto> {
    return { lastSyncAt: (await this.getOrCreate(userId)).lastSyncAt };
  }

  /** Simulado: solo guarda la hora de la última sincronización. */
  async sync(userId: string): Promise<SyncStatusDto> {
    const doc = await this.getOrCreate(userId);
    doc.lastSyncAt = new Date();
    await doc.save();
    return { lastSyncAt: doc.lastSyncAt };
  }

  private toDto(d: PreferencesDocument): PreferencesDto {
    return {
      groupBy: d.groupBy,
      markWith: d.markWith,
      visibleTags: [...d.visibleTags],
    };
  }
}
