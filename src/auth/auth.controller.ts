import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { FRONT_BASE_URL } from 'src/config/global.config';
import { createErrorResponse, createSuccessResponse } from 'src/helpers/apiResponse.helper';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  // 네이버 로그인 시작
  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverLogin(): Promise<void> {
    // Passport가 자동으로 네이버 로그인 페이지로 리다이렉션
  }

  // 네이버 로그인 콜백
  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverLoginCallback(@Req() req): Promise<any> {
    try {
      const { provider, providerId, name, image } = req.user;
      const accessToken = await this.authService.handleSocialLogin({
        provider,
        providerId,
        name,
        image,
      });

      return createSuccessResponse({
        accessToken,
      });
    } catch (error) {
      return createErrorResponse(error);
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Google OAuth 페이지로 리다이렉트
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(@Req() req) {
    try {
      const { provider, providerId, name, image } = req.user;
      const accessToken = await this.authService.handleSocialLogin({
        provider,
        providerId,
        name,
        image,
      });

      return createSuccessResponse({
        accessToken,
      });
    } catch (error) {
      return createErrorResponse(error);
    }
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    // 리다이렉트는 Passport가 처리
  }

  @Get('kakao/redirect')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginRedirect(@Req() req, @Res() res) {
    try {
      const { provider, providerId, name, image } = req.user;
      const accessToken = await this.authService.handleSocialLogin({
        provider,
        providerId,
        name,
        image,
      });

      return res.redirect(`${FRONT_BASE_URL}/login-success?token=${accessToken}`);
    } catch (error) {
      return createErrorResponse(error);
    }
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    try {
      await this.authService.createUser(createUserDto);

      return createSuccessResponse({});
    } catch (error) {
      return createErrorResponse(error);
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const { loginId, password } = loginUserDto;

      const accessToken = await this.authService.login(loginId, password);
      return createSuccessResponse({ accessToken });
    } catch (error) {
      return createErrorResponse(error);
    }
  }

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const newAccessToken = this.jwtService.sign({ id: payload.id, loginId: payload.loginId }, { expiresIn: '1h' });
      return createSuccessResponse({ accessToken: newAccessToken });
    } catch (error) {
      return createErrorResponse(new UnauthorizedException('리프레시 토큰이 유효하지 않습니다.'));
    }
  }
}
