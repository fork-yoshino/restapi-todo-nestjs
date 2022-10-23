import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Request } from 'express';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:8080'],
  });
  app.use(cookieParser());
  // CSRF
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        // TODO: 本番環境ではtrueに設定
        secure: true,
        sameSite: 'none',
      },
      value: (req: Request) => {
        return req.header('csrf-token');
      },
    }),
  );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
