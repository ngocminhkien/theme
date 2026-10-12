import { Request, Response } from 'express';
import { CategoryModel } from '../models/category.model.js';
import { ResponseView } from '../views/response.view.js';

export class CategoryController {
  /**
   * Lấy danh sách danh mục (hỗ trợ đếm themes và song ngữ VI/EN)
   * GET /api/v1/categories
   */
  static async getAll(req: Request, res: Response) {
    try {
      const includeCount = req.query.include_count !== 'false';
      const categories = await CategoryModel.findAll(includeCount);
      return ResponseView.success(res, categories, 'Lấy danh sách danh mục thành công.');
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }

  /**
   * Lấy chi tiết danh mục theo Slug
   * GET /api/v1/categories/:slug
   */
  static async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const category = await CategoryModel.findBySlug(slug as string);
      if (!category) {
        return ResponseView.notFound(res, 'Không tìm thấy danh mục này.');
      }
      return ResponseView.success(res, category, 'Lấy chi tiết danh mục thành công.');
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }

  /**
   * Tạo mới danh mục (Admin)
   * POST /api/v1/categories
   */
  static async create(req: Request, res: Response) {
    try {
      const { name_vi, name_en, slug, icon, sort_order } = req.body;
      if (!name_vi || !name_en || !slug) {
        return ResponseView.error(res, 'Vui lòng cung cấp name_vi, name_en và slug cho danh mục.');
      }

      const existing = await CategoryModel.findBySlug(slug);
      if (existing) {
        return ResponseView.error(res, 'Slug danh mục này đã tồn tại.');
      }

      const newId = await CategoryModel.create({
        name_vi,
        name_en,
        slug,
        icon,
        sort_order: sort_order ? parseInt(sort_order, 10) : 0,
      });

      const created = await CategoryModel.findById(newId);
      return ResponseView.created(res, created, 'Tạo danh mục mới thành công.');
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }

  /**
   * Cập nhật danh mục (Admin)
   * PUT /api/v1/categories/:id
   */
  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) {
        return ResponseView.error(res, 'ID danh mục không hợp lệ.');
      }

      const existing = await CategoryModel.findById(id);
      if (!existing) {
        return ResponseView.notFound(res, 'Không tìm thấy danh mục cần cập nhật.');
      }

      await CategoryModel.update(id, req.body);
      const updated = await CategoryModel.findById(id);
      return ResponseView.success(res, updated, 'Cập nhật danh mục thành công.');
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }
}
