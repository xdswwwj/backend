import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SocialLoginAndRegisterDto {
  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsString()
  @IsNotEmpty()
  providerId: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  name?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
