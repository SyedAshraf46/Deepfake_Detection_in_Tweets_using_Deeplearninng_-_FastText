"""
Script to create .env file for backend configuration
Run this script to generate .env file with default values
"""
import os

env_content = """# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/deepfake_detection

# JWT Configuration
JWT_SECRET_KEY=your-secret-key-change-in-production-use-random-string-32-chars-min

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True

# Model Paths (optional, defaults provided)
MODEL_PATH=models/deepfake_model.h5
FASTTEXT_PATH=models/fasttext_embeddings.pkl
"""

def create_env_file(overwrite=False):
    """Create .env file if it doesn't exist"""
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    
    if os.path.exists(env_path) and not overwrite:
        print("INFO: .env file already exists at:", env_path)
        print("To recreate it, run: python create_env.py --overwrite")
        return
    
    try:
        with open(env_path, 'w') as f:
            f.write(env_content)
        print("SUCCESS: .env file created successfully!")
        print(f"Location: {env_path}")
        print("\nIMPORTANT: Please update the following values:")
        print("   1. DATABASE_URL - Update with your PostgreSQL credentials")
        print("   2. JWT_SECRET_KEY - Change to a random secret key (min 32 characters)")
    except Exception as e:
        print(f"ERROR: Error creating .env file: {e}")

if __name__ == "__main__":
    import sys
    overwrite = '--overwrite' in sys.argv or '-o' in sys.argv
    create_env_file(overwrite=overwrite)

