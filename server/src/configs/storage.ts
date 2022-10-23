export const REDIS_URL =
  String(process.env.NODE_ENV) === 'production'
    ? process.env.REDIS_URL_PROD
    : process.env.REDIS_URL_DEV;
