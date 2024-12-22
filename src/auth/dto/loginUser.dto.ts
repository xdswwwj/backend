import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: '로그인 ID', example: 'xdswwwj' })
  @IsNotEmpty({ message: '로그인 ID는 필수입니다.' })
  @IsString()
  loginId: string;

  @ApiProperty({ description: '비밀번호', example: 'skdicls1' })
  @IsNotEmpty({ message: '비밀번호는 필수입니다.' })
  @IsString()
  password: string;
}
