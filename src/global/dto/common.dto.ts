import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ description: '페이지 번호', example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({ description: '페이지 당 아이템 수', example: 20, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 20;

  @ApiProperty({ description: '검색어', example: '검색어', required: false })
  @IsOptional()
  search: string;

  @ApiProperty({ description: '나의 클럽', example: true, required: false })
  @IsOptional()
  isMyClub: boolean = false;
}
