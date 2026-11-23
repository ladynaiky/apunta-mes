import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { AppConfigService } from './config/app-config.service.js';
import { setupApp } from './setup-app.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupApp(app);
  const port = app.get(AppConfigService).port;
  await app.listen(port);
  console.log(
    `API: http://localhost:${port}/api · Swagger: http://localhost:${port}/api/docs`,
  );
}
await bootstrap();
