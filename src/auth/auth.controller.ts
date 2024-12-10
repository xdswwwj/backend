import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Google OAuth 페이지로 리다이렉트
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(@Req() req) {
    const jwt = this.authService.generateJwt(req.user);
    // Google로 부터 사용자 정보 반환
    return {
      message: 'Google login successful',
      user: req.user,
      token: jwt,
    };
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    // 리다이렉트는 Passport가 처리
  }

  @Get('kakao/redirect')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginRedirect(@Req() req) {
    const user = req.user;
    const jwt = this.authService.generateJwt(req.user);

    return {
      message: 'Kakao login successful',
      user,
      token: jwt,
    };
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.signUp(createUserDto);
    return {
      message: '회원가입 성공',
      user,
    };
  }
}
