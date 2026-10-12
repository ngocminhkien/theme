import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';

export const orderRouter = Router();

orderRouter.post('/checkout', OrderController.checkout);
orderRouter.post('/create', OrderController.checkout);
orderRouter.get('/:orderNumber/status', OrderController.getOrderStatus);
