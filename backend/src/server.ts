import { app } from './app.js';
import { ENV } from './config/env.js';
import { testDbConnection } from './config/database.js';

async function bootstrap() {
  console.log('===> Đang khởi động Backend API Marketplace...');

  // Thử nghiệm kết nối Database khi khởi động
  await testDbConnection();

  app.listen(ENV.PORT, () => {
    console.log(`🚀 Backend Server đã khởi chạy thành công tại: http://localhost:${ENV.PORT}`);
    console.log(`🩺 Health check URL: http://localhost:${ENV.PORT}/health`);
    console.log(`📡 API Endpoints Base: http://localhost:${ENV.PORT}/api/v1`);
  });
}

bootstrap().catch((error) => {
  console.error('Lỗi nghiêm trọng khi khởi động server:', error);
  process.exit(1);
});
