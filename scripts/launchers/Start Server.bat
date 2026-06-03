@echo off
REM Windows double-click launcher for the eMasjid Web standalone bundle.
REM A user can just double-click this file from File Explorer.

setlocal
cd /d "%~dp0"

set "PORT=3000"
if not "%PORT_OVERRIDE%"=="" set "PORT=%PORT_OVERRIDE%"
set "URL=http://localhost:%PORT%"

cls
echo ===================================================
echo   eMasjid Web - Starting local server
echo ===================================================
echo.

REM Check Node.js is on PATH.
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is not installed on this PC.
  echo.
  echo   Please install Node.js ^(choose the LTS version^):
  echo       https://nodejs.org/
  echo.
  echo   After installing, double-click this file again.
  echo.
  pause
  exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set "NODE_VER=%%v"
echo   Node.js version: %NODE_VER%
echo   Server URL:      %URL%
echo.
echo   Opening your browser in a moment...
echo   (Keep this window open - closing it stops the server.)
echo.
echo ===================================================
echo.

REM Open the default browser shortly after node binds the port.
start "" /b cmd /c "timeout /t 2 /nobreak >nul && start """" %URL%"

REM Foreground the server.
node server.js
