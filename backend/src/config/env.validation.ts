import { plainToInstance } from 'class-transformer';
import {
  IsBooleanString,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  validateSync,
} from 'class-validator';

/**
 * Variables de entorno. Se validan al arrancar: si falta algo o tiene mal
 * formato, la app no arranca y dice qué variable revisar.
 * JWT_SECRET pasará a ser obligatoria en el paso 4.
 */
class EnvironmentVariables {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT?: number;

  @Matches(/^mongodb(\+srv)?:\/\/.+/, {
    message:
      'MONGODB_URI és obligatòria i ha de començar per mongodb:// o mongodb+srv:// (copia-la des d’Atlas)',
  })
  MONGODB_URI: string;

  @IsOptional()
  @IsString()
  JWT_SECRET?: string;

  @IsOptional()
  @IsString()
  JWT_EXPIRES_IN?: string;

  @IsOptional()
  @IsString()
  CORS_ORIGINS?: string;

  @IsOptional()
  @IsBooleanString()
  DEMO_MODE?: string;

  @IsOptional()
  @Matches(/^(\d{4}-\d{2}-\d{2})?$/, {
    message: 'DEMO_TODAY ha de tenir el format AAAA-MM-DD o estar buida',
  })
  DEMO_TODAY?: string;

  @IsOptional()
  @IsString()
  DEMO_USER_EMAIL?: string;

  @IsOptional()
  @IsString()
  DEMO_USER_PASSWORD?: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length > 0) {
    const detail = errors
      .map(
        (e) =>
          `${e.property}: ${Object.values(e.constraints ?? {}).join(', ')}`,
      )
      .join('\n');
    throw new Error(`Variables d'entorn no vàlides:\n${detail}`);
  }
  return validated;
}
