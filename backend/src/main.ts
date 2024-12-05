import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { CustomValidationPipe } from './pipes/CustomValidationPipe';
import { AllExceptionsFilter } from './utility/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

const dotenv = require('dotenv');
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new CustomValidationPipe());

  // global error handler
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  //

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Strips properties that are not in the DTO
      forbidNonWhitelisted: true, // Throws an error if extra properties are provided
    }),
  );

  // Increase the payload size limit
  app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit as needed
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
