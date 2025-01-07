import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUserInfoDto {
  @ApiProperty({ description: 'user Index', example: '1' })
  @IsNotEmpty({ message: '사용자 index는 필수입니다.' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'user Name', example: '홍길동' })
  @IsNotEmpty({ message: '사용자 이름은 필수입니다.' })
  name: string;

  @ApiProperty({ description: 'user Nickname', example: '홍길동' })
  @IsNotEmpty({ message: '사용자 닉네임은 필수입니다.' })
  nickname: string;

  @ApiProperty({ description: 'user Email', example: '' })
  @IsNotEmpty({ message: '사용자 이메일은 필수입니다.' })
  email: string;
}
