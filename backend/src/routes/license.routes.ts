import { Router } from 'express';
import { LicenseController } from '../controllers/license.controller.js';

export const licenseRouter = Router();

licenseRouter.post('/activate', LicenseController.activate);
licenseRouter.post('/deactivate', LicenseController.deactivate);
licenseRouter.get('/my-licenses', LicenseController.getMyLicenses);
licenseRouter.get('/verify', LicenseController.verify);
