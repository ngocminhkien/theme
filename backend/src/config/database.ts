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
});

export async function testDbConnection(): Promise<boolean> {
  try {
    const connection = await dbPool.getConnection();
    console.log(`[Database] Kết nối MySQL thành công tới database: ${ENV.DB.NAME}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('[Database] Lỗi kết nối MySQL:', error);
    return false;
  }
}
