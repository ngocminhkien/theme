import { Router } from 'express';
import { LicenseController } from '../controllers/license.controller.js';
import { rateLimiter } from '../middlewares/security.middleware.js';

export const licenseRouter = Router();

// Giới hạn tần suất kích hoạt & xác thực key chống dò mật mã (Brute-force)
const licenseRateLimiter = rateLimiter({ windowMs: 60 * 1000, max: 25, message: 'Thao tác bản quyền quá nhanh. Vui lòng thử lại sau.' });

licenseRouter.post('/activate', licenseRateLimiter, LicenseController.activate);
licenseRouter.post('/deactivate', licenseRateLimiter, LicenseController.deactivate);
licenseRouter.get('/my-licenses', LicenseController.getMyLicenses);
licenseRouter.get('/verify', licenseRateLimiter, LicenseController.verify);
