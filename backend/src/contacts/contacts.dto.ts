import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CONTACT_ROLES, type ContactDocument } from './contact.schema.js';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class ContactDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'Jordi (pare)' }) name: string;
  @ApiProperty({ example: 'jordi@exemple.cat' }) emailOrPhone: string;
  @ApiProperty({ enum: CONTACT_ROLES }) role: (typeof CONTACT_ROLES)[number];

  static from(c: ContactDocument): ContactDto {
    return {
      id: c.id as string,
      name: c.name,
      emailOrPhone: c.emailOrPhone,
      role: c.role,
    };
  }
}

/** name.required → «Escriu almenys el nom del contacte.» */
export class CreateContactDto {
  @ApiProperty({ example: 'Avi Joan' })
  @Transform(trim)
  @MaxLength(60, { message: 'name.maxLength' })
  @IsNotEmpty({ message: 'name.required' })
  @IsString({ message: 'name.required' })
  name: string;

  @ApiPropertyOptional({ example: 'nom@exemple.cat' })
  @IsOptional()
  @Transform(trim)
  @MaxLength(100, { message: 'emailOrPhone.maxLength' })
  @IsString({ message: 'emailOrPhone.invalid' })
  emailOrPhone?: string;

  @ApiPropertyOptional({ enum: CONTACT_ROLES })
  @IsOptional()
  @IsIn(CONTACT_ROLES, { message: 'role.invalid' })
  role?: (typeof CONTACT_ROLES)[number];
}

export class UpdateContactDto extends PartialType(CreateContactDto) {}
