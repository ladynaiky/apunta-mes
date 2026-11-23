import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigService } from '../config/app-config.service.js';

/** Conexión a MongoDB Atlas con la URI de MONGODB_URI. */
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (appConfig: AppConfigService) => ({
        uri: appConfig.mongoUri,
        retryAttempts: 3,
        retryDelay: 2000,
        serverSelectionTimeoutMS: 10000,
      }),
    }),
  ],
})
export class DatabaseModule {}
