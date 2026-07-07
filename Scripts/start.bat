@echo off
title FlashRead Server - Start
cd /d "%~dp0"
if exist start_server.py (
    cd ..
)

echo ==================================================
echo Launching FlashRead Server Deployment...
echo ==================================================

python Scripts\start_server.py

echo.
echo ==================================================
echo Deployment script execution completed.
echo The server is running.
echo KEEP THIS WINDOW OPEN to keep the server alive.
echo Run stop.bat or close this window to terminate.
echo ==================================================
echo.

rem Keep the cmd window open and interactive
cmd /k
