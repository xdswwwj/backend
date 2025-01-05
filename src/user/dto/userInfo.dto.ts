import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserInfoDto {
  @ApiProperty({ description: 'user Index', example: '1' })
  @IsNotEmpty({ message: '사용자 index는 필수입니다.' })
  @IsNumber()
  id: number;
}
