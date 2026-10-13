import { z } from 'zod';

const urlSchema = z.string().trim().refine((val) => {
  try {
    const url = new URL(val);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}, { message: 'URL không hợp lệ' });

/**
 * Schema cập nhật trạng thái đơn hàng (Order status & Payment status)
 */
export const AdminOrderStatusUpdateSchema = z.object({
  payment_status: z.enum(['pending', 'paid', 'failed', 'refunded'], {
    errorMap: () => ({ message: 'Trạng thái thanh toán không hợp lệ' }),
  }).optional(),
  order_status: z.enum(['processing', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Trạng thái đơn hàng không hợp lệ' }),
  }).optional(),
}).refine(data => data.payment_status !== undefined || data.order_status !== undefined, {
  message: 'Phải cung cấp ít nhất payment_status hoặc order_status',
});

/**
 * Schema tạo theme mới trong catalog
 */
export const AdminThemeCreateSchema = z.object({
  name: z
    .string({ required_error: 'Tên theme không được để trống' })
    .trim()
    .min(1, 'Tên theme không được để trống')
    .max(200, 'Tên theme không quá 200 ký tự'),
  slug: z
    .string({ required_error: 'Slug theme không được để trống' })
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug theme không hợp lệ'),
  price_vnd: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? Number(val) : val),
    z.number({ required_error: 'Giá VND không hợp lệ' }).finite('Giá VND phải là số').min(0, 'Giá VND phải lớn hơn hoặc bằng 0')
  ),
  price_usd: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? Number(val) : val),
    z.number({ required_error: 'Giá USD không hợp lệ' }).finite('Giá USD phải là số').min(0, 'Giá USD phải lớn hơn hoặc bằng 0')
  ),
  category_id: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number().int('ID danh mục phải là số nguyên').positive('ID danh mục phải lớn hơn 0').nullable().optional()
  ),
  short_desc_vi: z.string().optional().default(''),
  live_demo_url: urlSchema,
  thumbnail_url: urlSchema,
  status: z.enum(['draft', 'published', 'archived'], {
    errorMap: () => ({ message: 'Trạng thái theme không hợp lệ' }),
  }).optional().default('draft'),
});

/**
 * Schema cập nhật theme
 */
export const AdminThemeUpdateSchema = z.object({
  name: z.string().trim().min(1, 'Tên theme không được để trống').max(200, 'Tên theme không quá 200 ký tự').optional(),
  price_vnd: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? Number(val) : val),
    z.number().finite('Giá VND phải là số').min(0, 'Giá VND phải lớn hơn hoặc bằng 0').optional()
  ),
  price_usd: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? Number(val) : val),
    z.number().finite('Giá USD phải là số').min(0, 'Giá USD phải lớn hơn hoặc bằng 0').optional()
  ),
  status: z.enum(['draft', 'published', 'archived'], {
    errorMap: () => ({ message: 'Trạng thái theme không hợp lệ' }),
  }).optional(),
  short_desc_vi: z.string().optional(),
  live_demo_url: urlSchema.optional(),
  thumbnail_url: urlSchema.optional(),
  category_id: z.preprocess(
    (val) => (val === '' || val === null ? null : val === undefined ? undefined : Number(val)),
    z.number().int('ID danh mục phải là số nguyên').positive('ID danh mục phải lớn hơn 0').nullable().optional()
  ),
}).refine(data => Object.keys(data).length > 0, {
  message: 'Không có trường dữ liệu hợp lệ để cập nhật',
});

/**
 * Schema tạo người dùng / khách hàng mới từ Admin Portal
 */
export const AdminCustomerCreateSchema = z.object({
  full_name: z
    .string({ required_error: 'Họ và tên không được để trống' })
    .trim()
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ và tên không quá 100 ký tự'),
  email: z
    .string({ required_error: 'Email không được để trống' })
    .trim()
    .max(191, 'Email không quá 191 ký tự')
    .email('Email không hợp lệ')
    .toLowerCase(),
  password: z
    .string({ required_error: 'Mật khẩu không được để trống' })
    .min(6, 'Mật khẩu phải chứa ít nhất 6 ký tự'),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+() -]{8,20}$/, 'Số điện thoại không hợp lệ')
    .optional()
    .nullable(),
  role: z.enum(['customer', 'admin', 'author'], {
    errorMap: () => ({ message: 'Vai trò chỉ chấp nhận customer, admin hoặc author' }),
  }).optional().default('customer'),
});

/**
 * Schema cập nhật vai trò (Role)
 */
export const AdminCustomerRoleSchema = z.object({
  role: z.enum(['customer', 'admin', 'author'], {
    errorMap: () => ({ message: 'Vai trò không hợp lệ. Chỉ chấp nhận customer, author hoặc admin.' }),
  }),
});

/**
 * Schema hủy kích hoạt domain của license
 */
export const AdminLicenseDeactivateSchema = z.object({
  domain: z
    .string({ required_error: 'Tên miền không được để trống' })
    .trim()
    .min(3, 'Tên miền không hợp lệ (tối thiểu 3 ký tự)')
    .max(253, 'Tên miền quá dài'),
});
