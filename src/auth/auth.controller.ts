import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import {
  createErrorResponse,
  createSuccessResponse,
} from 'src/helpers/apiResponse.helper';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { SocialLoginDto } from './dto/social-login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Google OAuth 페이지로 리다이렉트
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(@Req() req) {
    const { providerId } = req.user;

    try {
      // 기존 사용자 로그인
      const result = await this.authService.socialLogin({
        provider: 'google',
        providerId,
      });
      return {
        result,
        user: req.user,
      };
    } catch (error) {
      throw new ConflictException('회원가입 후 연동할 수 있습니다.');
    }
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    // 리다이렉트는 Passport가 처리
  }

  @Get('kakao/redirect')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginRedirect(@Req() req) {
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
      console.log(error);

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

  @Post('refresh')
  async refreshToken(@Body('refreshToken') token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const newAccessToken = this.jwtService.sign(
        { id: payload.id, loginId: payload.loginId },
        { expiresIn: '1h' },
      );
      return { accessToken: newAccessToken };
    } catch (e) {
      throw new UnauthorizedException('리프레시 토큰이 유효하지 않습니다.');
    }
  }

  // 소셜 로그인 API
  @Post('social-login')
  async socialLogin(
    @Body()
    body: SocialLoginDto,
  ) {
    const { provider, providerId } = body;

    return await this.authService.socialLogin({
      provider,
      providerId,
    });
  }

  // NOTE: 소셜 회원가입 API
  @Post('social-register')
  async socialRegister(
    @Body()
    body: {
      provider: 'kakao' | 'google';
      providerId: string;
      email: string;
      name: string;
    },
  ) {
    const { provider, providerId, email, name } = body;

    return await this.authService.registerSocialUser(
      provider,
      providerId,
      'test',
      'skdicls1',
      'skdicls1',
      email,
      name,
    );
  }

  @Post('social-link')
  async linkSocialLogin(
    @Body() socialLoginDto: SocialLoginDto,
    @Request() req,
  ) {
    const id = req.user.id;
    return await this.authService.linkSocialAccount(id, socialLoginDto);
  }
}
