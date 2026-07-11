import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Kaban API')
    .setDescription(
      'This is the API documentation of Kaban task management application',
    )
    .setVersion('1.0')
    .addTag('Kaban')
    .addServer('http://localhost:3000', 'Development server')
    .addServer('https://api.kaban.com.ng', 'Production server')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setTermsOfService('https://kaban.com.ng/terms')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
