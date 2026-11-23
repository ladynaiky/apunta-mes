import { Body, Controller, Module, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsMongoId,
  IsOptional,
} from 'class-validator';
import { randomInt } from 'node:crypto';

/** «Tipus de contingut» en Compartir. */
export const SHARE_SCOPES = ['calendar', 'tasks', 'exams', 'trips'] as const;
const ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789'; // sin 0/o ni 1/l, que se confunden
const BASE_URL = 'https://apunta.app/c/';

export class CreateShareLinkDto {
  @ApiProperty({ enum: SHARE_SCOPES })
  @IsIn(SHARE_SCOPES, { message: 'scope.required' })
  scope: (typeof SHARE_SCOPES)[number];

  @ApiPropertyOptional({
    type: [String],
    description: 'Contactos elegidos (simulado)',
  })
  @IsOptional()
  @IsMongoId({ each: true, message: 'contactIds.invalid' })
  @ArrayMaxSize(50, { message: 'contactIds.maxSize' })
  @IsArray({ message: 'contactIds.invalid' })
  contactIds?: string[];
}

export class ShareLinkDto {
  @ApiProperty({ example: 'https://apunta.app/c/k7m2p9qa' }) url: string;
  @ApiProperty({ enum: SHARE_SCOPES }) scope: (typeof SHARE_SCOPES)[number];
}

/** Generar enllaç: simulado, el enlace no se guarda ni lleva a ningún sitio. */
@ApiTags('mock: share-links')
@ApiBearerAuth()
@Controller('share-links')
export class ShareLinksController {
  @Post()
  @ApiOperation({ summary: 'Generar l’enllaç (simulado)' })
  @ApiCreatedResponse({ type: ShareLinkDto })
  create(@Body() dto: CreateShareLinkDto): ShareLinkDto {
    const code = Array.from(
      { length: 8 },
      () => ALPHABET[randomInt(ALPHABET.length)],
    ).join('');
    return { url: BASE_URL + code, scope: dto.scope };
  }
}

@Module({ controllers: [ShareLinksController] })
export class ShareLinksModule {}
