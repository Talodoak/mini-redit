import { Request, Response } from 'express';
import { Loaders } from '../services';
import { Redis } from '../storage';
import { Session } from 'express-session';

export type MyContext = {
  redis: any;
  req: Request & { session: Session };
  res: Response;
  userLoader: ReturnType<typeof Loaders.userLoader>;
  updootLoader: ReturnType<typeof Loaders.updootLoader>;
};
