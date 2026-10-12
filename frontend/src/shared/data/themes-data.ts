import type { ThemeItem } from '../types';

const CATEGORIES = {
  1: { category: 'e-commerce', category_name_vi: 'Thương Mại Điện Tử & Bán Lẻ' },
  2: { category: 'corporate-b2b', category_name_vi: 'Doanh Nghiệp & Dịch Vụ' },
  7: { category: 'portfolio-agency', category_name_vi: 'Portfolio & Sáng Tạo' },
} as const;

type SeedTheme = Omit<ThemeItem, 'category' | 'category_name_vi'> & { category_id: keyof typeof CATEGORIES };

function themeFromSeed({ category_id, ...theme }: SeedTheme): ThemeItem {
  return { ...theme, ...CATEGORIES[category_id] };
}

// Canonical checkout identity and Regular prices mirror database/seeds/01_seed_data.sql.
// MySQL/API remain authoritative at order creation; do not add frontend price multipliers.
export const THEMES_DATA: ThemeItem[] = [
  themeFromSeed({
    id: 1, category_id: 1, name: 'WoodMart - Multipurpose WooCommerce Theme', slug: 'woodmart',
    short_desc_vi: 'Giao diện thương mại điện tử đỉnh cao tối ưu tốc độ, tích hợp Header Builder và hơn 80+ bản demo có sẵn.',
    short_desc_en: 'Premium WooCommerce WordPress theme built for ultimate performance and online stores with 80+ prebuilt websites.',
    full_desc_vi: 'WoodMart là giao diện cao cấp số 1 dành cho WooCommerce. Tích hợp sẵn Swatches, AJAX Search, Header Builder, Wishlist, Compare và tối ưu Core Web Vitals.',
    price_vnd: 599000, price_usd: 29, thumbnail_url: 'https://assets.thememarket.local/thumbnails/woodmart-thumb.jpg',
    gallery_urls: ['https://assets.thememarket.local/previews/woodmart-1.jpg', 'https://assets.thememarket.local/previews/woodmart-2.jpg'],
    live_demo_url: 'https://woodmart.xtemos.com/', page_builders: 'Elementor, WPBakery', rating_avg: 4.95, rating_count: 380, total_sales: 2540,
    is_featured: true, version: '8.6.2',
  }),
  themeFromSeed({
    id: 2, category_id: 1, name: 'Flatsome - Multi-Purpose Responsive WooCommerce Theme', slug: 'flatsome',
    short_desc_vi: 'Theme bán chạy hàng đầu thế giới với trình dựng trang UX Builder chuyên nghiệp siêu nhẹ.',
    short_desc_en: 'The number 1 bestselling WooCommerce theme featuring lightweight UX Builder for perfect online shops.',
    full_desc_vi: 'Flatsome hoàn hảo cho mọi website bán hàng online với UX Builder trực quan, tối ưu tốc độ tải trang.',
    price_vnd: 599000, price_usd: 29, thumbnail_url: 'https://assets.thememarket.local/thumbnails/flatsome-thumb.jpg',
    gallery_urls: ['https://assets.thememarket.local/previews/flatsome-1.jpg'],
    live_demo_url: 'https://flatsome3.uxthemes.com/', page_builders: 'UX Builder', rating_avg: 4.90, rating_count: 450, total_sales: 3120,
    is_featured: true, version: '3.19.2',
  }),
  themeFromSeed({
    id: 3, category_id: 1, name: 'Porto - Multipurpose & WooCommerce Theme', slug: 'porto',
    short_desc_vi: 'Theme doanh nghiệp và bán hàng mạnh mẽ với hơn 130+ bản demo cực kỳ phong phú.',
    short_desc_en: 'Powerful multipurpose and WooCommerce theme with 130+ niche demo sites and speed optimization.',
    full_desc_vi: 'Porto cung cấp giải pháp thương mại điện tử với AI Generator, Gutenberg blocks và Elementor widgets chuyên sâu.',
    price_vnd: 499000, price_usd: 25, thumbnail_url: 'https://assets.thememarket.local/thumbnails/porto-thumb.jpg',
    gallery_urls: ['https://assets.thememarket.local/previews/porto-1.jpg'],
    live_demo_url: 'https://www.portotheme.com/wordpress/porto/', page_builders: 'Elementor, WPBakery', rating_avg: 4.88, rating_count: 210, total_sales: 1850,
    is_featured: false, version: '7.1.0',
  }),
  themeFromSeed({
    id: 4, category_id: 2, name: 'Astra Pro - High Performance Multipurpose Theme', slug: 'astra-pro',
    short_desc_vi: 'Giao diện nhẹ dành cho website doanh nghiệp, tin tức và dịch vụ chuyên nghiệp.',
    short_desc_en: 'The fastest, lightweight and highly customizable WordPress theme for business and blogging.',
    full_desc_vi: 'Astra Pro có mã nguồn nhẹ, schema SEO và hàng trăm starter templates.',
    price_vnd: 699000, price_usd: 35, thumbnail_url: 'https://assets.thememarket.local/thumbnails/astra-thumb.jpg',
    gallery_urls: ['https://assets.thememarket.local/previews/astra-1.jpg'],
    live_demo_url: 'https://wpastra.com/starter-templates/', page_builders: 'Elementor, Gutenberg, Beaver Builder', rating_avg: 4.98, rating_count: 620, total_sales: 4200,
    is_featured: true, version: '4.6.4',
  }),
  themeFromSeed({
    id: 5, category_id: 7, name: 'Divi - The Ultimate Visual Builder Theme', slug: 'divi',
    short_desc_vi: 'Giải pháp xây dựng website sáng tạo không giới hạn với Divi Visual Builder tiên tiến.',
    short_desc_en: 'The most popular WordPress theme and visual page builder with revolutionary design capabilities.',
    full_desc_vi: 'Divi cung cấp trình soạn thảo thị giác, hiệu ứng chuyển động và thư viện layout.',
    price_vnd: 799000, price_usd: 39, thumbnail_url: 'https://assets.thememarket.local/thumbnails/divi-thumb.jpg',
    gallery_urls: ['https://assets.thememarket.local/previews/divi-1.jpg'],
    live_demo_url: 'https://www.elegantthemes.com/gallery/divi/', page_builders: 'Divi Builder', rating_avg: 4.85, rating_count: 780, total_sales: 5100,
    is_featured: true, version: '4.25.1',
  }),
  themeFromSeed({
    id: 6, category_id: 2, name: 'Avada - Website Builder For WordPress & WooCommerce', slug: 'avada',
    short_desc_vi: 'Hệ thống Website Builder toàn năng với hơn 900.000 người dùng tin cậy.',
    short_desc_en: 'The number 1 bestselling WordPress website builder with powerful live visual design tools.',
    full_desc_vi: 'Avada có Live Visual Builder, hỗ trợ tạo header, footer, form và layout WooCommerce.',
    price_vnd: 799000, price_usd: 39, thumbnail_url: 'https://assets.thememarket.local/thumbnails/avada-thumb.jpg',
    gallery_urls: ['https://assets.thememarket.local/previews/avada-1.jpg'],
    live_demo_url: 'https://avada.website/', page_builders: 'Avada Builder', rating_avg: 4.87, rating_count: 910, total_sales: 6300,
    is_featured: false, version: '7.11.4',
  }),
  themeFromSeed({
    id: 7, category_id: 2, name: 'Betheme - Responsive Multipurpose WordPress Theme', slug: 'betheme',
    short_desc_vi: 'Giao diện đa năng với hơn 700+ website dựng sẵn dành cho mọi lĩnh vực kinh doanh.',
    short_desc_en: 'Massive multipurpose WordPress theme with 700+ pre-built websites for any industry.',
    full_desc_vi: 'Betheme có BeBuilder tốc độ cao, tùy biến linh hoạt và kho mẫu phong phú.',
    price_vnd: 599000, price_usd: 29, thumbnail_url: 'https://assets.thememarket.local/thumbnails/betheme-thumb.jpg',
    gallery_urls: ['https://assets.thememarket.local/previews/betheme-1.jpg'],
    live_demo_url: 'https://muffingroup.com/betheme/', page_builders: 'BeBuilder, Elementor', rating_avg: 4.82, rating_count: 195, total_sales: 1900,
    is_featured: false, version: '27.3.5',
  }),
  themeFromSeed({
    id: 8, category_id: 1, name: 'Electro - Electronics Store WooCommerce Theme', slug: 'electro',
    short_desc_vi: 'Theme chuyên biệt cho sàn thương mại điện tử công nghệ, điện thoại và đồ điện tử.',
    short_desc_en: 'Specialized WooCommerce theme designed for electronics stores, gadget shops and digital marketplaces.',
    full_desc_vi: 'Electro hỗ trợ so sánh thông số kỹ thuật, Dokan Multi-vendor và WooCommerce.',
    price_vnd: 499000, price_usd: 25, thumbnail_url: 'https://assets.thememarket.local/thumbnails/electro-thumb.jpg',
    gallery_urls: ['https://assets.thememarket.local/previews/electro-1.jpg'],
    live_demo_url: 'https://electro.madrasthemes.com/', page_builders: 'Elementor, WPBakery', rating_avg: 4.86, rating_count: 160, total_sales: 1420,
    is_featured: false, version: '3.4.1',
  }),
  themeFromSeed({
    id: 9, category_id: 2, name: 'Enfold - Responsive Multi-Purpose Theme', slug: 'enfold',
    short_desc_vi: 'Theme thân thiện cho doanh nghiệp, chuẩn SEO, tối ưu tốc độ và ổn định.',
    short_desc_en: 'Super clean and extremely user-friendly multipurpose WordPress Theme suited for businesses.',
    full_desc_vi: 'Enfold xây dựng trên Avia Layout Builder, tương thích tốt với WPML.',
    price_vnd: 549000, price_usd: 27, thumbnail_url: 'https://assets.thememarket.local/thumbnails/enfold-thumb.jpg',
    gallery_urls: ['https://assets.thememarket.local/previews/enfold-1.jpg'],
    live_demo_url: 'https://kriesi.at/themedemo/enfold-overview/', page_builders: 'Avia Layout Builder', rating_avg: 4.90, rating_count: 310, total_sales: 2800,
    is_featured: false, version: '5.6.8',
  }),
  themeFromSeed({
    id: 10, category_id: 2, name: 'OceanWP - Lightweight & Highly Extendable Theme', slug: 'oceanwp',
    short_desc_vi: 'Giao diện nhẹ nhàng, linh hoạt, hỗ trợ tiện ích mở rộng cho kinh doanh trực tuyến.',
    short_desc_en: 'Lightweight and highly extendable theme with complete eCommerce customization.',
    full_desc_vi: 'OceanWP hỗ trợ Quick View, Floating Add to Cart, Off-Canvas filter và WooCommerce.',
    price_vnd: 399000, price_usd: 19, thumbnail_url: 'https://assets.thememarket.local/thumbnails/oceanwp-thumb.jpg',
    gallery_urls: ['https://assets.thememarket.local/previews/oceanwp-1.jpg'],
    live_demo_url: 'https://oceanwp.org/demos/', page_builders: 'Elementor, Gutenberg', rating_avg: 4.79, rating_count: 140, total_sales: 1650,
    is_featured: false, version: '3.5.3',
  }),
];

export const CATEGORIES_LIST = [
  { id: 'all', name_vi: 'Tất Cả Danh Mục', name_en: 'All Categories', count: 10, icon: 'LayoutGrid' },
  { id: 'e-commerce', name_vi: 'Thương Mại Điện Tử & Bán Lẻ', name_en: 'E-Commerce & Retail', count: 4, icon: 'ShoppingBag' },
  { id: 'corporate-b2b', name_vi: 'Doanh Nghiệp & Dịch Vụ', name_en: 'Corporate & B2B', count: 5, icon: 'Building2' },
  { id: 'portfolio-agency', name_vi: 'Portfolio & Sáng Tạo', name_en: 'Creative & Agency', count: 1, icon: 'Palette' },
];

export const BUILDERS_LIST = [
  { id: 'all', name: 'Tất Cả Builder' },
  { id: 'elementor', name: 'Elementor' },
  { id: 'wpbakery', name: 'WPBakery' },
  { id: 'gutenberg', name: 'Gutenberg' },
  { id: 'ux builder', name: 'UX Builder' },
  { id: 'beaver builder', name: 'Beaver Builder' },
  { id: 'divi builder', name: 'Divi Builder' },
  { id: 'avada builder', name: 'Avada Builder' },
  { id: 'bebuilder', name: 'BeBuilder' },
  { id: 'avia layout builder', name: 'Avia Layout Builder' },
];

export const PRICE_RANGES = [
  { id: 'all', name_vi: 'Tất Cả Mức Giá', min_vnd: 0, max_vnd: Infinity, min_usd: 0, max_usd: Infinity },
  { id: 'under-500k', name_vi: 'Dưới 500.000 đ', min_vnd: 0, max_vnd: 500000, min_usd: 0, max_usd: 25 },
  { id: '500k-700k', name_vi: '500.000 đ - 700.000 đ', min_vnd: 500000, max_vnd: 700000, min_usd: 25, max_usd: 35 },
  { id: 'above-700k', name_vi: 'Trên 700.000 đ', min_vnd: 700000, max_vnd: Infinity, min_usd: 35, max_usd: Infinity },
];
