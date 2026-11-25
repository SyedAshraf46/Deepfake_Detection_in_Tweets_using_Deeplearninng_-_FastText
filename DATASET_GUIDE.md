# Dataset Download Guide & Next Steps

## 📥 Dataset Download Links

### Option 1: TweepFake Dataset (Recommended)
**Best for Bot Detection Project**

1. **Kaggle:**
   - Search: "TweepFake" on Kaggle
   - Link: https://www.kaggle.com/datasets
   - Search term: "TweepFake bot detection"
   - Download CSV file

2. **GitHub:**
   - Search: "TweepFake dataset github"
   - Common repos:
     - `midas-research/TweepFake`
     - `marcogdepinto/TweepFake`
   - Download from releases or data folder

3. **Direct Research Papers:**
   - Paper: "TweepFake: About detecting deepfake tweets"
   - Dataset usually linked in paper's supplementary materials

### Option 2: Alternative Datasets (If TweepFake not available)

1. **Botometer Dataset:**
   - Link: https://botometer.osome.iu.edu/
   - Can collect bot vs human tweets

2. **Cresci-2017 Dataset:**
   - GitHub: Search "Cresci-2017 bot detection"
   - Contains bot and human accounts

3. **Bot Repository:**
   - GitHub: Search "twitter bot detection dataset"
   - Multiple repositories available

## 📁 Dataset Format Required

Your dataset CSV file should have these columns:
```csv
text,label
"This is a human tweet",0
"This is a bot tweet",1
```

- **text**: Tweet content (string)
- **label**: 0 for human, 1 for bot (integer)

## 🚀 Next Steps - Complete Project Setup

### Step 1: Download Dataset
```bash
# Create data folder
mkdir data

# Download dataset and save as:
# data/tweets_dataset.csv
```

### Step 2: Prepare Dataset (if needed)
If your downloaded dataset has different format:
- Convert to CSV format
- Ensure columns: `text`, `label`
- Label: 0 = human, 1 = bot
- Target: ~40,000 samples (20k each)

### Step 3: Update Notebook
Edit `notebooks/model_training.ipynb`:

```python
# In cell 3, replace this:
# dataset_path = 'path/to/your/dataset.csv'

# With this:
dataset_path = '../data/tweets_dataset.csv'
df = pd.read_csv(dataset_path)

# Verify columns
print(df.columns)
print(df.head())
print(f"Total samples: {len(df)}")
print(f"Human (0): {len(df[df['label']==0])}")
print(f"Bot (1): {len(df[df['label']==1])}")
```

### Step 4: Train Model
```bash
# Activate virtual environment
cd backend
venv\Scripts\activate  # Windows
# OR
source venv/bin/activate  # Linux/Mac

# Install Jupyter if not installed
pip install jupyter

# Open notebook
cd ../notebooks
jupyter notebook model_training.ipynb
```

**In Notebook:**
1. Run all cells to check setup
2. Uncomment training code in last cell
3. Update dataset path
4. Run training (takes 30-60 minutes)
5. Model saves to `backend/models/`

### Step 5: Verify Model Files
After training, check these files exist:
```
backend/models/
├── deepfake_model.h5
└── fasttext_embeddings.pkl
```

### Step 6: Test Backend
```bash
cd backend
python app.py
```

Test prediction:
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"tweet": "This is a test tweet"}'
```

### Step 7: Run Frontend
```bash
cd frontend
npm install
npm run dev
```

### Step 8: Test Full Application
1. Open: http://localhost:3000
2. Enter a tweet
3. Check prediction result
4. Test chatbot
5. Login and check dashboard

## 📊 Quick Dataset Creation (If Download Fails)

If you can't download TweepFake, create custom dataset:

### Method 1: Using Twitter API
```python
import tweepy
import pandas as pd

# Collect tweets (requires Twitter API keys)
# Save as CSV with text and label columns
```

### Method 2: Manual Collection
1. Collect 20,000 human tweets (from real accounts)
2. Generate 20,000 bot tweets (using GPT-2/LLaMA)
3. Combine into CSV file
4. Label: 0 for human, 1 for bot

### Method 3: Use Existing Bot Datasets
- Combine multiple small datasets
- Ensure balanced classes (50-50 split)

## 🔍 Dataset Validation Checklist

Before training, verify:
- [ ] CSV file has `text` and `label` columns
- [ ] Labels are 0 (human) or 1 (bot)
- [ ] At least 10,000 samples per class
- [ ] No missing values in text column
- [ ] Text is in English (or your target language)
- [ ] Dataset is balanced (similar counts for both classes)

## ⚠️ Important Notes

1. **Dataset Size:**
   - Minimum: 10,000 samples (5k each)
   - Recommended: 40,000 samples (20k each)
   - More data = Better accuracy

2. **Training Time:**
   - Small dataset (10k): ~15-30 minutes
   - Medium dataset (40k): ~30-60 minutes
   - Large dataset (100k+): 1-3 hours

3. **Without Dataset:**
   - System works with fallback predictions
   - Accuracy: ~60-70% (lower)
   - Good for testing, not production

## 📞 Troubleshooting

**Problem:** Dataset not found
- **Solution:** Check file path, use relative path from notebook

**Problem:** Training fails
- **Solution:** Check dataset format, ensure labels are 0/1

**Problem:** Model not saving
- **Solution:** Check `backend/models/` folder exists, has write permissions

**Problem:** Low accuracy
- **Solution:** Use more data, check data quality, balance classes

## 🎯 Summary

1. **Download** TweepFake or alternative dataset
2. **Save** to `data/tweets_dataset.csv`
3. **Update** notebook with correct path
4. **Train** model using Jupyter notebook
5. **Test** backend API
6. **Run** frontend
7. **Verify** full application works

---

**Need Help?** Check `SETUP.md` for detailed setup instructions.

