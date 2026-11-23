import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { USER_ROLES, type UserRole } from '../../users/user.schema.js';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;
const trimLower = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

/**
 * class-validator ejecuta los decoradores de abajo arriba: el más cercano a la
 * propiedad (obligatorio) va primero y, con stopAtFirstError, gana.
 * Los mensajes son códigos; el frontend los traduce a los textos del diseño:
 * name.required → «Escriu el teu nom.» · email.invalid → «Format de correu no vàlid (ex.: nom@exemple.cat).»
 * password.minLength → «Ha de tenir almenys 8 caràcters.» · role.required → «Tria un rol.»
 */
export class RegisterDto {
  @ApiProperty({ example: 'Laia' })
  @Transform(trim)
  @MaxLength(60, { message: 'name.maxLength' })
  @IsNotEmpty({ message: 'name.required' })
  @IsString({ message: 'name.required' })
  name: string;

  @ApiProperty({ enum: USER_ROLES, example: 'student' })
  @IsIn(USER_ROLES, { message: 'role.required' })
  role: UserRole;

  @ApiProperty({ example: 'laia@exemple.cat' })
  @Transform(trimLower)
  @IsEmail({}, { message: 'email.invalid' })
  @IsNotEmpty({ message: 'email.required' })
  @IsString({ message: 'email.required' })
  email: string;

  /** Máximo 72: bcrypt ignora lo que va a partir del carácter 72. */
  @ApiProperty({ example: 'contrasenya1', minLength: 8 })
  @MaxLength(72, { message: 'password.maxLength' })
  @MinLength(8, { message: 'password.minLength' })
  @IsString({ message: 'password.minLength' })
  password: string;
}
