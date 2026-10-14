import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const configuredOrigins = [
  ...(process.env.FRONTEND_URL || 'http://localhost:3000').split(','),
  ...(process.env.ADMIN_URL || 'http://localhost:3001').split(','),
].map((origin) => origin.trim()).filter(Boolean);

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || process.env.APP_PORT || '4000', 10),
  // Both the customer storefront and the separately-hosted admin application
  // need to call this API in development. Values remain explicit rather than
  // reflecting arbitrary browser origins.
  CORS_ORIGINS: [...new Set(configuredOrigins)],

  DB: {
    HOST: process.env.DB_HOST || '127.0.0.1',
    PORT: parseInt(process.env.DB_PORT || '3306', 10),
    NAME: process.env.DB_NAME || 'theme_marketplace',
    USER: process.env.DB_USER || 'theme_user',
    PASSWORD: process.env.DB_PASSWORD || 'theme_password_secure',
    SSL: process.env.DB_SSL === 'true',
  },

  JWT: {
    SECRET: process.env.JWT_SECRET || 'dev_secret_key_change_in_production_min32chars',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  },

  APP_URL: process.env.APP_URL || 'http://localhost:4000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  PAYMENTS: {
    SEPAY_API_KEY: process.env.SEPAY_API_KEY || '',
    SEPAY_WEBHOOK_SECRET: process.env.SEPAY_WEBHOOK_SECRET || '',
    VIETQR_BANK_ACCOUNT: process.env.VIETQR_BANK_ACCOUNT || '',
    VIETQR_BANK_BIN: process.env.VIETQR_BANK_BIN || '970422',
    VIETQR_ACCOUNT_NAME: process.env.VIETQR_ACCOUNT_NAME || '',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  },

  OAUTH: {
    GOOGLE: {
      CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
      CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
      CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/api/v1/auth/google/callback',
    },
    GITHUB: {
      CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
      CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
      CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:4000/api/v1/auth/github/callback',
    },
  },
};
