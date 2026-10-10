import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';

export const paymentRouter = Router();

// 1. Cổng thanh toán Việt Nam (VietQR SePAY Webhook)
paymentRouter.post('/sepay', PaymentController.handleSepayWebhook);

// 2. Cổng thanh toán Quốc tế (Stripe)
paymentRouter.post('/stripe/create-session', PaymentController.createStripeSession);
paymentRouter.post('/stripe', PaymentController.handleStripeWebhook);
