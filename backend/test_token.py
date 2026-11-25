"""
Test script to verify JWT token creation and validation
Run this to debug token issues
"""
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from app import app
from flask_jwt_extended import create_access_token, decode_token

with app.app_context():
    # Create a test token
    test_user_id = 1
    token = create_access_token(identity=test_user_id)
    print(f"✅ Token created successfully")
    print(f"Token (first 50 chars): {token[:50]}...")
    print(f"Token length: {len(token)}")
    
    # Try to decode it
    try:
        decoded = decode_token(token)
        print(f"✅ Token decoded successfully")
        print(f"User ID from token: {decoded.get('sub')}")
        print(f"Token payload: {decoded}")
    except Exception as e:
        print(f"❌ Token decode failed: {e}")

