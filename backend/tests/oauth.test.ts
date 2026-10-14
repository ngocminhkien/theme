import assert from 'node:assert/strict';
import { OAuthService } from '../src/services/oauth.service.js';
import { UserModel } from '../src/models/user.model.js';
import { AuthService } from '../src/services/auth.service.js';
import { ENV } from '../src/config/env.js';
import jwt from 'jsonwebtoken';

async function runOAuthTests() {
  console.log('🧪 Bắt đầu kiểm thử tính năng Real OAuth (Google & GitHub)...');

  // Test 1: Configuration check
  console.log('- Test 1: Kiểm tra cấu hình OAuth');
  const googleConfigured = OAuthService.isGoogleConfigured();
  const githubConfigured = OAuthService.isGithubConfigured();
  console.log(`  Google configured: ${googleConfigured}`);
  console.log(`  GitHub configured: ${githubConfigured}`);

  // Test 2: findOrCreateOAuthUser - New User
  console.log('- Test 2: Tạo người dùng mới qua OAuth');
  const testEmail = `oauth_test_${Date.now()}@gmail.com`;
  const newUser = await UserModel.findOrCreateOAuthUser({
    email: testEmail,
    full_name: 'Google Test User',
    avatar_url: 'https://lh3.googleusercontent.com/test-avatar.jpg',
  });

  assert.ok(newUser, 'Người dùng mới phải được tạo thành công');
  assert.equal(newUser.email, testEmail);
  assert.equal(newUser.full_name, 'Google Test User');
  assert.equal(newUser.role, 'customer');

  // Test 3: Generate and verify JWT
  console.log('- Test 3: Tạo và giải mã JWT token cho OAuth User');
  const token = AuthService.generateToken(newUser);
  assert.ok(token, 'Token phải tồn tại');
  const decoded = jwt.verify(token, ENV.JWT.SECRET) as any;
  assert.equal(decoded.email, testEmail);
  assert.equal(decoded.id, newUser.id);
  assert.equal(decoded.role, 'customer');

  // Test 4: Existing User linking
  console.log('- Test 4: Đăng nhập lại với cùng email (liên kết tài khoản đã có)');
  const sameUser = await UserModel.findOrCreateOAuthUser({
    email: testEmail,
    full_name: 'Google Test User (Updated)',
  });
  assert.equal(sameUser.id, newUser.id, 'Phải liên kết đúng ID người dùng đã tồn tại');

  // Test 5: Authorization URL generation
  console.log('- Test 5: Kiểm tra tạo URL chuyển hướng Google & GitHub');
  // Temporarily set dummy credentials to verify URL formatting
  const originalGoogleId = ENV.OAUTH.GOOGLE.CLIENT_ID;
  const originalGoogleSecret = ENV.OAUTH.GOOGLE.CLIENT_SECRET;
  const originalGithubId = ENV.OAUTH.GITHUB.CLIENT_ID;
  const originalGithubSecret = ENV.OAUTH.GITHUB.CLIENT_SECRET;

  ENV.OAUTH.GOOGLE.CLIENT_ID = 'google-client-id-test-123456';
  ENV.OAUTH.GOOGLE.CLIENT_SECRET = 'google-client-secret-test-123456';
  ENV.OAUTH.GITHUB.CLIENT_ID = 'github-client-id-test-123456';
  ENV.OAUTH.GITHUB.CLIENT_SECRET = 'github-client-secret-test-123456';

  const googleUrl = OAuthService.getGoogleAuthUrl('test_state_123');
  assert.ok(googleUrl.startsWith('https://accounts.google.com/o/oauth2/v2/auth?'));
  assert.ok(googleUrl.includes('client_id=google-client-id-test-123456'));
  assert.ok(googleUrl.includes('scope=openid+email+profile') || googleUrl.includes('scope=openid%20email%20profile'));
  assert.ok(googleUrl.includes('state=test_state_123'));

  const githubUrl = OAuthService.getGithubAuthUrl('test_github_state');
  assert.ok(githubUrl.startsWith('https://github.com/login/oauth/authorize?'));
  assert.ok(githubUrl.includes('client_id=github-client-id-test-123456'));
  assert.ok(githubUrl.includes('scope=read%3Auser+user%3Aemail') || githubUrl.includes('scope=read%3Auser%20user%3Aemail'));

  // Restore env
  ENV.OAUTH.GOOGLE.CLIENT_ID = originalGoogleId;
  ENV.OAUTH.GOOGLE.CLIENT_SECRET = originalGoogleSecret;
  ENV.OAUTH.GITHUB.CLIENT_ID = originalGithubId;
  ENV.OAUTH.GITHUB.CLIENT_SECRET = originalGithubSecret;

  // Test 6: HTTP Endpoints verification
  console.log('- Test 6: Kiểm tra HTTP Endpoints (/api/v1/auth/providers, /google, /github)');
  const { app } = await import('../src/app.js');
  const server = app.listen(0);
  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    // 6a: Providers endpoint
    const provRes = await fetch(`${baseUrl}/api/v1/auth/providers`);
    assert.equal(provRes.status, 200);
    const provData = await provRes.json();
    assert.equal(provData.success, true);
    assert.ok(provData.data.google);
    assert.ok(provData.data.github);

    // 6b: Google auth redirect (when configured -> redirects to accounts.google.com, else error param)
    const googleRes = await fetch(`${baseUrl}/api/v1/auth/google`, { redirect: 'manual' });
    assert.equal(googleRes.status, 302);
    const googleLocation = googleRes.headers.get('location') || '';
    assert.ok(googleLocation.includes('accounts.google.com') || googleLocation.includes('error=GOOGLE_CONFIG_MISSING'));

    // 6c: GitHub auth redirect (when unconfigured -> redirects to frontend login with error param)
    const githubRes = await fetch(`${baseUrl}/api/v1/auth/github`, { redirect: 'manual' });
    assert.equal(githubRes.status, 302);
    const githubLocation = githubRes.headers.get('location') || '';
    assert.ok(githubLocation.includes('error=GITHUB_CONFIG_MISSING'));

    console.log('  Endpoints phản hồi redirect 302 và 200 chính xác 100%!');
  } finally {
    await new Promise((resolve) => server.close(resolve));
    const { dbPool } = await import('../src/config/database.js');
    await dbPool.end();
  }

  console.log('✅ TẤT CẢ CÁC KIỂM THỬ OAUTH ĐÃ HOÀN TẤT THÀNH CÔNG VƯỢT TRỘI!');
}

runOAuthTests().catch((err) => {
  console.error('❌ Kiểm thử thất bại:', err);
  process.exit(1);
});
