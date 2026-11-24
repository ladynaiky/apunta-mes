import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/** email.required → «Escriu el correu electrònic.» · email.invalid → «Format de correu no vàlid…» */
export class ForgotPasswordDto {
  @ApiProperty({ example: 'demo@apunta.cat' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'email.invalid' })
  @IsNotEmpty({ message: 'email.required' })
  @IsString({ message: 'email.required' })
  email: string;
}
