import { RowDataPacket } from 'mysql2/promise';
import { dbPool, isDbOffline, markDbOffline } from '../config/database.js';

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
  created_at?: Date | string;
}

export class ThemeModel {
  static async findAll(params: {
    category_slug?: string;
    category_id?: number;
    builder?: string;
    keyword?: string;
    min_price?: number;
    max_price?: number;
    currency?: 'VND' | 'USD';
    sort?: 'sales' | 'newest' | 'price_asc' | 'price_desc' | 'rating' | string;
    limit?: number;
    offset?: number;
  }): Promise<{ themes: Theme[]; total: number }> {
    const limit = params.limit || 12;
    const offset = params.offset || 0;

    if (isDbOffline()) {
      let items = fallbackThemes.filter((t) => t.status === 'published');
      if (params.category_id) {
        items = items.filter((t) => t.category_id === params.category_id);
      }
      if (params.builder) {
        const b = params.builder.toLowerCase();
        items = items.filter((t) => t.page_builders.toLowerCase().includes(b));
      }
      if (params.keyword) {
        const q = params.keyword.toLowerCase();
        items = items.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.short_desc_vi.toLowerCase().includes(q) ||
            t.short_desc_en.toLowerCase().includes(q)
        );
      }
      if (params.min_price !== undefined && !isNaN(Number(params.min_price))) {
        const min = Number(params.min_price);
        items = items.filter((t) => (params.currency === 'USD' ? t.price_usd : t.price_vnd) >= min);
      }
      if (params.max_price !== undefined && !isNaN(Number(params.max_price))) {
        const max = Number(params.max_price);
        items = items.filter((t) => (params.currency === 'USD' ? t.price_usd : t.price_vnd) <= max);
      }
      return {
        themes: items.slice(offset, offset + limit),
        total: items.length,
      };
    }
    let whereClause = "WHERE status = 'published'";
    const queryParams: (string | number)[] = [];

    if (params.category_slug) {
      whereClause += " AND category_id = (SELECT id FROM categories WHERE slug = ? LIMIT 1)";
      queryParams.push(params.category_slug);
    } else if (params.category_id) {
      whereClause += " AND category_id = ?";
      queryParams.push(params.category_id);
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

    const priceCol = params.currency === 'USD' ? 'price_usd' : 'price_vnd';

    if (params.min_price !== undefined && !isNaN(Number(params.min_price))) {
      whereClause += ` AND ${priceCol} >= ?`;
      queryParams.push(Number(params.min_price));
    }

    if (params.max_price !== undefined && !isNaN(Number(params.max_price))) {
      whereClause += ` AND ${priceCol} <= ?`;
      queryParams.push(Number(params.max_price));
    }

    let orderByClause = "ORDER BY total_sales DESC, id DESC";
    switch (params.sort) {
      case 'newest':
        orderByClause = "ORDER BY created_at DESC, id DESC";
        break;
      case 'price_asc':
        orderByClause = `ORDER BY ${priceCol} ASC, id DESC`;
        break;
      case 'price_desc':
        orderByClause = `ORDER BY ${priceCol} DESC, id DESC`;
        break;
      case 'rating':
        orderByClause = "ORDER BY rating_avg DESC, rating_count DESC, id DESC";
        break;
      case 'sales':
      default:
        orderByClause = "ORDER BY total_sales DESC, id DESC";
        break;
    }

    try {
      const [countRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT COUNT(*) as total FROM themes ${whereClause}`,
        queryParams
      );
      const total = countRows[0]?.total || 0;

      const [rows] = await dbPool.query<RowDataPacket[]>(
        `SELECT * FROM themes ${whereClause} ${orderByClause} LIMIT ? OFFSET ?`,
        [...queryParams, limit, offset]
      );

      return { themes: rows as Theme[], total };
    } catch (err: any) {
      console.warn('[ThemeModel.findAll] DB Error, fallback in-memory:', err.message);
      let items = fallbackThemes.filter((t) => t.status === 'published');
      if (params.category_id) {
        items = items.filter((t) => t.category_id === params.category_id);
      }
      if (params.builder) {
        const b = params.builder.toLowerCase();
        items = items.filter((t) => t.page_builders.toLowerCase().includes(b));
      }
      if (params.keyword) {
        const q = params.keyword.toLowerCase();
        items = items.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.short_desc_vi.toLowerCase().includes(q) ||
            t.short_desc_en.toLowerCase().includes(q)
        );
      }
      if (params.min_price !== undefined && !isNaN(Number(params.min_price))) {
        const min = Number(params.min_price);
        items = items.filter((t) => (params.currency === 'USD' ? t.price_usd : t.price_vnd) >= min);
      }
      if (params.max_price !== undefined && !isNaN(Number(params.max_price))) {
        const max = Number(params.max_price);
        items = items.filter((t) => (params.currency === 'USD' ? t.price_usd : t.price_vnd) <= max);
      }
      return {
        themes: items.slice(offset, offset + limit),
        total: items.length,
      };
    }
  }

  static async findBySlug(slug: string): Promise<Theme | null> {
    if (isDbOffline()) {
      return fallbackThemes.find((t) => t.slug === slug && t.status === 'published') || null;
    }
    try {
      const [rows] = await dbPool.query<RowDataPacket[]>(
        'SELECT * FROM themes WHERE slug = ? AND status = "published" LIMIT 1',
        [slug]
      );
      if (rows.length) return rows[0] as Theme;
    } catch (err: any) {
      markDbOffline(err);
      console.warn('[ThemeModel.findBySlug] DB Error, fallback in-memory:', err.message);
    }
    return fallbackThemes.find((t) => t.slug === slug && t.status === 'published') || null;
  }

  static async findById(id: number): Promise<Theme | null> {
    if (isDbOffline()) {
      return fallbackThemes.find((t) => t.id === id && t.status === 'published') || null;
    }
    try {
      const [rows] = await dbPool.query<RowDataPacket[]>(
        'SELECT * FROM themes WHERE id = ? AND status = "published" LIMIT 1',
        [id]
      );
      if (rows.length) return rows[0] as Theme;
    } catch (err: any) {
      markDbOffline(err);
      console.warn('[ThemeModel.findById] DB Error, fallback in-memory:', err.message);
    }
    return fallbackThemes.find((t) => t.id === id && t.status === 'published') || null;
  }
}

const fallbackThemes: Theme[] = [
  {
    id: 1,
    author_id: 1,
    category_id: 1,
    name: 'Woodmart Multipurpose Theme',
    slug: 'woodmart',
    short_desc_vi: 'Theme bán hàng WooCommerce chuyên nghiệp, chuẩn SEO',
    short_desc_en: 'Professional WooCommerce theme',
    desc_vi: 'Woodmart Multipurpose Theme',
    desc_en: 'Woodmart Multipurpose Theme',
    current_version: '8.6.2',
    price_vnd: 890000,
    price_usd: 59,
    live_demo_url: 'https://woodmart.xtemos.com',
    thumbnail_url: '/assets/images/woodmart.webp',
    compatible_with: 'WordPress 6.0+, WooCommerce 9.0+',
    page_builders: 'Elementor, WPBakery',
    total_sales: 1540,
    rating_avg: 4.95,
    rating_count: 320,
    status: 'published',
    created_at: new Date('2026-10-12T08:00:00Z'),
  },
];
