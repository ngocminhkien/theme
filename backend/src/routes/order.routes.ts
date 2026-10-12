import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { rateLimiter } from '../middlewares/security.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const orderRouter = Router();

// Giới hạn tần suất tạo đơn hàng: tối đa 30 đơn / phút / IP chống spam bot
const orderRateLimiter = rateLimiter({ windowMs: 60 * 1000, max: 30, message: 'Bạn đang tạo đơn hàng quá nhanh. Vui lòng chờ 1 phút.' });

orderRouter.post('/checkout', authMiddleware, orderRateLimiter, OrderController.checkout);
orderRouter.post('/create', authMiddleware, orderRateLimiter, OrderController.checkout);
orderRouter.get('/my-orders', authMiddleware, OrderController.getMyOrders);
orderRouter.get('/:orderNumber/receipt', authMiddleware, OrderController.getReceipt);
orderRouter.get('/:orderNumber/status', authMiddleware, OrderController.getOrderStatus);
