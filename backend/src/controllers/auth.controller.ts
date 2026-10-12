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
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return ResponseView.error(res, 'Định dạng email không hợp lệ.');
      }
      if (password.length < 6) {
        return ResponseView.error(res, 'Mật khẩu phải có độ dài tối thiểu 6 ký tự.');
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
    try {
      if (!req.user?.id) {
        return ResponseView.unauthorized(res, 'Phiên đăng nhập không hợp lệ.');
      }
      const user = await AuthService.getProfile(req.user.id);
      return ResponseView.success(res, user, 'Lấy thông tin tài khoản thành công.');
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return ResponseView.unauthorized(res, 'Phiên đăng nhập không hợp lệ.');
      }
      const { full_name, phone } = req.body;
      const updatedUser = await AuthService.updateProfile(req.user.id, { full_name, phone });
      return ResponseView.success(res, updatedUser, 'Cập nhật thông tin tài khoản thành công.');
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }

  static async changePassword(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return ResponseView.unauthorized(res, 'Phiên đăng nhập không hợp lệ.');
      }
      const { old_password, new_password } = req.body;
      if (!old_password || !new_password) {
        return ResponseView.error(res, 'Vui lòng nhập mật khẩu cũ và mật khẩu mới.');
      }
      if (new_password.length < 6) {
        return ResponseView.error(res, 'Mật khẩu mới phải có tối thiểu 6 ký tự.');
      }
      await AuthService.changePassword(req.user.id, old_password, new_password);
      return ResponseView.success(res, { changed: true }, 'Đổi mật khẩu thành công.');
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }
}

