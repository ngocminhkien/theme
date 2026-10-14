import { ENV } from '../config/env.js';
import { UserModel, SafeUser } from '../models/user.model.js';
import { AuthService } from './auth.service.js';

interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

interface GithubUserInfo {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  email: string | null;
}

interface GithubEmailItem {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

export class OAuthService {
  static isGoogleConfigured(): boolean {
    const id = ENV.OAUTH.GOOGLE.CLIENT_ID?.trim() || '';
    const secret = ENV.OAUTH.GOOGLE.CLIENT_SECRET?.trim() || '';
    return (
      id.length > 5 &&
      secret.length > 5 &&
      !id.includes('your_') &&
      !secret.includes('your_')
    );
  }

  static isGithubConfigured(): boolean {
    const id = ENV.OAUTH.GITHUB.CLIENT_ID?.trim() || '';
    const secret = ENV.OAUTH.GITHUB.CLIENT_SECRET?.trim() || '';
    return (
      id.length > 5 &&
      secret.length > 5 &&
      !id.includes('your_') &&
      !secret.includes('your_')
    );
  }

  static getGoogleAuthUrl(state?: string): string {
    if (!this.isGoogleConfigured()) {
      throw new Error(
        'Chưa cấu hình GOOGLE_CLIENT_ID hoặc GOOGLE_CLIENT_SECRET trong backend/.env'
      );
    }
    const params = new URLSearchParams({
      client_id: ENV.OAUTH.GOOGLE.CLIENT_ID,
      redirect_uri: ENV.OAUTH.GOOGLE.CALLBACK_URL,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account',
      state: state || 'google_oauth_auth',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  static getGithubAuthUrl(state?: string): string {
    if (!this.isGithubConfigured()) {
      throw new Error(
        'Chưa cấu hình GITHUB_CLIENT_ID hoặc GITHUB_CLIENT_SECRET trong backend/.env'
      );
    }
    const params = new URLSearchParams({
      client_id: ENV.OAUTH.GITHUB.CLIENT_ID,
      redirect_uri: ENV.OAUTH.GITHUB.CALLBACK_URL,
      scope: 'read:user user:email',
      state: state || 'github_oauth_auth',
    });
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  static async handleGoogleCallback(code: string): Promise<{ user: SafeUser; token: string }> {
    if (!this.isGoogleConfigured()) {
      throw new Error('Google OAuth chưa được cấu hình Client ID và Secret.');
    }

    // 1. Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: ENV.OAUTH.GOOGLE.CLIENT_ID,
        client_secret: ENV.OAUTH.GOOGLE.CLIENT_SECRET,
        redirect_uri: ENV.OAUTH.GOOGLE.CALLBACK_URL,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorJson = (await tokenResponse.json().catch(() => ({}))) as Record<string, any>;
      const errorDesc = errorJson.error_description || errorJson.error || 'Trao đổi mã xác thực Google thất bại';
      throw new Error(`Google OAuth error: ${errorDesc}`);
    }

    const tokenData = (await tokenResponse.json()) as { access_token: string; id_token?: string };
    const accessToken = tokenData.access_token;

    // 2. Fetch Google profile
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error('Không thể lấy thông tin tài khoản Google của bạn.');
    }

    const profile = (await profileResponse.json()) as GoogleUserInfo;
    if (!profile.email) {
      throw new Error('Tài khoản Google không trả về địa chỉ email.');
    }

    // 3. Find or create user in database
    const user = await UserModel.findOrCreateOAuthUser({
      email: profile.email,
      full_name: profile.name || profile.given_name || profile.email.split('@')[0],
      avatar_url: profile.picture || null,
    });

    // 4. Generate JWT token
    const token = AuthService.generateToken(user);
    return { user, token };
  }

  static async handleGithubCallback(code: string): Promise<{ user: SafeUser; token: string }> {
    if (!this.isGithubConfigured()) {
      throw new Error('GitHub OAuth chưa được cấu hình Client ID và Secret.');
    }

    // 1. Exchange authorization code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: ENV.OAUTH.GITHUB.CLIENT_ID,
        client_secret: ENV.OAUTH.GITHUB.CLIENT_SECRET,
        code,
        redirect_uri: ENV.OAUTH.GITHUB.CALLBACK_URL,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Trao đổi mã xác thực GitHub thất bại.');
    }

    const tokenData = (await tokenResponse.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (tokenData.error || !tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error || 'Lỗi nhận token từ GitHub.');
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch GitHub profile
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'ThemeStore-OAuth-Client',
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!userResponse.ok) {
      throw new Error('Không thể lấy thông tin tài khoản GitHub.');
    }

    const githubUser = (await userResponse.json()) as GithubUserInfo;
    let email = githubUser.email;

    // 3. If email is private/hidden, fetch user emails list
    if (!email) {
      try {
        const emailsResponse = await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'User-Agent': 'ThemeStore-OAuth-Client',
            Accept: 'application/vnd.github.v3+json',
          },
        });
        if (emailsResponse.ok) {
          const emails = (await emailsResponse.json()) as GithubEmailItem[];
          const primaryVerified = emails.find((e) => e.primary && e.verified);
          const anyVerified = emails.find((e) => e.verified);
          email = primaryVerified?.email || anyVerified?.email || emails[0]?.email || null;
        }
      } catch {
        // fallback if email endpoint fails
      }
    }

    if (!email) {
      email = `${githubUser.login.toLowerCase()}@users.noreply.github.com`;
    }

    // 4. Find or create user
    const fullName = githubUser.name?.trim() || githubUser.login;
    const user = await UserModel.findOrCreateOAuthUser({
      email,
      full_name: fullName,
      avatar_url: githubUser.avatar_url || null,
    });

    // 5. Generate JWT token
    const token = AuthService.generateToken(user);
    return { user, token };
  }
}
