import { Router } from 'express';
import { ThemeController } from '../controllers/theme.controller.js';

export const themeRouter = Router();

themeRouter.get('/categories', ThemeController.getCategories);
themeRouter.get('/', ThemeController.getThemes);
themeRouter.get('/:slug', ThemeController.getThemeBySlug);
