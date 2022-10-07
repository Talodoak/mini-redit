import path from 'path';
import debug from 'debug';
import { createConnection } from 'typeorm';
import { Post, Updoot, User } from '../enteties';

const logInfo = debug('PostgresSQL:info:::');
const logError = debug('PostgresSQL:error:::');

class PostgresSQL {
  async connect() {
    try {
      const conn = await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        logging: true,
        // synchronize: true,
        migrations: [path.join(__dirname, './migrations/*')],
        entities: [Post, User, Updoot],
      });

      logInfo(
        `Postgres databases CONNECTED. DB URL: ${process.env.DATABASE_URL}`,
      );
      global.pq = conn;
    } catch (e) {
      logError('Postgres databases CONNECTED ERROR %s', e);
    }
  }
}

export default new PostgresSQL();