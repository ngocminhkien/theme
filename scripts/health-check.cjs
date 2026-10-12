#!/usr/bin/env node

/**
 * ============================================================================
 * 🩺 THEME MARKETPLACE PLATFORM - AUTOMATED SYSTEM HEALTH CHECK & SMOKE TEST
 * DevOps Diagnostic Utility for Local & Production Cluster (Member 01)
 * ============================================================================
 * Usage:
 *   node scripts/health-check.cjs
 * ============================================================================
 */

const http = require('http');
const https = require('https');
const net = require('net');
const url = require('url');

const CONFIG = {
  mysql: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  backend: {
    baseUrl: process.env.APP_URL || 'http://127.0.0.1:4000',
    healthPath: '/health',
    themesPath: '/api/v1/themes',
    categoriesPath: '/api/v1/categories',
  },
  frontend: {
    baseUrl: process.env.FRONTEND_URL || 'http://127.0.0.1:3000',
    homePath: '/',
    previewPath: '/preview/woodmart',
  },
  nginx: {
    baseUrl: 'http://127.0.0.1:80',
    apiPath: '/api/v1/themes',
  },
  minio: {
    baseUrl: 'http://127.0.0.1:9000',
    healthPath: '/minio/health/live',
  },
};

const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function logHeader() {
  console.log(COLORS.bold + COLORS.cyan + '======================================================================' + COLORS.reset);
  console.log(COLORS.bold + COLORS.cyan + '🚀 THEME MARKETPLACE PLATFORM - AUTOMATED CLUSTER HEALTH CHECK' + COLORS.reset);
  console.log(COLORS.dim + '   Lead DevOps & Database Architect Diagnostic Suite' + COLORS.reset);
  console.log(COLORS.dim + '   Timestamp: ' + new Date().toISOString() + COLORS.reset);
  console.log(COLORS.bold + COLORS.cyan + '======================================================================\n' + COLORS.reset);
}

function checkTcpPort(host, port, timeoutMs = 2000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isConnected = false;

    socket.setTimeout(timeoutMs);
    socket.on('connect', () => {
      isConnected = true;
      socket.destroy();
      resolve({ status: true, message: `Connected to ${host}:${port}` });
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve({ status: false, message: `Timeout (${timeoutMs}ms) to ${host}:${port}` });
    });

    socket.on('error', (err) => {
      socket.destroy();
      resolve({ status: false, message: err.message });
    });

    socket.connect(port, host);
  });
}

function checkRedisPing(host, port, timeoutMs = 2000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let responded = false;

    socket.setTimeout(timeoutMs);
    socket.on('connect', () => {
      socket.write('*1\r\n$4\r\nPING\r\n');
    });

    socket.on('data', (data) => {
      responded = true;
      const str = data.toString();
      socket.destroy();
      if (str.includes('+PONG')) {
        resolve({ status: true, message: 'Redis replied PONG successfully' });
      } else {
        resolve({ status: false, message: `Unexpected reply: ${str.trim()}` });
      }
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve({ status: false, message: `Timeout waiting for Redis PONG` });
    });

    socket.on('error', (err) => {
      socket.destroy();
      resolve({ status: false, message: err.message });
    });

    socket.connect(port, host);
  });
}

function checkHttpEndpoint(targetUrl, expectedStatuses = [200], timeoutMs = 3000) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(targetUrl);
      const client = parsed.protocol === 'https:' ? https : http;
      const req = client.get(targetUrl, { timeout: timeoutMs }, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          const passed = expectedStatuses.includes(res.statusCode);
          resolve({
            status: passed,
            statusCode: res.statusCode,
            message: `HTTP ${res.statusCode} (${data.length} bytes)`,
            body: data,
          });
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ status: false, statusCode: 0, message: `Timeout (${timeoutMs}ms)` });
      });

      req.on('error', (err) => {
        resolve({ status: false, statusCode: 0, message: err.message });
      });
    } catch (err) {
      resolve({ status: false, statusCode: 0, message: err.message });
    }
  });
}

async function runAllChecks() {
  logHeader();
  const results = [];

  console.log(COLORS.bold + '1. Cơ sở Dữ liệu & Caching (Database & In-Memory):' + COLORS.reset);
  
  // MySQL TCP Check
  const mysqlTcp = await checkTcpPort(CONFIG.mysql.host, CONFIG.mysql.port);
  results.push({
    name: 'MySQL 8.0 Port',
    target: `${CONFIG.mysql.host}:${CONFIG.mysql.port}`,
    status: mysqlTcp.status ? 'PASS' : 'WARN',
    detail: mysqlTcp.message,
    required: false,
  });
  console.log(`  ${mysqlTcp.status ? '✅' : '⚠️'} MySQL 3306: ${mysqlTcp.message}`);

  // Redis Check
  const redisCheck = await checkRedisPing(CONFIG.redis.host, CONFIG.redis.port);
  results.push({
    name: 'Redis 7.x Cache',
    target: `${CONFIG.redis.host}:${CONFIG.redis.port}`,
    status: redisCheck.status ? 'PASS' : 'WARN',
    detail: redisCheck.message,
    required: false,
  });
  console.log(`  ${redisCheck.status ? '✅' : '⚠️'} Redis 6379: ${redisCheck.message}\n`);

  console.log(COLORS.bold + '2. Backend API Services (Express / Node.js - Port 4000):' + COLORS.reset);
  
  // Backend Health
  const beHealth = await checkHttpEndpoint(`${CONFIG.backend.baseUrl}${CONFIG.backend.healthPath}`);
  results.push({
    name: 'Backend /health',
    target: `${CONFIG.backend.baseUrl}${CONFIG.backend.healthPath}`,
    status: beHealth.status ? 'PASS' : 'FAIL',
    detail: beHealth.message,
    required: true,
  });
  console.log(`  ${beHealth.status ? '✅' : '❌'} Backend Health: ${beHealth.message}`);

  // Backend Themes Catalog
  const beThemes = await checkHttpEndpoint(`${CONFIG.backend.baseUrl}${CONFIG.backend.themesPath}`);
  results.push({
    name: 'Backend /api/v1/themes',
    target: `${CONFIG.backend.baseUrl}${CONFIG.backend.themesPath}`,
    status: beThemes.status ? 'PASS' : 'FAIL',
    detail: beThemes.message,
    required: true,
  });
  console.log(`  ${beThemes.status ? '✅' : '❌'} Themes API: ${beThemes.message}`);

  // Backend Categories
  const beCategories = await checkHttpEndpoint(`${CONFIG.backend.baseUrl}${CONFIG.backend.categoriesPath}`);
  results.push({
    name: 'Backend /api/v1/categories',
    target: `${CONFIG.backend.baseUrl}${CONFIG.backend.categoriesPath}`,
    status: beCategories.status ? 'PASS' : 'FAIL',
    detail: beCategories.message,
    required: true,
  });
  console.log(`  ${beCategories.status ? '✅' : '❌'} Categories API: ${beCategories.message}\n`);

  console.log(COLORS.bold + '3. Frontend Storefront (Next.js 15 - Port 3000):' + COLORS.reset);
  
  // Frontend Home
  const feHome = await checkHttpEndpoint(`${CONFIG.frontend.baseUrl}${CONFIG.frontend.homePath}`);
  results.push({
    name: 'Frontend Home (/)',
    target: `${CONFIG.frontend.baseUrl}${CONFIG.frontend.homePath}`,
    status: feHome.status ? 'PASS' : 'FAIL',
    detail: feHome.message,
    required: true,
  });
  console.log(`  ${feHome.status ? '✅' : '❌'} Frontend Storefront: ${feHome.message}`);

  // Frontend Live Preview
  const fePreview = await checkHttpEndpoint(`${CONFIG.frontend.baseUrl}${CONFIG.frontend.previewPath}`);
  results.push({
    name: 'Frontend Live Preview',
    target: `${CONFIG.frontend.baseUrl}${CONFIG.frontend.previewPath}`,
    status: fePreview.status ? 'PASS' : 'FAIL',
    detail: fePreview.message,
    required: true,
  });
  console.log(`  ${fePreview.status ? '✅' : '❌'} Live Preview Route: ${fePreview.message}\n`);

  console.log(COLORS.bold + '4. Hạ tầng Bổ trợ (Reverse Proxy Nginx & MinIO S3):' + COLORS.reset);
  
  // Nginx Proxy
  const nginxCheck = await checkHttpEndpoint(`${CONFIG.nginx.baseUrl}${CONFIG.nginx.apiPath}`, [200, 301, 302], 1000);
  results.push({
    name: 'Nginx Reverse Proxy (:80)',
    target: `${CONFIG.nginx.baseUrl}`,
    status: nginxCheck.status ? 'PASS' : 'OPTIONAL',
    detail: nginxCheck.message,
    required: false,
  });
  console.log(`  ${nginxCheck.status ? '✅' : 'ℹ️'} Nginx Proxy: ${nginxCheck.message} (Chạy trong Docker Prod)`);

  // MinIO S3
  const minioCheck = await checkHttpEndpoint(`${CONFIG.minio.baseUrl}${CONFIG.minio.healthPath}`, [200], 1000);
  results.push({
    name: 'MinIO Local S3 (:9000)',
    target: `${CONFIG.minio.baseUrl}`,
    status: minioCheck.status ? 'PASS' : 'OPTIONAL',
    detail: minioCheck.message,
    required: false,
  });
  console.log(`  ${minioCheck.status ? '✅' : 'ℹ️'} MinIO S3 Storage: ${minioCheck.message} (Chạy trong Docker Storage)\n`);

  // Bảng tổng kết
  console.log(COLORS.bold + COLORS.cyan + '======================================================================' + COLORS.reset);
  console.log(COLORS.bold + '📋 BẢNG TỔNG KẾT TRẠNG THÁI HẠ TẦNG (CLUSTER STATUS MATRIX)' + COLORS.reset);
  console.log(COLORS.bold + COLORS.cyan + '======================================================================' + COLORS.reset);

  results.forEach((r, idx) => {
    let tag = '';
    if (r.status === 'PASS') tag = COLORS.green + '✔ PASS    ' + COLORS.reset;
    else if (r.status === 'WARN') tag = COLORS.yellow + '▲ STANDALONE' + COLORS.reset;
    else if (r.status === 'OPTIONAL') tag = COLORS.dim + '○ OPTIONAL' + COLORS.reset;
    else tag = COLORS.red + '✖ FAIL    ' + COLORS.reset;

    console.log(`${(idx + 1).toString().padStart(2, ' ')}. ${tag} | ${r.name.padEnd(25)} | ${r.detail.slice(0, 35)}`);
  });

  const fails = results.filter((r) => r.required && r.status === 'FAIL');
  console.log('----------------------------------------------------------------------');
  if (fails.length === 0) {
    console.log(COLORS.bold + COLORS.green + '🎉 HỆ THỐNG ĐẠT CHUẨN SẴN SÀNG (HEALTHY & OPERATIONAL)!' + COLORS.reset);
    console.log(COLORS.dim + '   Môi trường hoàn toàn sẵn sàng cho Development và CI/CD Testing.' + COLORS.reset);
  } else {
    console.log(COLORS.bold + COLORS.red + `⚠️ CẢNH BÁO: Phát hiện ${fails.length} dịch vụ chính chưa khởi động hoặc gặp lỗi!` + COLORS.reset);
  }
  console.log(COLORS.bold + COLORS.cyan + '======================================================================\n' + COLORS.reset);
}

runAllChecks().catch((err) => {
  console.error('Lỗi khi thực thi Health Check:', err);
  process.exit(1);
});
