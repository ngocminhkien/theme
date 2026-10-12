import crypto from 'crypto';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { dbPool } from '../config/database.js';
import { ENV } from '../config/env.js';

export interface DownloadLogParams {
  userId?: number | null;
  licenseId?: number | null;
  themeId: number;
  themeVersionId: number;
  ipAddress: string;
  userAgent?: string;
}

export interface ThemeVersionRecord {
  id: number;
  theme_id: number;
  version: string;
  file_path: string;
  file_size_bytes?: number;
  is_stable: number;
}

export class StorageService {
  /**
   * Kiểm tra xem Cloud Storage (Cloudflare R2 / AWS S3) đã được cấu hình hay chưa
   */
  static isConfigured(): boolean {
    const driver = process.env.STORAGE_DRIVER || 'r2';
    if (driver === 'r2') {
      const accountId = process.env.R2_ACCOUNT_ID;
      const keyId = process.env.R2_ACCESS_KEY_ID;
      const secret = process.env.R2_SECRET_ACCESS_KEY;
      if (!accountId || !keyId || !secret) return false;
      if (accountId.startsWith('your_') || keyId.startsWith('your_') || secret.startsWith('your_')) return false;
      return true;
    }
    if (driver === 's3') {
      const bucket = process.env.AWS_S3_BUCKET;
      const keyId = process.env.AWS_ACCESS_KEY_ID;
      const secret = process.env.AWS_SECRET_ACCESS_KEY;
      if (!bucket || !keyId || !secret) return false;
      if (bucket.startsWith('your_') || keyId.startsWith('your_') || secret.startsWith('your_')) return false;
      return true;
    }
    return false;
  }

  /**
   * Sinh Presigned Download URL có thời hạn (mặc định 30 phút = 1800 giây)
   * Sử dụng cơ chế HMAC-SHA256 chống làm giả (Tamper-proof signature)
   */
  static async generatePresignedDownloadUrl(
    filePath: string,
    expiresInSeconds = 1800,
    licenseKey?: string
  ): Promise<string> {
    const secretKey =
      process.env.R2_SECRET_ACCESS_KEY ||
      process.env.AWS_SECRET_ACCESS_KEY ||
      ENV.JWT.SECRET ||
      'storage_presigned_secret_key_2026';

    const baseUrl =
      process.env.R2_PUBLIC_DOMAIN ||
      `https://${process.env.R2_BUCKET_NAME || 'theme-dist'}.r2.cloudflarestorage.com`;

    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const cleanPath = filePath.replace(/^\/+/, '');

    // Tạo chữ ký số HMAC-SHA256 trên (path + expiresAt + licenseKey)
    const payload = `${cleanPath}:${expiresAt}:${licenseKey || 'guest'}`;
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(payload)
      .digest('hex');

    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}/${cleanPath}${separator}expires=${expiresAt}&sig=${signature}`;
  }

  /**
   * Xác thực một Presigned Download URL
   */
  static verifyPresignedUrl(
    filePath: string,
    expiresAt: number,
    signature: string,
    licenseKey?: string
  ): boolean {
    const now = Math.floor(Date.now() / 1000);
    if (now > expiresAt) {
      return false; // Đã hết hạn TTL
    }

    const secretKey =
      process.env.R2_SECRET_ACCESS_KEY ||
      process.env.AWS_SECRET_ACCESS_KEY ||
      ENV.JWT.SECRET ||
      'storage_presigned_secret_key_2026';

    const cleanPath = filePath.replace(/^\/+/, '');
    const payload = `${cleanPath}:${expiresAt}:${licenseKey || 'guest'}`;
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(payload)
      .digest('hex');

    // So sánh chuỗi với timing-safe equal để chống Timing Attack
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(expectedSignature, 'utf8')
    );
  }

  /**
   * Lấy thông tin bản phát hành theme ổn định mới nhất từ bảng theme_versions
   */
  static async getLatestThemeVersion(themeId: number): Promise<ThemeVersionRecord | null> {
    try {
      const [rows] = await dbPool.query<RowDataPacket[]>(
        `SELECT id, theme_id, version, file_path, file_size_bytes, is_stable
         FROM theme_versions
         WHERE theme_id = ? AND is_stable = 1
         ORDER BY id DESC
         LIMIT 1`,
        [themeId]
      );
      if (!rows.length) return null;
      return rows[0] as ThemeVersionRecord;
    } catch (err: any) {
      console.warn('[StorageService.getLatestThemeVersion] DB error:', err.message);
      return null;
    }
  }

  /**
   * Ghi log bảo mật vào bảng download_logs khi khách hàng hoặc WordPress updater tải file
   */
  static async recordDownloadLog(params: DownloadLogParams): Promise<number | null> {
    try {
      const [result] = await dbPool.query<ResultSetHeader>(
        `INSERT INTO download_logs (user_id, license_id, theme_id, theme_version_id, ip_address, user_agent)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          params.userId || null,
          params.licenseId || null,
          params.themeId,
          params.themeVersionId,
          params.ipAddress || '127.0.0.1',
          (params.userAgent || 'ThemeStore Client').substring(0, 255),
        ]
      );
      return result.insertId;
    } catch (err: any) {
      console.warn('[StorageService.recordDownloadLog] Ghi log thất bại:', err.message);
      return null;
    }
  }
}
