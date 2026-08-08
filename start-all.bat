@echo off
title EduPortal AI - System Launcher
color 0A

echo ===============================================================================
echo          EDUPORTAL AI - UNIVERSITY STUDENT & ACADEMIC MANAGEMENT SYSTEM
echo ===============================================================================
echo [1/3] Launching Spring Boot Backend (Port 8080)...
start "EduPortal Backend (Spring Boot 3)" cmd /k "cd /d D:\DATN\StudentManager\student-management && mvn spring-boot:run"

echo [2/3] Waiting 5 seconds for Backend initialization...
timeout /t 5 /nobreak >nul

echo [3/3] Launching React Frontend (Port 3000)...
start "EduPortal Frontend (React 18 + Vite)" cmd /k "cd /d D:\DATN\StudentManager\student-management-frontend && npm run dev"

echo.
echo ===============================================================================
echo   HET THONG DANG KHOI DONG THANH CONG!
echo   - Frontend: http://localhost:3000
echo   - Backend API: http://localhost:8080/api/v1
echo   - Swagger API Docs: http://localhost:8080/swagger-ui/index.html
echo   - Default Admin: admin / admin123
echo   - Default Teacher: teacher / teacher123
echo ===============================================================================
echo.
timeout /t 3 >nul
start http://localhost:3000
pause
