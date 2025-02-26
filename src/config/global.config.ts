export const FRONT_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://sanirang.kr' : 'http://localhost:5173';
export const BACK_BASE_URL =
  process.env.NODE_ENV === 'production' ? 'https://api.sanirang.kr' : 'http://localhost:3000';
export const KAKAO_CALLBACK_URL = BACK_BASE_URL + '/auth/kakao/redirect';
