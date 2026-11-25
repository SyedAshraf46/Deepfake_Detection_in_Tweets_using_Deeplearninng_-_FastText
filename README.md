# AI-Powered Deepfake Tweet Detection Platform

A full-stack web application that detects AI-generated and bot-created tweets using advanced machine learning. Features real-time detection, confidence scoring, and an intelligent AI chatbot for explanations.

## 🎯 Project Overview

This platform converts research-level deepfake detection into a production-grade full-stack application with:

- **Real-time Tweet Analysis**: Instant classification of tweets as human or bot-generated
- **Confidence Scoring**: Detailed confidence metrics and keyword analysis
- **Intelligent Chatbot**: AI assistant that explains predictions and answers questions
- **User Dashboard**: Track prediction history and view analytics
- **Admin Portal**: Monitor system statistics and model performance

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** + Custom UI Components
- **Recharts** for data visualization
- **Axios** for API communication

### Backend
- **Flask** (Python) - RESTful API
- **JWT Authentication**
- **PostgreSQL** database
- **SQLAlchemy** ORM

### AI/ML
- **Bi-LSTM** neural network (128 units)
- **FastText** embeddings for text representation
- **TensorFlow/Keras** for model training
- Expected accuracy: **87-90%**

## 📁 Project Structure

```
CSE_12/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── auth/
│   │   └── jwt.py            # JWT utilities
│   ├── database/
│   │   └── models.py         # Database models (User, Prediction)
│   ├── ml/
│   │   ├── preprocess.py     # Text preprocessing
│   │   ├── predict.py        # Prediction logic
│   │   └── explain.py        # Explanation generation
│   ├── chatbot/
│   │   └── bot_engine.py     # AI chatbot engine
│   ├── models/               # Trained model files (gitignored)
│   ├── requirements.txt
│   └── create_env.py             # Generates backend/.env
├── frontend/
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── services/         # API services
│   │   └── context/          # React context
│   ├── package.json
│   └── vite.config.js
├── notebooks/
│   └── model_training.ipynb  # Model training notebook
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- pip and npm

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up PostgreSQL database:**
   ```sql
   CREATE DATABASE deepfake_detection;
   ```

5. **Configure environment variables:**
   ```bash
   python create_env.py
   # Edit .env with your database credentials and JWT secret
   ```

6. **Run the Flask server:**
   ```bash
   python app.py
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

## 🤖 Model Training

### Dataset Preparation

1. **Reference Dataset**: TweepFake (25,572 tweets)
2. **Custom Dataset**: Create your own with:
   - GPT-2/LLaMA generated tweets
   - Human-written tweets (Twitter/Reddit)
   - Noise injection (typos, emojis, slang)

**Target Dataset Size**: ~40,000 samples

### Training Steps

1. **Open the training notebook:**
   ```bash
   jupyter notebook notebooks/model_training.ipynb
   ```

2. **Follow the notebook steps:**
   - Data loading and preprocessing
   - FastText embedding generation
   - Bi-LSTM model architecture
   - Training and validation
   - Model saving

3. **Save trained model:**
   - Model saved to `backend/models/deepfake_model.h5`
   - FastText embeddings to `backend/models/fasttext_embeddings.pkl`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Prediction
- `POST /api/predict` - Analyze a single tweet
- `POST /api/predict/batch` - Analyze multiple tweets

### History
- `GET /api/history` - Get user's prediction history (requires auth)
- `GET /api/history/<id>` - Get specific prediction details (requires auth)

### Chatbot
- `POST /api/chat` - Chat with AI assistant

### Admin
- `GET /api/admin/stats` - Get system statistics (requires admin)

## 🎨 UI Features

### Public Portal
- Landing page with hero section
- Tweet input interface
- Real-time result display
- Confidence visualization
- Keyword highlighting

### User Portal
- Login/Registration
- Prediction history dashboard
- Confidence score charts
- Detailed analytics

### Admin Portal
- System-wide statistics
- Model performance metrics
- User activity tracking
- Dataset insights

## 🧪 Testing

### Test Prediction
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"tweet": "This is a test tweet to analyze"}'
```

### Test Authentication
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "testpass123"}'
```

## 📊 Model Architecture

```
Input Text
   ↓
Text Preprocessing
   ↓
FastText Embeddings
   ↓
Bi-LSTM (128 units)
   ↓
Dropout (0.5)
   ↓
Dense + Sigmoid
   ↓
Human / Bot Probability
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing (Werkzeug)
- CORS protection
- Input validation
- SQL injection prevention (SQLAlchemy)

## 🎯 Key Features

✅ **Real-time Detection**: Instant tweet analysis
✅ **High Accuracy**: 87-90% with Bi-LSTM, 92-94% with RoBERTa
✅ **Intelligent Chatbot**: Context-aware explanations
✅ **User Dashboard**: Track predictions and analytics
✅ **Admin Portal**: System monitoring and statistics
✅ **Responsive Design**: Modern UI with Tailwind CSS
✅ **Production Ready**: Full authentication and error handling

## 📝 Notes for Viva

### Project Flow (One-Liner)
> User enters tweet → React sends to Flask API → ML model predicts → Confidence returned → UI visualizes → Chatbot explains → Result stored in PostgreSQL.

### Why This Project Scores High
- ✅ Full Stack (Frontend + Backend)
- ✅ AIML Heavy (Bi-LSTM, FastText)
- ✅ Real-world Relevance (Deepfake detection)
- ✅ Chatbot Integration
- ✅ Custom Dataset (40,000+ samples)
- ✅ >90% Accuracy Possible

## 🐛 Troubleshooting

### Backend Issues
- **Database connection error**: Check PostgreSQL is running and `.env` has correct credentials
- **Model not found**: Train the model first using the notebook
- **Import errors**: Ensure virtual environment is activated

### Frontend Issues
- **API connection error**: Ensure backend is running on port 5000
- **Build errors**: Delete `node_modules` and reinstall with `npm install`
- **CORS errors**: Check Flask-CORS is installed and configured

## 📚 References

- TweepFake Dataset (Reference)
- FastText Documentation
- Bi-LSTM Architecture
- Flask REST API Best Practices

## 👥 Authors

CSE-A Project Team

## 📄 License

This project is for academic purposes.

---

**For questions or issues, refer to the training notebook or check the API documentation.**

