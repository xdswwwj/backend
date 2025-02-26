export const FRONT_BASE_URL =
  process.env.NODE_ENV === 'development' ? process.env.FRONT_DEV_BASE_URL : process.env.FRONT_PROD_BASE_URL;
export const BACK_BASE_URL =
  process.env.NODE_ENV === 'development' ? process.env.BACK_DEV_BASE_URL : process.env.BACK_PROD_BASE_URL;
