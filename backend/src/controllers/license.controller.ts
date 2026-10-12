import { Request, Response } from 'express';
import { LicenseModel } from '../models/license.model.js';
import { ResponseView } from '../views/response.view.js';
import { LicenseActivateSchema } from '../validators/payment.validator.js';
import { SecurityLogger } from '../middlewares/security.middleware.js';

export class LicenseController {
  /**
   * Kích hoạt bản quyền cho domain WordPress
   * Endpoint: POST /api/v1/licenses/activate
   */
  static async activate(req: Request, res: Response) {
    try {
      const parseResult = LicenseActivateSchema.safeParse(req.body);
      if (!parseResult.success) {
        const errorMsg = parseResult.error.errors.map((e) => e.message).join(', ');
        return ResponseView.error(res, errorMsg, 'VALIDATION_ERROR', 400);
      }

      const { license_key, domain } = parseResult.data;
      const clientIp = (req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1').split(',')[0].trim();

      const result = await LicenseModel.activateDomain(license_key, domain, clientIp);

      if (!result.success) {
        SecurityLogger.warn('LICENSE_ACTIVATION_REJECTED', {
          ip: clientIp,
          license_key,
          domain,
          reason: result.message,
        });
        return ResponseView.error(res, result.message, undefined, 400);
      }

      SecurityLogger.info('LICENSE_ACTIVATED', { ip: clientIp, license_key, domain });
      return ResponseView.success(res, result, result.message);
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }

  /**
   * Hủy kích hoạt domain cũ để chuyển sang domain mới
   * Endpoint: POST /api/v1/licenses/deactivate
   */
  static async deactivate(req: Request, res: Response) {
    try {
      const { license_key, domain } = req.body;

      if (!license_key || !domain) {
        return ResponseView.error(res, 'Vui lòng cung cấp đầy đủ license_key và domain.');
      }

      const result = await LicenseModel.deactivateDomain(license_key, domain);

      if (!result.success) {
        return ResponseView.error(res, result.message, undefined, 400);
      }

      return ResponseView.success(res, result, result.message);
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }

  /**
   * Lấy danh sách bản quyền của khách hàng (Cổng My Account)
   * Endpoint: GET /api/v1/licenses/my-licenses
   */
  static async getMyLicenses(req: Request, res: Response) {
    try {
      // Hỗ trợ lấy theo user_id hoặc demo user ID = 1
      const userId = Number(req.query.userId || (req as any).user?.id || 1);
      const licenses = await LicenseModel.findByUserId(userId);

      return ResponseView.success(res, licenses, 'Lấy danh sách bản quyền thành công.');
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }

  /**
   * Kiểm tra thông tin chi tiết của 1 License Key
   * Endpoint: GET /api/v1/licenses/verify
   */
  static async verify(req: Request, res: Response) {
    try {
      const key = (req.query.key as string) || (req.params.key as string);
      if (!key) {
        return ResponseView.error(res, 'Vui lòng cung cấp License Key cần xác thực.');
      }

      const license = await LicenseModel.findByKey(key);
      if (!license) {
        return ResponseView.notFound(res, 'License Key không tồn tại trên hệ thống.');
      }

      return ResponseView.success(res, {
        license_key: license.license_key,
        license_type: license.license_type,
        status: license.status,
        max_domains: license.max_domains,
        active_domains_count: license.active_domains_count,
        activations: license.activations || [],
        theme_name: license.theme_name || 'Woodmart Theme',
      }, 'Bản quyền hợp lệ.');
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }
}
