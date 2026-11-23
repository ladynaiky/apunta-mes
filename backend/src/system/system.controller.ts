import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppConfigService } from '../config/app-config.service.js';
import { AppConfigDto, HealthDto } from './system.dto.js';

@ApiTags('system')
@Controller()
export class SystemController {
  constructor(private readonly appConfig: AppConfigService) {}

  @Get('health')
  @ApiOperation({ summary: 'Comprueba que la API responde' })
  @ApiOkResponse({ type: HealthDto })
  health(): HealthDto {
    return { status: 'ok' };
  }

  @Get('config')
  @ApiOperation({ summary: 'Configuración pública: fecha de hoy y modo demo' })
  @ApiOkResponse({ type: AppConfigDto })
  config(): AppConfigDto {
    return {
      today: this.appConfig.today,
      timeZone: this.appConfig.timeZone,
      demoMode: this.appConfig.demoMode,
    };
  }
}
