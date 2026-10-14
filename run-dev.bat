@echo off
chcp 65001 >nul
title Theme Marketplace - Turbo Development Mode
echo ======================================================================
echo 🚀 THEME MARKETPLACE - KHỞI CHẠY CHẾ ĐỘ PHÁT TRIỂN TURBO (0ms LAG)
echo ======================================================================
echo - Backend API  : http://localhost:4000
echo - Frontend Store: http://localhost:3000 (Turbopack Enabled)
echo - Admin Portal  : http://localhost:3001 (Turbopack Enabled)
echo ======================================================================
echo.

echo [1/3] Khởi chạy Backend Express API (Port 4000)...
start "Backend API (Port 4000)" cmd /k "title Backend API (Port 4000) && npm --prefix backend run dev"

echo [2/3] Khởi chạy Frontend Next.js 15 Turbopack (Port 3000)...
start "Frontend Store (Port 3000)" cmd /k "title Frontend Store (Port 3000) && npm --prefix frontend run dev:turbo"

echo [3/3] Khởi chạy Admin Portal Next.js 15 Turbopack (Port 3001)...
start "Admin Portal (Port 3001)" cmd /k "title Admin Portal (Port 3001) && npm --prefix admin run dev:turbo"

echo.
echo ✅ ĐÃ KHỞI CHẠY ĐỒNG THỜI 3 DỊCH VỤ!
echo Hãy mở trình duyệt và trải nghiệm điều hướng tức thì với Turbopack.
echo Nhấn phím bất kỳ để thoát cửa sổ này (các dịch vụ vẫn sẽ chạy ngầm).
pause >nul
