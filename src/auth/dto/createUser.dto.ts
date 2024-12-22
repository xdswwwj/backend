import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '로그인 ID', example: 'xdswwwj' })
  @IsNotEmpty({ message: '로그인 ID는 필수입니다.' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '비밀번호', example: 'skdicls1' })
  @IsNotEmpty({ message: '비밀번호는 필수입니다.' })
  @IsString()
  password: string;

  @ApiProperty({ description: '비밀번호 확인', example: 'skdicls1' })
  @IsNotEmpty({ message: '비밀번호 확인은 필수입니다.' })
  @IsString()
  passwordConfirm: string;

  @ApiProperty({ description: '사용자 휴대폰 번호', example: '01021678895' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: '사용자 이름', example: '김도현' })
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
    example: 'http://k.kakaocdn.net/dn/me51W/btsK5Dkhb7e/sWSrkiHre6Bu1bQSoQuHtk/img_640x640.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;
}
