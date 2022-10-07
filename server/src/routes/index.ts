import express, {Router} from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import Redis from "ioredis";
import session from 'express-session';
import connectRedis from "connect-redis";
import V1 from "./v1";
import {COOKIE_NAME} from "../configs/additionals";

const expressRouter = Router();
const RedisStore = connectRedis(session);
const redis = new Redis('127.0.0.1:6379');

export default class InitRouter {
  app: express.Application;
  apolloServer: any;
  globalRouter: express.Router;
  MODE: string;

  constructor(app: express.Application, MODE: string, apolloServer) {
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
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(cookieParser());
    this.app.set("trust proxy", 1);
    this.app.use(
        cors({
          origin: process.env.CORS_ORIGIN,
          credentials: true,
        })
    );
    this.app.use(session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
        disableTTL: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
         secure: process.env.NODE_ENV === 'production', //cookie only works with https
         sameSite: 'lax', //csrf
      },
      saveUninitialized: false,
      secret: 'keyboard cat',
      resave: false
    }));
    this.apolloServer.applyMiddleware({app: this.app, cors: false});
  }
}