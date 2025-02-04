import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateClubDto {
  @ApiProperty({ description: '클럽 이름', example: '종주꿈나무' })
  @IsNotEmpty({ message: '클럽 이름은 필수입니다.' })
  name: string;

  @ApiProperty({ description: '클럽 설명', example: '8090 종주꿈나무' })
  @IsOptional()
  description: string;

  @ApiProperty({
    description: '클럽 이미지',
    type: 'string',
    format: 'binary',
  })
  image: Express.Multer.File;
}
