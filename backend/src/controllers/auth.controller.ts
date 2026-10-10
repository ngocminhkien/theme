import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ResponseView } from '../views/response.view.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, full_name, phone } = req.body;
      if (!email || !password || !full_name) {
        return ResponseView.error(res, 'Vui lòng cung cấp email, mật khẩu và họ tên.');
      }
      const result = await AuthService.register({ email, password, full_name, phone });
      return ResponseView.created(res, result, 'Đăng ký tài khoản thành công.');
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return ResponseView.error(res, 'Vui lòng nhập email và mật khẩu.');
      }
      const result = await AuthService.login(email, password);
      return ResponseView.success(res, result, 'Đăng nhập thành công.');
    } catch (error: any) {
      return ResponseView.error(res, error.message, 'AUTH_FAILED', 401);
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    return ResponseView.success(res, req.user, 'Lấy thông tin tài khoản thành công.');
  }
}
