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

    // Trong production: BẮT BUỘC phải cấu hình API key
    if (ENV.NODE_ENV === 'production' && (!configuredKey || configuredKey === 'your_sepay_api_key_here')) {
      SecurityLogger.alert('UNCONFIGURED_WEBHOOK_SECRET_IN_PROD', 'Từ chối webhook vì chưa cấu hình SEPAY_API_KEY trên môi trường Production');
      return false;
    }

    // Trong local/dev/test: cho phép nếu chưa đổi placeholder
    if (!configuredKey || configuredKey === 'your_sepay_api_key_here') {
      return true;
    }

    if (!apiKeyHeader) {
      SecurityLogger.warn('WEBHOOK_MISSING_AUTH_HEADER', 'Webhook bị từ chối do thiếu header Authorization');
      return false;
    }

    const cleanHeader = apiKeyHeader.startsWith('Apikey ') ? apiKeyHeader.slice(7) : apiKeyHeader;

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
