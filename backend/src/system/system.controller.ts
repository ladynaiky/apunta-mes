import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Connection } from 'mongoose';
import { AppConfigService } from '../config/app-config.service.js';
import { AppConfigDto, HealthDto } from './system.dto.js';

/** readyState 1 = conectado (Mongoose). */
const CONNECTED = 1;

@ApiTags('system')
@Controller()
export class SystemController {
  constructor(
    private readonly appConfig: AppConfigService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get('health')
  @ApiOperation({
    summary: 'Comprueba que la API y la base de datos responden',
  })
  @ApiOkResponse({ type: HealthDto })
  @ApiServiceUnavailableResponse({
    description: 'La base de datos no responde',
  })
  health(): HealthDto {
    if (this.connection.readyState !== CONNECTED) {
      throw new ServiceUnavailableException({
        statusCode: 503,
        code: 'DATABASE_DOWN',
        status: 'error',
        database: 'down',
      });
    }
    return { status: 'ok', database: 'up' };
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
