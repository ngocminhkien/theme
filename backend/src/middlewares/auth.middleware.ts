import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { ResponseView } from '../views/response.view.js';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ResponseView.unauthorized(res, 'Vui lòng đăng nhập để tiếp tục.');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, ENV.JWT.SECRET) as { id: number; email: string; role: string };
    req.user = decoded;
    next();
  } catch {
    return ResponseView.unauthorized(res, 'Token không hợp lệ hoặc đã hết hạn.');
  }
}
