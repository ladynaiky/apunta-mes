import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument, UserRole } from './user.schema.js';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly users: Model<User>) {}

  findById(id: string | Types.ObjectId): Promise<UserDocument | null> {
    return this.users.findById(id).exec();
  }

  /** Incluye passwordHash (solo para comprobar la contraseña al iniciar sesión). */
  findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.users
      .findOne({ email: email.trim().toLowerCase() })
      .select('+passwordHash')
      .exec();
  }

  existsByEmail(email: string): Promise<boolean> {
    return this.users
      .exists({ email: email.trim().toLowerCase() })
      .then((r) => r !== null);
  }

  create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
  }): Promise<UserDocument> {
    return this.users.create(data);
  }

  async deleteById(id: string | Types.ObjectId): Promise<void> {
    await this.users.deleteOne({ _id: id }).exec();
  }
}
