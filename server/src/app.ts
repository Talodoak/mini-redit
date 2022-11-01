import 'reflect-metadata';
import debug from 'debug';
import * as sourceMapSupport from 'source-map-support';

sourceMapSupport.install(); // This needed to display correct line for the exception in .ts file (not .js)

import { PqSQL, Redis } from './storage/index';
import express from 'express';
import http, { Server } from 'http';
import { MAIN as AppMainConfig } from './configs/app';
import RouterConfigurator from './routes';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { MyContext } from './interfaces';
import { PostResolver, UserResolver } from './controllers';
import { Loaders } from './services';

const logInfo = debug('Server:info:::');

const logError = debug('Server:error:::');

/**
 * @class App
 * An entry point to server
 */
class App {
  private readonly MODE: string;

  private readonly app: express.Application;

  private readonly PORT: number;

  private readonly HOST: string;

  private server: Server;

  private apolloServer: ApolloServer<
    import('apollo-server-express').ExpressContext
  >;

  constructor() {
    this.PORT = AppMainConfig.APP_PORT;
    this.HOST = AppMainConfig.HOST;
    this.MODE = AppMainConfig.MODE;

    this.app = express();
    this.server = http.createServer(this.app);
  }

  private async connectDbs(): Promise<void> {
    await Redis.connect();
    await PqSQL.connect();
  }

  private async initializeRoutes() {
    const configurator = new RouterConfigurator(
      this.app,
      this.MODE,
      this.apolloServer,
    );
    configurator.initalize();

    logInfo(`Routes initalized`);
  }

  private async listenGraphQL() {
    try {
      this.apolloServer = new ApolloServer({
        schema: await buildSchema({
          resolvers: [PostResolver, UserResolver],
          validate: false,
        }),
        context: ({ req, res }): MyContext => ({
          req,
          res,
          redis,
          userLoader: Loaders.userLoader(),
          updootLoader: Loaders.updootLoader(),
        }),
      });
      await this.apolloServer.start();
      logInfo(`GraphQL server started`);
    } catch (e) {
      logError(`GraphQL server not started`, e);
    }
  }

  private async listen() {
    this.server.listen(this.PORT, this.HOST, () => {
      logInfo(`APP STARTED IN ${this.MODE.toUpperCase()} MODE`);
      logInfo(`App is listening on the port ${this.PORT} on ${this.MODE} mode`);
    });
  }

  public async startup() {
    await this.connectDbs();
    await this.listenGraphQL();
    await this.initializeRoutes();
    await this.listen();
  }
}

export default App;
