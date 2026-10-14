import { Request, Response } from 'express';
import { OAuthService } from '../services/oauth.service.js';
import { ENV } from '../config/env.js';
import { ResponseView } from '../views/response.view.js';

export class OAuthController {
  static getProviders(_req: Request, res: Response) {
    return ResponseView.success(res, {
      google: {
        enabled: OAuthService.isGoogleConfigured(),
        auth_url: '/api/v1/auth/google',
      },
      github: {
        enabled: OAuthService.isGithubConfigured(),
        auth_url: '/api/v1/auth/github',
      },
    }, 'Danh sách nhà cung cấp xác thực OAuth');
  }

  static googleAuth(req: Request, res: Response) {
    try {
      if (!OAuthService.isGoogleConfigured()) {
        const message = 'Chưa cấu hình GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET trong backend/.env. Vui lòng thiết lập để đăng nhập Google.';
        return res.redirect(
          `${ENV.FRONTEND_URL}/login?error=GOOGLE_CONFIG_MISSING&provider=Google&message=${encodeURIComponent(message)}`
        );
      }
      const state = (req.query.state as string) || 'google_oauth_auth';
      const url = OAuthService.getGoogleAuthUrl(state);
      return res.redirect(url);
    } catch (error: any) {
      return res.redirect(
        `${ENV.FRONTEND_URL}/login?error=oauth_init_failed&provider=Google&message=${encodeURIComponent(error.message || 'Lỗi khởi tạo Google OAuth')}`
      );
    }
  }

  static async googleCallback(req: Request, res: Response) {
    try {
      if (req.query.error) {
        const errorDesc = String(req.query.error_description || req.query.error);
        return res.redirect(
          `${ENV.FRONTEND_URL}/login?error=oauth_cancelled&provider=Google&message=${encodeURIComponent(errorDesc)}`
        );
      }

      const code = req.query.code as string;
      if (!code) {
        return res.redirect(
          `${ENV.FRONTEND_URL}/login?error=missing_code&provider=Google&message=${encodeURIComponent('Không nhận được mã xác thực từ Google.')}`
        );
      }

      const { token } = await OAuthService.handleGoogleCallback(code);
      return res.redirect(
        `${ENV.FRONTEND_URL}/auth/callback?token=${encodeURIComponent(token)}&provider=google`
      );
    } catch (error: any) {
      return res.redirect(
        `${ENV.FRONTEND_URL}/login?error=oauth_failed&provider=Google&message=${encodeURIComponent(error.message || 'Đăng nhập Google thất bại.')}`
      );
    }
  }

  static githubAuth(req: Request, res: Response) {
    try {
      if (!OAuthService.isGithubConfigured()) {
        const message = 'Chưa cấu hình GITHUB_CLIENT_ID và GITHUB_CLIENT_SECRET trong backend/.env. Vui lòng thiết lập để đăng nhập GitHub.';
        return res.redirect(
          `${ENV.FRONTEND_URL}/login?error=GITHUB_CONFIG_MISSING&provider=GitHub&message=${encodeURIComponent(message)}`
        );
      }
      const state = (req.query.state as string) || 'github_oauth_auth';
      const url = OAuthService.getGithubAuthUrl(state);
      return res.redirect(url);
    } catch (error: any) {
      return res.redirect(
        `${ENV.FRONTEND_URL}/login?error=oauth_init_failed&provider=GitHub&message=${encodeURIComponent(error.message || 'Lỗi khởi tạo GitHub OAuth')}`
      );
    }
  }

  static async githubCallback(req: Request, res: Response) {
    try {
      if (req.query.error) {
        const errorDesc = String(req.query.error_description || req.query.error);
        return res.redirect(
          `${ENV.FRONTEND_URL}/login?error=oauth_cancelled&provider=GitHub&message=${encodeURIComponent(errorDesc)}`
        );
      }

      const code = req.query.code as string;
      if (!code) {
        return res.redirect(
          `${ENV.FRONTEND_URL}/login?error=missing_code&provider=GitHub&message=${encodeURIComponent('Không nhận được mã xác thực từ GitHub.')}`
        );
      }

      const { token } = await OAuthService.handleGithubCallback(code);
      return res.redirect(
        `${ENV.FRONTEND_URL}/auth/callback?token=${encodeURIComponent(token)}&provider=github`
      );
    } catch (error: any) {
      return res.redirect(
        `${ENV.FRONTEND_URL}/login?error=oauth_failed&provider=GitHub&message=${encodeURIComponent(error.message || 'Đăng nhập GitHub thất bại.')}`
      );
    }
  }
}
