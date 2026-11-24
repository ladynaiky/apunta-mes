import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SUBJECT_COLOR_TOKENS } from '../../subjects/default-subjects.js';
import {
  BIRTHDAY_RELATIONS,
  ENTRY_TYPES,
  EXAM_TYPES,
  PRIORITIES,
  type EntryType,
} from '../entry.schema.js';
import { CheckItemDto, ReminderDto } from './create-entry.dto.js';

export class SubjectSummaryDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'Mates' }) name: string;
  @ApiProperty({ enum: SUBJECT_COLOR_TOKENS }) colorToken: string;
  @ApiProperty({ example: '#1F4FB8' }) colorHex: string;
}

export class EntryDto {
  @ApiProperty() id: string;
  @ApiProperty({ enum: ENTRY_TYPES }) type: EntryType;
  @ApiProperty({ example: 'Exercicis, pàg. 12' }) title: string;
  @ApiProperty({
    example: '2026-11-04',
    description: 'Aniversaris: en las búsquedas por fechas, el día de ese año',
  })
  date: string;
  @ApiProperty() notes: string;
  @ApiProperty({ type: ReminderDto, nullable: true })
  reminder: ReminderDto | null;
  @ApiProperty({ enum: PRIORITIES, nullable: true }) priority: 'high' | null;
  @ApiProperty() shared: boolean;
  @ApiProperty({ type: SubjectSummaryDto, nullable: true })
  subject: SubjectSummaryDto | null;
  @ApiProperty() done: boolean;
  @ApiProperty({ nullable: true }) doneAt: Date | null;
  @ApiProperty() page: string;
  @ApiProperty() activity: string;
  @ApiProperty() topic: string;
  @ApiProperty({ enum: EXAM_TYPES, nullable: true }) examType: string | null;
  @ApiProperty() toStudy: string;
  @ApiProperty() place: string;
  @ApiProperty() departureTime: string;
  @ApiProperty() returnTime: string;
  @ApiProperty({ type: [CheckItemDto] }) whatToBring: {
    name: string;
    done: boolean;
  }[];
  @ApiProperty() personName: string;
  @ApiProperty({ nullable: true }) age: number | null;
  @ApiProperty({ enum: BIRTHDAY_RELATIONS, nullable: true }) relation:
    string | null;
  @ApiProperty() giftIdeas: string;
  @ApiProperty() createdAt: Date;
}

export class ReminderEntryDto extends EntryDto {
  @ApiPropertyOptional({
    example: 0,
    description: 'Días que faltan (0 = acaba avui)',
  })
  daysLeft: number;
}

export class CalendarDotDto {
  @ApiProperty({ enum: ENTRY_TYPES }) type: EntryType;
  @ApiProperty({ nullable: true, example: 'Mates' }) subjectName: string | null;
  @ApiProperty({ nullable: true, example: 'blau' }) colorToken: string | null;
  @ApiProperty({ nullable: true, example: '#1F4FB8' }) colorHex: string | null;
}

export class CalendarDayDto {
  @ApiProperty({ example: '2026-11-04' }) date: string;
  @ApiProperty({ example: 3 }) count: number;
  @ApiProperty({
    type: [CalendarDotDto],
    description: 'Un punto por cosa apuntada',
  })
  dots: CalendarDotDto[];
}
