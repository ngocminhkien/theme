import { Router } from 'express';
import { UpdaterController } from '../controllers/updater.controller.js';

export const updaterRouter = Router();

// Endpoint kiểm tra phiên bản mới từ WordPress Client
updaterRouter.get('/check', UpdaterController.checkForUpdates);

// Endpoint tải file zip cập nhật bảo mật
updaterRouter.get('/download', UpdaterController.downloadThemePackage);
