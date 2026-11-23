import { ApiProperty } from '@nestjs/swagger';
import {
  USER_ROLES,
  type UserRole,
  type UserDocument,
} from '../../users/user.schema.js';

export class UserDto {
  @ApiProperty({ example: '6740a1b2c3d4e5f6a7b8c9d0' })
  id: string;

  @ApiProperty({ example: 'Laia' })
  name: string;

  @ApiProperty({ example: 'laia@exemple.cat' })
  email: string;

  @ApiProperty({ enum: USER_ROLES })
  role: UserRole;

  @ApiProperty()
  createdAt: Date;

  static from(user: UserDocument): UserDto {
    return {
      id: user.id as string,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT para la cabecera Authorization: Bearer …' })
  accessToken: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}
