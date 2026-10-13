import crypto from 'crypto';
import { ENV } from '../config/env.js';
import { SecurityLogger } from '../middlewares/security.middleware.js';

export class SePayService {
  /**
   * Sinh URL ảnh mã QR VietQR chuẩn ngân hàng
   * Hỗ trợ mọi app ngân hàng quét tự động điền số tiền và nội dung đơn hàng
   */
  static generateVietQrUrl(orderNumber: string, amountVnd: number): string {
    const bankBin = ENV.PAYMENTS.VIETQR_BANK_BIN || '970422'; // Ví dụ 970422 (MBBank)
    const bankAccount = ENV.PAYMENTS.VIETQR_BANK_ACCOUNT || '0987654321';
    const template = 'compact2';
    const description = encodeURIComponent(orderNumber);

    // Chuẩn API hình ảnh VietQR Quicklink
    return `https://img.vietqr.io/image/${bankBin}-${bankAccount}-${template}.png?amount=${amountVnd}&addInfo=${description}&accountName=${encodeURIComponent(ENV.PAYMENTS.VIETQR_ACCOUNT_NAME || 'THEMESTORE')}`;
  }

  /**
   * Xác thực an toàn Webhook SePAY với cơ chế chống Timing Attack (Constant Time Comparison)
   */
  static verifyWebhook(apiKeyHeader: string | undefined): boolean {
    const configuredKey = ENV.PAYMENTS.SEPAY_API_KEY;

    if (!configuredKey) {
      SecurityLogger.alert('UNCONFIGURED_WEBHOOK_API_KEY', 'Từ chối webhook vì chưa cấu hình SEPAY_API_KEY');
      return false;
    }

    if (!apiKeyHeader) {
      SecurityLogger.warn('WEBHOOK_MISSING_AUTH_HEADER', 'Webhook bị từ chối do thiếu header Authorization');
      return false;
    }

    // SePAY documents API-key webhooks as: Authorization: Apikey {API_KEY}.
    if (!apiKeyHeader.startsWith('Apikey ')) return false;
    const cleanHeader = apiKeyHeader.slice(7);

    try {
      const bufA = Buffer.from(cleanHeader);
      const bufB = Buffer.from(configuredKey);
      if (bufA.length !== bufB.length) return false;
      return crypto.timingSafeEqual(bufA, bufB);
    } catch {
      return false;
    }
  }
}
