import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '로그인 ID', example: 'xdswwwj' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ description: '비밀번호', example: 'skdicls1' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: '비밀번호', example: 'skdicls1' })
  @IsNotEmpty()
  @IsString()
  passwordConfirm: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '김도현',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  providerId?: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example:
      'http://k.kakaocdn.net/dn/me51W/btsK5Dkhb7e/sWSrkiHre6Bu1bQSoQuHtk/img_640x640.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;
}
