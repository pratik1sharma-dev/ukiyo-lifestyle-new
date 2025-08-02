@echo off
echo 🚀 Starting Ukiyo Lifestyle Development Environment...
echo.

echo 📦 Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend dependencies installation failed
    pause
    exit /b 1
)

echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend dependencies installation failed
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.
echo 🎯 Starting services...
echo.
echo 📋 Instructions:
echo   1. Backend will start on http://localhost:5000
echo   2. Frontend will start on http://localhost:5173
echo   3. Keep both terminals open
echo   4. Press Ctrl+C to stop services
echo.

echo 🔧 Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo ⏳ Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo 🎨 Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo 🎉 Both services are starting!
echo.
echo 🌐 Access your application:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo.
echo 📡 Test API endpoints:
echo    curl http://localhost:5000/api/products
echo    curl http://localhost:5000/api/categories
echo.
pause 