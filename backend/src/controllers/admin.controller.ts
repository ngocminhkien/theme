import { Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { dbPool } from '../config/database.js';
import { ResponseView } from '../views/response.view.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export class AdminController {
  /**
   * Thống kê Dashboard tổng quan (chỉ tính số liệu thật từ DB, doanh thu từ đơn đã thanh toán)
   * GET /api/v1/admin/stats
   */
  static async getDashboardStats(_req: AuthRequest, res: Response) {
    try {
      // 1. Doanh thu: chỉ tính đơn đã thanh toán. VND và USD phải tách riêng:
      // không có tỷ giá chính thức để quy đổi hay cộng lẫn hai loại tiền tệ.
      const [revRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT currency, COALESCE(SUM(total_amount), 0) AS total_revenue
         FROM orders
         WHERE payment_status = 'paid'
         GROUP BY currency`
      );
      const revenue = { vnd: 0, usd: 0 };
      for (const row of revRows) {
        if (row.currency === 'VND') revenue.vnd = Number(row.total_revenue || 0);
        if (row.currency === 'USD') revenue.usd = Number(row.total_revenue || 0);
      }

      // 2. Thống kê đơn hàng
      const [orderCountRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT 
          COUNT(*) AS total_orders,
          COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END), 0) AS paid_orders,
          COALESCE(SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END), 0) AS pending_orders,
          COALESCE(SUM(CASE WHEN payment_status = 'failed' THEN 1 ELSE 0 END), 0) AS failed_orders
         FROM orders`
      );
      const orderStats = orderCountRows[0] || {
        total_orders: 0, paid_orders: 0, pending_orders: 0, failed_orders: 0,
      };

      // 3. Tổng số themes
      const [themeCountRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS total_themes FROM themes`
      );
      const totalThemes = Number(themeCountRows[0]?.total_themes || 0);

      // 4. Tổng số khách hàng (role = 'customer')
      const [customerCountRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS total_customers FROM users WHERE role = 'customer'`
      );
      const totalCustomers = Number(customerCountRows[0]?.total_customers || 0);

      // 5. Tổng số license đang active
      const [licenseCountRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS active_licenses FROM licenses WHERE status = 'active'`
      );
      const activeLicenses = Number(licenseCountRows[0]?.active_licenses || 0);

      // 6. 5 đơn hàng gần nhất
      const [recentOrderRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT id, order_number, customer_name, customer_email, total_amount, currency,
                payment_method, payment_status, order_status, created_at
         FROM orders
         ORDER BY created_at DESC, id DESC
         LIMIT 5`
      );

      return ResponseView.success(res, {
        revenue,
        orders: {
          total: Number(orderStats.total_orders),
          paid: Number(orderStats.paid_orders),
          pending: Number(orderStats.pending_orders),
          failed: Number(orderStats.failed_orders),
        },
        themes_count: totalThemes,
        customers_count: totalCustomers,
        active_licenses_count: activeLicenses,
        recent_orders: recentOrderRows.map(o => ({
          ...o,
          total_amount: Number(o.total_amount),
        })),
      }, 'Lấy thống kê dashboard thành công.');
    } catch (error: any) {
      return ResponseView.error(res, error.message || 'Lỗi truy vấn dữ liệu thống kê.', 'DASHBOARD_QUERY_ERROR', 500);
    }
  }

  /**
   * Báo cáo doanh thu/đơn hàng theo ngày và các theme được mua nhiều nhất.
   * GET /api/v1/admin/analytics?days=30
   */
  static async getAnalytics(req: AuthRequest, res: Response) {
    try {
      const requestedDays = Number.parseInt(req.query.days as string, 10);
      const days = [7, 30, 90].includes(requestedDays) ? requestedDays : 30;

      const [seriesRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT DATE(created_at) AS date,
                COALESCE(SUM(CASE WHEN currency = 'VND' THEN total_amount ELSE 0 END), 0) AS revenue_vnd,
                COALESCE(SUM(CASE WHEN currency = 'USD' THEN total_amount ELSE 0 END), 0) AS revenue_usd,
                COUNT(*) AS orders
         FROM orders
         WHERE payment_status = 'paid'
           AND created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
         GROUP BY DATE(created_at)
         ORDER BY DATE(created_at) ASC`,
        [days]
      );

      const [topThemeRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT t.id, t.name, t.slug, COUNT(*) AS purchases,
                COALESCE(SUM(CASE WHEN o.currency = 'VND' THEN oi.unit_price ELSE 0 END), 0) AS revenue_vnd,
                COALESCE(SUM(CASE WHEN o.currency = 'USD' THEN oi.unit_price ELSE 0 END), 0) AS revenue_usd
         FROM order_items oi
         INNER JOIN orders o ON o.id = oi.order_id AND o.payment_status = 'paid'
         INNER JOIN themes t ON t.id = oi.theme_id
         WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
         GROUP BY t.id, t.name, t.slug
         ORDER BY purchases DESC, t.id ASC
         LIMIT 5`,
        [days]
      );

      return ResponseView.success(res, {
        period_days: days,
        series: seriesRows.map((row) => ({
          date: row.date,
          revenue_vnd: Number(row.revenue_vnd || 0),
          revenue_usd: Number(row.revenue_usd || 0),
          orders: Number(row.orders || 0),
        })),
        top_themes: topThemeRows.map((row) => ({
          ...row,
          purchases: Number(row.purchases || 0),
          revenue_vnd: Number(row.revenue_vnd || 0),
          revenue_usd: Number(row.revenue_usd || 0),
        })),
      });
    } catch (error: any) {
      return ResponseView.error(res, error.message || 'Lỗi tải báo cáo.', 'ANALYTICS_QUERY_ERROR', 500);
    }
  }

  /**
   * Danh sách đơn hàng có tìm kiếm và phân trang
   * GET /api/v1/admin/orders
   */
  static async getOrders(req: AuthRequest, res: Response) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
      const offset = (page - 1) * limit;

      const search = ((req.query.search as string) || '').trim();
      const status = ((req.query.status as string) || '').trim();
      const dateFrom = ((req.query.date_from as string) || '').trim();
      const dateTo = ((req.query.date_to as string) || '').trim();

      const conditions: string[] = [];
      const params: any[] = [];

      if (search) {
        conditions.push('(order_number LIKE ? OR customer_email LIKE ? OR customer_name LIKE ?)');
        const searchLike = `%${search}%`;
        params.push(searchLike, searchLike, searchLike);
      }

      if (status) {
        conditions.push('(payment_status = ? OR order_status = ?)');
        params.push(status, status);
      }
      if (dateFrom) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateFrom)) return ResponseView.error(res, 'Ngày bắt đầu không hợp lệ.', 'INVALID_DATE', 400);
        conditions.push('created_at >= ?');
        params.push(`${dateFrom} 00:00:00`);
      }
      if (dateTo) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateTo)) return ResponseView.error(res, 'Ngày kết thúc không hợp lệ.', 'INVALID_DATE', 400);
        conditions.push('created_at < DATE_ADD(?, INTERVAL 1 DAY)');
        params.push(dateTo);
      }

      const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

      // Đếm tổng số
      const [countRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS total FROM orders ${whereClause}`,
        params
      );
      const total = Number(countRows[0]?.total || 0);

      // Lấy dữ liệu
      const [orderRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT id, order_number, user_id, customer_email, customer_name, customer_phone,
                total_amount, currency, payment_method, payment_status, order_status, created_at
         FROM orders
         ${whereClause}
         ORDER BY created_at DESC, id DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      return ResponseView.success(res, {
        orders: orderRows.map(o => ({
          ...o,
          total_amount: Number(o.total_amount),
        })),
        pagination: {
          page,
          limit,
          total,
          total_pages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      return ResponseView.error(res, error.message || 'Lỗi tải danh sách đơn hàng.', 'ORDERS_QUERY_ERROR', 500);
    }
  }

  /**
   * Chi tiết một đơn hàng
   * GET /api/v1/admin/orders/:orderNumber
   */
  static async getOrderDetail(req: AuthRequest, res: Response) {
    try {
      const orderNumber = req.params.orderNumber as string;
      const [orderRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT * FROM orders WHERE order_number = ? LIMIT 1`,
        [orderNumber]
      );
      if (!orderRows.length) {
        return ResponseView.notFound(res, 'Không tìm thấy đơn hàng.');
      }
      const order = orderRows[0];

      // Chi tiết sản phẩm trong đơn
      const [itemRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT oi.*, t.name as theme_name, t.slug as theme_slug
         FROM order_items oi
         LEFT JOIN themes t ON oi.theme_id = t.id
         WHERE oi.order_id = ?`,
        [order.id]
      );

      // Licenses đã cấp (nếu có)
      const [licenseRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT l.*, t.name as theme_name
         FROM licenses l
         LEFT JOIN themes t ON l.theme_id = t.id
         WHERE l.order_id = ?`,
        [order.id]
      );

      // Giao dịch thanh toán (nếu có)
      const [paymentRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT id, transaction_id, gateway, amount, currency, status, created_at
         FROM payments WHERE order_id = ?`,
        [order.id]
      );

      return ResponseView.success(res, {
        ...order,
        total_amount: Number(order.total_amount),
        items: itemRows.map(i => ({
          ...i,
          unit_price: Number(i.unit_price),
          subtotal: Number(i.subtotal),
        })),
        licenses: licenseRows,
        payments: paymentRows,
      });
    } catch (error: any) {
      return ResponseView.error(res, error.message || 'Lỗi tải chi tiết đơn hàng.', 'ORDER_DETAIL_ERROR', 500);
    }
  }

  /**
   * Danh sách themes quản trị
   * GET /api/v1/admin/themes
   */
  static async getThemes(req: AuthRequest, res: Response) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
      const offset = (page - 1) * limit;

      const search = ((req.query.search as string) || '').trim();
      const status = ((req.query.status as string) || '').trim();
      const categoryId = Number.parseInt(req.query.category_id as string, 10);

      const conditions: string[] = [];
      const params: any[] = [];

      if (search) {
        conditions.push('(t.name LIKE ? OR t.slug LIKE ?)');
        const searchLike = `%${search}%`;
        params.push(searchLike, searchLike);
      }

      if (status) {
        conditions.push('t.status = ?');
        params.push(status);
      }
      if (Number.isInteger(categoryId) && categoryId > 0) {
        conditions.push('t.category_id = ?');
        params.push(categoryId);
      }
      const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

      const [countRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS total FROM themes t ${whereClause}`,
        params
      );
      const total = Number(countRows[0]?.total || 0);

      const [themeRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT t.id, t.category_id, t.name, t.slug, t.thumbnail_url, t.price_vnd, t.price_usd, t.current_version,
                t.status, t.is_featured, t.total_sales, t.rating_avg, t.rating_count,
                t.created_at, c.name_vi as category_name, u.full_name as author_name
         FROM themes t
         LEFT JOIN categories c ON t.category_id = c.id
         LEFT JOIN users u ON t.author_id = u.id
         ${whereClause}
         ORDER BY t.id ASC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      return ResponseView.success(res, {
        themes: themeRows.map(t => ({
          ...t,
          price_vnd: Number(t.price_vnd),
          price_usd: Number(t.price_usd),
          rating_avg: Number(t.rating_avg),
        })),
        pagination: {
          page,
          limit,
          total,
          total_pages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      return ResponseView.error(res, error.message || 'Lỗi tải danh sách themes.', 'THEMES_QUERY_ERROR', 500);
    }
  }

  /**
   * Tạo theme ở trạng thái draft/published theo dữ liệu catalogue hiện có.
   * POST /api/v1/admin/themes
   */
  static async createTheme(req: AuthRequest, res: Response) {
    try {
      const { name, slug, price_vnd, price_usd, status = 'draft', short_desc_vi = '', live_demo_url, thumbnail_url, category_id } = req.body;
      const normalizedName = typeof name === 'string' ? name.trim() : '';
      const normalizedSlug = typeof slug === 'string' ? slug.trim() : '';
      const priceVnd = Number(price_vnd);
      const priceUsd = Number(price_usd);
      const categoryId = category_id === undefined || category_id === '' ? null : Number(category_id);

      if (!normalizedName || normalizedName.length > 200 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)) {
        return ResponseView.error(res, 'Tên hoặc slug theme không hợp lệ.', 'INVALID_THEME_INPUT', 400);
      }
      if (!Number.isFinite(priceVnd) || priceVnd < 0 || !Number.isFinite(priceUsd) || priceUsd < 0) {
        return ResponseView.error(res, 'Giá theme không hợp lệ.', 'INVALID_THEME_PRICE', 400);
      }
      if (!['draft', 'published', 'archived'].includes(status) || !this.isHttpUrl(live_demo_url) || !this.isHttpUrl(thumbnail_url)) {
        return ResponseView.error(res, 'Trạng thái hoặc URL theme không hợp lệ.', 'INVALID_THEME_INPUT', 400);
      }
      if (categoryId !== null && (!Number.isInteger(categoryId) || categoryId <= 0)) {
        return ResponseView.error(res, 'Danh mục theme không hợp lệ.', 'INVALID_CATEGORY', 400);
      }
      if (categoryId !== null) {
        const [categories] = await dbPool.query<RowDataPacket[]>('SELECT id FROM categories WHERE id = ? LIMIT 1', [categoryId]);
        if (!categories.length) return ResponseView.error(res, 'Danh mục không tồn tại.', 'CATEGORY_NOT_FOUND', 400);
      }

      const [result] = await dbPool.query<ResultSetHeader>(
        `INSERT INTO themes (author_id, category_id, name, slug, short_desc_vi, price_vnd, price_usd, live_demo_url, thumbnail_url, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.user!.id, categoryId, normalizedName, normalizedSlug, typeof short_desc_vi === 'string' ? short_desc_vi.trim() : '', priceVnd, priceUsd, live_demo_url.trim(), thumbnail_url.trim(), status]
      );
      return ResponseView.success(res, { id: result.insertId }, 'Tạo theme thành công.', 201);
    } catch (error: any) {
      if (error?.code === 'ER_DUP_ENTRY') {
        return ResponseView.error(res, 'Slug theme đã tồn tại.', 'THEME_SLUG_EXISTS', 409);
      }
      return ResponseView.error(res, error.message || 'Lỗi tạo theme.', 'CREATE_THEME_ERROR', 500);
    }
  }

  /**
   * Chi tiết Theme
   * GET /api/v1/admin/themes/:id
   */
  static async getThemeDetail(req: AuthRequest, res: Response) {
    try {
      const themeId = parseInt(req.params.id as string, 10);
      if (isNaN(themeId)) return ResponseView.error(res, 'ID theme không hợp lệ.', 'INVALID_ID', 400);

      const [rows] = await dbPool.query<RowDataPacket[]>(
        `SELECT t.*, c.name_vi as category_name, u.full_name as author_name
         FROM themes t
         LEFT JOIN categories c ON t.category_id = c.id
         LEFT JOIN users u ON t.author_id = u.id
         WHERE t.id = ? LIMIT 1`,
        [themeId]
      );

      if (!rows.length) return ResponseView.notFound(res, 'Không tìm thấy theme.');
      const theme = rows[0];

      return ResponseView.success(res, {
        ...theme,
        price_vnd: Number(theme.price_vnd),
        price_usd: Number(theme.price_usd),
        rating_avg: Number(theme.rating_avg),
      });
    } catch (error: any) {
      return ResponseView.error(res, error.message || 'Lỗi tải theme.', 'THEME_DETAIL_ERROR', 500);
    }
  }

  /**
   * Cập nhật thông tin Theme
   * PUT /api/v1/admin/themes/:id
   */
  static async updateTheme(req: AuthRequest, res: Response) {
    try {
      const themeId = parseInt(req.params.id as string, 10);
      if (isNaN(themeId)) return ResponseView.error(res, 'ID theme không hợp lệ.', 'INVALID_ID', 400);

      const { name, price_vnd, price_usd, status, short_desc_vi, live_demo_url, thumbnail_url, category_id } = req.body;

      const fields: string[] = [];
      const params: any[] = [];

      if (name !== undefined) {
        if (typeof name !== 'string' || !name.trim() || name.trim().length > 200) {
          return ResponseView.error(res, 'Tên theme không hợp lệ.', 'INVALID_THEME_INPUT', 400);
        }
        fields.push('name = ?');
        params.push(name.trim());
      }
      if (price_vnd !== undefined) {
        const pVnd = Number(price_vnd);
        if (!Number.isFinite(pVnd) || pVnd < 0) return ResponseView.error(res, 'Giá VND không hợp lệ.', 'INVALID_THEME_PRICE', 400);
        fields.push('price_vnd = ?');
        params.push(pVnd);
      }
      if (price_usd !== undefined) {
        const pUsd = Number(price_usd);
        if (!Number.isFinite(pUsd) || pUsd < 0) return ResponseView.error(res, 'Giá USD không hợp lệ.', 'INVALID_THEME_PRICE', 400);
        fields.push('price_usd = ?');
        params.push(pUsd);
      }
      if (status !== undefined) {
        if (!['draft', 'published', 'archived'].includes(status)) return ResponseView.error(res, 'Trạng thái theme không hợp lệ.', 'INVALID_THEME_INPUT', 400);
        fields.push('status = ?');
        params.push(status);
      }
      if (short_desc_vi !== undefined) {
        if (typeof short_desc_vi !== 'string') return ResponseView.error(res, 'Mô tả theme không hợp lệ.', 'INVALID_THEME_INPUT', 400);
        fields.push('short_desc_vi = ?');
        params.push(short_desc_vi);
      }
      if (live_demo_url !== undefined) {
        if (!this.isHttpUrl(live_demo_url)) return ResponseView.error(res, 'Live demo URL không hợp lệ.', 'INVALID_THEME_INPUT', 400);
        fields.push('live_demo_url = ?');
        params.push(live_demo_url.trim());
      }
      if (thumbnail_url !== undefined) {
        if (!this.isHttpUrl(thumbnail_url)) return ResponseView.error(res, 'Thumbnail URL không hợp lệ.', 'INVALID_THEME_INPUT', 400);
        fields.push('thumbnail_url = ?');
        params.push(thumbnail_url.trim());
      }
      if (category_id !== undefined) {
        const normalizedCategoryId = category_id === '' || category_id === null ? null : Number(category_id);
        if (normalizedCategoryId !== null && (!Number.isInteger(normalizedCategoryId) || normalizedCategoryId <= 0)) {
          return ResponseView.error(res, 'Danh mục theme không hợp lệ.', 'INVALID_CATEGORY', 400);
        }
        if (normalizedCategoryId !== null) {
          const [categories] = await dbPool.query<RowDataPacket[]>('SELECT id FROM categories WHERE id = ? LIMIT 1', [normalizedCategoryId]);
          if (!categories.length) return ResponseView.error(res, 'Danh mục không tồn tại.', 'CATEGORY_NOT_FOUND', 400);
        }
        fields.push('category_id = ?');
        params.push(normalizedCategoryId);
      }

      if (!fields.length) {
        return ResponseView.error(res, 'Không có trường dữ liệu hợp lệ để cập nhật.', 'NO_VALID_FIELDS', 400);
      }

      params.push(themeId);
      const [result] = await dbPool.query<ResultSetHeader>(
        `UPDATE themes SET ${fields.join(', ')} WHERE id = ?`,
        params
      );

      if (result.affectedRows === 0) {
        return ResponseView.notFound(res, 'Theme không tồn tại hoặc không thay đổi.');
      }

      return ResponseView.success(res, { id: themeId, updated_fields: fields }, 'Cập nhật theme thành công.');
    } catch (error: any) {
      return ResponseView.error(res, error.message || 'Lỗi cập nhật theme.', 'UPDATE_THEME_ERROR', 500);
    }
  }

  /** GET /api/v1/admin/categories */
  static async getCategories(_req: AuthRequest, res: Response) {
    try {
      const [rows] = await dbPool.query<RowDataPacket[]>(
        `SELECT id, name_vi, name_en, slug, is_active, sort_order
         FROM categories ORDER BY sort_order ASC, id ASC`
      );
      return ResponseView.success(res, { categories: rows });
    } catch (error: any) {
      return ResponseView.error(res, error.message || 'Lỗi tải danh mục.', 'CATEGORIES_QUERY_ERROR', 500);
    }
  }

  /**
   * Danh sách Licenses
   * GET /api/v1/admin/licenses
   */
  static async getLicenses(req: AuthRequest, res: Response) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
      const offset = (page - 1) * limit;

      const search = ((req.query.search as string) || '').trim();
      const status = ((req.query.status as string) || '').trim();

      const conditions: string[] = [];
      const params: any[] = [];

      if (search) {
        conditions.push('(l.license_key LIKE ? OR u.email LIKE ? OR t.name LIKE ?)');
        const searchLike = `%${search}%`;
        params.push(searchLike, searchLike, searchLike);
      }

      if (status) {
        conditions.push('l.status = ?');
        params.push(status);
      }

      const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

      const [countRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS total
         FROM licenses l
         LEFT JOIN users u ON l.user_id = u.id
         LEFT JOIN themes t ON l.theme_id = t.id
         ${whereClause}`,
        params
      );
      const total = Number(countRows[0]?.total || 0);

      const [licenseRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT l.id, l.license_key, l.license_type, l.status, l.max_domains,
                l.created_at, l.expires_at,
                t.name as theme_name, t.slug as theme_slug,
                u.email as customer_email, u.full_name as customer_name,
                o.order_number,
                (SELECT COUNT(*) FROM license_activations la WHERE la.license_id = l.id AND la.is_active = 1) as active_domains_count
         FROM licenses l
         LEFT JOIN themes t ON l.theme_id = t.id
         LEFT JOIN users u ON l.user_id = u.id
         LEFT JOIN orders o ON l.order_id = o.id
         ${whereClause}
         ORDER BY l.created_at DESC, l.id DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      return ResponseView.success(res, {
        licenses: licenseRows,
        pagination: {
          page,
          limit,
          total,
          total_pages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      return ResponseView.error(res, error.message || 'Lỗi tải danh sách license.', 'LICENSES_QUERY_ERROR', 500);
    }
  }

  /**
   * Chi tiết License + danh sách domain kích hoạt
   * GET /api/v1/admin/licenses/:licenseKey
   */
  static async getLicenseDetail(req: AuthRequest, res: Response) {
    try {
      const licenseKey = req.params.licenseKey as string;
      const [rows] = await dbPool.query<RowDataPacket[]>(
        `SELECT l.*, t.name as theme_name, u.email as customer_email, u.full_name as customer_name,
                o.order_number
         FROM licenses l
         LEFT JOIN themes t ON l.theme_id = t.id
         LEFT JOIN users u ON l.user_id = u.id
         LEFT JOIN orders o ON l.order_id = o.id
         WHERE l.license_key = ? LIMIT 1`,
        [licenseKey]
      );

      if (!rows.length) return ResponseView.notFound(res, 'Không tìm thấy license.');
      const license = rows[0];

      const [activationRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT * FROM license_activations WHERE license_id = ? ORDER BY activated_at DESC`,
        [license.id]
      );

      return ResponseView.success(res, {
        ...license,
        activations: activationRows,
      });
    } catch (error: any) {
      return ResponseView.error(res, error.message || 'Lỗi tải chi tiết license.', 'LICENSE_DETAIL_ERROR', 500);
    }
  }

  /**
   * Danh sách khách hàng (role = 'customer')
   * GET /api/v1/admin/customers
   */
  static async getCustomers(req: AuthRequest, res: Response) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
      const offset = (page - 1) * limit;

      const search = ((req.query.search as string) || '').trim();

      const conditions: string[] = ["u.role = 'customer'"];
      const params: any[] = [];

      if (search) {
        conditions.push('(u.email LIKE ? OR u.full_name LIKE ? OR u.phone LIKE ?)');
        const searchLike = `%${search}%`;
        params.push(searchLike, searchLike, searchLike);
      }

      const whereClause = `WHERE ${conditions.join(' AND ')}`;

      const [countRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS total FROM users u ${whereClause}`,
        params
      );
      const total = Number(countRows[0]?.total || 0);

      const [customerRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT u.id, u.email, u.full_name, u.phone, u.status, u.country_code, u.created_at,
                (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) as orders_count,
                (SELECT COALESCE(SUM(total_amount), 0) FROM orders o WHERE o.user_id = u.id AND o.payment_status = 'paid' AND o.currency = 'VND') as total_spent_vnd,
                (SELECT COALESCE(SUM(total_amount), 0) FROM orders o WHERE o.user_id = u.id AND o.payment_status = 'paid' AND o.currency = 'USD') as total_spent_usd
         FROM users u
         ${whereClause}
         ORDER BY u.created_at DESC, u.id DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      return ResponseView.success(res, {
        customers: customerRows.map(c => ({
          ...c,
          total_spent_vnd: Number(c.total_spent_vnd),
          total_spent_usd: Number(c.total_spent_usd),
          orders_count: Number(c.orders_count),
        })),
        pagination: {
          page,
          limit,
          total,
          total_pages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      return ResponseView.error(res, error.message || 'Lỗi tải danh sách khách hàng.', 'CUSTOMERS_QUERY_ERROR', 500);
    }
  }

  /**
   * Chi tiết khách hàng + đơn hàng của khách
   * GET /api/v1/admin/customers/:id
   */
  static async getCustomerDetail(req: AuthRequest, res: Response) {
    try {
      const customerId = parseInt(req.params.id as string, 10);
      if (isNaN(customerId)) return ResponseView.error(res, 'ID khách hàng không hợp lệ.', 'INVALID_ID', 400);

      const [rows] = await dbPool.query<RowDataPacket[]>(
        `SELECT id, email, full_name, phone, role, status, country_code, created_at
         FROM users
         WHERE id = ? AND role = 'customer' LIMIT 1`,
        [customerId]
      );

      if (!rows.length) return ResponseView.notFound(res, 'Không tìm thấy khách hàng.');
      const customer = rows[0];

      // Đơn hàng của khách hàng này
      const [orderRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT id, order_number, total_amount, currency, payment_method, payment_status,
                order_status, created_at
         FROM orders
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [customerId]
      );

      // Licenses thuộc khách hàng này
      const [licenseRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT l.*, t.name as theme_name
         FROM licenses l
         LEFT JOIN themes t ON l.theme_id = t.id
         WHERE l.user_id = ?
         ORDER BY l.created_at DESC`,
        [customerId]
      );

      return ResponseView.success(res, {
        customer,
        orders: orderRows.map(o => ({
          ...o,
          total_amount: Number(o.total_amount),
        })),
        licenses: licenseRows,
      });
    } catch (error: any) {
      return ResponseView.error(res, error.message || 'Lỗi tải chi tiết khách hàng.', 'CUSTOMER_DETAIL_ERROR', 500);
    }
  }

  private static isHttpUrl(value: unknown): value is string {
    if (typeof value !== 'string' || !value.trim()) return false;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
      return false;
    }
  }
}
