import { z } from 'zod';

export const CheckoutOrderSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(2, 'Họ và tên tối thiểu 2 ký tự')
    .max(100, 'Họ và tên không quá 100 ký tự'),
  customer_email: z
    .string()
    .trim()
    .max(191, 'Email không quá 191 ký tự')
    .email('Định dạng email khách hàng không hợp lệ'),
  customer_phone: z
    .string()
    .trim()
    .regex(/^[0-9+() -]{8,20}$/, 'Số điện thoại không hợp lệ')
    .optional()
    .nullable(),
  total_amount: z
    .number()
    .positive('Số tiền thanh toán phải lớn hơn 0'),
  currency: z
    .enum(['VND', 'USD'], {
      errorMap: () => ({ message: 'Tiền tệ chỉ hỗ trợ VND hoặc USD' }),
    })
    .default('VND'),
  payment_method: z
    .enum(['vietqr', 'stripe', 'paypal'], {
      errorMap: () => ({ message: 'Phương thức thanh toán chỉ hỗ trợ vietqr, stripe hoặc paypal' }),
    })
    .default('vietqr'),
  idempotency_key: z.string().uuid('Mã yêu cầu đặt hàng không hợp lệ'),
  items: z
    .array(
      z.object({
        theme_id: z.number().int().positive(),
        theme_slug: z.string().trim().min(1).max(191),
        license_type: z.literal('regular', { errorMap: () => ({ message: 'Hiện chỉ mở bán Regular License' }) }),
      }).strict()
    )
    .min(1, 'Giỏ hàng không được để trống')
    .refine(items => new Set(items.map(item => item.theme_id)).size === items.length, 'Theme trong giỏ hàng bị trùng'),
}).strict();

export const SepayWebhookSchema = z.object({
  id: z.union([z.number(), z.string()], {
    required_error: 'Yêu cầu mã giao dịch transaction id',
  }),
  gateway: z.string().optional().default('vietqr'),
  transferAmount: z.number().positive('Số tiền chuyển khoản phải lớn hơn 0'),
  content: z.string().min(1, 'Nội dung chuyển khoản không được để trống'),
  accumulated: z.number().optional(),
  accountNumber: z.string().optional(),
  transactionDate: z.string().optional(),
});

export const LicenseActivateSchema = z.object({
  license_key: z
    .string()
    .trim()
    .regex(/^WD-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-2026$/, 'Định dạng License Key không hợp lệ (WD-XXXX-XXXX-XXXX-2026)'),
  domain: z
    .string()
    .trim()
    .min(3, 'Tên miền không hợp lệ (tối thiểu 3 ký tự)')
    .max(253, 'Tên miền quá dài'),
});
