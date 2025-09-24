@echo off
echo ========================================
echo  Voice Control Smart Home Automation
echo ========================================
echo.

echo Starting Backend Server...
cd backend
start cmd /k "npm start"
timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend...
cd ../frontend
start index.html

echo.
echo ========================================
echo  System Started Successfully!
echo ========================================
echo.
echo Backend: http://localhost:3001
echo Frontend: Open index.html in your browser
echo.
echo Press any key to close this window...
pause > nul
