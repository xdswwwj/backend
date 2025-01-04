import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import morgan from 'morgan';
import { WinstonModule } from 'nest-winston';
import { AuthModule } from './auth/auth.module';
import { morganStream, winstonLogger } from './config/logger.config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // 환경 변수 및 설정
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 로그 모듈
    WinstonModule.forRoot({
      instance: winstonLogger,
    }),
    // 데이터베이스 모듈
    PrismaModule,

    // 모듈
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(morgan('combined', { stream: morganStream })).forRoutes('*');
  }
}
