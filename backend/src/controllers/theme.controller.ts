import { Request, Response } from 'express';
import { ThemeModel } from '../models/theme.model.js';
import { CategoryModel } from '../models/category.model.js';
import { ResponseView } from '../views/response.view.js';

export class ThemeController {
  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryModel.findAll();
      return ResponseView.success(res, categories, 'Lấy danh mục thành công.');
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }

  static async getThemes(req: Request, res: Response) {
    try {
      const {
        category,
        category_id,
        builder,
        q,
        min_price,
        max_price,
        currency = 'VND',
        sort = 'sales',
        page = '1',
        limit = '12',
      } = req.query;

      const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 12));
      const offset = (pageNum - 1) * limitNum;

      const parsedMin = min_price !== undefined ? parseFloat(min_price as string) : undefined;
      const parsedMax = max_price !== undefined ? parseFloat(max_price as string) : undefined;
      const parsedCatId = category_id !== undefined ? parseInt(category_id as string, 10) : undefined;

      const { themes, total } = await ThemeModel.findAll({
        category_slug: category ? (category as string).trim() : undefined,
        category_id: !isNaN(parsedCatId!) ? parsedCatId : undefined,
        builder: builder ? (builder as string).trim() : undefined,
        keyword: q ? (q as string).trim() : undefined,
        min_price: !isNaN(parsedMin!) ? parsedMin : undefined,
        max_price: !isNaN(parsedMax!) ? parsedMax : undefined,
        currency: currency === 'USD' ? 'USD' : 'VND',
        sort: sort as string,
        limit: limitNum,
        offset,
      });

      return ResponseView.success(res, {
        items: themes,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      }, 'Lấy danh sách theme thành công.');
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }

  static async getThemeBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const theme = await ThemeModel.findBySlug(slug as string);
      if (!theme) {
        return ResponseView.notFound(res, 'Không tìm thấy theme này.');
      }
      return ResponseView.success(res, theme, 'Lấy chi tiết theme thành công.');
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }
}
