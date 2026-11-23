import { Controller, ForbiddenException, HttpCode, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  type AuthUser,
} from '../auth/decorators/current-user.decorator.js';
import { notFound } from '../common/errors.js';
import { AppConfigService } from '../config/app-config.service.js';
import { UsersService } from '../users/users.service.js';
import { DemoSeedService } from './demo-seed.service.js';

@ApiTags('demo')
@ApiBearerAuth()
@Controller('demo')
export class DemoController {
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly users: UsersService,
    private readonly seed: DemoSeedService,
  ) {}

  /**
   * Vuelve a dejar los datos de la demo como al principio.
   * Solo con DEMO_MODE=true y solo para el usuario de demo.
   */
  @Post('reset')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reiniciar los datos de la demo (solo modo demo)' })
  @ApiOkResponse({ description: 'Resumen de lo que se ha creado' })
  @ApiForbiddenResponse({ description: 'DEMO_ONLY: solo el usuario de demo' })
  async reset(@CurrentUser() current: AuthUser) {
    const { demoMode, demoUserEmail, demoUserPassword } = this.appConfig;
    if (!demoMode || !demoUserEmail || !demoUserPassword) throw notFound();

    const user = await this.users.findById(current.userId);
    if (user?.email !== demoUserEmail.trim().toLowerCase()) {
      throw new ForbiddenException({ statusCode: 403, code: 'DEMO_ONLY' });
    }
    return this.seed.reset(demoUserEmail, demoUserPassword);
  }
}
