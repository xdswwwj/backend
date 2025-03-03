import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import morgan from 'morgan';
import { WinstonModule } from 'nest-winston';
import { AuthModule } from './auth/auth.module';
import { ClubModule } from './club/club.module';
import { morganStream, winstonLogger } from './config/logger.config';
import { JwtMiddleware } from './middlewares/jwt.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
export interface User {
  id: number;
  userId: string;
  email: string;
  image: string;
  name: string;
  nickname: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

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
    ClubModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  constructor() {
    process.env.TZ = 'Asia/Seoul'; // ✅ NestJS 전체에서 Timezone을 KST로 설정
    console.log('🕒 NestJS 타임존 설정 완료:', process.env.TZ);
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(morgan('combined', { stream: morganStream })).forRoutes('*');
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/sighup', method: RequestMethod.POST },
        { path: 'auth/naver', method: RequestMethod.GET },
        { path: 'auth/naver/callback', method: RequestMethod.GET },
        { path: 'auth/google', method: RequestMethod.GET },
        { path: 'auth/google/redirect', method: RequestMethod.GET },
        { path: 'auth/kakao', method: RequestMethod.GET },
        { path: 'auth/kakao/redirect', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
