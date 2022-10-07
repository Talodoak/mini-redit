import debug from 'debug';
import { createClient } from 'redis';
import { Connections } from '../interfaces';

const logInfo = debug('RedisDb:info:::');
const logError = debug('RedisDb:error:::');

class RedisDb {
  private static get config(): Connections.RedisConnection {
    const mode = process.env.NODE_ENV;
    return {
      host:
        mode === 'production'
          ? process.env.REDIS_PROD_HOST
          : process.env.REDIS_DEV_HOST,
      port:
        mode === 'production'
          ? process.env.REDIS_PROD_PORT
          : process.env.REDIS_DEV_PORT,
      databaseNumber:
        mode === 'production'
          ? process.env.REDIS_PROD_SELECTED_DB
          : process.env.REDIS_DEV_SELECTED_DB,
      username:
        mode === 'production'
          ? process.env.REDIS_PROD_USERNAME
          : process.env.REDIS_DEV_USERNAME,
      password:
        mode === 'production'
          ? process.env.REDIS_PROD_PASSWORD
          : process.env.REDIS_DEV_PASSWORD,
    };
  }

  async connect() {
    try {
      const { host, port, databaseNumber } = RedisDb.config;
      const client = createClient({
        url: `redis://@${host}:${port}`,
      });
      await client.connect();
      await client.SELECT(Number(databaseNumber));

      logInfo(`REDIS SERVER CONNECT. DB SELECTED: ${Number(databaseNumber)}`);
      global.redis = client;
    } catch (e) {
      logError('REDIS SERVER ERROR %s', e);
    }
  }
}

export default new RedisDb();
