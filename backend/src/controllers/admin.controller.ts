import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { dbPool, isDbOffline, markDbOffline } from '../config/database.js';
import { ResponseView } from '../views/response.view.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { ThemeModel } from '../models/theme.model.js';
import { CategoryModel } from '../models/category.model.js';
import { UserModel } from '../models/user.model.js';
import { LicenseModel } from '../models/license.model.js';
import {
  AdminOrderStatusUpdateSchema,
  AdminThemeCreateSchema,
  AdminThemeUpdateSchema,
  AdminCustomerCreateSchema,
  AdminCustomerRoleSchema,
  AdminLicenseDeactivateSchema,
} from '../validators/admin.validator.js';

const fallbackOrders = [
  {
    id: 1,
    order_number: 'ORD-2026-8888',
    user_id: 3,
    customer_email: 'customer@thememarket.local',
    customer_name: 'Nguyễn Văn Khách Hàng',
    customer_phone: '0901234567',
    total_amount: 599000,
    currency: 'VND',
    payment_method: 'vietqr',
    payment_status: 'paid',
    order_status: 'completed',
    created_at: new Date('2026-10-12T09:30:00Z'),
  },
];

const fallbackLicenses = [
  {
    id: 1,
    license_key: 'WD-2026-DEMO-A1B2-C3D4-E5F6',
    order_id: 1,
    theme_id: 1,
    user_id: 3,
    license_type: 'regular',
    status: 'active',
    max_domains: 1,
    active_domains_count: 1,
    created_at: new Date('2026-10-12T09:31:00Z'),
    expires_at: new Date('2027-10-12T09:31:00Z'),
    theme_name: 'WoodMart - Multipurpose WooCommerce Theme',
    theme_slug: 'woodmart',
    customer_email: 'customer@thememarket.local',
    customer_name: 'Nguyễn Văn Khách Hàng',
    order_number: 'ORD-2026-8888',
  },
];

const fallbackActivations = [
  {
    id: 1,
    license_id: 1,
    license_key: 'WD-2026-DEMO-A1B2-C3D4-E5F6',
    domain: 'mytestshop.local',
    ip_address: '127.0.0.1',
    is_active: 1,
    activated_at: new Date('2026-10-12T09:31:00Z'),
  },
];

const fallbackAdminThemes: any[] = [
  {
    id: 1,
    author_id: 1,
    category_id: 1,
    name: 'WoodMart - Multipurpose WooCommerce Theme',
    slug: 'woodmart',
    short_desc_vi: 'Theme bán hàng WooCommerce chuyên nghiệp, chuẩn SEO',
    price_vnd: 599000,
    price_usd: 29.0,
    current_version: '8.6.2',
    status: 'published',
    is_featured: 1,
    total_sales: 128,
    rating_avg: 4.95,
    rating_count: 320,
    live_demo_url: 'https://demo.xtemos.com/woodmart',
    thumbnail_url: 'https://example.com/thumb.jpg',
    category_name: 'WordPress Theme',
    author_name: 'XTemos Studio Official',
    created_at: new Date('2026-10-12T08:00:00Z'),
  },
];

function isDbOfflineError(error: any): boolean {
  const code = error?.code || '';
  const msg = String(error?.message || '');
  return (
    code === 'ECONNREFUSED' ||
    code === 'ER_ACCESS_DENIED_ERROR' ||
    code === 'ETIMEDOUT' ||
    code === 'ENOTFOUND' ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('Access denied') ||
    msg.includes('ETIMEDOUT')
  );
}

export class AdminController {
  /**
   * Thống kê Dashboard tổng quan (chỉ tính số liệu thật từ DB, doanh thu từ đơn đã thanh toán)
   * GET /api/v1/admin/stats
   */
  static async getDashboardStats(_req: AuthRequest, res: Response) {
    if (isDbOffline()) {
      const { total: totalThemes } = await ThemeModel.findAll({});
      const customersCount = UserModel.getFallbackUsers().filter(u => u.role === 'customer').length;
      return ResponseView.success(res, {
        revenue: { vnd: 599000, usd: 0 },
        orders: { total: 1, paid: 1, pending: 0, failed: 0 },
        themes_count: totalThemes,
        customers_count: customersCount,
        active_licenses_count: fallbackLicenses.length,
        recent_orders: fallbackOrders,
      }, 'Lấy thống kê dashboard thành công (Standalone Mode).');
    }

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
      markDbOffline(error);
      if (isDbOffline() || isDbOfflineError(error)) {
        const { total: totalThemes } = await ThemeModel.findAll({});
        const customersCount = UserModel.getFallbackUsers().filter(u => u.role === 'customer').length;
        return ResponseView.success(res, {
          revenue: { vnd: 599000, usd: 0 },
          orders: { total: 1, paid: 1, pending: 0, failed: 0 },
          themes_count: totalThemes,
          customers_count: customersCount,
          active_licenses_count: fallbackLicenses.length,
          recent_orders: fallbackOrders,
        }, 'Lấy thống kê dashboard thành công (Standalone Mode).');
      }
      return ResponseView.error(res, error.message || 'Lỗi truy vấn dữ liệu thống kê.', 'DASHBOARD_QUERY_ERROR', 500);
    }
  }

  /**
   * Báo cáo doanh thu/đơn hàng theo ngày và các theme được mua nhiều nhất.
   * GET /api/v1/admin/analytics?days=30
   */
  static async getAnalytics(req: AuthRequest, res: Response) {
    const requestedDays = Number.parseInt(req.query.days as string, 10);
    const days = [7, 30, 90].includes(requestedDays) ? requestedDays : 30;

    if (isDbOffline()) {
      return ResponseView.success(res, {
        period_days: days,
        series: [{ date: '2026-10-12', revenue_vnd: 599000, revenue_usd: 0, orders: 1 }],
        top_themes: [{ id: 1, name: 'WoodMart - Multipurpose WooCommerce Theme', slug: 'woodmart', purchases: 1, revenue_vnd: 599000, revenue_usd: 0 }],
      });
    }

    try {
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
      markDbOffline(error);
      if (isDbOffline() || isDbOfflineError(error)) {
        return ResponseView.success(res, {
          period_days: days,
          series: [{ date: '2026-10-12', revenue_vnd: 599000, revenue_usd: 0, orders: 1 }],
          top_themes: [{ id: 1, name: 'WoodMart - Multipurpose WooCommerce Theme', slug: 'woodmart', purchases: 1, revenue_vnd: 599000, revenue_usd: 0 }],
        });
      }
      return ResponseView.error(res, error.message || 'Lỗi tải báo cáo.', 'ANALYTICS_QUERY_ERROR', 500);
    }
  }

  /**
   * Danh sách đơn hàng có tìm kiếm và phân trang
   * GET /api/v1/admin/orders
   */
  static async getOrders(req: AuthRequest, res: Response) {
    if (isDbOffline()) {
      return ResponseView.success(res, {
        orders: fallbackOrders,
        pagination: { page: 1, limit: 10, total: fallbackOrders.length, total_pages: 1 },
      });
    }

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
      markDbOffline(error);
      if (isDbOffline() || isDbOfflineError(error)) {
        return ResponseView.success(res, {
          orders: fallbackOrders,
          pagination: { page: 1, limit: 10, total: fallbackOrders.length, total_pages: 1 },
        });
      }
      return ResponseView.error(res, error.message || 'Lỗi tải danh sách đơn hàng.', 'ORDERS_QUERY_ERROR', 500);
    }
  }

  /**
   * Chi tiết một đơn hàng
   * GET /api/v1/admin/orders/:orderNumber
   */
  static async getOrderDetail(req: AuthRequest, res: Response) {
    if (isDbOffline()) {
      const order = fallbackOrders.find(o => o.order_number === req.params.orderNumber);
      if (!order) return ResponseView.notFound(res, 'Không tìm thấy đơn hàng.');
      return ResponseView.success(res, {
        ...order,
        items: [{ id: 1, order_id: 1, theme_id: 1, theme_name: 'WoodMart - Multipurpose WooCommerce Theme', theme_slug: 'woodmart', license_type: 'regular', unit_price: 599000, subtotal: 599000 }],
        licenses: fallbackLicenses,
        payments: [{ id: 1, transaction_id: 'MB-999888777-DEMO', gateway: 'vietqr', amount: 599000, currency: 'VND', status: 'completed', created_at: order.created_at }],
      });
    }

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
      markDbOffline(error);
      if (isDbOffline() || isDbOfflineError(error)) {
        const order = fallbackOrders.find(o => o.order_number === req.params.orderNumber);
        if (!order) return ResponseView.notFound(res, 'Không tìm thấy đơn hàng.');
        return ResponseView.success(res, {
          ...order,
          items: [{ id: 1, order_id: 1, theme_id: 1, theme_name: 'WoodMart - Multipurpose WooCommerce Theme', theme_slug: 'woodmart', license_type: 'regular', unit_price: 599000, subtotal: 599000 }],
          licenses: fallbackLicenses,
          payments: [{ id: 1, transaction_id: 'MB-999888777-DEMO', gateway: 'vietqr', amount: 599000, currency: 'VND', status: 'completed', created_at: order.created_at }],
        });
      }
      return ResponseView.error(res, error.message || 'Lỗi tải chi tiết đơn hàng.', 'ORDER_DETAIL_ERROR', 500);
    }
  }

  /**
   * Cập nhật trạng thái đơn hàng (order_status hoặc payment_status)
   * PATCH /api/v1/admin/orders/:orderNumber/status
   */
  static async updateOrderStatus(req: AuthRequest, res: Response) {
    const orderNumber = (req.params.orderNumber as string || '').trim();
    if (!orderNumber) {
      return ResponseView.error(res, 'Mã đơn hàng không hợp lệ.', 'INVALID_ORDER_NUMBER', 400);
    }

    const parseResult = AdminOrderStatusUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return ResponseView.error(res, 'Trạng thái đơn hàng không hợp lệ.', 'INVALID_STATUS_UPDATE', 400);
    }

    const { payment_status, order_status } = parseResult.data;

    if (isDbOffline()) {
      const order = fallbackOrders.find(o => o.order_number === orderNumber);
      if (!order) {
        return ResponseView.notFound(res, 'Không tìm thấy đơn hàng.');
      }
      if (payment_status) order.payment_status = payment_status;
      if (order_status) order.order_status = order_status;
      return ResponseView.success(res, {
        order_number: order.order_number,
        payment_status: order.payment_status,
        order_status: order.order_status,
      }, 'Cập nhật trạng thái đơn hàng thành công.');
    }

    try {
      const [orderRows] = await dbPool.query<RowDataPacket[]>(
        'SELECT id, order_number, payment_status, order_status FROM orders WHERE order_number = ? LIMIT 1',
        [orderNumber]
      );
      if (!orderRows.length) {
        return ResponseView.notFound(res, 'Không tìm thấy đơn hàng.');
      }

      const fields: string[] = [];
      const params: any[] = [];
      if (payment_status) {
        fields.push('payment_status = ?');
        params.push(payment_status);
      }
      if (order_status) {
        fields.push('order_status = ?');
        params.push(order_status);
      }
      params.push(orderNumber);

      await dbPool.query<ResultSetHeader>(
        `UPDATE orders SET ${fields.join(', ')} WHERE order_number = ?`,
        params
      );

      const currentOrder = orderRows[0];
      const updatedPaymentStatus = payment_status || currentOrder.payment_status;
      const updatedOrderStatus = order_status || currentOrder.order_status;

      return ResponseView.success(res, {
        order_number: orderNumber,
        payment_status: updatedPaymentStatus,
        order_status: updatedOrderStatus,
      }, 'Cập nhật trạng thái đơn hàng thành công.');
    } catch (error: any) {
      markDbOffline(error);
      if (isDbOffline() || isDbOfflineError(error)) {
        const order = fallbackOrders.find(o => o.order_number === orderNumber);
        if (!order) {
          return ResponseView.notFound(res, 'Không tìm thấy đơn hàng.');
        }
        if (payment_status) order.payment_status = payment_status;
        if (order_status) order.order_status = order_status;
        return ResponseView.success(res, {
          order_number: order.order_number,
          payment_status: order.payment_status,
          order_status: order.order_status,
        }, 'Cập nhật trạng thái đơn hàng thành công.');
      }
      return ResponseView.error(res, error.message || 'Lỗi cập nhật trạng thái đơn hàng.', 'UPDATE_ORDER_ERROR', 500);
    }
  }

  /**
   * Danh sách themes quản trị
   * GET /api/v1/admin/themes
   */
  static async getThemes(req: AuthRequest, res: Response) {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
    const offset = (page - 1) * limit;
    const search = ((req.query.search as string) || '').trim();
    const status = ((req.query.status as string) || '').trim();
    const categoryId = Number.parseInt(req.query.category_id as string, 10);

    if (isDbOffline()) {
      const { themes, total } = await ThemeModel.findAll({
        keyword: search || undefined,
        category_id: Number.isInteger(categoryId) && categoryId > 0 ? categoryId : undefined,
        limit,
        offset,
      });
      return ResponseView.success(res, {
        themes: themes.map(t => ({
          ...t,
          is_featured: 1,
          category_name: 'WordPress Theme',
          author_name: 'XTemos Studio Official',
          created_at: t.created_at || '2026-10-12T08:00:00.000Z',
        })),
        pagination: { page, limit, total, total_pages: Math.ceil(total / limit) || 1 },
      });
    }

    try {
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
      markDbOffline(error);
      if (isDbOffline() || isDbOfflineError(error)) {
        const { themes, total } = await ThemeModel.findAll({
          keyword: search || undefined,
          category_id: Number.isInteger(categoryId) && categoryId > 0 ? categoryId : undefined,
          limit,
          offset,
        });
        return ResponseView.success(res, {
          themes: themes.map(t => ({
            ...t,
            is_featured: 1,
            category_name: 'WordPress Theme',
            author_name: 'XTemos Studio Official',
            created_at: t.created_at || '2026-10-12T08:00:00.000Z',
          })),
          pagination: { page, limit, total, total_pages: Math.ceil(total / limit) || 1 },
        });
      }
      return ResponseView.error(res, error.message || 'Lỗi tải danh sách themes.', 'THEMES_QUERY_ERROR', 500);
    }
  }

  /**
   * Tạo theme ở trạng thái draft/published theo dữ liệu catalogue hiện có.
   * POST /api/v1/admin/themes
   */
  static async createTheme(req: AuthRequest, res: Response) {
    const parseResult = AdminThemeCreateSchema.safeParse(req.body);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      const field = issue.path[0];
      if (field === 'price_vnd' || field === 'price_usd') {
        return ResponseView.error(res, 'Giá theme không hợp lệ.', 'INVALID_THEME_PRICE', 400);
      }
      if (field === 'category_id') {
        return ResponseView.error(res, 'Danh mục theme không hợp lệ.', 'INVALID_CATEGORY', 400);
      }
      return ResponseView.error(res, 'Tên, slug, trạng thái hoặc URL theme không hợp lệ.', 'INVALID_THEME_INPUT', 400);
    }

    const {
      name,
      slug,
      price_vnd: priceVnd,
      price_usd: priceUsd,
      status,
      short_desc_vi: shortDescVi,
      live_demo_url: liveDemoUrl,
      thumbnail_url: thumbnailUrl,
      category_id: categoryId,
    } = parseResult.data;

    if (isDbOffline()) {
      if (fallbackAdminThemes.some(t => t.slug === slug)) {
        return ResponseView.error(res, 'Slug theme đã tồn tại.', 'THEME_SLUG_EXISTS', 409);
      }
      const newId = fallbackAdminThemes.length + 10;
      const newTheme = {
        id: newId,
        author_id: req.user?.id || 1,
        category_id: categoryId,
        name,
        slug,
        short_desc_vi: shortDescVi,
        price_vnd: priceVnd,
        price_usd: priceUsd,
        live_demo_url: liveDemoUrl,
        thumbnail_url: thumbnailUrl,
        status,
        is_featured: 0,
        total_sales: 0,
        rating_avg: 5.0,
        rating_count: 0,
        current_version: '1.0.0',
        category_name: 'WordPress Theme',
        author_name: 'Admin',
        created_at: new Date(),
      };
      fallbackAdminThemes.push(newTheme);
      return ResponseView.success(res, { id: newId }, 'Tạo theme thành công.', 201);
    }

    try {
      if (categoryId !== null && categoryId !== undefined) {
        const [categories] = await dbPool.query<RowDataPacket[]>('SELECT id FROM categories WHERE id = ? LIMIT 1', [categoryId]);
        if (!categories.length) return ResponseView.error(res, 'Danh mục không tồn tại.', 'CATEGORY_NOT_FOUND', 400);
      }

      const [result] = await dbPool.query<ResultSetHeader>(
        `INSERT INTO themes (author_id, category_id, name, slug, short_desc_vi, price_vnd, price_usd, live_demo_url, thumbnail_url, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.user!.id, categoryId, name, slug, shortDescVi, priceVnd, priceUsd, liveDemoUrl, thumbnailUrl, status]
      );
      return ResponseView.success(res, { id: result.insertId }, 'Tạo theme thành công.', 201);
    } catch (error: any) {
      if (error?.code === 'ER_DUP_ENTRY') {
        return ResponseView.error(res, 'Slug theme đã tồn tại.', 'THEME_SLUG_EXISTS', 409);
      }
      markDbOffline(error);
      if (isDbOffline() || isDbOfflineError(error)) {
        if (fallbackAdminThemes.some(t => t.slug === slug)) {
          return ResponseView.error(res, 'Slug theme đã tồn tại.', 'THEME_SLUG_EXISTS', 409);
        }
        const newId = fallbackAdminThemes.length + 10;
        const newTheme = {
          id: newId,
          author_id: req.user?.id || 1,
          category_id: categoryId,
          name,
          slug,
          short_desc_vi: shortDescVi,
          price_vnd: priceVnd,
          price_usd: priceUsd,
          live_demo_url: liveDemoUrl,
          thumbnail_url: thumbnailUrl,
          status,
          is_featured: 0,
          total_sales: 0,
          rating_avg: 5.0,
          rating_count: 0,
          current_version: '1.0.0',
          category_name: 'WordPress Theme',
          author_name: 'Admin',
          created_at: new Date(),
        };
        fallbackAdminThemes.push(newTheme);
        return ResponseView.success(res, { id: newId }, 'Tạo theme thành công.', 201);
      }
      return ResponseView.error(res, error.message || 'Lỗi tạo theme.', 'CREATE_THEME_ERROR', 500);
    }
  }

  /**
   * Chi tiết Theme
   * GET /api/v1/admin/themes/:id
   */
  static async getThemeDetail(req: AuthRequest, res: Response) {
    const themeId = parseInt(req.params.id as string, 10);
    if (isNaN(themeId)) return ResponseView.error(res, 'ID theme không hợp lệ.', 'INVALID_ID', 400);

    if (isDbOffline()) {
      const localTheme = fallbackAdminThemes.find(t => t.id === themeId);
      if (localTheme) return ResponseView.success(res, localTheme);
      const theme = await ThemeModel.findById(themeId);
      if (!theme) return ResponseView.notFound(res, 'Không tìm thấy theme.');
      return ResponseView.success(res, {
        ...theme,
        category_name: 'WordPress Theme',
        author_name: 'XTemos Studio Official',
      });
    }

    try {
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
      markDbOffline(error);
      if (isDbOffline() || isDbOfflineError(error)) {
        const localTheme = fallbackAdminThemes.find(t => t.id === themeId);
        if (localTheme) return ResponseView.success(res, localTheme);
        const theme = await ThemeModel.findById(themeId);
        if (!theme) return ResponseView.notFound(res, 'Không tìm thấy theme.');
        return ResponseView.success(res, {
          ...theme,
          category_name: 'WordPress Theme',
          author_name: 'XTemos Studio Official',
        });
      }
      return ResponseView.error(res, error.message || 'Lỗi tải theme.', 'THEME_DETAIL_ERROR', 500);
    }
  }

  /**
   * Cập nhật thông tin Theme
   * PUT /api/v1/admin/themes/:id
   */
  static async updateTheme(req: AuthRequest, res: Response) {
    const themeId = parseInt(req.params.id as string, 10);
    if (isNaN(themeId)) return ResponseView.error(res, 'ID theme không hợp lệ.', 'INVALID_ID', 400);

    const parseResult = AdminThemeUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      const field = issue.path[0];
      if (!Object.keys(req.body || {}).length) {
        return ResponseView.error(res, 'Không có trường dữ liệu hợp lệ để cập nhật.', 'NO_VALID_FIELDS', 400);
      }
      if (field === 'price_vnd' || field === 'price_usd') {
        return ResponseView.error(res, 'Giá VND hoặc USD không hợp lệ.', 'INVALID_THEME_PRICE', 400);
      }
      if (field === 'category_id') {
        return ResponseView.error(res, 'Danh mục theme không hợp lệ.', 'INVALID_CATEGORY', 400);
      }
      return ResponseView.error(res, 'Thông tin cập nhật theme không hợp lệ.', 'INVALID_THEME_INPUT', 400);
    }

    const {
      name,
      price_vnd,
      price_usd,
      status,
      short_desc_vi,
      live_demo_url,
      thumbnail_url,
      category_id,
    } = parseResult.data;

    const fields: string[] = [];
    const params: any[] = [];

    if (name !== undefined) {
      fields.push('name = ?');
      params.push(name);
    }
    if (price_vnd !== undefined) {
      fields.push('price_vnd = ?');
      params.push(price_vnd);
    }
    if (price_usd !== undefined) {
      fields.push('price_usd = ?');
      params.push(price_usd);
    }
    if (status !== undefined) {
      fields.push('status = ?');
      params.push(status);
    }
    if (short_desc_vi !== undefined) {
      fields.push('short_desc_vi = ?');
      params.push(short_desc_vi);
    }
    if (live_demo_url !== undefined) {
      fields.push('live_demo_url = ?');
      params.push(live_demo_url);
    }
    if (thumbnail_url !== undefined) {
      fields.push('thumbnail_url = ?');
      params.push(thumbnail_url);
    }
    if (category_id !== undefined) {
      fields.push('category_id = ?');
      params.push(category_id);
    }

    if (!fields.length) {
      return ResponseView.error(res, 'Không có trường dữ liệu hợp lệ để cập nhật.', 'NO_VALID_FIELDS', 400);
    }

    if (isDbOffline()) {
      const theme = fallbackAdminThemes.find(t => t.id === themeId);
      if (!theme) {
        return ResponseView.notFound(res, 'Theme không tồn tại hoặc không thay đổi.');
      }
      if (name !== undefined) theme.name = name;
      if (price_vnd !== undefined) theme.price_vnd = price_vnd;
      if (price_usd !== undefined) theme.price_usd = price_usd;
      if (status !== undefined) theme.status = status;
      if (short_desc_vi !== undefined) theme.short_desc_vi = short_desc_vi;
      if (live_demo_url !== undefined) theme.live_demo_url = live_demo_url;
      if (thumbnail_url !== undefined) theme.thumbnail_url = thumbnail_url;
      if (category_id !== undefined) theme.category_id = category_id;
      return ResponseView.success(res, { id: themeId, updated_fields: fields }, 'Cập nhật theme thành công.');
    }

    try {
      if (category_id !== undefined && category_id !== null) {
        const [categories] = await dbPool.query<RowDataPacket[]>('SELECT id FROM categories WHERE id = ? LIMIT 1', [category_id]);
        if (!categories.length) return ResponseView.error(res, 'Danh mục không tồn tại.', 'CATEGORY_NOT_FOUND', 400);
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
      markDbOffline(error);
      if (isDbOffline() || isDbOfflineError(error)) {
        const theme = fallbackAdminThemes.find(t => t.id === themeId);
        if (!theme) {
          return ResponseView.notFound(res, 'Theme không tồn tại hoặc không thay đổi.');
        }
        if (name !== undefined) theme.name = name;
        if (price_vnd !== undefined) theme.price_vnd = price_vnd;
        if (price_usd !== undefined) theme.price_usd = price_usd;
        if (status !== undefined) theme.status = status;
        if (short_desc_vi !== undefined) theme.short_desc_vi = short_desc_vi;
        if (live_demo_url !== undefined) theme.live_demo_url = live_demo_url;
        if (thumbnail_url !== undefined) theme.thumbnail_url = thumbnail_url;
        if (category_id !== undefined) theme.category_id = category_id;
        return ResponseView.success(res, { id: themeId, updated_fields: fields }, 'Cập nhật theme thành công.');
      }
      return ResponseView.error(res, error.message || 'Lỗi cập nhật theme.', 'UPDATE_THEME_ERROR', 500);
    }
  }

  /** GET /api/v1/admin/categories */
  static async getCategories(_req: AuthRequest, res: Response) {
    if (isDbOffline()) {
      const categories = await CategoryModel.findAll(true);
      return ResponseView.success(res, { categories });
    }

    try {
      const [rows] = await dbPool.query<RowDataPacket[]>(
        `SELECT id, name_vi, name_en, slug, is_active, sort_order
         FROM categories ORDER BY sort_order ASC, id ASC`
      );
      return ResponseView.success(res, { categories: rows });
    } catch (error: any) {
      markDbOffline(error);
      if (isDbOffline() || isDbOfflineError(error)) {
        const categories = await CategoryModel.findAll(true);
        return ResponseView.success(res, { categories });
      }
      return ResponseView.error(res, error.message || 'Lỗi tải danh mục.', 'CATEGORIES_QUERY_ERROR', 500);
    }
  }

  /**
   * Danh sách Licenses
   * GET /api/v1/admin/licenses
   */
  static async getLicenses(req: AuthRequest, res: Response) {
    if (isDbOffline()) {
      return ResponseView.success(res, {
        licenses: fallbackLicenses,
        pagination: { page: 1, limit: 10, total: fallbackLicenses.length, total_pages: 1 },
      });
    }

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
      markDbOffline(error);
      if (isDbOffline() || isDbOfflineError(error)) {
        return ResponseView.success(res, {
          licenses: fallbackLicenses,
          pagination: { page: 1, limit: 10, total: fallbackLicenses.length, total_pages: 1 },
        });
      }
      return ResponseView.error(res, error.message || 'Lỗi tải danh sách license.', 'LICENSES_QUERY_ERROR', 500);
    }
  }

  /**
   * Chi tiết License + danh sách domain kích hoạt
   * GET /api/v1/admin/licenses/:licenseKey
   */
  static async getLicenseDetail(req: AuthRequest, res: Response) {
    if (isDbOffline()) {
      const license = fallbackLicenses.find(l => l.license_key === req.params.licenseKey);
      if (!license) return ResponseView.notFound(res, 'Không tìm thấy license.');
      const activations = fallbackActivations.filter(a => a.license_key === license.license_key && a.is_active === 1);
      return ResponseView.success(res, {
        ...license,
        activations,
      });
    }

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
      markDbOffline(error);
      if (isDbOffline() || isDbOfflineError(error)) {
        const license = fallbackLicenses.find(l => l.license_key === req.params.licenseKey);
        if (!license) return ResponseView.notFound(res, 'Không tìm thấy license.');
        const activations = fallbackActivations.filter(a => a.license_key === license.license_key && a.is_active === 1);
        return ResponseView.success(res, {
          ...license,
          activations,
        });
      }
      return ResponseView.error(res, error.message || 'Lỗi tải chi tiết license.', 'LICENSE_DETAIL_ERROR', 500);
    }
  }

  /**
   * Hủy kích hoạt Domain của License
   * POST /api/v1/admin/licenses/:licenseKey/deactivate
   */
  static async deactivateLicenseDomain(req: AuthRequest, res: Response) {
    const licenseKey = (req.params.licenseKey as string || '').trim();
    if (!licenseKey) {
      return ResponseView.error(res, 'Mã bản quyền không hợp lệ.', 'INVALID_LICENSE_KEY', 400);
    }

    const parseResult = AdminLicenseDeactivateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return ResponseView.error(res, 'Tên miền không hợp lệ.', 'INVALID_DOMAIN', 400);
    }

    const cleanDomain = parseResult.data.domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');

    if (isDbOffline()) {
      const fallbackLic = fallbackLicenses.find(l => l.license_key === licenseKey);
      if (!fallbackLic) {
        return ResponseView.notFound(res, 'Không tìm thấy license.');
      }
      const act = fallbackActivations.find(
        a => a.license_key === licenseKey && a.domain.toLowerCase() === cleanDomain && a.is_active === 1
      );
      if (!act) {
        return ResponseView.error(res, 'Domain này hiện không kích hoạt trên License Key này.', 'DOMAIN_NOT_ACTIVE', 400);
      }
      act.is_active = 0;
      fallbackLic.active_domains_count = Math.max(0, fallbackLic.active_domains_count - 1);
      return ResponseView.success(res, {
        license_key: licenseKey,
        domain: cleanDomain,
        is_active: 0,
      }, `Đã hủy kích hoạt thành công domain: ${cleanDomain}`);
    }

    try {
      const [licRows] = await dbPool.query<RowDataPacket[]>(
        'SELECT id, license_key FROM licenses WHERE license_key = ? LIMIT 1',
        [licenseKey]
      );
      if (!licRows.length) {
        return ResponseView.notFound(res, 'Không tìm thấy license.');
      }

      const deactResult = await LicenseModel.deactivateDomain(licenseKey, cleanDomain);
      if (!deactResult.success) {
        return ResponseView.error(res, deactResult.message, 'DEACTIVATE_DOMAIN_FAILED', 400);
      }

      return ResponseView.success(res, {
        license_key: licenseKey,
        domain: cleanDomain,
        is_active: 0,
      }, deactResult.message);
    } catch (error: any) {
      markDbOffline(error);
      if (isDbOffline() || isDbOfflineError(error)) {
        const fallbackLic = fallbackLicenses.find(l => l.license_key === licenseKey);
        if (!fallbackLic) {
          return ResponseView.notFound(res, 'Không tìm thấy license.');
        }
        const act = fallbackActivations.find(
          a => a.license_key === licenseKey && a.domain.toLowerCase() === cleanDomain && a.is_active === 1
        );
        if (!act) {
          return ResponseView.error(res, 'Domain này hiện không kích hoạt trên License Key này.', 'DOMAIN_NOT_ACTIVE', 400);
        }
        act.is_active = 0;
        fallbackLic.active_domains_count = Math.max(0, fallbackLic.active_domains_count - 1);
        return ResponseView.success(res, {
          license_key: licenseKey,
          domain: cleanDomain,
          is_active: 0,
        }, `Đã hủy kích hoạt thành công domain: ${cleanDomain}`);
      }
      return ResponseView.error(res, error.message || 'Lỗi hủy kích hoạt domain.', 'DEACTIVATE_DOMAIN_ERROR', 500);
    }
  }

  /**
   * Danh sách người dùng / khách hàng (hỗ trợ lọc theo role: customer, admin, author)
   * GET /api/v1/admin/customers
   */
  static async getCustomers(req: AuthRequest, res: Response) {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
    const offset = (page - 1) * limit;
    const search = ((req.query.search as string) || '').trim();
    const roleFilter = ((req.query.role as string) || '').trim().toLowerCase();

    if (isDbOffline()) {
      const searchLower = search.toLowerCase();
      const customers = UserModel.getFallbackUsers()
        .filter(u => {
          if (roleFilter === 'customer' || roleFilter === 'admin' || roleFilter === 'author') {
            if (u.role !== roleFilter) return false;
          }
          if (searchLower) {
            return (
              u.email.toLowerCase().includes(searchLower) ||
              u.full_name.toLowerCase().includes(searchLower) ||
              (u.phone || '').toLowerCase().includes(searchLower)
            );
          }
          return true;
        })
        .map(u => ({
          id: u.id,
          email: u.email,
          full_name: u.full_name,
          phone: u.phone || null,
          role: u.role || 'customer',
          status: u.status,
          country_code: 'VN',
          created_at: u.created_at,
          orders_count: u.id === 3 ? 1 : 0,
          licenses_count: u.id === 3 ? 1 : 0,
          total_spent_vnd: u.id === 3 ? 599000 : 0,
          total_spent_usd: 0,
        }));
      return ResponseView.success(res, {
        customers,
        pagination: { page: 1, limit: 10, total: customers.length, total_pages: 1 },
      });
    }

    try {
      const conditions: string[] = [];
      const params: any[] = [];

      if (roleFilter === 'customer' || roleFilter === 'admin' || roleFilter === 'author') {
        conditions.push('u.role = ?');
        params.push(roleFilter);
      }

      if (search) {
        conditions.push('(u.email LIKE ? OR u.full_name LIKE ? OR u.phone LIKE ?)');
        const searchLike = `%${search}%`;
        params.push(searchLike, searchLike, searchLike);
      }

      const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

      const [countRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS total FROM users u ${whereClause}`,
        params
      );
      const total = Number(countRows[0]?.total || 0);

      const [customerRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT u.id, u.email, u.full_name, u.phone, u.role, u.status, u.country_code, u.created_at,
                (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) as orders_count,
                (SELECT COUNT(*) FROM licenses l WHERE l.user_id = u.id) as licenses_count,
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
          role: c.role || 'customer',
          total_spent_vnd: Number(c.total_spent_vnd),
          total_spent_usd: Number(c.total_spent_usd),
          orders_count: Number(c.orders_count),
          licenses_count: Number(c.licenses_count || 0),
        })),
        pagination: {
          page,
          limit,
          total,
          total_pages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      markDbOffline(error);
      if (isDbOffline() || isDbOfflineError(error)) {
        const searchLower = search.toLowerCase();
        const customers = UserModel.getFallbackUsers()
          .filter(u => {
            if (roleFilter === 'customer' || roleFilter === 'admin' || roleFilter === 'author') {
              if (u.role !== roleFilter) return false;
            }
            if (searchLower) {
              return (
                u.email.toLowerCase().includes(searchLower) ||
                u.full_name.toLowerCase().includes(searchLower) ||
                (u.phone || '').toLowerCase().includes(searchLower)
              );
            }
            return true;
          })
          .map(u => ({
            id: u.id,
            email: u.email,
            full_name: u.full_name,
            phone: u.phone || null,
            role: u.role || 'customer',
            status: u.status,
            country_code: 'VN',
            created_at: u.created_at,
            orders_count: u.id === 3 ? 1 : 0,
            licenses_count: u.id === 3 ? 1 : 0,
            total_spent_vnd: u.id === 3 ? 599000 : 0,
            total_spent_usd: 0,
          }));
        return ResponseView.success(res, {
          customers,
          pagination: { page: 1, limit: 10, total: customers.length, total_pages: 1 },
        });
      }
      return ResponseView.error(res, error.message || 'Lỗi tải danh sách khách hàng.', 'CUSTOMERS_QUERY_ERROR', 500);
    }
  }

  /**
   * Chi tiết người dùng / khách hàng + đơn hàng
   * GET /api/v1/admin/customers/:id
   */
  static async getCustomerDetail(req: AuthRequest, res: Response) {
    const customerId = parseInt(req.params.id as string, 10);
    if (isNaN(customerId)) return ResponseView.error(res, 'ID người dùng không hợp lệ.', 'INVALID_ID', 400);

    if (isDbOffline()) {
      const customer = UserModel.getFallbackUsers().find(u => u.id === customerId);
      if (!customer) return ResponseView.notFound(res, 'Không tìm thấy người dùng.');
      const { password_hash, ...safeCustomer } = customer;
      return ResponseView.success(res, {
        customer: { ...safeCustomer, role: safeCustomer.role || 'customer', country_code: 'VN' },
        orders: customerId === 3 ? fallbackOrders : [],
        licenses: customerId === 3 ? fallbackLicenses : [],
      });
    }

    try {
      const [rows] = await dbPool.query<RowDataPacket[]>(
        `SELECT id, email, full_name, phone, role, status, country_code, created_at
         FROM users
         WHERE id = ? LIMIT 1`,
        [customerId]
      );

      if (!rows.length) return ResponseView.notFound(res, 'Không tìm thấy người dùng.');
      const customer = rows[0];

      // Đơn hàng của người dùng này
      const [orderRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT id, order_number, total_amount, currency, payment_method, payment_status,
                order_status, created_at
         FROM orders
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [customerId]
      );

      // Licenses thuộc người dùng này
      const [licenseRows] = await dbPool.query<RowDataPacket[]>(
        `SELECT l.*, t.name as theme_name
         FROM licenses l
         LEFT JOIN themes t ON l.theme_id = t.id
         WHERE l.user_id = ?
         ORDER BY l.created_at DESC`,
        [customerId]
      );

      return ResponseView.success(res, {
        customer: { ...customer, role: customer.role || 'customer' },
        orders: orderRows.map(o => ({
          ...o,
          total_amount: Number(o.total_amount),
        })),
        licenses: licenseRows,
      });
    } catch (error: any) {
      markDbOffline(error);
      if (isDbOffline() || isDbOfflineError(error)) {
        const customer = UserModel.getFallbackUsers().find(u => u.id === customerId);
        if (!customer) return ResponseView.notFound(res, 'Không tìm thấy người dùng.');
        const { password_hash, ...safeCustomer } = customer;
        return ResponseView.success(res, {
          customer: { ...safeCustomer, role: safeCustomer.role || 'customer', country_code: 'VN' },
          orders: customerId === 3 ? fallbackOrders : [],
          licenses: customerId === 3 ? fallbackLicenses : [],
        });
      }
      return ResponseView.error(res, error.message || 'Lỗi tải chi tiết người dùng.', 'CUSTOMER_DETAIL_ERROR', 500);
    }
  }

  /**
   * Tạo tài khoản mới từ cổng Admin (mặc định role = 'customer', cho phép Admin chọn 'admin' / 'author')
   * POST /api/v1/admin/customers
   */
  static async createCustomer(req: AuthRequest, res: Response) {
    const parseResult = AdminCustomerCreateSchema.safeParse(req.body);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      const field = issue.path[0];
      if (field === 'email') {
        return ResponseView.error(res, 'Email không hợp lệ.', 'INVALID_EMAIL', 400);
      }
      if (field === 'full_name') {
        return ResponseView.error(res, 'Họ và tên phải có ít nhất 2 ký tự.', 'INVALID_FULL_NAME', 400);
      }
      if (field === 'password') {
        return ResponseView.error(res, 'Mật khẩu phải chứa ít nhất 6 ký tự.', 'INVALID_PASSWORD', 400);
      }
      return ResponseView.error(res, issue.message || 'Thông tin người dùng không hợp lệ.', 'INVALID_CUSTOMER_INPUT', 400);
    }

    const { email, password, full_name, phone, role } = parseResult.data;

    try {
      const existing = await UserModel.findByEmail(email);
      if (existing) {
        return ResponseView.error(res, 'Email này đã tồn tại trong hệ thống.', 'EMAIL_EXISTS', 409);
      }

      const password_hash = await bcrypt.hash(password, 10);
      const userId = await UserModel.create({
        email,
        password_hash,
        full_name,
        phone: phone || undefined,
        role: role || 'customer',
      });

      const user = await UserModel.findById(userId);
      return ResponseView.success(res, { user }, 'Tạo tài khoản thành công.', 201);
    } catch (error: any) {
      markDbOffline(error);
      return ResponseView.error(res, error.message || 'Lỗi tạo tài khoản người dùng.', 'CREATE_USER_ERROR', 500);
    }
  }

  /**
   * Cập nhật vai trò (role) của tài khoản người dùng ('customer' | 'admin' | 'author')
   * PATCH /api/v1/admin/customers/:id/role
   */
  static async updateCustomerRole(req: AuthRequest, res: Response) {
    const userId = parseInt(req.params.id as string, 10);
    if (isNaN(userId) || userId <= 0) {
      return ResponseView.error(res, 'ID người dùng không hợp lệ.', 'INVALID_ID', 400);
    }

    const parseResult = AdminCustomerRoleSchema.safeParse(req.body);
    if (!parseResult.success) {
      return ResponseView.error(res, 'Vai trò không hợp lệ. Chỉ chấp nhận customer, author hoặc admin.', 'INVALID_ROLE', 400);
    }

    const { role } = parseResult.data;

    if (req.user?.id === userId && role !== 'admin') {
      return ResponseView.error(res, 'Không thể tự hạ quyền quản trị của chính tài khoản đang đăng nhập.', 'SELF_DEMOTION_FORBIDDEN', 400);
    }

    try {
      const updated = await UserModel.updateRole(userId, role);
      if (!updated) {
        return ResponseView.notFound(res, 'Không tìm thấy tài khoản người dùng.');
      }
      const user = await UserModel.findById(userId);
      return ResponseView.success(res, { user }, 'Cập nhật vai trò tài khoản thành công.');
    } catch (error: any) {
      markDbOffline(error);
      return ResponseView.error(res, error.message || 'Lỗi cập nhật vai trò người dùng.', 'UPDATE_ROLE_ERROR', 500);
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
