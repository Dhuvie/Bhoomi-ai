@echo off
echo ============================================================
echo Starting Soil Analysis API Server
echo ============================================================
echo.
echo API will be available at: http://127.0.0.1:8000
echo API Documentation at: http://127.0.0.1:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.
echo ============================================================
echo.

python main_api.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo First attempt failed. Trying with 'py' command...
    py main_api.py
)

pause
