@echo off
echo Creating .env file...

(
echo # Database Configuration
echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/deepfake_detection
echo.
echo # JWT Configuration
echo JWT_SECRET_KEY=your-secret-key-change-in-production-use-random-string-32-chars-min
echo.
echo # Flask Configuration
echo FLASK_ENV=development
echo FLASK_DEBUG=True
echo.
echo # Model Paths ^(optional, defaults provided^)
echo MODEL_PATH=models/deepfake_model.h5
echo FASTTEXT_PATH=models/fasttext_embeddings.pkl
) > .env

echo.
echo SUCCESS: .env file created!
echo.
echo IMPORTANT: Please update DATABASE_URL and JWT_SECRET_KEY in .env file
pause

