import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { authMiddleware, requireAdmin } from '../middlewares/auth.middleware.js';

export const categoryRouter = Router();

// Public routes
categoryRouter.get('/', CategoryController.getAll);
categoryRouter.get('/:slug', CategoryController.getBySlug);

// Protected Admin routes
categoryRouter.post('/', authMiddleware, requireAdmin, CategoryController.create);
categoryRouter.put('/:id', authMiddleware, requireAdmin, CategoryController.update);
