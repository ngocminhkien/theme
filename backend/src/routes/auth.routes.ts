import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { OAuthController } from '../controllers/oauth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const authRouter = Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.get('/me', authMiddleware, AuthController.getProfile);
authRouter.put('/profile', authMiddleware, AuthController.updateProfile);
authRouter.put('/change-password', authMiddleware, AuthController.changePassword);

// OAuth 2.0 (Google & GitHub)
authRouter.get('/providers', OAuthController.getProviders);
authRouter.get('/google', OAuthController.googleAuth);
authRouter.get('/google/callback', OAuthController.googleCallback);
authRouter.get('/github', OAuthController.githubAuth);
authRouter.get('/github/callback', OAuthController.githubCallback);
