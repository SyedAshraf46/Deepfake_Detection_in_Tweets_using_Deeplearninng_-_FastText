#!/bin/bash
echo "Creating .env file..."

cat > .env << 'EOF'
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
EOF

echo ""
echo "SUCCESS: .env file created!"
echo ""
echo "IMPORTANT: Please update DATABASE_URL and JWT_SECRET_KEY in .env file"

