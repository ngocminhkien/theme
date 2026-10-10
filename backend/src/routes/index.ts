import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { themeRouter } from './theme.routes.js';
import { orderRouter } from './order.routes.js';
import { paymentRouter } from './payment.routes.js';
import { updaterRouter } from './updater.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/themes', themeRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/webhooks', paymentRouter);
apiRouter.use('/updater', updaterRouter);
