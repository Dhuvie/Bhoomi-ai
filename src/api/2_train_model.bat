@echo off
echo ============================================================
echo Training Soil Analysis ML Model
echo ============================================================
echo.

python train_model.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo First attempt failed. Trying with 'py' command...
    py train_model.py
)

echo.
echo ============================================================
echo.
echo If training was successful, you should now have:
echo   - best_pipeline.pkl (the trained model file)
echo.
echo Next step: Run "3_start_api.bat" to start the API server
echo.
pause
