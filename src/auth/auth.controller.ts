import {
  BadRequestException,
  Body,
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
  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // async googleLogin() {
  //   // Google OAuth 페이지로 리다이렉트
  // }

  // @Get('google/redirect')
  // @UseGuards(AuthGuard('google'))
  // async googleLoginRedirect(@Req() req) {
  //   const { providerId } = req.user;

  //   try {
  //     // 기존 사용자 로그인
  //     const result = await this.authService.socialLogin('google', providerId);
  //     return result;
  //   } catch (error) {
  //     throw new ConflictException('회원가입 후 연동할 수 있습니다.');
  //   }
  //   // const jwt = this.authService.generateJwt(req.user);
  //   // // Google로 부터 사용자 정보 반환
  //   // return {
  //   //   message: 'Google login successful',
  //   //   user: req.user,
  //   //   token: jwt,
  //   // };
  // }

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
      // Step 1: providerId로 사용자 확인
      let user = await this.authService.findUserByProviderId(
        provider,
        providerId,
      );
      console.log('user >>', user);

      // Step 2: 새로운 사용자 생성
      if (!user) {
        user = await this.authService.createUser({
          userId: providerId,
          name,
          image,
          provider,
          providerId,
          password: '',
          passwordConfirm: '',
        });
      }

      const accessToken = this.authService.generateJwt(user.id);

      return {
        user,
        accessToken,
      };
    } catch (error) {
      console.log(error);

      return {
        error,
      };
    }
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.createUser(createUserDto);
    return {
      message: '회원가입 성공',
      user,
    };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const { loginId, password } = loginUserDto;
    if (!loginId) {
      throw new BadRequestException('loginId는 필수입니다.');
    }
    if (!password) {
      throw new BadRequestException('password는 필수입니다.');
    }

    return await this.authService.login(loginId, password);
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
