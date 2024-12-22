import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SocialLoginAndRegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'provider 값이 존재하지 않습니다.' })
  provider: string;

  @IsString()
  @IsNotEmpty({ message: 'providerId 값이 존재하지 않습니다.' })
  providerId: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  name?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
