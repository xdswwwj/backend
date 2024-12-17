import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SocialLoginDto } from './dto/social-login.dto';

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
  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
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
    const {
      userId,
      password,
      passwordConfirm,
      name,
      image,
      provider,
      providerId,
    } = createUserDto;

    let hashedPassword = '';
    if (!provider) {
      const checkPassword: boolean = password === passwordConfirm;

      if (checkPassword) {
        throw new ConflictException('비밀번호 확인이 일치하지 않았습니다.');
      }

      const existingUser = await this.findUserByUserId(userId);

      if (existingUser) {
        throw new ConflictException('이미 존재하는 loginId입니다.');
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

    const isPasswordValid = await this.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const payload = { loginId: user.userId };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: '로그인 성공',
      accessToken,
    };
  }

  // NOTE: 소셜 로그인 처리
  async socialLogin(socialLoginDto: SocialLoginDto) {
    const { provider, providerId } = socialLoginDto;
    const user = await this.findUserByProviderId(provider, providerId);

    if (!user) {
      throw new UnauthorizedException(
        '연동된 계정을 찾을 수 없습니다. 먼저 회원가입 후 소셜 계정을 연동해주세요.',
      );
    }

    const payload = { id: user.id, provider };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user };
  }

  // NOTE: 소셜 로그인 회원가입 처리
  async registerSocialUser(
    provider: 'kakao' | 'google',
    providerId: string,
    userId: string,
    password: string,
    passwordConfirm: string,
    email: string,
    name: string,
  ) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ provider }, { providerId }],
      },
    });

    if (existingUser) {
      throw new ConflictException('이미 가입된 사용자입니다.');
    }

    const data = { providerId: providerId, providerEmail: email, name };
    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        userId,
        password,
      },
    });

    if (password !== passwordConfirm) {
      throw new ConflictException('비밀번호 확인이 일치하지 않았습니다.');
    }

    return {
      message: '회원가입 성공',
      user: newUser,
      token: this.generateJwt(newUser),
    };
  }

  async linkSocialAccount(id: number, socialLoginDto: SocialLoginDto) {
    const { provider, providerId, email } = socialLoginDto;

    const existingUser = await this.findUserByProviderId(provider, providerId);

    if (existingUser) {
      throw new ConflictException(
        '이 소셜 계정은 이미 다른 계정에 연동되어 있습니다.',
      );
    }

    const updateUserStatus = await this.updateUser(id, {
      provider,
      providerId,
      providerEmail: email,
    });

    console.log(updateUserStatus);
  }
}
