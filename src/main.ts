import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const config = new DocumentBuilder()
    .setTitle('API 문서')
    .setDescription('API에 대한 설명')
    .setVersion('1.0')
    .addTag('Users') // 태그 추가 (옵션)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI 경로 설정 (/api)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
