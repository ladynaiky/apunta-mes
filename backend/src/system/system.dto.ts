import { ApiProperty } from '@nestjs/swagger';

export class HealthDto {
  @ApiProperty({ example: 'ok', enum: ['ok', 'error'] })
  status: 'ok' | 'error';

  @ApiProperty({ example: 'up', enum: ['up', 'down'] })
  database: 'up' | 'down';
}

export class AppConfigDto {
  @ApiProperty({
    example: '2026-11-04',
    description: 'Fecha «de hoy» (DEMO_TODAY o la fecha real)',
  })
  today: string;

  @ApiProperty({ example: 'Europe/Madrid' })
  timeZone: string;

  @ApiProperty({ example: true, description: 'Modo demo activo' })
  demoMode: boolean;
}
