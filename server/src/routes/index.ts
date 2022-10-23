import express, { Router } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import V1 from './v1';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import { COOKIE_NAME } from '../configs/additionals';
import connectRedis from 'connect-redis';
import { MAIN } from '../configs/app';
import { createClient } from 'redis';
import { REDIS_URL } from '../configs/storage';

const RedisStore = connectRedis(session);
const redisClient: any = createClient({ url: REDIS_URL, legacyMode: true });
redisClient.connect().catch(console.error);

export default class InitRouter {
  app: express.Application;
  apolloServer: any;
  globalRouter: express.Router;
  MODE: string;

  constructor(
    app: express.Application,
    MODE: string,
    apolloServer: ApolloServer<ExpressContext>,
  ) {
    this.app = app;
    this.globalRouter = Router();
    this.MODE = MODE;
    this.apolloServer = apolloServer;
  }

  public initalize() {
    this.attachMiddlewares();
    this.initRoutes();
    this.app.use(this.globalRouter);
  }

  // add any new route class below
  private initRoutes(): void {
    this.globalRouter.use('/api/v1', V1.getGeneralRouter(this.MODE));
  }

  private attachMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.disable('x-powered-by');
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.set('trust proxy', 1);
    this.app.use(
      cors({
        origin: MAIN.ALLOWED_ORIGINS,
        credentials: true,
      }),
    );
    this.app.use(
      session({
        name: COOKIE_NAME,
        store: new RedisStore({
          client: redisClient,
          disableTouch: true,
          disableTTL: true,
        }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', //cookie only works with https
          sameSite: 'lax', //csrf
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        resave: false,
      }),
    );
    this.apolloServer.applyMiddleware({ app: this.app, cors: false });
  }
}
