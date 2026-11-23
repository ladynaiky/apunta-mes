import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import {
  SUBJECT_COLOR_TOKENS,
  type SubjectColorToken,
} from '../default-subjects.js';
import type { SubjectDocument } from '../subject.schema.js';

export class SubjectDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'Mates' }) name: string;
  @ApiProperty({ enum: SUBJECT_COLOR_TOKENS, example: 'blau' })
  colorToken: SubjectColorToken;
  @ApiProperty({ example: '#1F4FB8' }) colorHex: string;

  static from(s: SubjectDocument): SubjectDto {
    return {
      id: s.id as string,
      name: s.name,
      colorToken: s.colorToken,
      colorHex: s.colorHex,
    };
  }
}

/** «Crear nova assignatura»: nombre y color del selector. */
export class CreateSubjectDto {
  @ApiProperty({ example: 'Tecnologia' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MaxLength(30, { message: 'name.maxLength' })
  @IsNotEmpty({ message: 'name.required' })
  @IsString({ message: 'name.required' })
  name: string;

  @ApiProperty({ enum: SUBJECT_COLOR_TOKENS })
  @IsIn(SUBJECT_COLOR_TOKENS, { message: 'colorToken.required' })
  colorToken: SubjectColorToken;
}

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {}
