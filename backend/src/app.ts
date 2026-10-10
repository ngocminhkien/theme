import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { ResponseView } from './views/response.view.js';
import { ENV } from './config/env.js';

export const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/health', (_req, res) => {
  return ResponseView.success(res, { status: 'healthy', uptime: process.uptime() }, 'Backend API đang hoạt động ổn định');
});

// Master API Routes v1
app.use('/api/v1', apiRouter);

// 404 Route Handler
app.use((_req, res) => {
  return ResponseView.notFound(res, 'API endpoint không tồn tại.');
});

// Global Error Handler Middleware
app.use(errorHandler);
