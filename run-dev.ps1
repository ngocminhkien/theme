# ======================================================================
# 🚀 THEME MARKETPLACE - KHỞI CHẠY CHẾ ĐỘ PHÁT TRIỂN TURBO (0ms LAG)
# ======================================================================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "Theme Marketplace - Turbo Dev Mode"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "🚀 THEME MARKETPLACE - KHỞI CHẠY CHẾ ĐỘ PHÁT TRIỂN TURBO (0ms LAG)" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "- Backend API   : http://localhost:4000" -ForegroundColor Green
Write-Host "- Web & Admin   : http://localhost:3000 (Turbopack Enabled)" -ForegroundColor Green
Write-Host "  * Cửa hàng    : http://localhost:3000" -ForegroundColor Gray
Write-Host "  * Quản trị    : http://localhost:3000/admin" -ForegroundColor Gray
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = $PSScriptRoot

Write-Host "[1/2] Khởi chạy Backend Express API (Port 4000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootPath'; `$Host.UI.RawUI.WindowTitle='Backend API (Port 4000)'; npm --prefix backend run dev"

Write-Host "[2/2] Khởi chạy Unified Frontend Next.js 15 Turbopack (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootPath'; `$Host.UI.RawUI.WindowTitle='Unified Frontend (Port 3000)'; npm --prefix frontend run dev:turbo"

Write-Host ""
Write-Host "✅ ĐÃ KHỞI CHẠY ĐỒNG THỜI 2 TIẾN TRÌNH VỚI TURBOPACK RUST BUNDLER!" -ForegroundColor Green
Write-Host "Tốc độ Fast Refresh dưới 1s, phản hồi trang dưới 50ms." -ForegroundColor Green
