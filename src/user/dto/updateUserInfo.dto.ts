import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserInfoDto {
  @ApiProperty({ description: 'user Name', example: '홍길동' })
  @IsNotEmpty({ message: '사용자 이름은 필수입니다.' })
  name: string;

  @ApiProperty({ description: 'user Nickname', example: '홍길' })
  @IsNotEmpty({ message: '사용자 닉네임은 필수입니다.' })
  nickname: string;

  @ApiProperty({ description: 'user Email', example: 'dev-do@naver.com' })
  @IsNotEmpty({ message: '사용자 이메일은 필수입니다.' })
  email: string;

  @ApiProperty({ description: 'user Sex', example: '1' })
  @IsNotEmpty({ message: '사용자 성별은 필수입니다.' })
  sex: number;
}
