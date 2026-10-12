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

// Root Welcome & API Discovery
app.get('/', (_req, res) => {
  return ResponseView.success(res, {
    service: 'Theme Marketplace Backend API',
    version: '1.0.0',
    status: 'online',
    health: '/health',
    endpoints: {
      health: 'GET /health',
      orders_checkout: 'POST /api/v1/orders/checkout',
      orders_status: 'GET /api/v1/orders/:orderNumber/status',
      sepay_webhook: 'POST /api/v1/webhooks/sepay',
      stripe_session: 'POST /api/v1/payments/stripe/create-session',
      licenses_verify: 'GET /api/v1/licenses/verify?key={key}',
      licenses_activate: 'POST /api/v1/licenses/activate',
      updater_check: 'GET /api/v1/updater/check?license_key={key}',
      themes_list: 'GET /api/v1/themes',
    },
  }, 'Chào mừng bạn đến với Theme Marketplace Backend API!');
});

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
