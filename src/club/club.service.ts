import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationDto } from 'src/global/dto/common.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClubDto } from './dto/createClub.dto';

@Injectable()
export class ClubService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClubDto: CreateClubDto, image: string, leaderId: number) {
    const { name, description } = createClubDto;
    const club = await this.prisma.club.create({
      data: {
        name,
        description,
        image,
        leaderId,
      },
    });
    return club;
  }

  async getClubList(paginationDto: PaginationDto) {
    const { page, limit = 1, search } = paginationDto;

    const skip = (page - 1) * limit; // 페이지에 맞는 offset 계산
    const take = limit;

    const where: Prisma.ClubWhereInput = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive', // 대소문자 없이
          },
        }
      : {};

    const [clubs, total] = await Promise.all([
      this.prisma.club.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' }, // 최신순 정렬
        include: {
          leader: {
            select: { id: true, name: true, email: true, image: true },
          },
          _count: {
            select: { members: true },
          },
        },
      }),
      this.prisma.club.count({ where }), // 전체 개수 카운트
    ]);

    return {
      success: true,
      data: clubs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
