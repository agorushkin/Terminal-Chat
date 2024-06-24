import { serve, ServerRouter } from 'x/http';

export const distributionRouter = new ServerRouter('/');

distributionRouter.get('/assets/*', serve('/bundler/dist.js'));
