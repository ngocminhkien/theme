import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { dbPool } from '../config/database.js';

export interface LicenseActivation {
  id: number;
  license_id: number;
  domain: string;
  ip_address?: string;
  activated_at: Date;
  is_active: boolean;
}

export interface License {
  id: number;
  license_key: string;
  order_id: number;
  theme_id: number;
  theme_name?: string;
  user_id?: number | null;
  license_type: 'regular' | 'agency' | 'lifetime';
  max_domains: number;
  active_domains_count: number;
  status: 'active' | 'expired' | 'revoked';
  expires_at?: Date | null;
  activations?: LicenseActivation[];
  created_at: Date;
}

// In-memory fallback cho license khi DB chưa sẵn sàng
const inMemoryLicenses = new Map<string, License>();
const inMemoryActivations: LicenseActivation[] = [];

export class LicenseModel {
  /**
   * Cấp phát mới License Key
   */
  static async create(data: {
    license_key: string;
    order_id: number;
    theme_id: number;
    user_id?: number | null;
    license_type?: 'regular' | 'agency' | 'lifetime';
    max_domains?: number;
  }): Promise<number> {
    const licenseType = data.license_type || 'regular';
    const maxDomains =
      data.max_domains ||
      (licenseType === 'lifetime' ? 999 : licenseType === 'agency' ? 5 : 1);

    try {
      const [result] = await dbPool.query<ResultSetHeader>(
        `INSERT INTO licenses (license_key, order_id, theme_id, user_id, license_type, max_domains)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          data.license_key,
          data.order_id,
          data.theme_id,
          data.user_id || null,
          licenseType,
          maxDomains,
        ]
      );
      return result.insertId;
    } catch (error: any) {
      console.warn('[LicenseModel.create] DB Error, lưu tạm in-memory:', error.message);
      const fallbackId = inMemoryLicenses.size + 1;
      inMemoryLicenses.set(data.license_key, {
        id: fallbackId,
        license_key: data.license_key,
        order_id: data.order_id,
        theme_id: data.theme_id,
        user_id: data.user_id || null,
        license_type: licenseType,
        max_domains: maxDomains,
        active_domains_count: 0,
        status: 'active',
        created_at: new Date(),
      });
      return fallbackId;
    }
  }

  /**
   * Tra cứu License theo mã Key
   */
  static async findByKey(key: string): Promise<License | null> {
    try {
      const [rows] = await dbPool.query<RowDataPacket[]>(
        `SELECT l.*, t.name as theme_name 
         FROM licenses l
         LEFT JOIN themes t ON l.theme_id = t.id
         WHERE l.license_key = ? LIMIT 1`,
        [key]
      );
      if (rows.length > 0) {
        const license = rows[0] as License;
        // Lấy danh sách domain đã kích hoạt
        const [actRows] = await dbPool.query<RowDataPacket[]>(
          'SELECT * FROM license_activations WHERE license_id = ? AND is_active = 1',
          [license.id]
        );
        license.activations = actRows as LicenseActivation[];
        return license;
      }
    } catch (error: any) {
      console.warn('[LicenseModel.findByKey] DB Error, tra cứu in-memory:', error.message);
    }

    const mem = inMemoryLicenses.get(key);
    if (mem) {
      mem.activations = inMemoryActivations.filter(
        (a) => a.license_id === mem.id && a.is_active
      );
      return mem;
    }
    return null;
  }

  /**
   * Lấy danh sách license của người dùng
   */
  static async findByUserId(userId: number): Promise<License[]> {
    try {
      const [rows] = await dbPool.query<RowDataPacket[]>(
        `SELECT l.*, t.name as theme_name, t.slug as theme_slug, t.thumbnail_url
         FROM licenses l
         LEFT JOIN themes t ON l.theme_id = t.id
         WHERE l.user_id = ? ORDER BY l.id DESC`,
        [userId]
      );
      return rows as License[];
    } catch (error: any) {
      console.warn('[LicenseModel.findByUserId] DB Error, tra cứu in-memory:', error.message);
      return Array.from(inMemoryLicenses.values()).filter(
        (l) => l.user_id === userId
      );
    }
  }

  /**
   * Kích hoạt Domain cho License
   */
  static async activateDomain(
    licenseKey: string,
    domain: string,
    ipAddress?: string
  ): Promise<{ success: boolean; message: string; remainingDomains?: number }> {
    const license = await this.findByKey(licenseKey);
    if (!license) {
      return { success: false, message: 'License Key không tồn tại trên hệ thống.' };
    }

    if (license.status !== 'active') {
      return { success: false, message: `License Key đã bị ${license.status === 'revoked' ? 'thu hồi' : 'hết hạn'}.` };
    }

    const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');

    // Kiểm tra xem domain đã kích hoạt chưa
    const existing = license.activations?.find(
      (a) => a.domain.toLowerCase() === cleanDomain && a.is_active
    );
    if (existing) {
      return {
        success: true,
        message: 'Domain này đã được kích hoạt trước đó.',
        remainingDomains: license.max_domains - license.active_domains_count,
      };
    }

    // Kiểm tra giới hạn số lượng domain
    if (license.active_domains_count >= license.max_domains) {
      return {
        success: false,
        message: `Đã đạt giới hạn kích hoạt tối đa (${license.max_domains} domain) cho gói ${license.license_type}. Vui lòng hủy domain cũ hoặc nâng cấp gói bản quyền.`,
      };
    }

    try {
      await dbPool.query(
        `INSERT INTO license_activations (license_id, domain, ip_address, is_active)
         VALUES (?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE is_active = 1, ip_address = VALUES(ip_address), last_check_at = CURRENT_TIMESTAMP`,
        [license.id, cleanDomain, ipAddress || null]
      );

      await dbPool.query(
        'UPDATE licenses SET active_domains_count = active_domains_count + 1 WHERE id = ?',
        [license.id]
      );

      return {
        success: true,
        message: `Kích hoạt thành công bản quyền cho domain: ${cleanDomain}`,
        remainingDomains: license.max_domains - (license.active_domains_count + 1),
      };
    } catch (error: any) {
      console.warn('[LicenseModel.activateDomain] DB Error, ghi nhận in-memory:', error.message);
      inMemoryActivations.push({
        id: inMemoryActivations.length + 1,
        license_id: license.id,
        domain: cleanDomain,
        ip_address: ipAddress,
        activated_at: new Date(),
        is_active: true,
      });
      license.active_domains_count += 1;
      return {
        success: true,
        message: `Kích hoạt thành công bản quyền cho domain: ${cleanDomain}`,
        remainingDomains: license.max_domains - license.active_domains_count,
      };
    }
  }

  /**
   * Hủy kích hoạt Domain (Deactivate) để khách chuyển sang site mới
   */
  static async deactivateDomain(
    licenseKey: string,
    domain: string
  ): Promise<{ success: boolean; message: string }> {
    const license = await this.findByKey(licenseKey);
    if (!license) {
      return { success: false, message: 'License Key không hợp lệ.' };
    }

    const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');

    try {
      const [res] = await dbPool.query<ResultSetHeader>(
        'UPDATE license_activations SET is_active = 0 WHERE license_id = ? AND domain = ? AND is_active = 1',
        [license.id, cleanDomain]
      );

      if (res.affectedRows > 0) {
        await dbPool.query(
          'UPDATE licenses SET active_domains_count = GREATEST(0, active_domains_count - 1) WHERE id = ?',
          [license.id]
        );
        return { success: true, message: `Đã hủy kích hoạt thành công domain: ${cleanDomain}` };
      }
      return { success: false, message: 'Domain này hiện không kích hoạt trên License Key này.' };
    } catch (error: any) {
      console.warn('[LicenseModel.deactivateDomain] DB Error, hủy trên in-memory:', error.message);
      const act = inMemoryActivations.find(
        (a) => a.license_id === license.id && a.domain === cleanDomain && a.is_active
      );
      if (act) {
        act.is_active = false;
        license.active_domains_count = Math.max(0, license.active_domains_count - 1);
        return { success: true, message: `Đã hủy kích hoạt thành công domain: ${cleanDomain}` };
      }
      return { success: false, message: 'Domain này hiện không kích hoạt trên License Key này.' };
    }
  }
}
