import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createErrorResponse } from 'src/helpers/apiResponse.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/createUser.dto';
import { SocialLoginAndRegisterDto } from './dto/socialLoginAndRegister.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  // NOTE: JWT 정보 생성
  generateJwt(user: any) {
    const payload = {
      id: user?.id,
      userId: user?.userId,
      email: user?.email,
      provider: user?.provider,
    };
    return this.jwtService.sign(payload);
  }

  // 비밀번호 암호화
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // 비밀번호 검증
  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // 사용자 userId로 찾기
  async findUserByUserId(userId) {
    return await this.prisma.user.findUnique({ where: { userId } });
  }

  // 사용자 index로 찾기
  async findUserById(id) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  // 사용자 provider email로 찾기
  async findUserByProviderEmail(providerEmail) {
    return await this.prisma.user.findUnique({
      where: { email: providerEmail },
    });
  }

  // 소셜 로그인 사용자 찾기
  async findUserByProviderId(provider: string, providerId: string) {
    return await this.prisma.user.findFirst({
      where: {
        provider,
        providerId,
      },
    });
  }

  // 사용자 업데이트 함수
  async updateUser(
    id: number,
    data: Partial<{
      provider: string;
      providerId: string;
      providerEmail: string;
    }>,
  ) {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // NOTE: 회원가입
  async createUser(createUserDto: CreateUserDto) {
    const { userId, password, passwordConfirm, name, image, provider, providerId } = createUserDto;

    let hashedPassword = '';
    if (!provider) {
      const checkPassword: boolean = password !== passwordConfirm;

      if (checkPassword) {
        throw new ConflictException('비밀번호 확인이 일치하지 않았습니다.');
      }

      const existingUser = await this.findUserByUserId(userId);

      if (existingUser) {
        throw new ConflictException('이미 존재하는 로그인 id 입니다.');
      }

      hashedPassword = await this.hashPassword(password);
    }

    // 사용자 생성
    const user = await this.prisma.user.create({
      data: {
        userId,
        password: provider ? '' : hashedPassword,
        name,
        image,
        provider,
        providerId,
      },
    });

    return user;
  }

  // NOTE: 로그인
  async login(loginId: string, password: string): Promise<any> {
    const user = await this.findUserByUserId(loginId);
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    const isPasswordValid = await this.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const accessToken = this.generateJwt(user);

    return accessToken;
  }

  async handleSocialLogin(socialLoginAndRegisterDto: SocialLoginAndRegisterDto) {
    const { provider, providerId, name, image } = socialLoginAndRegisterDto;
    try {
      let user = await this.findUserByProviderId(provider, providerId);

      if (!user) {
        const userId = uuidv4();
        user = await this.createUser({
          userId,
          name,
          image,
          provider,
          providerId,
          password: '',
          passwordConfirm: '',
        });
      }

      const accessToken = this.generateJwt(user);

      return accessToken;
    } catch (error) {
      return createErrorResponse(error);
    }
  }
}
