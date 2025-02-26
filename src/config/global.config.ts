export const FRONT_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : 'https://sanirang.kr';
export const BACK_BASE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://api.sanirang.kr';
export const KAKAO_CALLBACK_URL = BACK_BASE_URL + '/auth/kakao/redirect';
