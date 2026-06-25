import {
  BadRequestException,
  ConsoleLogger,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/exception.filter';
import { logger } from './logger.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'core',
      timestamp: true,
    }),
  });

  app.use(logger);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Innogram core microservice')
    .setDescription('The Innogram core microservice API')
    .setVersion('0.1')
    .addTag('core')
    .addBearerAuth()
    .addCookieAuth('accessToken')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const messages = validationErrors.flatMap((error) =>
          Object.values(error.constraints || {}),
        );
        return new BadRequestException(messages);
      },
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new PrismaClientExceptionFilter(httpAdapter),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders:
      'Content-Type, Authorization, Accept, Origin, X-Requested-With',
    exposedHeaders: 'Cross-Origin-Resource-Policy',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`Core microservice is running on port: ${port}`, 'Bootstrap');
}
bootstrap().catch(console.error);
