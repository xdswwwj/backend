import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(id) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        email: true,
        image: true,
        name: true,
        nickname: true,
        sex: true,
        phone: true,
        provider: true,
        userId: true,
      },
    });
  }

  async updateUserInfo(userInfoDto) {
    const { id, name, nickname, email } = userInfoDto;
    return await this.prisma.user.update({
      where: { id },
      data: {
        name,
        nickname,
        email,
      },
    });
  }
}
