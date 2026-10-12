import { Request, Response, NextFunction } from 'express';
import { ResponseView } from '../views/response.view.js';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Tạo middleware giới hạn tần suất request (Rate Limiting) chống Brute-Force & DDoS
 */
export function rateLimiter(options: { windowMs: number; max: number; message?: string }) {
  const { windowMs, max, message = 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.' } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1';
    const routeKey = `${req.baseUrl || ''}${req.path}`;
    const key = `${ip}:${routeKey}`;
    const now = Date.now();

    const record = rateLimitMap.get(key);

    if (!record || now > record.resetAt) {
      rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= max) {
      SecurityLogger.warn('RATE_LIMIT_EXCEEDED', `IP ${ip} vượt quá giới hạn ${max} requests / ${windowMs / 1000}s tại ${routeKey}`);
      return ResponseView.error(res, message, 'RATE_LIMIT_EXCEEDED', 429);
    }

    record.count += 1;
    return next();
  };
}

/**
 * Module ghi nhật ký an ninh bảo mật giao dịch (Security Audit Logger)
 */
export class SecurityLogger {
  static info(event: string, details: any) {
    const time = new Date().toISOString();
    console.log(`🛡️ [SECURITY_AUDIT][INFO][${time}] [${event}]:`, details);
  }

  static warn(event: string, details: any) {
    const time = new Date().toISOString();
    console.warn(`⚠️ [SECURITY_ALERT][WARN][${time}] [${event}]:`, details);
  }

  static alert(event: string, details: any) {
    const time = new Date().toISOString();
    console.error(`🚨 [CRITICAL_SECURITY_ALERT][${time}] [${event}]:`, details);
  }
}
