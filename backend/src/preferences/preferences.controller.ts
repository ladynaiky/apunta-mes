import { Body, Controller, Get, HttpCode, Post, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  type AuthUser,
} from '../auth/decorators/current-user.decorator.js';
import {
  PreferencesDto,
  SyncStatusDto,
  UpdatePreferencesDto,
} from './preferences.dto.js';
import { PreferencesService } from './preferences.service.js';

@ApiTags('mock: preferences & sync')
@ApiBearerAuth()
@Controller()
export class PreferencesController {
  constructor(private readonly prefs: PreferencesService) {}

  @Get('preferences')
  @ApiOperation({ summary: 'Personalització' })
  @ApiOkResponse({ type: PreferencesDto })
  get(@CurrentUser() user: AuthUser) {
    return this.prefs.get(user.userId);
  }

  @Put('preferences')
  @ApiOperation({ summary: 'Desar la personalització' })
  @ApiOkResponse({ type: PreferencesDto })
  update(@CurrentUser() user: AuthUser, @Body() dto: UpdatePreferencesDto) {
    return this.prefs.update(user.userId, dto);
  }

  @Get('sync')
  @ApiOperation({ summary: 'Sincronitzar: estado (simulado)' })
  @ApiOkResponse({ type: SyncStatusDto })
  status(@CurrentUser() user: AuthUser) {
    return this.prefs.syncStatus(user.userId);
  }

  @Post('sync')
  @HttpCode(200)
  @ApiOperation({ summary: 'Sincronitzar ara (simulado)' })
  @ApiOkResponse({ type: SyncStatusDto })
  sync(@CurrentUser() user: AuthUser) {
    return this.prefs.sync(user.userId);
  }
}
