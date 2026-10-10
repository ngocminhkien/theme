import { RowDataPacket } from 'mysql2/promise';
import { dbPool } from '../config/database.js';

export interface Theme {
  id: number;
  author_id: number;
  category_id: number;
  name: string;
  slug: string;
  short_desc_vi: string;
  short_desc_en: string;
  desc_vi: string;
  desc_en: string;
  current_version: string;
  price_vnd: number;
  price_usd: number;
  live_demo_url: string;
  thumbnail_url: string;
  compatible_with: string;
  page_builders: string;
  total_sales: number;
  rating_avg: number;
  rating_count: number;
  status: 'draft' | 'published' | 'archived';
}

export class ThemeModel {
  static async findAll(params: {
    category_slug?: string;
    builder?: string;
    keyword?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ themes: Theme[]; total: number }> {
    let whereClause = "WHERE status = 'published'";
    const queryParams: (string | number)[] = [];

    if (params.category_slug) {
      whereClause += " AND category_id = (SELECT id FROM categories WHERE slug = ? LIMIT 1)";
      queryParams.push(params.category_slug);
    }

    if (params.builder) {
      whereClause += " AND page_builders LIKE ?";
      queryParams.push(`%${params.builder}%`);
    }

    if (params.keyword) {
      whereClause += " AND (name LIKE ? OR short_desc_vi LIKE ? OR short_desc_en LIKE ?)";
      const term = `%${params.keyword}%`;
      queryParams.push(term, term, term);
    }

    const limit = params.limit || 12;
    const offset = params.offset || 0;

    const [countRows] = await dbPool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM themes ${whereClause}`,
      queryParams
    );
    const total = countRows[0]?.total || 0;

    const [rows] = await dbPool.query<RowDataPacket[]>(
      `SELECT * FROM themes ${whereClause} ORDER BY total_sales DESC, id DESC LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    return { themes: rows as Theme[], total };
  }

  static async findBySlug(slug: string): Promise<Theme | null> {
    const [rows] = await dbPool.query<RowDataPacket[]>(
      'SELECT * FROM themes WHERE slug = ? AND status = "published" LIMIT 1',
      [slug]
    );
    if (!rows.length) return null;
    return rows[0] as Theme;
  }
}
