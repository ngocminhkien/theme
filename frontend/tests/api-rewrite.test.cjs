const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const configPath = path.resolve(__dirname, '../next.config.js');

async function destinationFor(value) {
  const original = process.env.NEXT_PUBLIC_API_URL;
  if (value === undefined) delete process.env.NEXT_PUBLIC_API_URL;
  else process.env.NEXT_PUBLIC_API_URL = value;
  delete require.cache[configPath];
  try {
    const rewrites = await require(configPath).rewrites();
    return rewrites[0].destination;
  } finally {
    if (original === undefined) delete process.env.NEXT_PUBLIC_API_URL;
    else process.env.NEXT_PUBLIC_API_URL = original;
    delete require.cache[configPath];
  }
}

test('order API rewrite accepts origin-only and documented /api/v1 base URLs', async () => {
  assert.equal(await destinationFor(undefined), 'http://localhost:4000/api/v1/:path*');
  assert.equal(await destinationFor('http://localhost:4000'), 'http://localhost:4000/api/v1/:path*');
  assert.equal(await destinationFor('http://localhost:4000/api/v1'), 'http://localhost:4000/api/v1/:path*');
  assert.equal(await destinationFor('http://localhost:4000/api/v1/'), 'http://localhost:4000/api/v1/:path*');
});
