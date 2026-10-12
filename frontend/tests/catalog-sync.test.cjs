const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

const { THEMES_DATA, CATEGORIES_LIST } = require('../src/shared/data/themes-data.ts');
const seedPath = path.resolve(__dirname, '../../database/seeds/01_seed_data.sql');

function publishedSeedThemes() {
  const sql = fs.readFileSync(seedPath, 'utf8');
  const start = sql.indexOf('-- 3. SEED 10 DEMO THEMES');
  const end = sql.indexOf('-- 4.', start);
  assert.ok(start >= 0 && end > start, 'theme seed section must exist');

  const blocks = sql.slice(start, end).match(/\(\s*\d+,\s*2,\s*\d+,[\s\S]*?\n\)/g) || [];
  return blocks.map((block) => {
    const match = block.match(/^\(\s*(\d+),\s*2,\s*(\d+),\s*\n?\s*'([^']+)',\s*'([^']+)',[\s\S]*?\n\s*'[^']*',\s*(\d+),\s*([\d.]+),[\s\S]*?\n\s*'published'/);
    assert.ok(match, `could not parse published seed theme block: ${block.slice(0, 80)}`);
    return {
      id: Number(match[1]),
      categoryId: Number(match[2]),
      name: match[3],
      slug: match[4],
      priceVnd: Number(match[5]),
      priceUsd: Number(match[6]),
    };
  });
}

test('static frontend catalog exactly mirrors every published MySQL seed identity and Regular price', () => {
  const seedThemes = publishedSeedThemes();
  assert.equal(seedThemes.length, 10, 'seed must expose the expected published catalog');
  assert.equal(THEMES_DATA.length, seedThemes.length, 'frontend must not omit or add purchasable themes');

  const frontendIds = new Set(THEMES_DATA.map((theme) => theme.id));
  const frontendSlugs = new Set(THEMES_DATA.map((theme) => theme.slug));
  assert.equal(frontendIds.size, THEMES_DATA.length, 'frontend IDs must be unique');
  assert.equal(frontendSlugs.size, THEMES_DATA.length, 'frontend slugs must be unique');

  for (const seed of seedThemes) {
    const theme = THEMES_DATA.find((candidate) => candidate.id === seed.id);
    assert.ok(theme, `missing frontend theme ${seed.id}`);
    assert.deepEqual(
      { id: theme.id, name: theme.name, slug: theme.slug, priceVnd: theme.price_vnd, priceUsd: theme.price_usd },
      { id: seed.id, name: seed.name, slug: seed.slug, priceVnd: seed.priceVnd, priceUsd: seed.priceUsd },
      `catalog mismatch for MySQL theme ${seed.id}`,
    );
  }
});

test('frontend category counts are derived from the purchasable static catalog', () => {
  for (const category of CATEGORIES_LIST) {
    const expected = category.id === 'all'
      ? THEMES_DATA.length
      : THEMES_DATA.filter((theme) => theme.category === category.id).length;
    assert.equal(category.count, expected, `incorrect count for ${category.id}`);
  }
});

test('catalog visuals never use the unresolved seed asset host and remain distinct per theme', () => {
  const thumbnails = new Set();
  for (const theme of THEMES_DATA) {
    assert.doesNotMatch(theme.thumbnail_url, /assets\.thememarket\.local/i, `${theme.slug} cannot use the unconfigured seed host`);
    assert.match(theme.thumbnail_url, /^https:\/\/images\.unsplash\.com\//, `${theme.slug} must use a catalog visual from the prior storefront source`);
    assert.ok(Array.isArray(theme.gallery_urls) && theme.gallery_urls.length > 0, `${theme.slug} needs a gallery visual`);
    theme.gallery_urls.forEach((image) => assert.match(image, /^https:\/\/images\.unsplash\.com\//, `${theme.slug} gallery must avoid the unresolved seed host`));
    thumbnails.add(theme.thumbnail_url);
  }
  assert.equal(thumbnails.size, THEMES_DATA.length, 'themes must not collapse to one shared thumbnail');
});
