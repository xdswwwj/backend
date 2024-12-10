import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async findUserById(loginId) {
    return this.prisma.user.findUnique({ where: { loginId } });
  }

  async signUp(createUserDto: CreateUserDto) {
    const { loginId, password, name, image } = createUserDto;

    // loginId 중복 확인
    const existingUser = await this.findUserById(loginId);

    if (existingUser) {
      throw new ConflictException('이미 존재하는 loginId입니다.');
    }

    // 사용자 생성
    const user = await this.prisma.user.create({
      data: {
        loginId,
        password,
        name,
        image,
      },
    });

    return user;
  }

  generateJwt(user: any) {
    console.log('user >>', user);
    return this.jwtService.sign(user);
  }
}
