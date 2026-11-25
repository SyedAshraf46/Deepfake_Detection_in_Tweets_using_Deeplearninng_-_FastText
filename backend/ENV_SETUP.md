# .env File Setup

## Quick Setup

### Option 1: Using Batch Script (Windows)
```bash
cd backend
setup_env.bat
```

### Option 2: Using Python Script
```bash
cd backend
python create_env.py --overwrite
```

### Option 3: Manual Creation
Create a file named `.env` in the `backend` directory with the following content:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/deepfake_detection

# JWT Configuration
JWT_SECRET_KEY=your-secret-key-change-in-production-use-random-string-32-chars-min

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True

# Model Paths (optional, defaults provided)
MODEL_PATH=models/deepfake_model.h5
FASTTEXT_PATH=models/fasttext_embeddings.pkl
```

## Important: Update These Values

1. **DATABASE_URL**: 
   - Format: `postgresql://username:password@host:port/database`
   - Example: `postgresql://myuser:mypass@localhost:5432/deepfake_detection`

2. **JWT_SECRET_KEY**: 
   - Change to a random secret key (minimum 32 characters)
   - You can generate one using: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

## Note

The `.env` file is gitignored for security reasons. Each developer needs to create their own `.env` file.

