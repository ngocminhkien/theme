import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { categoryRouter } from './category.routes.js';
import { themeRouter } from './theme.routes.js';
import { orderRouter } from './order.routes.js';
import { paymentRouter } from './payment.routes.js';
import { licenseRouter } from './license.routes.js';
import { updaterRouter } from './updater.routes.js';
import { adminRouter } from './admin.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/themes', themeRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/payments', paymentRouter);
apiRouter.use('/webhooks', paymentRouter); // Hỗ trợ cả /webhooks/sepay và /payments/sepay
apiRouter.use('/licenses', licenseRouter);
apiRouter.use('/updater', updaterRouter);
apiRouter.use('/admin', adminRouter);
