import express from 'express';
import getRequests from '../../configs/routing';

export default (MODE: string) => {
  const apiRouter = express.Router();

  const REQUESTS = getRequests(MODE);

  /**
   * GET
   */
  for (let request of REQUESTS.GET.v1.generalRoutes) {
    apiRouter.get(request.path, request.controller);
  }

  /**
   * POST
   */
  for (let request of REQUESTS.POST.v1.generalRoutes) {
    apiRouter.post(request.path, request.controller);
  }

  return apiRouter;
};
