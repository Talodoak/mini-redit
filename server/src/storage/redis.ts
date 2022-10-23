import debug from 'debug';
import { createClient, RedisClientType } from 'redis';
import { Connections } from '../interfaces';
import { REDIS_URL } from '../configs/storage';

const logInfo = debug('RedisDb:info:::');
const logError = debug('RedisDb:error:::');

class RedisDb {
  private static get config(): Connections.RedisConnection {
    return {
      url: REDIS_URL,
    };
  }

  async connect() {
    try {
      const { url } = RedisDb.config;
      const client = createClient({ url });
      await client.connect();

      logInfo(`REDIS SERVER CONNECT. Url: ${url}`);
      global.redis = client as RedisClientType;
    } catch (e) {
      logError('REDIS SERVER ERROR %s', e);
    }
  }
}

export default new RedisDb();
