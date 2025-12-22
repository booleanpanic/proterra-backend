@echo off
echo Starting ProTerra Project...

start "ProTerra Backend" /D "backend" cmd /k "npm start"
start "ProTerra Frontend" /D "frontend" cmd /k "npm run dev"

echo Backend running on http://localhost:3000
echo Frontend running on http://localhost:5173
echo.
echo Press any key to exit this launcher (servers will keep running)...
pause
