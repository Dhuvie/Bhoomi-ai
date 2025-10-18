@echo off
echo ============================================================
echo Installing Python Packages for Soil Analysis API
echo ============================================================
echo.

echo Attempting to install packages...
echo.

python -m pip install pandas numpy scikit-learn joblib fastapi uvicorn pydantic

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo First attempt failed. Trying with 'py' command...
    py -m pip install pandas numpy scikit-learn joblib fastapi uvicorn pydantic
)

echo.
echo ============================================================
echo Installation complete!
echo ============================================================
echo.
echo Next step: Run "2_train_model.bat" to create the ML model
echo.
pause
