@echo off
title FlashRead Server - Stop
cd /d "%~dp0"
if exist stop_server.py (
    cd ..
)

echo ==================================================
echo Stopping FlashRead Server...
echo ==================================================

python Scripts\stop_server.py

echo.
echo ==================================================
echo Server stop sequence completed.
echo ==================================================
echo.
pause
