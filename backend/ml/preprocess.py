"""
Text preprocessing utilities for tweet analysis
"""
import re
import string

# Try to import emoji, use fallback if not available
try:
    import emoji
    HAS_EMOJI = True
except ImportError:
    HAS_EMOJI = False
    print("Warning: emoji module not installed. Emoji normalization will be skipped.")

def preprocess_tweet(text):
    """
    Preprocess tweet text for model input
    
    Steps:
    1. Lowercasing
    2. URL masking
    3. Mention masking
    4. Emoji normalization
    5. Remove extra whitespace
    """
    if not text or not isinstance(text, str):
        return ""
    
    # Lowercase
    text = text.lower()
    
    # Mask URLs
    text = re.sub(r'http\S+|www\.\S+', '[URL]', text)
    
    # Mask mentions
    text = re.sub(r'@\w+', '[MENTION]', text)
    
    # Mask hashtags (keep the word but mark it)
    text = re.sub(r'#(\w+)', r'\1 [HASHTAG]', text)
    
    # Normalize emojis (convert to text representation)
    if HAS_EMOJI:
        try:
            text = emoji.demojize(text, delimiters=(" ", " "))
        except:
            pass  # Skip emoji normalization if it fails
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Strip
    text = text.strip()
    
    return text

def extract_keywords(text, top_n=5):
    """
    Extract important keywords from text
    Simple implementation - can be enhanced with TF-IDF or other methods
    """
    # Remove special tokens
    text = re.sub(r'\[URL\]|\[MENTION\]|\[HASHTAG\]', '', text)
    
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    
    # Split into words
    words = text.split()
    
    # Remove common stopwords (basic list)
    stopwords = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'}
    
    # Filter and count
    keywords = [w for w in words if w not in stopwords and len(w) > 2]
    
    # Count frequency
    from collections import Counter
    word_freq = Counter(keywords)
    
    # Return top N
    return [word for word, _ in word_freq.most_common(top_n)]

def clean_for_embedding(text):
    """
    Additional cleaning specifically for embedding models
    """
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s\.\,\!\?]', '', text)
    
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()

