import path from 'path';
import debug from 'debug';
import { createConnection } from 'typeorm';
import { Post, Updoot, Users } from '../enteties';

const logInfo = debug('PostgresSQL:info:::');
const logError = debug('PostgresSQL:error:::');

class PostgresSQL {
  private static get config() {
    const mode = String(process.env.NODE_ENV);
    return {
      url:
        mode === 'production'
          ? process.env.PQ_URL_PROD
          : process.env.PQ_URL_DEV,
    };
  }

  async connect() {
    try {
      const { url } = PostgresSQL.config;

      const conn = await createConnection({
        type: 'postgres',
        url: url,
        logging: true,
        // synchronize: true,
        migrations: [path.join(__dirname, '../migrations/pq/*')],
        entities: [Post, Users, Updoot],
      });

      logInfo(`Postgres databases CONNECTED. DB URL: ${url}`);
      global.pq = conn;
    } catch (e) {
      logError('Postgres databases CONNECTED ERROR %s', e);
    }
  }
}

export default new PostgresSQL();
