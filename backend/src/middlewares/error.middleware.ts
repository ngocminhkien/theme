import { Request, Response, NextFunction } from 'express';
import { ResponseView } from '../views/response.view.js';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  console.error('[Error Middleware] Phát hiện lỗi:', err.message);
  return ResponseView.error(res, err.message || 'Đã xảy ra lỗi máy chủ nội bộ.', 'INTERNAL_SERVER_ERROR', 500);
}
