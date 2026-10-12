import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authMiddleware, requireAdmin } from '../middlewares/auth.middleware.js';

export const adminRouter = Router();

// Tất cả các endpoints bên dưới bắt buộc phải xác thực JWT và có role admin
adminRouter.use(authMiddleware, requireAdmin);

// Dashboard
adminRouter.get('/stats', AdminController.getDashboardStats);

// Quản lý Đơn hàng
adminRouter.get('/orders', AdminController.getOrders);
adminRouter.get('/orders/:orderNumber', AdminController.getOrderDetail);

// Quản lý Themes
adminRouter.get('/themes', AdminController.getThemes);
adminRouter.get('/themes/:id', AdminController.getThemeDetail);
adminRouter.put('/themes/:id', AdminController.updateTheme);

// Quản lý Licenses
adminRouter.get('/licenses', AdminController.getLicenses);
adminRouter.get('/licenses/:licenseKey', AdminController.getLicenseDetail);

// Quản lý Khách hàng
adminRouter.get('/customers', AdminController.getCustomers);
adminRouter.get('/customers/:id', AdminController.getCustomerDetail);
