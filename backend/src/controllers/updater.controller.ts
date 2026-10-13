import { Request, Response } from 'express';
import { LicenseModel } from '../models/license.model.js';
import { ResponseView } from '../views/response.view.js';
import { dbPool } from '../config/database.js';
import { StorageService } from '../services/storage.service.js';

export class UpdaterController {
  /**
   * Endpoint phục vụ WordPress Client kiểm tra bản cập nhật
   * Tương thích 100% với thư viện plugin-update-checker (PUC)
   * Endpoint: GET /api/v1/updater/check
   */
  static async checkForUpdates(req: Request, res: Response) {
    try {
      const { license_key, version = '1.0.0', theme_slug = 'woodmart' } = req.query;

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
        name: 'Woodmart Multipurpose Theme',
        slug: theme_slug,
        version: latestVersion,
        requires: '6.0',
        tested: '6.7',
        requires_php: '7.4',
        download_url: `${req.protocol}://${req.get('host')}/api/v1/updater/download?license_key=${license_key}`,
        sections: {
          description: 'Woodmart - E-Commerce Multipurpose Theme bản quyền chính hãng.',
          changelog: `
            <h4>Phiên bản 8.6.2 (10/10/2026)</h4>
            <ul>
              <li>Tối ưu hóa Core Web Vitals đạt 95+ điểm trên Mobile.</li>
              <li>Hỗ trợ cổng thanh toán VietQR tự động 3 giây.</li>
              <li>Tương thích WooCommerce 9.x và WordPress 6.7.</li>
            </ul>
          `,
        },
      });
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }

  /**
   * Endpoint bảo mật cho phép tải gói cài đặt .zip của theme
   * Tự động lưu vết audit log vào bảng download_logs
   * Endpoint: GET /api/v1/updater/download
   */
  static async downloadThemePackage(req: Request, res: Response) {
    try {
      const { license_key } = req.query;

      if (!license_key) {
        return ResponseView.unauthorized(res, 'Yêu cầu License Key để tải bản cập nhật.');
      }

      const license = await LicenseModel.findByKey(license_key as string);
      if (!license || license.status !== 'active') {
        return ResponseView.unauthorized(res, 'License Key không hợp lệ hoặc đã hết hạn.');
      }

      if (!StorageService.isConfigured()) {
        return ResponseView.error(
          res,
          'Kho tệp tải bảo mật chưa được cấu hình. License của bạn vẫn hợp lệ; vui lòng thử lại sau.',
          'DOWNLOAD_NOT_CONFIGURED',
          503
        );
      }

      const clientIp = req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1';
      const userAgent = req.headers['user-agent'] || 'WordPress/PUC';

      // Ghi log vào bảng download_logs để kiểm soát và ngăn chặn hành vi tải hàng loạt
      await StorageService.recordDownloadLog({
        userId: license.user_id,
        licenseId: license.id,
        themeId: license.theme_id || 1,
        themeVersionId: 1,
        ipAddress: clientIp,
        userAgent,
      });

      // Sinh link tải gói nén an toàn (Presigned URL 30 phút trên Cloudflare R2 / AWS S3)
      const presignedDownloadUrl = await StorageService.generatePresignedDownloadUrl(
        'packages/woodmart/woodmart-8.6.2.zip',
        1800,
        license.license_key
      );

      // Chuyển hướng 302 an toàn đến link tải trực tiếp
      return res.redirect(presignedDownloadUrl);
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }
}
