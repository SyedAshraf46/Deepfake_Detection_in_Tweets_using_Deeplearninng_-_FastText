# Detailed Setup Guide

## Step-by-Step Installation

### 1. Clone/Download Project
```bash
# Navigate to project directory
cd CSE_12
```

### 2. Backend Setup

#### 2.1 Install Python Dependencies
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

#### 2.2 Install PostgreSQL
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`
- **Mac**: `brew install postgresql`

#### 2.3 Create Database
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE deepfake_detection;

# Create user (optional)
CREATE USER deepfake_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE deepfake_detection TO deepfake_user;

# Exit
\q
```

#### 2.4 Configure Environment
```bash
# Generate .env from the backend defaults
python create_env.py

# Edit .env file with your settings:
# DATABASE_URL=postgresql://username:password@localhost:5432/deepfake_detection
# JWT_SECRET_KEY=your-random-secret-key-here
```

#### 2.5 Initialize Database Tables
```bash
# Run Flask app once to create tables
python app.py
# Press Ctrl+C after tables are created
```

### 3. Frontend Setup

#### 3.1 Install Node Dependencies
```bash
cd frontend
npm install
```

#### 3.2 Start Development Server
```bash
npm run dev
```

### 4. Model Training (Optional - for production)

#### 4.1 Prepare Dataset

**Download Dataset:**
- **TweepFake Dataset** (Recommended): Search on Kaggle or GitHub
  - Kaggle: https://www.kaggle.com/datasets (search "TweepFake")
  - GitHub: Search "TweepFake dataset" or "midas-research/TweepFake"
- **Alternative**: Use any bot detection dataset with ~40,000 samples
- **Format**: CSV with columns: `text`, `label` (0=human, 1=bot)

**Save Dataset:**
```bash
# Create data folder in project root
mkdir data

# Save downloaded CSV file as:
# data/tweets_dataset.csv
```

**For detailed download links and instructions, see: `DATASET_GUIDE.md`**

#### 4.2 Train Model
```bash
# Open Jupyter notebook
jupyter notebook notebooks/model_training.ipynb

# Follow notebook steps to train model
# Models will be saved to backend/models/
```

#### 4.3 Test Without Training (Fallback Mode)
- The system works with fallback prediction if models aren't trained
- Accuracy will be lower (~60-70%) but functional for testing

### 5. Run Application

#### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

#### Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/api/health

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
# Windows: Check Services
# Linux: sudo systemctl status postgresql
# Mac: brew services list

# Test connection
psql -U postgres -d deepfake_detection
```

### Port Already in Use
```bash
# Find process using port 5000
# Windows: netstat -ano | findstr :5000
# Linux/Mac: lsof -i :5000

# Kill process or change port in app.py
```

### Module Not Found Errors
```bash
# Ensure virtual environment is activated
# Reinstall requirements
pip install -r requirements.txt --force-reinstall
```

### Frontend Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

### Backend (Flask)
- Use Gunicorn or uWSGI
- Set `FLASK_ENV=production`
- Use environment variables for secrets
- Enable HTTPS

### Frontend (React)
```bash
npm run build
# Serve dist/ folder with nginx or similar
```

### Database
- Use managed PostgreSQL (AWS RDS, Heroku Postgres, etc.)
- Set up regular backups
- Configure connection pooling

## Environment Variables Reference

```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/dbname

# JWT
JWT_SECRET_KEY=your-secret-key-min-32-chars

# Flask
FLASK_ENV=development
FLASK_DEBUG=True

# Optional
MODEL_PATH=models/deepfake_model.h5
FASTTEXT_PATH=models/fasttext_embeddings.pkl
```

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend dev server starts
- [ ] Database connection successful
- [ ] Can register new user
- [ ] Can login
- [ ] Can make prediction
- [ ] Chatbot responds
- [ ] Dashboard loads history
- [ ] Admin panel accessible (if admin user)

## Next Steps After Setup

1. Train model with your dataset
2. Test all API endpoints
3. Customize UI colors/branding
4. Add more features
5. Deploy to production

