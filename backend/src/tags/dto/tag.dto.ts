import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TAG_COLORS, type TagColor, type TagDocument } from '../tag.schema.js';

export class TagDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'Deures' }) name: string;
  @ApiProperty({ enum: TAG_COLORS, example: 'menta' }) color: TagColor;
  @ApiProperty() visible: boolean;

  static from(t: TagDocument): TagDto {
    return {
      id: t.id as string,
      name: t.name,
      color: t.color,
      visible: t.visible,
    };
  }
}

/** «Nova etiqueta»: nombre (máx. 20) y color. */
export class CreateTagDto {
  @ApiProperty({ example: 'Deures' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MaxLength(20, { message: 'name.maxLength' })
  @IsNotEmpty({ message: 'name.required' })
  @IsString({ message: 'name.required' })
  name: string;

  @ApiProperty({ enum: TAG_COLORS })
  @IsIn(TAG_COLORS, { message: 'color.required' })
  color: TagColor;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean({ message: 'visible.invalid' })
  visible?: boolean;
}

export class UpdateTagDto extends PartialType(CreateTagDto) {}
