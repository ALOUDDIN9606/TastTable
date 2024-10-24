import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const PORT = process.env.PORT || 3001;
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
