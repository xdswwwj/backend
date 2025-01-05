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
        phone: true,
        provider: true,
        userId: true,
      },
    });
  }
}
