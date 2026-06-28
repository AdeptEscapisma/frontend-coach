import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AppConfiguration } from './common/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AppConfiguration, true>);

  const port = configService.get('port', { infer: true });
  const corsSettings = configService.get('cors', { infer: true });

  app.enableCors({
    origin: corsSettings.origin,
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(port);
}
void bootstrap();
