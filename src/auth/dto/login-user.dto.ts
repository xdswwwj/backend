import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: '로그인 ID', example: 'xdswwwj' })
  @IsNotEmpty()
  @IsString()
  loginId: string;

  @ApiProperty({ description: '비밀번호', example: 'skdicls1' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
