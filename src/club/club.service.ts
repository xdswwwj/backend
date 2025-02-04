import { Injectable } from '@nestjs/common';
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
    const { page, limit } = paginationDto;

    const skip = (page - 1) * limit; // 페이지에 맞는 offset 계산
    const take = limit;

    const [clubs, total] = await Promise.all([
      this.prisma.club.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' }, // 최신순 정렬
      }),
      this.prisma.club.count(), // 전체 개수 카운트
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
