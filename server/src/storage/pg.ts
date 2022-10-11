import path from 'path';
import debug from 'debug';
import { createConnection } from 'typeorm';
import { Post, Updoot, Users } from '../enteties';

const logInfo = debug('PostgresSQL:info:::');
const logError = debug('PostgresSQL:error:::');

class PostgresSQL {
  async connect() {
    try {
      const conn = await createConnection({
        type: 'postgres',
        url: process.env.PQ_URL,
        logging: true,
        // synchronize: true,
        migrations: [path.join(__dirname, '../migrations/pq/*')],
        entities: [Post, Users, Updoot],
      });

      logInfo(
        `Postgres databases CONNECTED. DB URL: ${process.env.PQ_URL}`,
      );
      global.pq = conn;
    } catch (e) {
      logError('Postgres databases CONNECTED ERROR %s', e);
    }
  }
}

export default new PostgresSQL();
