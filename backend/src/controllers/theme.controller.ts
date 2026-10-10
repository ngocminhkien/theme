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
      const { category, builder, q, page = '1', limit = '12' } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const offset = (pageNum - 1) * limitNum;

      const { themes, total } = await ThemeModel.findAll({
        category_slug: category as string,
        builder: builder as string,
        keyword: q as string,
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
      const slug = req.params.slug as string;
      const theme = await ThemeModel.findBySlug(slug);
      if (!theme) {
        return ResponseView.notFound(res, 'Không tìm thấy theme này.');
      }
      return ResponseView.success(res, theme, 'Lấy chi tiết theme thành công.');
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }
}
