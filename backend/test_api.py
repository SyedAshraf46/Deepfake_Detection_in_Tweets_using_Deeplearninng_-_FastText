"""
Simple test script to verify backend API is working
Run this after starting the Flask server
"""
import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_health():
    """Test health check endpoint"""
    print("Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✓ Health check: {response.status_code}")
        print(f"  Response: {response.json()}")
        return True
    except Exception as e:
        print(f"✗ Health check failed: {e}")
        return False

def test_predict():
    """Test prediction endpoint"""
    print("\nTesting prediction...")
    try:
        test_tweet = "This is a test tweet to see if the API works correctly!"
        response = requests.post(
            f"{BASE_URL}/predict",
            json={"tweet": test_tweet},
            headers={"Content-Type": "application/json"}
        )
        print(f"✓ Prediction: {response.status_code}")
        data = response.json()
        print(f"  Prediction: {data.get('prediction')}")
        print(f"  Confidence: {data.get('confidence')}")
        return True
    except Exception as e:
        print(f"✗ Prediction failed: {e}")
        return False

def test_register():
    """Test user registration"""
    print("\nTesting registration...")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json={
                "username": "testuser",
                "email": "test@example.com",
                "password": "testpass123"
            },
            headers={"Content-Type": "application/json"}
        )
        print(f"✓ Registration: {response.status_code}")
        if response.status_code == 201:
            print("  User registered successfully")
        elif response.status_code == 400:
            print("  User already exists (this is OK)")
        return True
    except Exception as e:
        print(f"✗ Registration failed: {e}")
        return False

def test_chat():
    """Test chatbot endpoint"""
    print("\nTesting chatbot...")
    try:
        response = requests.post(
            f"{BASE_URL}/chat",
            json={"message": "How does the model work?"},
            headers={"Content-Type": "application/json"}
        )
        print(f"✓ Chatbot: {response.status_code}")
        data = response.json()
        print(f"  Response: {data.get('response')[:100]}...")
        return True
    except Exception as e:
        print(f"✗ Chatbot failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("API Test Suite")
    print("=" * 50)
    print("\nMake sure Flask server is running on http://localhost:5000")
    print("Press Enter to start tests...")
    input()
    
    results = []
    results.append(("Health Check", test_health()))
    results.append(("Prediction", test_predict()))
    results.append(("Registration", test_register()))
    results.append(("Chatbot", test_chat()))
    
    print("\n" + "=" * 50)
    print("Test Results Summary")
    print("=" * 50)
    for name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{name}: {status}")
    
    all_passed = all(result for _, result in results)
    if all_passed:
        print("\n🎉 All tests passed!")
    else:
        print("\n⚠️  Some tests failed. Check server logs.")

