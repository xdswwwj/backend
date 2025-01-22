export type ReqeustJwtInfoUser = {
  id: number;
  userId: string;
  email: string;
  provider: string;
  iat: number;
  exp: number;
};

export interface RequestCustom extends Reqeust {
  user: ReqeustJwtInfoUser;
}
