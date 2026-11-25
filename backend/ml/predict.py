"""
Main prediction module for tweet classification
"""
import os
import numpy as np
from ml.preprocess import preprocess_tweet, extract_keywords
import pickle

# Try to load model (will be created during training)
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'deepfake_model.h5')
FASTTEXT_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'fasttext_embeddings.pkl')

# Global variables for model and embeddings
_model = None
_fasttext_model = None
_tokenizer = None

def load_model():
    """Load the trained model and embeddings"""
    global _model, _fasttext_model, _tokenizer
    
    try:
        # Try loading TensorFlow/Keras model
        try:
            import tensorflow as tf
            if os.path.exists(MODEL_PATH):
                _model = tf.keras.models.load_model(MODEL_PATH)
        except ImportError:
            print("TensorFlow not available, using fallback prediction")
        
        # Try loading FastText embeddings
        if os.path.exists(FASTTEXT_PATH):
            with open(FASTTEXT_PATH, 'rb') as f:
                _fasttext_model = pickle.load(f)
    except Exception as e:
        print(f"Error loading model: {e}")
        print("Using fallback prediction method")

def get_text_features(text):
    """Extract features from text using FastText or fallback"""
    if _fasttext_model:
        try:
            # Get embedding vector
            embedding = _fasttext_model.get_sentence_vector(text)
            return embedding
        except:
            pass
    
    # Fallback: simple feature extraction
    # This is a placeholder - in production, you'd use actual FastText
    text_length = len(text)
    word_count = len(text.split())
    avg_word_length = text_length / word_count if word_count > 0 else 0
    
    # Simple features
    features = np.array([
        text_length,
        word_count,
        avg_word_length,
        text.count('!'),
        text.count('?'),
        text.count('http'),
        text.count('@'),
        text.count('#'),
    ])
    
    # Normalize
    features = features / (features.max() + 1e-8)
    
    return features

def predict_tweet(tweet_text):
    """
    Main prediction function
    
    Args:
        tweet_text: Raw tweet text
    
    Returns:
        dict with prediction, confidence, and keywords
    """
    # Preprocess
    processed_text = preprocess_tweet(tweet_text)
    
    if not processed_text:
        return {
            'prediction': 'human',
            'confidence': 0.5,
            'keywords': []
        }
    
    # Extract keywords
    keywords = extract_keywords(processed_text)
    
    # Get features
    features = get_text_features(processed_text)
    
    # Make prediction
    if _model is not None:
        try:
            # Reshape for model input
            if len(features.shape) == 1:
                features = features.reshape(1, -1)
            
            # Predict
            prediction_proba = _model.predict(features, verbose=0)[0]
            
            # Handle different output shapes
            if isinstance(prediction_proba, np.ndarray):
                if prediction_proba.shape[0] == 1:
                    # Binary classification with single output
                    bot_prob = float(prediction_proba[0])
                else:
                    # Binary classification with two outputs
                    bot_prob = float(prediction_proba[1]) if len(prediction_proba) > 1 else float(prediction_proba[0])
            else:
                bot_prob = float(prediction_proba)
            
            human_prob = 1 - bot_prob
            
            # Determine prediction
            if bot_prob > 0.5:
                prediction = 'bot'
                confidence = bot_prob
            else:
                prediction = 'human'
                confidence = human_prob
        except Exception as e:
            print(f"Model prediction error: {e}")
            # Fallback to rule-based
            prediction, confidence = fallback_predict(processed_text)
    else:
        # Fallback prediction (rule-based)
        prediction, confidence = fallback_predict(processed_text)
    
    return {
        'prediction': prediction,
        'confidence': float(confidence),
        'keywords': keywords[:5]  # Top 5 keywords
    }

def fallback_predict(text):
    """
    Fallback rule-based prediction when model is not available
    This is a simple heuristic - replace with actual model in production
    """
    # Simple heuristics
    bot_indicators = [
        len(text) < 20,  # Very short
        text.count('http') > 1,  # Multiple URLs
        text.count('!') > 3,  # Excessive punctuation
        text.count('@') > 2,  # Multiple mentions
    ]
    
    bot_score = sum(bot_indicators) / len(bot_indicators)
    
    if bot_score > 0.5:
        return 'bot', 0.6 + bot_score * 0.3
    else:
        return 'human', 0.7 - bot_score * 0.2

# Initialize model on import
load_model()

