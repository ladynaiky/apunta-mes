import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import {
  CurrentUser,
  type AuthUser,
} from './decorators/current-user.decorator.js';
import { Public } from './decorators/public.decorator.js';
import { AuthResponseDto, UserDto } from './dto/auth-response.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Crear una cuenta (crea también las 7 asignaturas)',
  })
  @ApiCreatedResponse({ type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'VALIDATION_ERROR' })
  @ApiConflictResponse({
    description: 'EMAIL_TAKEN: el correo ya tiene cuenta',
  })
  register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.auth.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'VALIDATION_ERROR' })
  @ApiUnauthorizedResponse({ description: 'INVALID_CREDENTIALS' })
  login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.auth.login(dto);
  }

  /**
   * «Has oblidat la contrasenya?» (simulado: no se envía ningún correo).
   * Responde siempre lo mismo, exista o no la cuenta, para no revelar qué correos están registrados.
   */
  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Pedir el enlace para cambiar la contraseña (simulado)' })
  @ApiAcceptedResponse({ description: 'Siempre 202, exista o no la cuenta' })
  @ApiBadRequestResponse({ description: 'VALIDATION_ERROR' })
  forgotPassword(@Body() _dto: ForgotPasswordDto): { sent: true } {
    return { sent: true };
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Usuario de la sesión actual' })
  @ApiOkResponse({ type: UserDto })
  @ApiUnauthorizedResponse({
    description: 'UNAUTHORIZED: falta el token o ha caducado',
  })
  me(@CurrentUser() user: AuthUser): Promise<UserDto> {
    return this.auth.me(user.userId);
  }
}
