import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { dbPool } from '../config/database.js';

export interface License {
  id: number;
  license_key: string;
  order_id: number;
  theme_id: number;
  user_id?: number;
  license_type: 'regular' | 'agency' | 'lifetime';
  max_domains: number;
  active_domains_count: number;
  status: 'active' | 'expired' | 'revoked';
  created_at: Date;
}

export class LicenseModel {
  static async create(data: {
    license_key: string;
    order_id: number;
    theme_id: number;
    user_id?: number;
    license_type?: string;
    max_domains?: number;
  }): Promise<number> {
    const [result] = await dbPool.query<ResultSetHeader>(
      `INSERT INTO licenses (license_key, order_id, theme_id, user_id, license_type, max_domains)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.license_key,
        data.order_id,
        data.theme_id,
        data.user_id || null,
        data.license_type || 'regular',
        data.max_domains || 1,
      ]
    );
    return result.insertId;
  }

  static async findByKey(key: string): Promise<License | null> {
    const [rows] = await dbPool.query<RowDataPacket[]>(
      'SELECT * FROM licenses WHERE license_key = ? LIMIT 1',
      [key]
    );
    if (!rows.length) return null;
    return rows[0] as License;
  }
}
