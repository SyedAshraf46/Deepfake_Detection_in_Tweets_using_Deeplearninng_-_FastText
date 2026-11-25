@echo off
echo Installing Python dependencies...
echo.

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install core dependencies (without FastText for Windows compatibility)
echo Installing core dependencies...
pip install Flask==3.0.0
pip install flask-cors==4.0.0
pip install flask-sqlalchemy==3.1.1
pip install flask-jwt-extended==4.6.0
pip install werkzeug==3.0.1
pip install python-dotenv==1.0.0
pip install psycopg2-binary==2.9.9
pip install numpy==1.24.3
pip install scikit-learn==1.3.2
pip install emoji==2.8.0
pip install pandas==2.1.4

echo.
echo Installing TensorFlow (this may take a while)...
pip install tensorflow==2.15.0

echo.
echo ========================================
echo Core dependencies installed!
echo.
echo Note: FastText is skipped (Windows compatibility issue)
echo The system will use fallback features instead.
echo.
echo To install FastText later (optional):
echo   - Install Visual Studio Build Tools
echo   - Or use Linux/WSL
echo   - Or use pre-built wheels if available
echo ========================================
echo.
pause

