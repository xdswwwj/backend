import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { NaverStrategy } from './strategies/naver.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRESIN || '1h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, KakaoStrategy, JwtStrategy, NaverStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
