@echo off
chcp 65001 >nul
title Theme Marketplace - Turbo Development Mode
echo ======================================================================
echo 🚀 THEME MARKETPLACE - KHỞI CHẠY CHẾ ĐỘ PHÁT TRIỂN TURBO (0ms LAG)
echo ======================================================================
echo - Backend API   : http://localhost:4000
echo - Web & Admin   : http://localhost:3000 (Turbopack Enabled)
echo   * Cửa hàng    : http://localhost:3000
echo   * Quản trị    : http://localhost:3000/admin
echo ======================================================================
echo.

echo [1/2] Khởi chạy Backend Express API (Port 4000)...
start "Backend API (Port 4000)" cmd /k "title Backend API (Port 4000) && npm --prefix backend run dev"

echo [2/2] Khởi chạy Unified Frontend Next.js 15 Turbopack (Port 3000)...
start "Unified Frontend (Port 3000)" cmd /k "title Unified Frontend (Port 3000) && npm --prefix frontend run dev:turbo"

echo.
echo ✅ ĐÃ KHỞI CHẠY ĐỒNG THỜI 2 DỊCH VỤ!
echo Hãy mở trình duyệt và trải nghiệm điều hướng tức thì với Turbopack.
echo Nhấn phím bất kỳ để thoát cửa sổ này (các dịch vụ vẫn sẽ chạy ngầm).
pause >nul
