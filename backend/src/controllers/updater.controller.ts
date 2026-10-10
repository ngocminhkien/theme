import { Request, Response } from 'express';
import { LicenseModel } from '../models/license.model.js';
import { ResponseView } from '../views/response.view.js';

export class UpdaterController {
  /**
   * Endpoint phục vụ WordPress Client kiểm tra bản cập nhật
   * Tương thích với thư viện plugin-update-checker (PUC)
   */
  static async checkForUpdates(req: Request, res: Response) {
    try {
      const { license_key, version = '1.0.0' } = req.query;

      if (!license_key) {
        return ResponseView.unauthorized(res, 'Vui lòng cung cấp License Key hợp lệ.');
      }

      const license = await LicenseModel.findByKey(license_key as string);
      if (!license || license.status !== 'active') {
        return ResponseView.unauthorized(res, 'License Key không hợp lệ hoặc đã bị khóa.');
      }

      const latestVersion = '8.6.2';
      // Trả về metadata cập nhật theo format chuẩn WordPress Update Checker
      return res.json({
        name: 'Woodmart Theme',
        slug: 'woodmart',
        version: latestVersion,
        requires: '6.0',
        tested: '6.7',
        requires_php: '7.4',
        download_url: `/api/v1/updater/download?license_key=${license_key}`,
        sections: {
          description: 'Woodmart WooCommerce Multipurpose Theme',
          changelog: '<h4>8.6.2 (10/10/2026)</h4><ul><li>Tối ưu hóa hiệu năng và Core Web Vitals</li><li>Hỗ trợ cổng thanh toán VietQR tự động</li></ul>',
        },
      });
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }
}
