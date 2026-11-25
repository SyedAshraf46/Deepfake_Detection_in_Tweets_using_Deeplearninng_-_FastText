@echo off
echo ========================================
echo Quick Install - Missing Dependencies
echo ========================================
echo.

cd /d "%~dp0"
call venv\Scripts\activate.bat

echo Installing emoji, pandas, scikit-learn...
pip install emoji pandas scikit-learn

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo You can now run: python app.py
echo.
pause

