import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { MONTH_RE } from '../../common/dates.js';
import { IsCalendarDate } from '../../common/is-calendar-date.js';
import { ENTRY_TYPES, type EntryType } from '../entry.schema.js';

const toBool = ({ value }: { value: unknown }) =>
  value === 'true' ? true : value === 'false' ? false : value;

/** Buscar/Filtrar: por nombre, asignatura, tipo, fechas y estado. */
export class EntryQueryDto {
  @ApiPropertyOptional({ enum: ENTRY_TYPES })
  @IsOptional()
  @IsIn(ENTRY_TYPES, { message: 'type.invalid' })
  type?: EntryType;

  @ApiPropertyOptional({ example: '2026-11-01' })
  @IsOptional()
  @IsCalendarDate({ message: 'from.invalid' })
  from?: string;

  @ApiPropertyOptional({ example: '2026-11-30' })
  @IsOptional()
  @IsCalendarDate({ message: 'to.invalid' })
  to?: string;

  @ApiPropertyOptional({ description: 'Id de la asignatura' })
  @IsOptional()
  @IsMongoId({ message: 'subject.invalid' })
  subject?: string;

  @ApiPropertyOptional({
    description: 'Texto a buscar en el nombre (y en la asignatura)',
  })
  @IsOptional()
  @MaxLength(100, { message: 'q.maxLength' })
  @IsString({ message: 'q.invalid' })
  q?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @Transform(toBool)
  @IsBoolean({ message: 'done.invalid' })
  done?: boolean;

  @ApiPropertyOptional({ type: Boolean, description: 'Solo las compartidas (El meu espai · Compartir)' })
  @IsOptional()
  @Transform(toBool)
  @IsBoolean({ message: 'shared.invalid' })
  shared?: boolean;
}

export class HistoryQueryDto {
  @ApiPropertyOptional({ example: 2026 })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value === undefined ? value : Number(value),
  )
  @Min(2000, { message: 'year.invalid' })
  @Max(2100, { message: 'year.invalid' })
  @IsInt({ message: 'year.invalid' })
  year?: number;

  @ApiPropertyOptional({
    example: 11,
    description: '1 = gener … 12 = desembre',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value === undefined ? value : Number(value),
  )
  @Min(1, { message: 'month.invalid' })
  @Max(12, { message: 'month.invalid' })
  @IsInt({ message: 'month.invalid' })
  month?: number;
}

export class CalendarQueryDto {
  @ApiPropertyOptional({
    example: '2026-11',
    description: 'Mes AAAA-MM (por defecto, el de hoy)',
  })
  @IsOptional()
  @Matches(MONTH_RE, { message: 'month.invalid' })
  month?: string;
}

export class SetDoneDto {
  @ApiPropertyOptional({ example: true })
  @IsBoolean({ message: 'done.required' })
  done: boolean;
}
