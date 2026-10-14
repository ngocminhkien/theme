# ======================================================================
# 🚀 THEME MARKETPLACE - KHỞI CHẠY CHẾ ĐỘ PHÁT TRIỂN TURBO (0ms LAG)
# ======================================================================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "Theme Marketplace - Turbo Dev Mode"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "🚀 THEME MARKETPLACE - KHỞI CHẠY CHẾ ĐỘ PHÁT TRIỂN TURBO (0ms LAG)" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "- Backend API  : http://localhost:4000" -ForegroundColor Green
Write-Host "- Frontend Store: http://localhost:3000 (Turbopack Enabled)" -ForegroundColor Green
Write-Host "- Admin Portal  : http://localhost:3001 (Turbopack Enabled)" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = $PSScriptRoot

Write-Host "[1/3] Khởi chạy Backend Express API (Port 4000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootPath'; `$Host.UI.RawUI.WindowTitle='Backend API (Port 4000)'; npm --prefix backend run dev"

Write-Host "[2/3] Khởi chạy Frontend Next.js 15 Turbopack (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootPath'; `$Host.UI.RawUI.WindowTitle='Frontend Store (Port 3000)'; npm --prefix frontend run dev:turbo"

Write-Host "[3/3] Khởi chạy Admin Portal Next.js 15 Turbopack (Port 3001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootPath'; `$Host.UI.RawUI.WindowTitle='Admin Portal (Port 3001)'; npm --prefix admin run dev:turbo"

Write-Host ""
Write-Host "✅ ĐÃ KHỞI CHẠY ĐỒNG THỜI 3 TIẾN TRÌNH VỚI TURBOPACK RUST BUNDLER!" -ForegroundColor Green
Write-Host "Tốc độ Fast Refresh dưới 1s, phản hồi trang dưới 50ms." -ForegroundColor Green
