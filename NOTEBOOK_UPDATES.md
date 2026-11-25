# Notebook Updates - Dataset Column Mapping

## ✅ Changes Made

### 1. **Cell 3 (Data Loading)** - Updated
- ✅ Dataset path set to: `../data/tweets_dataset.csv`
- ✅ Uses `tweet` column (instead of `text`)
- ✅ Uses `bot` column (instead of `label`)
- ✅ Ignores other columns in CSV
- ✅ Automatically handles different `bot` column formats:
  - Boolean (True/False) → 1/0
  - String ("bot"/"human") → 1/0
  - Numeric (1/0) → 1/0
- ✅ Shows dataset statistics after loading

### 2. **Cell 11 (Training Pipeline)** - Updated
- ✅ All code uncommented and ready to run
- ✅ Uses `texts` and `labels` from Cell 3
- ✅ Complete training pipeline with progress messages
- ✅ Model saves to `backend/models/` automatically

## 📋 How It Works

### Column Mapping:
```
CSV File          →  Notebook
─────────────────────────────
tweet column      →  Used for text preprocessing
bot column        →  Converted to label (0/1)
other columns     →  Ignored
```

### Bot Column Handling:
- **If `bot` is True/False**: True = bot (1), False = human (0)
- **If `bot` is "bot"/"human"**: "bot" = 1, "human" = 0
- **If `bot` is numeric**: 1 = bot, 0 = human

## 🚀 How to Use

### Step 1: Place Dataset
Make sure your CSV file is at:
```
CSE_12/
└── data/
    └── tweets_dataset.csv
```

### Step 2: Open Notebook
```bash
cd backend
venv\Scripts\activate
cd ../notebooks
jupyter notebook model_training.ipynb
```

### Step 3: Run Cells
1. **Cell 1**: Run to import libraries
2. **Cell 3**: Run to load and verify dataset
   - Check the output to see:
     - Available columns
     - Sample rows
     - Label distribution
3. **Cell 11**: Run to train model
   - This will take 30-60 minutes
   - Progress will be shown

### Step 4: Verify Model Files
After training, check:
```
backend/models/
├── deepfake_model.h5          ✅ Should exist
└── fasttext_embeddings.pkl   ✅ Should exist
```

## ⚠️ Important Notes

1. **Dataset Path**: 
   - Current: `../data/tweets_dataset.csv`
   - If your file has different name, update in Cell 3

2. **Column Names**:
   - Must have `tweet` column
   - Must have `bot` column
   - Other columns are ignored

3. **Bot Column Values**:
   - Can be: True/False, 1/0, "bot"/"human", or any format
   - Code automatically converts to 0/1

4. **Missing Values**:
   - Empty tweets will be skipped
   - Missing bot labels will cause error

## 🔍 Verification Steps

After running Cell 3, you should see:
```
Available columns in dataset:
['tweet', 'bot', ...other columns...]

First few rows:
[tweet column] [bot column] ...

Dataset loaded successfully!
Total samples: 40000
Human (label=0): 20000
Bot (label=1): 20000
```

If you see errors:
- **"'tweet' column not found"**: Check CSV column names
- **"'bot' column not found"**: Check CSV column names
- **File not found**: Check dataset path in Cell 3

## 📝 Example CSV Format

Your CSV should look like:
```csv
tweet,bot,other_field1,other_field2
"This is a human tweet",0,value1,value2
"This is a bot tweet",1,value3,value4
```

Or:
```csv
tweet,bot
"Hello world",False
"Buy now!",True
```

Both formats will work! ✅

---

**Ready to train?** Just run the notebook cells in order!

