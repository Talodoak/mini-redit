export const MAIN = {
  APP_PORT: Number(process.env.PORT) || 8080,
  HOST: process.env.HOST || '0.0.0.0',
  MODE:
    (['test', 'development', 'production'].includes(
      String(process.env.NODE_ENV),
    ) &&
      String(process.env.NODE_ENV)) ||
    'development',
  ALLOWED_ORIGINS: String(process.env.CORS_ORIGIN).split(','),
};
