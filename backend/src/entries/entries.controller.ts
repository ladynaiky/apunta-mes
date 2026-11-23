import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  type AuthUser,
} from '../auth/decorators/current-user.decorator.js';
import { ParseObjectIdPipe } from '../common/parse-object-id.pipe.js';
import { DemoState } from '../demo/demo-state.decorator.js';
import { CreateEntryDto } from './dto/create-entry.dto.js';
import { CalendarDayDto, EntryDto, ReminderEntryDto } from './dto/entry.dto.js';
import {
  CalendarQueryDto,
  EntryQueryDto,
  HistoryQueryDto,
  SetDoneDto,
} from './dto/entry-query.dto.js';
import { UpdateEntryDto } from './dto/update-entry.dto.js';
import { EntriesService } from './entries.service.js';
import { DayParamDto } from './dto/day-param.dto.js';

@ApiTags('entries')
@ApiBearerAuth()
@Controller()
export class EntriesController {
  constructor(private readonly entries: EntriesService) {}

  // Las rutas fijas van antes de entries/:id.

  @Get('entries/today')
  @DemoState()
  @ApiOperation({ summary: 'Lo de hoy (fecha de /config)' })
  @ApiOkResponse({ type: [EntryDto] })
  today(@CurrentUser() user: AuthUser) {
    return this.entries.today(user.userId);
  }

  @Get('entries/week')
  @DemoState()
  @ApiOperation({ summary: 'Esta semana, de dilluns a diumenge' })
  @ApiOkResponse({ type: [EntryDto] })
  week(@CurrentUser() user: AuthUser) {
    return this.entries.week(user.userId);
  }

  @Get('entries/day/:date')
  @DemoState()
  @ApiOperation({ summary: 'Un día concreto (Tasques del dia)' })
  @ApiOkResponse({ type: [EntryDto] })
  day(@CurrentUser() user: AuthUser, @Param() params: DayParamDto) {
    return this.entries.day(user.userId, params.date);
  }

  @Get('entries/history')
  @DemoState()
  @ApiOperation({ summary: 'Historial: tareas hechas (filtro por año y mes)' })
  @ApiOkResponse({ type: [EntryDto] })
  history(@CurrentUser() user: AuthUser, @Query() q: HistoryQueryDto) {
    return this.entries.history(user.userId, q.year, q.month);
  }

  @Get('entries')
  @DemoState()
  @ApiOperation({ summary: 'Buscar/Filtrar' })
  @ApiOkResponse({ type: [EntryDto] })
  list(@CurrentUser() user: AuthUser, @Query() q: EntryQueryDto) {
    return this.entries.list(user.userId, q);
  }

  @Post('entries')
  @ApiOperation({ summary: 'Apuntar (tasca, examen, excursió o aniversari)' })
  @ApiCreatedResponse({ type: EntryDto })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateEntryDto) {
    return this.entries.create(user.userId, dto);
  }

  @Get('entries/:id')
  @ApiOperation({ summary: 'Detalle' })
  @ApiOkResponse({ type: EntryDto })
  @ApiNotFoundResponse({ description: 'NOT_FOUND' })
  get(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.entries.get(user.userId, id);
  }

  @Patch('entries/:id')
  @ApiOperation({ summary: 'Editar' })
  @ApiOkResponse({ type: EntryDto })
  @ApiNotFoundResponse({ description: 'NOT_FOUND' })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateEntryDto,
  ) {
    return this.entries.update(user.userId, id, dto);
  }

  @Patch('entries/:id/done')
  @ApiOperation({ summary: 'Marcar com a feta / desmarcar' })
  @ApiOkResponse({ type: EntryDto })
  setDone(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: SetDoneDto,
  ) {
    return this.entries.setDone(user.userId, id, dto.done);
  }

  @Delete('entries/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Esborrar' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'NOT_FOUND' })
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.entries.remove(user.userId, id);
  }

  @Get('calendar')
  @DemoState()
  @ApiTags('calendar')
  @ApiOperation({ summary: 'Puntos del calendario de un mes' })
  @ApiOkResponse({ type: [CalendarDayDto] })
  calendar(@CurrentUser() user: AuthUser, @Query() q: CalendarQueryDto) {
    return this.entries.calendar(user.userId, q.month);
  }

  @Get('reminders')
  @DemoState()
  @ApiTags('calendar')
  @ApiOperation({ summary: 'Avís de pendents' })
  @ApiOkResponse({ type: [ReminderEntryDto] })
  reminders(@CurrentUser() user: AuthUser) {
    return this.entries.reminders(user.userId);
  }
}
