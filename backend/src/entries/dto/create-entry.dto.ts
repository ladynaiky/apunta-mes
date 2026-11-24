import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { TIME_RE } from '../../common/dates.js';
import { IsCalendarDate } from '../../common/is-calendar-date.js';
import {
  BIRTHDAY_RELATIONS,
  ENTRY_TYPES,
  EXAM_TYPES,
  PRIORITIES,
  REMINDER_DAYS,
  type EntryType,
} from '../entry.schema.js';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;
const isType =
  (...types: EntryType[]) =>
  (o: { type?: EntryType }) =>
    !!o.type && types.includes(o.type);
/** Campo con contenido (los vacíos de otros tipos de entrada se ignoran). */
const hasValue = (v: unknown) => v !== undefined && v !== null && v !== '';
/** Hora HH:mm o vacío. */
const TIME_OR_EMPTY = new RegExp(`^(${TIME_RE.source.slice(1, -1)})?$`);

export class ReminderDto {
  @ApiProperty({
    enum: REMINDER_DAYS,
    example: 1,
    description: '0 = el mateix dia',
  })
  @IsIn(REMINDER_DAYS, { message: 'reminder.daysBefore.invalid' })
  daysBefore: number;

  @ApiProperty({ example: '08:00' })
  @Matches(TIME_RE, { message: 'reminder.time.invalid' })
  time: string;
}

export class CheckItemDto {
  @ApiProperty({ example: 'Autorització signada' })
  @Transform(trim)
  @MaxLength(60, { message: 'whatToBring.name.maxLength' })
  @IsNotEmpty({ message: 'whatToBring.name.required' })
  @IsString({ message: 'whatToBring.name.required' })
  name: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean({ message: 'whatToBring.done.invalid' })
  done?: boolean;
}

/**
 * Lo que se apunta (Apuntar tasca / examen / excursió / aniversari).
 * Obligatorio según el tipo:
 *  - task: title, subject · exam: subject · trip: title · birthday: personName.
 * Si no llega title: examen → «Examen de <assignatura>», aniversari → el nombre.
 */
export class CreateEntryDto {
  @ApiProperty({ enum: ENTRY_TYPES })
  @IsIn(ENTRY_TYPES, { message: 'type.required' })
  type: EntryType;

  @ApiPropertyOptional({ example: 'Exercicis, pàg. 12' })
  @ValidateIf(
    (o: CreateEntryDto) => isType('task', 'trip')(o) || hasValue(o.title),
  )
  @Transform(trim)
  @MaxLength(120, { message: 'title.maxLength' })
  @IsNotEmpty({ message: 'title.required' })
  @IsString({ message: 'title.required' })
  title?: string;

  @ApiProperty({ example: '2026-11-04' })
  @IsCalendarDate({ message: 'date.invalid' })
  @IsNotEmpty({ message: 'date.required' })
  date: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(1000, { message: 'notes.maxLength' })
  @IsString({ message: 'notes.invalid' })
  notes?: string;

  @ApiPropertyOptional({ type: ReminderDto, nullable: true })
  @ValidateIf(
    (o: CreateEntryDto) => o.reminder !== null && o.reminder !== undefined,
  )
  @ValidateNested()
  @Type(() => ReminderDto)
  reminder?: ReminderDto | null;

  @ApiPropertyOptional({ enum: PRIORITIES, nullable: true })
  @ValidateIf(
    (o: CreateEntryDto) => o.priority !== null && o.priority !== undefined,
  )
  @IsIn(PRIORITIES, { message: 'priority.invalid' })
  priority?: (typeof PRIORITIES)[number] | null;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean({ message: 'shared.invalid' })
  shared?: boolean;

  @ApiPropertyOptional({
    description: 'Id de la asignatura (task y exam: obligatorio)',
  })
  @ValidateIf(
    (o: CreateEntryDto) =>
      isType('task', 'exam')(o) ||
      (o.subject !== null && o.subject !== undefined),
  )
  @IsMongoId({ message: 'subject.required' })
  subject?: string | null;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean({ message: 'done.invalid' })
  done?: boolean;

  // — task —
  @ApiPropertyOptional({ example: '12', description: 'Pàg.' })
  @IsOptional()
  @Transform(trim)
  @MaxLength(20, { message: 'page.maxLength' })
  @IsString({ message: 'page.invalid' })
  page?: string;

  // — exam —
  @ApiPropertyOptional({
    example: 'Fraccions i decimals',
    description: 'Examen de: tema o unitat',
  })
  @IsOptional()
  @Transform(trim)
  @MaxLength(120, { message: 'topic.maxLength' })
  @IsString({ message: 'topic.invalid' })
  topic?: string;

  @ApiPropertyOptional({ enum: EXAM_TYPES })
  @IsOptional()
  @IsIn(EXAM_TYPES, { message: 'examType.invalid' })
  examType?: (typeof EXAM_TYPES)[number];

  @ApiPropertyOptional({ description: 'Què he d’estudiar' })
  @IsOptional()
  @MaxLength(1000, { message: 'toStudy.maxLength' })
  @IsString({ message: 'toStudy.invalid' })
  toStudy?: string;

  // — trip —
  @ApiPropertyOptional({
    example: 'Museu d’Història de Catalunya',
    description: 'On anireu?',
  })
  @IsOptional()
  @Transform(trim)
  @MaxLength(120, { message: 'place.maxLength' })
  @IsString({ message: 'place.invalid' })
  place?: string;

  @ApiPropertyOptional({ example: '09:00' })
  @IsOptional()
  @Matches(TIME_OR_EMPTY, { message: 'departureTime.invalid' })
  departureTime?: string;

  @ApiPropertyOptional({ example: '17:00' })
  @IsOptional()
  @Matches(TIME_OR_EMPTY, { message: 'returnTime.invalid' })
  returnTime?: string;

  @ApiPropertyOptional({ type: [CheckItemDto], description: 'Què cal portar' })
  @IsOptional()
  @IsArray({ message: 'whatToBring.invalid' })
  @ArrayMaxSize(30, { message: 'whatToBring.maxSize' })
  @ValidateNested({ each: true })
  @Type(() => CheckItemDto)
  whatToBring?: CheckItemDto[];

  // — birthday —
  @ApiPropertyOptional({ example: 'l’Anna', description: 'Qui fa anys?' })
  @ValidateIf(
    (o: CreateEntryDto) => isType('birthday')(o) || hasValue(o.personName),
  )
  @Transform(trim)
  @MaxLength(60, { message: 'personName.maxLength' })
  @IsNotEmpty({ message: 'personName.required' })
  @IsString({ message: 'personName.required' })
  personName?: string;

  @ApiPropertyOptional({
    example: 12,
    nullable: true,
    description: 'Edat que fa aquell any',
  })
  @ValidateIf((o: CreateEntryDto) => o.age !== null && o.age !== undefined)
  @Min(0, { message: 'age.invalid' })
  @Max(120, { message: 'age.invalid' })
  @IsInt({ message: 'age.invalid' })
  age?: number | null;

  @ApiPropertyOptional({ enum: BIRTHDAY_RELATIONS })
  @IsOptional()
  @IsIn(BIRTHDAY_RELATIONS, { message: 'relation.invalid' })
  relation?: (typeof BIRTHDAY_RELATIONS)[number];

  @ApiPropertyOptional({ description: 'Idees de regal' })
  @IsOptional()
  @MaxLength(1000, { message: 'giftIdeas.maxLength' })
  @IsString({ message: 'giftIdeas.invalid' })
  giftIdeas?: string;
}
