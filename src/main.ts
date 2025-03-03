import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './pipes/validation.pipe';

async function bootstrap() {
  console.log('🚀 서버 부팅 시작'); // 여기가 찍히는지 확인

  const app = await NestFactory.create(AppModule);
  console.log('✅ NestJS 애플리케이션 생성 완료');

  const whitelist = ['http://localhost:5173', 'https://sanirang.kr', 'https://www.sanirang.kr'];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        console.log('🚨 CORS 차단됨:', origin); // CORS에서 차단된 경우 확인
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  console.log('🛠 ValidationPipe 설정 완료');

  const config = new DocumentBuilder()
    .setTitle('API 문서')
    .setDescription('API에 대한 설명')
    .setVersion('1.0')
    .addTag('Users')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  console.log('📄 Swagger 문서 설정 완료');

  app.useGlobalFilters(new HttpExceptionFilter());
  console.log('🚨 HttpExceptionFilter 등록 완료');

  const now = new Date();
  console.log('now >>', now);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 서버가 실행 중입니다! PORT: ${process.env.PORT ?? 3000}`);
}
bootstrap();
