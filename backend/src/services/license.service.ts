import crypto from 'crypto';

export class LicenseService {
  /**
   * Sinh chuỗi License Key ngẫu nhiên bảo mật định dạng: WD-XXXX-YYYY-ZZZZ-2026
   */
  static generateKey(): string {
    const p1 = crypto.randomBytes(2).toString('hex').toUpperCase();
    const p2 = crypto.randomBytes(2).toString('hex').toUpperCase();
    const p3 = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `WD-${p1}-${p2}-${p3}-2026`;
  }
}
