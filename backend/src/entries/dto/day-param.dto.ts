import { ApiProperty } from '@nestjs/swagger';
import { IsCalendarDate } from '../../common/is-calendar-date.js';

export class DayParamDto {
  @ApiProperty({ example: '2026-11-04' })
  @IsCalendarDate({ message: 'date.invalid' })
  date: string;
}
