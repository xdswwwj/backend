import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile, done: Function): Promise<any> {
    const { id, username, _json: kakaoAccount } = profile;
    const user = {
      provider: 'kakao',
      providerId: String(id),
      email: kakaoAccount.kakao_account.email,
      name: username,
      image: kakaoAccount.properties.profile_image,
      accessToken,
    };
    done(null, user);
  }
}
