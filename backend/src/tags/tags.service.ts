import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { conflict, notFound } from '../common/errors.js';
import { Entry } from '../entries/entry.schema.js';
import type { CreateTagDto, UpdateTagDto } from './dto/tag.dto.js';
import { Tag, TagDocument } from './tag.schema.js';

const isDuplicate = (err: unknown) => (err as { code?: number }).code === 11000;

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private readonly tags: Model<Tag>,
    @InjectModel(Entry.name) private readonly entries: Model<Entry>,
  ) {}

  findByUser(userId: Types.ObjectId | string): Promise<TagDocument[]> {
    return this.tags
      .find({ user: userId })
      .sort({ createdAt: 1, _id: 1 })
      .exec();
  }

  async findOwned(userId: string, id: string): Promise<TagDocument> {
    const tag = await this.tags.findOne({ _id: id, user: userId }).exec();
    if (!tag) throw notFound();
    return tag;
  }

  async create(userId: string, dto: CreateTagDto): Promise<TagDocument> {
    try {
      return await this.tags.create({
        user: userId,
        name: dto.name,
        color: dto.color,
        visible: dto.visible ?? true,
      });
    } catch (err) {
      if (isDuplicate(err)) throw conflict('TAG_EXISTS');
      throw err;
    }
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateTagDto,
  ): Promise<TagDocument> {
    const tag = await this.findOwned(userId, id);
    if (dto.name !== undefined) tag.name = dto.name;
    if (dto.color !== undefined) tag.color = dto.color;
    if (dto.visible !== undefined) tag.visible = dto.visible;
    try {
      return await tag.save();
    } catch (err) {
      if (isDuplicate(err)) throw conflict('TAG_EXISTS');
      throw err;
    }
  }

  /** Al borrarla, desaparece también de las tareas que la tenían. */
  async remove(userId: string, id: string): Promise<void> {
    const tag = await this.findOwned(userId, id);
    await this.entries
      .updateMany({ user: userId }, { $pull: { tags: tag._id } })
      .exec();
    await tag.deleteOne();
  }

  async deleteByUser(userId: Types.ObjectId | string): Promise<void> {
    await this.tags.deleteMany({ user: userId }).exec();
  }
}
