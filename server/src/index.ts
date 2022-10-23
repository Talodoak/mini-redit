import * as path from 'path';
import { config as dotenvConfig } from 'dotenv';

console.log(__dirname);

const env = dotenvConfig({
  path: path.join(__dirname, '../../.env'),
});
if (env.error) {
  console.error('PLEASE CREATE .env');
}
import debug from 'debug';
import App from './app.ts';

const logError = debug('Index:error:::');

const app = new App();
app.startup();

process.on('uncaughtException', (e) => {
  logError(e);
  process.exit(1);
});

process.on('unhandledRejection', (e) => {
  logError(e);
  process.exit(1);
});

process.on('exit', () => {
  logError('Exit event is called');
  process.exit(1);
});
