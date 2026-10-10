-- =====================================================================
-- SEED DATA: THEME MARKETPLACE PLATFORM
-- Bao gom: 2 Users (Admin & Customer), 1 Author, 7 Categories,
--          10 Themes Demo (VND & USD), Versions, Orders, Licenses
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. SEED USERS
-- Password hash:
-- admin@thememarket.local    -> Admin@2026
-- customer@thememarket.local -> Customer@2026
-- author@xtemos.local        -> Author@2026
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `status`, `country_code`) VALUES
(1, 'admin@thememarket.local', '$2a$12$e6jZvhT1K8M.V.fK2DkJCe9yYj5L4y5a89M4zJ4Y0G7pG7kX1gKTe', 'Super Administrator', '0909999999', 'admin', 'active', 'VN'),
(2, 'author@xtemos.local', '$2a$12$e6jZvhT1K8M.V.fK2DkJCe9yYj5L4y5a89M4zJ4Y0G7pG7kX1gKTe', 'XTemos Studio Official', '0908888888', 'author', 'active', 'VN'),
(3, 'customer@thememarket.local', '$2a$12$e6jZvhT1K8M.V.fK2DkJCe9yYj5L4y5a89M4zJ4Y0G7pG7kX1gKTe', 'Nguyễn Văn Khách Hàng', '0901234567', 'customer', 'active', 'VN')
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

-- 2. SEED CATEGORIES
INSERT INTO `categories` (`id`, `parent_id`, `name_vi`, `name_en`, `slug`, `icon`, `sort_order`, `is_active`) VALUES
(1, NULL, 'Thương Mại Điện Tử & Bán Lẻ', 'E-Commerce & Retail', 'e-commerce', 'shopping-cart', 1, 1),
(2, NULL, 'Doanh Nghiệp & Dịch Vụ', 'Corporate & B2B', 'corporate-b2b', 'briefcase', 2, 1),
(3, NULL, 'Y Tế, Spa & Làm Đẹp', 'Health, Spa & Beauty', 'health-beauty', 'heart-pulse', 3, 1),
(4, NULL, 'Giáo Dục & Khóa Học', 'Education & LMS', 'education-lms', 'graduation-cap', 4, 1),
(5, NULL, 'Nhà Hàng, Café & F&B', 'Restaurant & F&B', 'restaurant-food', 'utensils', 5, 1),
(6, NULL, 'Bất Động Sản & Xây Dựng', 'Real Estate & Architecture', 'real-estate', 'building', 6, 1),
(7, NULL, 'Portfolio & Sáng Tạo', 'Creative & Agency', 'portfolio-agency', 'palette', 7, 1)
ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`);

-- 3. SEED 10 DEMO THEMES
INSERT INTO `themes` (
  `id`, `author_id`, `category_id`, `name`, `slug`, 
  `short_desc_vi`, `short_desc_en`, 
  `desc_vi`, `desc_en`, 
  `current_version`, `price_vnd`, `price_usd`, 
  `live_demo_url`, `thumbnail_url`, `preview_images`, 
  `compatible_with`, `page_builders`, `total_sales`, `rating_avg`, `rating_count`, 
  `status`, `is_featured`
) VALUES
(
  1, 2, 1, 
  'WoodMart - Multipurpose WooCommerce Theme', 'woodmart',
  'Giao diện thương mại điện tử đỉnh cao tối ưu tốc độ, tích hợp Header Builder và hơn 80+ bản demo có sẵn.',
  'Premium WooCommerce WordPress theme built for ultimate performance and online stores with 80+ prebuilt websites.',
  'WoodMart là giao diện cao cấp số 1 dành cho WooCommerce. Tích hợp sẵn bộ tính năng: Swatches biến thể, AJAX Search theo thời gian thực, Header Builder kéo thả, Wishlist, Compare và tối ưu Core Web Vitals.',
  'WoodMart is a premium theme optimized for creating WooCommerce online stores. It provides super fast interface for the ultimate user experience with full Elementor and WPBakery support.',
  '8.6.2', 599000, 29.00,
  'https://woodmart.xtemos.com/',
  'https://assets.thememarket.local/thumbnails/woodmart-thumb.jpg',
  '["https://assets.thememarket.local/previews/woodmart-1.jpg", "https://assets.thememarket.local/previews/woodmart-2.jpg"]',
  'WordPress 6.x, WooCommerce 9.x', 'Elementor, WPBakery', 2540, 4.95, 380,
  'published', 1
),
(
  2, 2, 1,
  'Flatsome - Multi-Purpose Responsive WooCommerce Theme', 'flatsome',
  'Theme bán chạy hàng đầu thế giới với trình dựng trang UX Builder chuyên nghiệp siêu nhẹ.',
  'The number 1 bestselling WooCommerce theme featuring lightweight UX Builder for perfect online shops.',
  'Flatsome hoàn hảo cho mọi website bán hàng online. Được thiết kế tối ưu hóa tốc độ tải trang, UX Builder trực quan không cần viết code.',
  'Flatsome is the perfect theme for your shop or company website, fully responsive with revolution slider and drag & drop page builder.',
  '3.19.2', 599000, 29.00,
  'https://flatsome3.uxthemes.com/',
  'https://assets.thememarket.local/thumbnails/flatsome-thumb.jpg',
  '["https://assets.thememarket.local/previews/flatsome-1.jpg"]',
  'WordPress 6.x, WooCommerce 9.x', 'UX Builder', 3120, 4.90, 450,
  'published', 1
),
(
  3, 2, 1,
  'Porto - Multipurpose & WooCommerce Theme', 'porto',
  'Theme doanh nghiệp và bán hàng mạnh mẽ với hơn 130+ bản demo cực kỳ phong phú.',
  'Powerful multipurpose and WooCommerce theme with 130+ niche demo sites and speed optimization.',
  'Porto cung cấp giải pháp trọn gói cho website thương mại điện tử với hệ thống AI Generator, Gutenberg blocks, và Elementor widgets chuyên sâu.',
  'Porto is an ultimate WordPress business & woocommerce theme that is suitable for any business and woocommerce sites.',
  '7.1.0', 499000, 25.00,
  'https://www.portotheme.com/wordpress/porto/',
  'https://assets.thememarket.local/thumbnails/porto-thumb.jpg',
  '["https://assets.thememarket.local/previews/porto-1.jpg"]',
  'WordPress 6.x, WooCommerce 9.x', 'Elementor, WPBakery', 1850, 4.88, 210,
  'published', 0
),
(
  4, 2, 2,
  'Astra Pro - High Performance Multipurpose Theme', 'astra-pro',
  'Giao diện nhẹ nhất thế giới dành cho website doanh nghiệp, tin tức, và dịch vụ chuyên nghiệp.',
  'The fastest, lightweight and highly customizable WordPress theme for business and blogging.',
  'Astra Pro mang đến trải nghiệm mượt mà với kích thước mã nguồn dưới 50KB, tích hợp schema SEO chuẩn xác và hàng trăm starter templates.',
  'Astra is fast, fully customizable & beautiful WordPress theme suitable for blog, personal portfolio, business website and WooCommerce storefront.',
  '4.6.4', 699000, 35.00,
  'https://wpastra.com/starter-templates/',
  'https://assets.thememarket.local/thumbnails/astra-thumb.jpg',
  '["https://assets.thememarket.local/previews/astra-1.jpg"]',
  'WordPress 6.x, WooCommerce 9.x', 'Elementor, Gutenberg, Beaver Builder', 4200, 4.98, 620,
  'published', 1
),
(
  5, 2, 7,
  'Divi - The Ultimate Visual Builder Theme', 'divi',
  'Giải pháp xây dựng website sáng tạo không giới hạn với Divi Visual Builder tiên tiến.',
  'The most popular WordPress theme and visual page builder with revolutionary design capabilities.',
  'Divi thay đổi cách bạn tạo website với trình soạn thảo thị giác trực tiếp, hàng ngàn hiệu ứng chuyển động và thư viện layout đồ sộ.',
  'Divi takes WordPress to a whole new level with its incredibly advanced visual builder technology.',
  '4.25.1', 799000, 39.00,
  'https://www.elegantthemes.com/gallery/divi/',
  'https://assets.thememarket.local/thumbnails/divi-thumb.jpg',
  '["https://assets.thememarket.local/previews/divi-1.jpg"]',
  'WordPress 6.x, WooCommerce 9.x', 'Divi Builder', 5100, 4.85, 780,
  'published', 1
),
(
  6, 2, 2,
  'Avada - Website Builder For WordPress & WooCommerce', 'avada',
  'Hệ thống Website Builder toàn năng số 1 thế giới với hơn 900.000 người dùng tin cậy.',
  'The number 1 bestselling WordPress website builder with powerful live visual design tools.',
  'Avada sở hữu bộ công cụ Avada Live Visual Builder hoàn chỉnh, hỗ trợ tạo header, footer, form và layout WooCommerce dễ dàng.',
  'Avada is the ultimate website building experience for WordPress with no coding knowledge required.',
  '7.11.4', 799000, 39.00,
  'https://avada.website/',
  'https://assets.thememarket.local/thumbnails/avada-thumb.jpg',
  '["https://assets.thememarket.local/previews/avada-1.jpg"]',
  'WordPress 6.x, WooCommerce 9.x', 'Avada Builder', 6300, 4.87, 910,
  'published', 0
),
(
  7, 2, 2,
  'Betheme - Responsive Multipurpose WordPress Theme', 'betheme',
  'Giao diện đa năng với hơn 700+ website dựng sẵn dành cho mọi lĩnh vực kinh doanh.',
  'Massive multipurpose WordPress theme with 700+ pre-built websites for any industry.',
  'Betheme nổi bật với trình tạo trang BeBuilder tốc độ cao, khả năng tùy biến không giới hạn và kho mẫu giao diện đồ sộ.',
  'Betheme is packed with 700+ thematic websites so you can easily import any demo website within seconds.',
  '27.3.5', 599000, 29.00,
  'https://muffingroup.com/betheme/',
  'https://assets.thememarket.local/thumbnails/betheme-thumb.jpg',
  '["https://assets.thememarket.local/previews/betheme-1.jpg"]',
  'WordPress 6.x, WooCommerce 9.x', 'BeBuilder, Elementor', 1900, 4.82, 195,
  'published', 0
),
(
  8, 2, 1,
  'Electro - Electronics Store WooCommerce Theme', 'electro',
  'Theme chuyên biệt cho sàn thương mại điện tử công nghệ, điện thoại và đồ điện tử.',
  'Specialized WooCommerce theme designed for electronics stores, gadget shops and digital marketplaces.',
  'Electro được thiết kế riêng cho cửa hàng thiết bị điện tử, hỗ trợ so sánh thông số kỹ thuật, tích hợp Dokan Multi-vendor.',
  'Electro is a robust and flexible WordPress theme designed to help you make the most out of using WooCommerce to power your online store.',
  '3.4.1', 499000, 25.00,
  'https://electro.madrasthemes.com/',
  'https://assets.thememarket.local/thumbnails/electro-thumb.jpg',
  '["https://assets.thememarket.local/previews/electro-1.jpg"]',
  'WordPress 6.x, WooCommerce 9.x', 'Elementor, WPBakery', 1420, 4.86, 160,
  'published', 0
),
(
  9, 2, 2,
  'Enfold - Responsive Multi-Purpose Theme', 'enfold',
  'Theme siêu thân thiện cho doanh nghiệp, chuẩn SEO, tối ưu tốc độ và cực kỳ ổn định.',
  'Super clean and extremely user-friendly multipurpose WordPress theme for businesses.',
  'Enfold được xây dựng trên bộ khung Avia Layout Builder nhẹ nhàng, code sạch, tương thích tối đa với WPML đa ngôn ngữ.',
  'Enfold is a clean, super flexible and fully responsive WordPress Theme suited for business websites, shop websites and portfolios.',
  '5.6.8', 549000, 27.00,
  'https://kriesi.at/themedemo/enfold-overview/',
  'https://assets.thememarket.local/thumbnails/enfold-thumb.jpg',
  '["https://assets.thememarket.local/previews/enfold-1.jpg"]',
  'WordPress 6.x, WooCommerce 9.x', 'Avia Layout Builder', 2800, 4.90, 310,
  'published', 0
),
(
  10, 2, 2,
  'OceanWP - Lightweight & Highly Extendable Theme', 'oceanwp',
  'Giao diện nhẹ nhàng, linh hoạt, hỗ trợ đầy đủ các tiện ích mở rộng cho kinh doanh trực tuyến.',
  'Lightweight and highly extendable theme with complete eCommerce customization.',
  'OceanWP hỗ trợ tùy biến WooCommerce nâng cao: Quick View, Floating Add to Cart bar, Off-Canvas filter và Native Cart popup.',
  'OceanWP is the perfect theme for your project. Lightweight and highly extendable, it will enable you to create almost any type of website.',
  '3.5.3', 399000, 19.00,
  'https://oceanwp.org/demos/',
  'https://assets.thememarket.local/thumbnails/oceanwp-thumb.jpg',
  '["https://assets.thememarket.local/previews/oceanwp-1.jpg"]',
  'WordPress 6.x, WooCommerce 9.x', 'Elementor, Gutenberg', 1650, 4.79, 140,
  'published', 0
)
ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`);

-- 4. SEED THEME VERSIONS
INSERT INTO `theme_versions` (`id`, `theme_id`, `version`, `changelog`, `file_path`, `file_size_bytes`, `php_version_min`, `wp_version_min`, `is_stable`) VALUES
(
  1, 1, '8.6.2',
  '### Version 8.6.2 Changelog\n- Tương thích hoàn toàn với WooCommerce 9.x và WordPress 6.x\n- Bổ sung tính năng Custom Labels và Video Gallery cho sản phẩm\n- Tối ưu hóa hiệu năng Core Web Vitals (LCP & CLS)\n- Sửa các lỗi CSS trên thiết bị di động',
  'packages/woodmart/woodmart-8.6.2.zip', 48234496, '7.4', '6.0', 1
),
(
  2, 1, '8.6.0',
  '### Version 8.6.0 Changelog\n- Bổ sung module Dynamic Discounts\n- Thêm tính năng Frequently Bought Together\n- Cải thiện tốc độ tải styles storage',
  'packages/woodmart/woodmart-8.6.0.zip', 47800120, '7.4', '6.0', 1
),
(
  3, 2, '3.19.2',
  '### Version 3.19.2 Changelog\n- Cập nhật UX Builder elements\n- Tương thích WooCommerce mới nhất\n- Nâng cấp Google Fonts API v2',
  'packages/flatsome/flatsome-3.19.2.zip', 32450000, '7.4', '6.0', 1
),
(
  4, 4, '4.6.4',
  '### Version 4.6.4 Changelog\n- Tối ưu hóa tốc độ nạp CSS font chữ\n- Nâng cấp header builder layout switcher',
  'packages/astra-pro/astra-pro-4.6.4.zip', 18900000, '7.4', '6.0', 1
)
ON DUPLICATE KEY UPDATE `version` = VALUES(`version`);

-- 5. SEED ORDERS & ITEMS (DEMO ORDER)
INSERT INTO `orders` (
  `id`, `order_number`, `user_id`, `customer_email`, `customer_name`, `customer_phone`, 
  `total_amount`, `currency`, `payment_method`, `payment_status`, `order_status`, `ip_address`
) VALUES
(
  1, 'ORD-2026-8888', 3, 'customer@thememarket.local', 'Nguyễn Văn Khách Hàng', '0901234567',
  599000.00, 'VND', 'vietqr', 'paid', 'completed', '127.0.0.1'
)
ON DUPLICATE KEY UPDATE `order_number` = VALUES(`order_number`);

INSERT INTO `order_items` (`id`, `order_id`, `theme_id`, `license_type`, `unit_price`) VALUES
(1, 1, 1, 'regular', 599000.00)
ON DUPLICATE KEY UPDATE `order_id` = VALUES(`order_id`);

-- 6. SEED LICENSES & ACTIVATIONS
INSERT INTO `licenses` (
  `id`, `license_key`, `order_id`, `theme_id`, `user_id`, 
  `license_type`, `max_domains`, `active_domains_count`, `status`, `expires_at`
) VALUES
(
  1, 'WD-2026-DEMO-A1B2-C3D4-E5F6', 1, 1, 3,
  'regular', 1, 1, 'active', DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 YEAR)
)
ON DUPLICATE KEY UPDATE `license_key` = VALUES(`license_key`);

INSERT INTO `license_activations` (`id`, `license_id`, `domain`, `ip_address`, `is_active`) VALUES
(1, 1, 'mytestshop.local', '127.0.0.1', 1)
ON DUPLICATE KEY UPDATE `domain` = VALUES(`domain`);

-- 7. SEED PAYMENTS
INSERT INTO `payments` (
  `id`, `order_id`, `transaction_id`, `gateway`, `amount`, `currency`, `status`, `raw_payload`
) VALUES
(
  1, 1, 'MB-999888777-DEMO', 'vietqr', 599000.00, 'VND', 'completed', 
  '{"gateway":"vietqr","accountNumber":"9999999999","content":"ORD-2026-8888","amount":599000,"status":"PAID"}'
)
ON DUPLICATE KEY UPDATE `transaction_id` = VALUES(`transaction_id`);

SET FOREIGN_KEY_CHECKS = 1;
