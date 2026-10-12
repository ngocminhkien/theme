import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { dbPool } from '../config/database.js';

export interface Category {
  id: number;
  name_vi: string;
  name_en: string;
  slug: string;
  icon?: string | null;
  sort_order: number;
  is_active?: number;
  themes_count?: number;
}

export class CategoryModel {
  static async findAll(includeCount = true): Promise<Category[]> {
    if (includeCount) {
      try {
        const [rows] = await dbPool.query<RowDataPacket[]>(
          `SELECT c.id, c.name_vi, c.name_en, c.slug, c.icon, c.sort_order, c.is_active,
                  COUNT(t.id) AS themes_count
           FROM categories c
           LEFT JOIN themes t ON t.category_id = c.id AND t.status = 'published'
           WHERE c.is_active = 1
           GROUP BY c.id
           ORDER BY c.sort_order ASC, c.id ASC`
        );
        return rows.map((r) => ({ ...r, themes_count: Number(r.themes_count || 0) })) as Category[];
      } catch (err: any) {
        console.warn('[CategoryModel.findAll] fallback to simple query:', err.message);
      }
    }
    const [rows] = await dbPool.query<RowDataPacket[]>(
      'SELECT id, name_vi, name_en, slug, icon, sort_order, is_active FROM categories WHERE is_active = 1 ORDER BY sort_order ASC'
    );
    return rows.map((r) => ({ ...r, themes_count: 0 })) as Category[];
  }

  static async findById(id: number): Promise<Category | null> {
    const [rows] = await dbPool.query<RowDataPacket[]>(
      'SELECT id, name_vi, name_en, slug, icon, sort_order, is_active FROM categories WHERE id = ? LIMIT 1',
      [id]
    );
    if (!rows.length) return null;
    return rows[0] as Category;
  }

  static async findBySlug(slug: string): Promise<Category | null> {
    const [rows] = await dbPool.query<RowDataPacket[]>(
      'SELECT id, name_vi, name_en, slug, icon, sort_order, is_active FROM categories WHERE slug = ? LIMIT 1',
      [slug]
    );
    if (!rows.length) return null;
    return rows[0] as Category;
  }

  static async create(data: {
    name_vi: string;
    name_en: string;
    slug: string;
    icon?: string;
    sort_order?: number;
  }): Promise<number> {
    const [result] = await dbPool.query<ResultSetHeader>(
      'INSERT INTO categories (name_vi, name_en, slug, icon, sort_order) VALUES (?, ?, ?, ?, ?)',
      [data.name_vi, data.name_en, data.slug, data.icon || null, data.sort_order ?? 0]
    );
    return result.insertId;
  }

  static async update(id: number, data: Partial<Category>): Promise<boolean> {
    const updates: string[] = [];
    const values: (string | number | null)[] = [];
    if (data.name_vi !== undefined) { updates.push('name_vi = ?'); values.push(data.name_vi); }
    if (data.name_en !== undefined) { updates.push('name_en = ?'); values.push(data.name_en); }
    if (data.slug !== undefined) { updates.push('slug = ?'); values.push(data.slug); }
    if (data.icon !== undefined) { updates.push('icon = ?'); values.push(data.icon || null); }
    if (data.sort_order !== undefined) { updates.push('sort_order = ?'); values.push(data.sort_order); }
    if (data.is_active !== undefined) { updates.push('is_active = ?'); values.push(data.is_active); }
    if (!updates.length) return true;
    values.push(id);
    const [result] = await dbPool.query<ResultSetHeader>(
      `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }
}

