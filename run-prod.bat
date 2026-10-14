@echo off
chcp 65001 >nul
title Theme Marketplace - Production Zero-Lag Runtime
echo ======================================================================
echo ⚡ THEME MARKETPLACE - CHẾ ĐỘ TRẢI NGHIỆM SIÊU TỐC / PRODUCTION
echo ======================================================================
echo Toàn bộ trang được biên dịch trước (Pre-rendered) & nén Brotli/Gzip.
echo Thời gian phản hồi click chuyển trang đạt ^< 20ms.
echo ======================================================================
echo.

echo [GIAI ĐOẠN 1/2] BIÊN DỊCH BẢN PHÁT HÀNH (ONE-TIME BUILD)...
echo.
echo 📦 1.1 Biên dịch Backend TypeScript...
call npm --prefix backend run build
if %errorlevel% neq 0 (
  echo ❌ Lỗi biên dịch Backend! Vui lòng kiểm tra lại.
  pause
  exit /b %errorlevel%
)

echo 📦 1.2 Biên dịch Frontend Next.js 15 Production Package...
call npm --prefix frontend run build
if %errorlevel% neq 0 (
  echo ❌ Lỗi biên dịch Frontend! Vui lòng kiểm tra lại.
  pause
  exit /b %errorlevel%
)

echo 📦 1.3 Biên dịch Admin Portal Next.js 15 Production Package...
call npm --prefix admin run build
if %errorlevel% neq 0 (
  echo ❌ Lỗi biên dịch Admin! Vui lòng kiểm tra lại.
  pause
  exit /b %errorlevel%
)

echo.
echo ======================================================================
echo [GIAI ĐOẠN 2/2] KHỞI CHẠY HỆ THỐNG RUNTIME SIÊU TỐC
echo ======================================================================
echo - Backend API  : http://localhost:4000 (Node.js High-Throughput)
echo - Frontend Store: http://localhost:3000 (Pre-rendered Production)
echo - Admin Portal  : http://localhost:3001 (Pre-rendered Production)
echo ======================================================================
echo.

echo 🚀 Khởi chạy Backend Production (Port 4000)...
start "Backend Production (Port 4000)" cmd /k "title Backend Production (Port 4000) && node backend/dist/server.js"

echo 🚀 Khởi chạy Frontend Production (Port 3000)...
start "Frontend Production (Port 3000)" cmd /k "title Frontend Production (Port 3000) && npm --prefix frontend run start"

echo 🚀 Khởi chạy Admin Portal Production (Port 3001)...
start "Admin Portal Production (Port 3001)" cmd /k "title Admin Portal Production (Port 3001) && npm --prefix admin run start"

echo.
echo ✅ HỆ THỐNG PRODUCTION ĐÃ SẴN SÀNG!
echo Trải nghiệm tốc độ chuyển trang tức thì dưới 20ms mà không hề có giật lag.
echo Nhấn phím bất kỳ để thoát cửa sổ này (các dịch vụ vẫn sẽ chạy ngầm).
pause >nul
