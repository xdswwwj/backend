import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-naver-v2';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile, done: Function): Promise<any> {
    const { id } = profile;
    const user = {
      provider: profile.provider,
      providerId: String(id),
      email: profile.email,
      name: profile.name,
      image: profile.profileImage,
      accessToken,
    };
    done(null, user);
  }
}
