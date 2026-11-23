import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createValidationPipe } from './common/validation.js';
import { AppConfigService } from './config/app-config.service.js';

/** Configuración común de la app (la usan main.ts y los tests e2e). */
export function setupApp(app: INestApplication): void {
  const appConfig = app.get(AppConfigService);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: appConfig.corsOrigins,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Demo-State'],
  });
  app.useGlobalPipes(createValidationPipe());

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Apunta+ API')
      .setDescription('API de la agenda escolar Apunta+')
      .setVersion('0.1.0')
      .addBearerAuth()
      .build(),
  );
  SwaggerModule.setup('api/docs', app, document);
}
