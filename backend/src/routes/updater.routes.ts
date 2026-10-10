import { Router } from 'express';
import { UpdaterController } from '../controllers/updater.controller.js';

export const updaterRouter = Router();

updaterRouter.get('/check', UpdaterController.checkForUpdates);
