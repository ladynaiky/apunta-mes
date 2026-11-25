import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppConfigService } from '../config/app-config.service.js';
import { Preferences } from '../preferences/preferences.schema.js';
import { User } from '../users/user.schema.js';
import { DemoSeedService } from './demo-seed.service.js';

const CHECK_EVERY_MS = 30 * 60 * 1000;

/**
 * Modo demo: los datos del usuario de demo están pensados para «hoy».
 * Al arrancar y cada 30 minutos se mira si se crearon otro día; si es así, se reinician.
 * (Lo que se haya apuntado ese mismo día se conserva hasta el día siguiente.)
 */
@Injectable()
export class DemoDailyResetService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private readonly logger = new Logger(DemoDailyResetService.name);
  private timer: NodeJS.Timeout | null = null;
  private running = false;

  constructor(
    private readonly appConfig: AppConfigService,
    private readonly seed: DemoSeedService,
    @InjectModel(User.name) private readonly users: Model<User>,
    @InjectModel(Preferences.name) private readonly prefs: Model<Preferences>,
  ) {}

  onApplicationBootstrap(): void {
    if (!this.appConfig.demoDailyReset) return;
    if (!this.appConfig.demoUserEmail || !this.appConfig.demoUserPassword)
      return;
    void this.check();
    this.timer = setInterval(() => void this.check(), CHECK_EVERY_MS);
    this.timer.unref();
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  /** Reinicia si los datos de demo no son de hoy. Devuelve si ha reiniciado. */
  async check(): Promise<boolean> {
    if (this.running) return false;
    this.running = true;
    try {
      const email = this.appConfig.demoUserEmail.trim().toLowerCase();
      const user = await this.users.findOne({ email }).lean().exec();
      const prefs = user
        ? await this.prefs.findOne({ user: user._id }).lean().exec()
        : null;
      if (prefs?.demoSeededOn === this.appConfig.today) return false;
      await this.seed.reset(email, this.appConfig.demoUserPassword);
      this.logger.log(`Datos de demo reiniciados para el ${this.appConfig.today}`);
      return true;
    } catch (err) {
      this.logger.error(`No se han podido reiniciar los datos de demo: ${String(err)}`);
      return false;
    } finally {
      this.running = false;
    }
  }
}
