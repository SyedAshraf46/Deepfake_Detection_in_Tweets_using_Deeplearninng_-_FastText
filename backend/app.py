from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

from database.models import db, User, Prediction
from ml.predict import predict_tweet
from ml.explain import explain_prediction
from chatbot.bot_engine import ChatbotEngine

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://user:password@localhost/deepfake_detection')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Configure CORS to allow credentials and Authorization header
CORS(app, 
     supports_credentials=True, 
     allow_headers=['Content-Type', 'Authorization'],
     expose_headers=['Content-Type', 'Authorization'],
     origins=['http://localhost:3000', 'http://127.0.0.1:3000'])
db.init_app(app)
jwt = JWTManager(app)

# JWT Error Handlers
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({'error': 'Token has expired', 'code': 'TOKEN_EXPIRED'}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    auth_header = request.headers.get('Authorization', 'Not provided')
    print(f"❌ Invalid token error: {error}")
    print(f"   Auth Header: {auth_header[:50] if auth_header != 'Not provided' else 'Not provided'}")
    return jsonify({
        'error': 'Invalid token', 
        'code': 'INVALID_TOKEN', 
        'details': str(error)
    }), 422

@jwt.unauthorized_loader
def missing_token_callback(error):
    auth_header = request.headers.get('Authorization', 'Not provided')
    all_headers = list(request.headers.keys())
    print(f"❌ Missing token - Auth Header: {auth_header}")
    print(f"   All headers: {all_headers}")
    return jsonify({
        'error': 'Authorization token is missing', 
        'code': 'MISSING_TOKEN',
        'received_headers': all_headers
    }), 422

@jwt.needs_fresh_token_loader
def token_not_fresh_callback(jwt_header, jwt_payload):
    return jsonify({'error': 'Token is not fresh', 'code': 'TOKEN_NOT_FRESH'}), 401

# Initialize chatbot
chatbot = ChatbotEngine()

# Initialize database tables
with app.app_context():
    db.create_all()

# ==================== AUTHENTICATION APIs ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not username or not email or not password:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user exists
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'User already exists'}), 400
        
        # Create new user
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            'message': 'User registered successfully',
            'token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== PREDICTION APIs ====================

@app.route('/api/predict', methods=['POST'])
def predict():
    """Main tweet detection endpoint"""
    try:
        data = request.get_json()
        tweet_text = data.get('tweet')
        user_id = data.get('user_id')  # Optional, for logged-in users
        
        if not tweet_text:
            return jsonify({'error': 'Tweet text is required'}), 400
        
        # Get prediction
        result = predict_tweet(tweet_text)
        
        # Get explanation
        explanation = explain_prediction(tweet_text, result)
        
        # Save to database if user is logged in
        if user_id:
            try:
                prediction = Prediction(
                    user_id=user_id,
                    tweet_text=tweet_text,
                    prediction=result['prediction'],
                    confidence=result['confidence'],
                    keywords=result.get('keywords', [])
                )
                db.session.add(prediction)
                db.session.commit()
            except Exception as e:
                # Log error but don't fail the request
                print(f"Error saving prediction: {e}")
        
        return jsonify({
            'success': True,
            'prediction': result['prediction'],  # 'human' or 'bot'
            'confidence': result['confidence'],
            'keywords': result.get('keywords', []),
            'explanation': explanation
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict/batch', methods=['POST'])
def predict_batch():
    """Batch prediction endpoint for multiple tweets"""
    try:
        data = request.get_json()
        tweets = data.get('tweets', [])
        
        if not tweets or not isinstance(tweets, list):
            return jsonify({'error': 'Tweets array is required'}), 400
        
        results = []
        for tweet in tweets:
            result = predict_tweet(tweet)
            results.append({
                'tweet': tweet,
                'prediction': result['prediction'],
                'confidence': result['confidence']
            })
        
        return jsonify({'results': results}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== HISTORY APIs ====================

@app.route('/api/history', methods=['GET'])
@jwt_required()
def get_history():
    """Get user's prediction history"""
    try:
        # Get user ID from JWT token (convert from string to int)
        user_id = int(get_jwt_identity())
        
        # Debug: Log the request (remove in production)
        auth_header = request.headers.get('Authorization', 'Not provided')
        print(f"✅ History request - User ID: {user_id}")
        print(f"   Auth Header present: {auth_header != 'Not provided'}")
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        predictions = Prediction.query.filter_by(user_id=user_id)\
            .order_by(Prediction.created_at.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'predictions': [{
                'id': p.id,
                'tweet_text': p.tweet_text,
                'prediction': p.prediction,
                'confidence': p.confidence,
                'keywords': p.keywords,
                'created_at': p.created_at.isoformat()
            } for p in predictions.items],
            'total': predictions.total,
            'page': page,
            'per_page': per_page,
            'pages': predictions.pages
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history/<int:prediction_id>', methods=['GET'])
@jwt_required()
def get_prediction_detail(prediction_id):
    """Get detailed information about a specific prediction"""
    try:
        user_id = int(get_jwt_identity())
        prediction = Prediction.query.filter_by(id=prediction_id, user_id=user_id).first()
        
        if not prediction:
            return jsonify({'error': 'Prediction not found'}), 404
        
        explanation = explain_prediction(prediction.tweet_text, {
            'prediction': prediction.prediction,
            'confidence': prediction.confidence,
            'keywords': prediction.keywords
        })
        
        return jsonify({
            'id': prediction.id,
            'tweet_text': prediction.tweet_text,
            'prediction': prediction.prediction,
            'confidence': prediction.confidence,
            'keywords': prediction.keywords,
            'explanation': explanation,
            'created_at': prediction.created_at.isoformat()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== CHATBOT APIs ====================

@app.route('/api/chat', methods=['POST'])
def chat():
    """AI chatbot endpoint for explaining predictions"""
    try:
        data = request.get_json()
        message = data.get('message')
        context = data.get('context', {})  # Optional: prediction context
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get chatbot response
        response = chatbot.get_response(message, context)
        
        return jsonify({
            'response': response['message'],
            'suggestions': response.get('suggestions', [])
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== ADMIN APIs ====================

@app.route('/api/admin/stats', methods=['GET'])
@jwt_required()
def get_admin_stats():
    """Get admin dashboard statistics"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        # Check if user is admin (you can add is_admin field to User model)
        if not user or not getattr(user, 'is_admin', False):
            return jsonify({'error': 'Admin access required'}), 403
        
        total_predictions = Prediction.query.count()
        total_users = User.query.count()
        bot_predictions = Prediction.query.filter_by(prediction='bot').count()
        human_predictions = Prediction.query.filter_by(prediction='human').count()
        
        # Calculate average confidence
        avg_confidence = db.session.query(db.func.avg(Prediction.confidence)).scalar() or 0
        
        return jsonify({
            'total_predictions': total_predictions,
            'total_users': total_users,
            'bot_predictions': bot_predictions,
            'human_predictions': human_predictions,
            'bot_percentage': (bot_predictions / total_predictions * 100) if total_predictions > 0 else 0,
            'average_confidence': float(avg_confidence)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== HEALTH CHECK ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat()
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

