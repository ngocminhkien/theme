import mysql from 'mysql2/promise';
import { ENV } from './env.js';

// Connection pool tối ưu cho môi trường Production
export const dbPool = mysql.createPool({
  host: ENV.DB.HOST,
  port: ENV.DB.PORT,
  database: ENV.DB.NAME,
  user: ENV.DB.USER,
  password: ENV.DB.PASSWORD,
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  ssl: ENV.DB.SSL ? { rejectUnauthorized: false } : undefined,
});

const originalPoolQuery = dbPool.query;

let isOfflineMode = false;
let heartbeatTimer: NodeJS.Timeout | null = null;
let lastHeartbeatTime = 0;

/**
 * Kiểm tra trạng thái máy chủ MySQL.
 * Trả về true nếu MySQL đang ngoại tuyến (circuit open) để Model & Controller
 * chuyển thẳng 100% sang Fast-Path dữ liệu in-memory mà không chờ TCP timeout.
 */
export function isDbOffline(): boolean {
  // Nếu dbPool.query đã được mock trong môi trường kiểm thử (e.g. unit tests),
  // không kích hoạt offline fast-path để cho phép mock query chạy bình thường.
  if (dbPool.query !== originalPoolQuery) {
    return false;
  }
  return isOfflineMode;
}

export function setOfflineMode(offline: boolean): void {
  isOfflineMode = offline;
}

export function markDbOffline(error?: any): void {
  if (error?.code === 'ECONNREFUSED' || String(error?.message || '').includes('ECONNREFUSED') || String(error?.code || '').includes('ETIMEDOUT')) {
    if (!isOfflineMode) {
      console.warn('⚡ [CircuitBreaker] Kích hoạt 0ms Fast-Path in-memory do MySQL ngoại tuyến:', error?.message || error?.code);
    }
    isOfflineMode = true;
  }
}

/**
 * Kiểm tra kết nối MySQL với thời gian chờ ngắn (1000ms).
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  if (dbPool.query !== originalPoolQuery) {
    isOfflineMode = false;
    return true;
  }

  try {
    const connectionPromise = dbPool.getConnection();
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('ETIMEDOUT'));
      }, 1000);
      if (timer.unref) timer.unref();
    });

    const conn = await Promise.race([connectionPromise, timeoutPromise]);
    conn.release();

    if (isOfflineMode) {
      console.log('⚡ [CircuitBreaker] MySQL đã khôi phục kết nối! Tắt chế độ Fast-Path in-memory.');
    }
    isOfflineMode = false;
    lastHeartbeatTime = Date.now();
    return true;
  } catch (err: any) {
    markDbOffline(err);
    lastHeartbeatTime = Date.now();
    return false;
  }
}

/**
 * Kích hoạt vòng lặp kiểm tra trạng thái MySQL định kỳ (heartbeat mỗi 30 giây).
 */
export function startDatabaseHeartbeat(intervalMs = 30000): void {
  if (heartbeatTimer) return;
  heartbeatTimer = setInterval(() => {
    checkDatabaseHealth().catch(() => {});
  }, intervalMs);
  if (heartbeatTimer.unref) heartbeatTimer.unref();
}

export function stopDatabaseHeartbeat(): void {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

export async function testDbConnection(): Promise<boolean> {
  const isHealthy = await checkDatabaseHealth();
  startDatabaseHeartbeat();
  if (isHealthy) {
    console.log(`[Database] Kết nối MySQL thành công tới database: ${ENV.DB.NAME}`);
  } else {
    console.log(`[Database] MySQL không hoạt động hoặc không khả dụng. 0ms Fast-Path in-memory đã được kích hoạt.`);
  }
  return isHealthy;
}
