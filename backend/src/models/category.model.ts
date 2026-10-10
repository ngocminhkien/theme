import { RowDataPacket } from 'mysql2/promise';
import { dbPool } from '../config/database.js';

export interface Category {
  id: number;
  name_vi: string;
  name_en: string;
  slug: string;
  icon?: string;
  sort_order: number;
}

export class CategoryModel {
  static async findAll(): Promise<Category[]> {
    const [rows] = await dbPool.query<RowDataPacket[]>(
      'SELECT id, name_vi, name_en, slug, icon, sort_order FROM categories WHERE is_active = 1 ORDER BY sort_order ASC'
    );
    return rows as Category[];
  }
}
