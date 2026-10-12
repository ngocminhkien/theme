import { AuthController } from '../src/controllers/auth.controller.js';
import { AuthService } from '../src/services/auth.service.js';
import { UserModel, type User, type SafeUser } from '../src/models/user.model.js';
import bcrypt from 'bcryptjs';

interface Result {
  statusCode: number;
  body: any;
}

const results: Array<{ name: string; passed: boolean; details?: string }> = [];

function response(): { res: any; result: () => Result } {
  let value: Result = { statusCode: 200, body: null };
  return {
    res: {
      status(code: number) {
        value.statusCode = code;
        return this;
      },
      json(body: any) {
        value.body = body;
        return this;
      },
    },
    result: () => value,
  };
}

function request(body: any = {}, user?: any) {
  return {
    body,
    params: {},
    query: {},
    headers: {},
    ...(user ? { user } : {}),
  } as any;
}

async function run(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log('  PASS ' + name);
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    results.push({ name, passed: false, details });
    console.error('  FAIL ' + name + ': ' + details);
  }
}

function expect(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

// Backup original UserModel methods
const origFindByEmail = UserModel.findByEmail;
const origFindById = UserModel.findById;
const origFindFullById = UserModel.findFullById;
const origCreate = UserModel.create;
const origUpdateProfile = UserModel.updateProfile;
const origUpdatePassword = UserModel.updatePassword;

// Mock user data
const mockPassword = 'SecretPassword123';
const mockSalt = await bcrypt.genSalt(10);
const mockHash = await bcrypt.hash(mockPassword, mockSalt);

const mockUserDb: User = {
  id: 42,
  email: 'tester@example.com',
  password_hash: mockHash,
  full_name: 'Nguyễn Văn Test',
  phone: '0901234567',
  role: 'customer',
  status: 'active',
  created_at: new Date('2026-10-12T00:00:00Z'),
};

const mockSafeUser: SafeUser = {
  id: 42,
  email: 'tester@example.com',
  full_name: 'Nguyễn Văn Test',
  phone: '0901234567',
  role: 'customer',
  status: 'active',
  created_at: new Date('2026-10-12T00:00:00Z'),
};

console.log('--- Testing Member 2: Auth & User Profile Controller ---');

await run('register rejects invalid email format', async () => {
  const { res, result } = response();
  await AuthController.register(
    request({ email: 'invalid-email', password: 'password123', full_name: 'Tester' }),
    res
  );
  expect(result().statusCode === 400, 'must return status 400');
  expect(result().body.success === false, 'success must be false');
});

await run('register rejects password shorter than 6 chars', async () => {
  const { res, result } = response();
  await AuthController.register(
    request({ email: 'test@example.com', password: '123', full_name: 'Tester' }),
    res
  );
  expect(result().statusCode === 400, 'must return status 400');
});

await run('register successfully creates user and never leaks password_hash', async () => {
  (UserModel as any).findByEmail = async () => null;
  (UserModel as any).create = async () => 42;
  (UserModel as any).findById = async () => mockSafeUser;

  const { res, result } = response();
  await AuthController.register(
    request({ email: 'newuser@example.com', password: 'SecretPassword123', full_name: 'Nguyễn Văn Test' }),
    res
  );

  expect(result().statusCode === 201, 'must return status 201');
  expect(result().body.success === true, 'success must be true');
  expect(result().body.data.user.password_hash === undefined, 'password_hash must be completely omitted');
  expect(typeof result().body.data.token === 'string', 'must return jwt token');
});

await run('login rejects incorrect password', async () => {
  (UserModel as any).findByEmail = async () => mockUserDb;

  const { res, result } = response();
  await AuthController.login(
    request({ email: 'tester@example.com', password: 'WrongPassword' }),
    res
  );

  expect(result().statusCode === 401, 'must return 401');
  expect(result().body.success === false, 'must fail');
});

await run('login rejects banned user account', async () => {
  (UserModel as any).findByEmail = async () => ({ ...mockUserDb, status: 'banned' });

  const { res, result } = response();
  await AuthController.login(
    request({ email: 'tester@example.com', password: mockPassword }),
    res
  );

  expect(result().statusCode === 401, 'must return 401 for banned account');
});

await run('login succeeds with correct credentials and returns safe user', async () => {
  (UserModel as any).findByEmail = async () => mockUserDb;

  const { res, result } = response();
  await AuthController.login(
    request({ email: 'tester@example.com', password: mockPassword }),
    res
  );

  expect(result().statusCode === 200, 'must return 200');
  expect(result().body.success === true, 'must be success');
  expect(result().body.data.user.password_hash === undefined, 'password_hash must never be exposed');
  expect(result().body.data.user.email === 'tester@example.com', 'email matches');
});

await run('getProfile returns complete user details from DB', async () => {
  (UserModel as any).findById = async (id: number) => {
    expect(id === 42, 'must query matching userId');
    return mockSafeUser;
  };

  const { res, result } = response();
  await AuthController.getProfile(request({}, { id: 42, email: 'tester@example.com', role: 'customer' }), res);

  expect(result().statusCode === 200, 'must return 200');
  expect(result().body.data.full_name === 'Nguyễn Văn Test', 'full_name must be returned');
  expect(result().body.data.phone === '0901234567', 'phone must be returned');
});

await run('updateProfile updates full_name and phone', async () => {
  let updatedFields: any = null;
  (UserModel as any).updateProfile = async (id: number, data: any) => {
    updatedFields = data;
    return true;
  };
  (UserModel as any).findById = async () => ({
    ...mockSafeUser,
    full_name: 'Nguyễn Văn Cập Nhật',
    phone: '0988888888',
  });

  const { res, result } = response();
  await AuthController.updateProfile(
    request({ full_name: 'Nguyễn Văn Cập Nhật', phone: '0988888888' }, { id: 42, role: 'customer' }),
    res
  );

  expect(result().statusCode === 200, 'must return 200');
  expect(updatedFields.full_name === 'Nguyễn Văn Cập Nhật', 'profile updated');
  expect(result().body.data.full_name === 'Nguyễn Văn Cập Nhật', 'returns updated full_name');
});

await run('changePassword verifies old password and updates new hash', async () => {
  let updatedHash: string | null = null;
  (UserModel as any).findFullById = async () => mockUserDb;
  (UserModel as any).updatePassword = async (id: number, hash: string) => {
    updatedHash = hash;
    return true;
  };

  const { res, result } = response();
  await AuthController.changePassword(
    request({ old_password: mockPassword, new_password: 'NewStrongPassword456' }, { id: 42 }),
    res
  );

  expect(result().statusCode === 200, 'must return 200');
  expect(result().body.data.changed === true, 'changed must be true');
  expect(updatedHash !== null && updatedHash !== mockHash, 'password hash must be changed');
});

await run('changePassword rejects incorrect old password', async () => {
  (UserModel as any).findFullById = async () => mockUserDb;

  const { res, result } = response();
  await AuthController.changePassword(
    request({ old_password: 'WrongOldPassword', new_password: 'NewStrongPassword456' }, { id: 42 }),
    res
  );

  expect(result().statusCode === 400, 'must return 400 for incorrect old password');
});

// Restore originals
(UserModel as any).findByEmail = origFindByEmail;
(UserModel as any).findById = origFindById;
(UserModel as any).findFullById = origFindFullById;
(UserModel as any).create = origCreate;
(UserModel as any).updateProfile = origUpdateProfile;
(UserModel as any).updatePassword = origUpdatePassword;

// -------------------------------------------------------------
// MODULE CATEGORIES & FACETED SEARCH TESTS
// -------------------------------------------------------------
import { CategoryController } from '../src/controllers/category.controller.js';
import { CategoryModel, type Category } from '../src/models/category.model.js';
import { ThemeController } from '../src/controllers/theme.controller.js';
import { ThemeModel, type Theme } from '../src/models/theme.model.js';

console.log('\n--- Testing Member 2: Categories & Faceted Search ---');

const mockCategories: Category[] = [
  { id: 1, name_vi: 'Thương mại điện tử', name_en: 'E-commerce', slug: 'e-commerce', icon: 'shopping-cart', sort_order: 1, themes_count: 5 },
  { id: 2, name_vi: 'Doanh nghiệp & B2B', name_en: 'Corporate & B2B', slug: 'corporate', icon: 'briefcase', sort_order: 2, themes_count: 3 },
];

const mockThemeList: Theme[] = [
  {
    id: 1, author_id: 1, category_id: 1, name: 'WoodMart', slug: 'woodmart',
    short_desc_vi: 'Theme WooCommerce số 1', short_desc_en: 'Top WooCommerce theme',
    desc_vi: 'Mô tả chi tiết', desc_en: 'Detailed description', current_version: '8.6.2',
    price_vnd: 599000, price_usd: 29, live_demo_url: 'https://woodmart.demo',
    thumbnail_url: 'https://thumb.url', compatible_with: 'WordPress 6.x', page_builders: 'Elementor, WPBakery',
    total_sales: 1540, rating_avg: 4.95, rating_count: 320, status: 'published',
  },
  {
    id: 2, author_id: 1, category_id: 1, name: 'Flatsome', slug: 'flatsome',
    short_desc_vi: 'Theme bán hàng tối ưu', short_desc_en: 'Optimized eCommerce theme',
    desc_vi: 'Mô tả chi tiết', desc_en: 'Detailed description', current_version: '3.19.0',
    price_vnd: 550000, price_usd: 27, live_demo_url: 'https://flatsome.demo',
    thumbnail_url: 'https://thumb.url', compatible_with: 'WordPress 6.x', page_builders: 'UX Builder',
    total_sales: 2100, rating_avg: 4.90, rating_count: 480, status: 'published',
  },
];

await run('CategoryController.getAll returns categories with themes_count', async () => {
  (CategoryModel as any).findAll = async (includeCount: boolean) => {
    expect(includeCount === true, 'should request themes_count by default');
    return mockCategories;
  };

  const { res, result } = response();
  await CategoryController.getAll(request(), res);

  expect(result().statusCode === 200, 'must return 200');
  expect(result().body.success === true, 'success must be true');
  expect(Array.isArray(result().body.data), 'data must be array');
  expect(result().body.data[0].themes_count === 5, 'themes_count must be included');
});

await run('CategoryController.getBySlug returns matching category', async () => {
  (CategoryModel as any).findBySlug = async (slug: string) => {
    return mockCategories.find((c) => c.slug === slug) || null;
  };

  const { res, result } = response();
  await CategoryController.getBySlug({ params: { slug: 'e-commerce' } } as any, res);

  expect(result().statusCode === 200, 'must return 200');
  expect(result().body.data.slug === 'e-commerce', 'slug must match');
});

await run('CategoryController.getBySlug returns 404 for unknown category', async () => {
  (CategoryModel as any).findBySlug = async () => null;

  const { res, result } = response();
  await CategoryController.getBySlug({ params: { slug: 'non-existing-slug' } } as any, res);

  expect(result().statusCode === 404, 'must return 404');
});

await run('CategoryController.create rejects duplicate slug', async () => {
  (CategoryModel as any).findBySlug = async () => mockCategories[0];

  const { res, result } = response();
  await CategoryController.create(
    request({ name_vi: 'Mới', name_en: 'New', slug: 'e-commerce' }),
    res
  );

  expect(result().statusCode === 400, 'must return 400');
  expect(result().body.message.includes('đã tồn tại'), 'message mentions duplicate slug');
});

await run('CategoryController.create succeeds with valid payload', async () => {
  (CategoryModel as any).findBySlug = async () => null;
  (CategoryModel as any).create = async () => 3;
  (CategoryModel as any).findById = async () => ({ id: 3, name_vi: 'Bất động sản', name_en: 'Real Estate', slug: 'real-estate', sort_order: 3 });

  const { res, result } = response();
  await CategoryController.create(
    request({ name_vi: 'Bất động sản', name_en: 'Real Estate', slug: 'real-estate', sort_order: 3 }),
    res
  );

  expect(result().statusCode === 201, 'must return 201');
  expect(result().body.data.slug === 'real-estate', 'slug matches');
});

await run('ThemeController.getThemes parses faceted search filters and pagination', async () => {
  let capturedParams: any = null;
  (ThemeModel as any).findAll = async (params: any) => {
    capturedParams = params;
    return { themes: mockThemeList, total: 2 };
  };

  const { res, result } = response();
  await ThemeController.getThemes(
    {
      query: {
        category: 'e-commerce',
        builder: 'Elementor',
        q: 'woodmart',
        min_price: '500000',
        max_price: '700000',
        currency: 'VND',
        sort: 'price_asc',
        page: '1',
        limit: '10',
      },
    } as any,
    res
  );

  expect(result().statusCode === 200, 'must return 200');
  expect(capturedParams.category_slug === 'e-commerce', 'category_slug parsed');
  expect(capturedParams.builder === 'Elementor', 'builder parsed');
  expect(capturedParams.keyword === 'woodmart', 'keyword parsed');
  expect(capturedParams.min_price === 500000, 'min_price parsed');
  expect(capturedParams.max_price === 700000, 'max_price parsed');
  expect(capturedParams.currency === 'VND', 'currency parsed');
  expect(capturedParams.sort === 'price_asc', 'sort parsed');
  expect(result().body.data.pagination.totalPages === 1, 'totalPages calculated');
});

await run('ThemeController.getThemeBySlug returns theme details', async () => {
  (ThemeModel as any).findBySlug = async (slug: string) => {
    return mockThemeList.find((t) => t.slug === slug) || null;
  };

  const { res, result } = response();
  await ThemeController.getThemeBySlug({ params: { slug: 'woodmart' } } as any, res);

  expect(result().statusCode === 200, 'must return 200');
  expect(result().body.data.name === 'WoodMart', 'theme name matches');
});

// -------------------------------------------------------------
// MODULE STORAGE & PRESIGNED DOWNLOAD URLS TESTS
// -------------------------------------------------------------
import { StorageService } from '../src/services/storage.service.js';

console.log('\n--- Testing Member 2: Storage & Presigned Download URLs ---');

await run('StorageService.isConfigured returns false when env credentials missing', async () => {
  const origR2Account = process.env.R2_ACCOUNT_ID;
  delete process.env.R2_ACCOUNT_ID;
  const configured = StorageService.isConfigured();
  expect(configured === false, 'must return false when credentials missing');
  if (origR2Account) process.env.R2_ACCOUNT_ID = origR2Account;
});

await run('StorageService.generatePresignedDownloadUrl creates valid tamper-proof URL', async () => {
  const testPath = 'packages/woodmart/woodmart-8.6.2.zip';
  const url = await StorageService.generatePresignedDownloadUrl(testPath, 1800, 'WD-TEST-KEY-2026');

  expect(url.includes('expires='), 'URL must contain expires param');
  expect(url.includes('sig='), 'URL must contain signature param');

  const matchExp = url.match(/expires=(\d+)/);
  const matchSig = url.match(/sig=([a-f0-9]+)/);
  expect(matchExp !== null, 'expires timestamp found');
  expect(matchSig !== null, 'signature hash found');

  const expiresAt = parseInt(matchExp![1], 10);
  const signature = matchSig![1];

  const isValid = StorageService.verifyPresignedUrl(testPath, expiresAt, signature, 'WD-TEST-KEY-2026');
  expect(isValid === true, 'generated presigned URL must pass verification');
});

await run('StorageService.verifyPresignedUrl rejects expired or tampered token', async () => {
  const testPath = 'packages/woodmart/woodmart-8.6.2.zip';
  const expiredTimestamp = Math.floor(Date.now() / 1000) - 100; // 100 seconds in the past

  const isExpired = StorageService.verifyPresignedUrl(testPath, expiredTimestamp, 'fake_sig_123', 'WD-TEST-KEY');
  expect(isExpired === false, 'must reject expired timestamp');

  const futureTimestamp = Math.floor(Date.now() / 1000) + 1800;
  // Tampered signature with 64 hex characters
  const tamperedSig = 'a'.repeat(64);
  const isTampered = StorageService.verifyPresignedUrl(testPath, futureTimestamp, tamperedSig, 'WD-TEST-KEY');
  expect(isTampered === false, 'must reject tampered signature');
});

const failed = results.filter(r => !r.passed);
if (failed.length > 0) {
  console.error(`\n${failed.length} test(s) failed.`);
  process.exit(1);
} else {
  console.log(`\nALL ${results.length} Member 2 Tests PASSED successfully!`);
}


