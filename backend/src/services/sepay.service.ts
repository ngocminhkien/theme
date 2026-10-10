import { ENV } from '../config/env.js';

export class SePayService {
  /**
   * Sinh URL ảnh mã QR VietQR chuẩn ngân hàng
   * Hỗ trợ mọi app ngân hàng quét tự động điền số tiền và nội dung đơn hàng
   */
  static generateVietQrUrl(orderNumber: string, amountVnd: number): string {
    const bankBin = ENV.PAYMENTS.VIETQR_BANK_BIN; // Ví dụ 970422 (MBBank)
    const bankAccount = ENV.PAYMENTS.VIETQR_BANK_ACCOUNT;
    const template = 'compact2';
    const description = encodeURIComponent(orderNumber);

    // Chuẩn API hình ảnh VietQR Quicklink
    return `https://img.vietqr.io/image/${bankBin}-${bankAccount}-${template}.png?amount=${amountVnd}&addInfo=${description}&accountName=${encodeURIComponent(ENV.PAYMENTS.VIETQR_ACCOUNT_NAME)}`;
  }

  /**
   * Xác thực Webhook gửi từ SePAY
   */
  static verifyWebhook(apiKeyHeader: string | undefined): boolean {
    const configuredKey = ENV.PAYMENTS.SEPAY_API_KEY;
    // Nếu chưa cấu hình key thật hoặc đang dùng placeholder trong môi trường dev
    if (!configuredKey || configuredKey === 'your_sepay_api_key_here') {
      return true;
    }
    return apiKeyHeader === `Apikey ${configuredKey}` || apiKeyHeader === configuredKey;
  }
}
