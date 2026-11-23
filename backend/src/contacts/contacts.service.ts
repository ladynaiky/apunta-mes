import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { notFound } from '../common/errors.js';
import { Contact, ContactDocument } from './contact.schema.js';
import type { CreateContactDto, UpdateContactDto } from './contacts.dto.js';

const defined = <T extends object>(o: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(o).filter(([, v]) => v !== undefined),
  ) as Partial<T>;

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name) private readonly contacts: Model<Contact>,
  ) {}

  list(userId: string): Promise<ContactDocument[]> {
    return this.contacts
      .find({ user: userId })
      .sort({ createdAt: 1, _id: 1 })
      .exec();
  }

  create(userId: string, dto: CreateContactDto): Promise<ContactDocument> {
    return this.contacts.create({ ...defined(dto), user: userId });
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateContactDto,
  ): Promise<ContactDocument> {
    const doc = await this.contacts
      .findOneAndUpdate({ _id: id, user: userId }, defined(dto), {
        returnDocument: 'after',
        runValidators: true,
      })
      .exec();
    if (!doc) throw notFound();
    return doc;
  }

  async remove(userId: string, id: string): Promise<void> {
    const res = await this.contacts.deleteOne({ _id: id, user: userId }).exec();
    if (res.deletedCount === 0) throw notFound();
  }
}
