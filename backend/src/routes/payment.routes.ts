import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';

export const paymentRouter = Router();

// Webhook endpoint nhận dữ liệu từ SePAY
paymentRouter.post('/sepay', PaymentController.handleSepayWebhook);
