# Quick Start Guide

Get the application running in 5 minutes!

## Prerequisites Check
- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] PostgreSQL installed and running

## Quick Setup

### 1. Backend (Terminal 1)
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt

# Create .env file
echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/deepfake_detection > .env
echo JWT_SECRET_KEY=your-secret-key-here >> .env

# Run (creates tables automatically)
python app.py
```

### 2. Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

### 3. Access
- Open http://localhost:3000
- Try analyzing a tweet!

## Test Without Database

The system works with fallback prediction even without:
- Database setup
- Trained model

Just start backend and frontend - it will use rule-based fallback predictions.

## First Prediction

1. Go to http://localhost:3000
2. Paste a tweet in the input box
3. Click send
4. See the result!

## Common Issues

**Port 5000 in use?**
- Change port in `backend/app.py` line 296

**Port 3000 in use?**
- Vite will automatically use next available port

**Database errors?**
- System works without database for testing
- Or set up PostgreSQL (see SETUP.md)

## Next Steps

1. Set up PostgreSQL for user accounts
2. Train model with your dataset (see notebooks/)
3. Customize UI colors
4. Deploy!

---

**That's it! You're ready to detect deepfake tweets! 🚀**

