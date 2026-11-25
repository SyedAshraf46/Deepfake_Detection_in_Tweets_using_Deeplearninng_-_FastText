# Quick Dataset Download & Next Steps (Tinglish)

## 🔗 Dataset Download Links

### Option 1: TweepFake Dataset (Best for this project)
1. **Kaggle:**
   - Go to: https://www.kaggle.com/datasets
   - Search: "TweepFake" or "bot detection tweets"
   - Download CSV file

2. **GitHub:**
   - Search: "TweepFake dataset github"
   - Common links:
     - `github.com/midas-research/TweepFake`
     - `github.com/marcogdepinto/TweepFake`
   - Download CSV from releases or data folder

3. **Research Paper:**
   - Paper title: "TweepFake: About detecting deepfake tweets"
   - Dataset link usually in paper's supplementary materials

### Option 2: Alternative Datasets
- **Botometer Dataset**: https://botometer.osome.iu.edu/
- **Cresci-2017**: Search "Cresci-2017 bot detection github"
- **Any bot detection dataset** with CSV format

## 📋 Next Steps (Step by Step)

### Step 1: Dataset Download & Save
```bash
# Project root lo data folder create chey
mkdir data

# Downloaded CSV file ni data/ folder lo save chey
# File name: tweets_dataset.csv
```

### Step 2: Dataset Format Check
CSV file lo ee columns undali:
- `text` - Tweet content
- `label` - 0 (human) or 1 (bot)

### Step 3: Notebook Update
`notebooks/model_training.ipynb` file lo:

```python
# Cell 3 lo uncomment chey and update:
dataset_path = '../data/tweets_dataset.csv'
df = pd.read_csv(dataset_path)

# Verify dataset
print(f"Total samples: {len(df)}")
print(f"Human (0): {len(df[df['label']==0])}")
print(f"Bot (1): {len(df[df['label']==1])}")
```

### Step 4: Model Training
```bash
# Backend folder lo venv activate chey
cd backend
venv\Scripts\activate  # Windows

# Jupyter install chey (if ledu)
pip install jupyter

# Notebook open chey
cd ../notebooks
jupyter notebook model_training.ipynb
```

**Notebook lo:**
1. All cells run chey
2. Last cell lo training code uncomment chey
3. Dataset path correct ga unda check chey
4. Training start chey (30-60 minutes padutundi)
5. Model `backend/models/` lo save avutundi

### Step 5: Backend Test
```bash
cd backend
python app.py
```

Browser lo open chey: http://localhost:5000/api/health

### Step 6: Frontend Run
```bash
cd frontend
npm install
npm run dev
```

Browser lo open chey: http://localhost:3000

### Step 7: Full Application Test
1. Tweet enter chey
2. Prediction result chudu
3. Chatbot test chey
4. Login chesi dashboard chudu

## ✅ Checklist

Before training:
- [ ] Dataset download chesanu
- [ ] `data/tweets_dataset.csv` file undi
- [ ] CSV lo `text` and `label` columns unnayi
- [ ] At least 10,000 samples unnayi
- [ ] Notebook lo path update chesanu

After training:
- [ ] `backend/models/deepfake_model.h5` file undi
- [ ] `backend/models/fasttext_embeddings.pkl` file undi
- [ ] Backend run avutundi
- [ ] Frontend run avutundi
- [ ] Prediction working undi

## ⚠️ Important Points

1. **Dataset Size:**
   - Minimum: 10,000 samples (5k each class)
   - Recommended: 40,000 samples (20k each)
   - More data = Better accuracy

2. **Training Time:**
   - Small (10k): 15-30 minutes
   - Medium (40k): 30-60 minutes
   - Large (100k+): 1-3 hours

3. **Without Dataset:**
   - System fallback mode lo work avutundi
   - But accuracy 60-70% untundi
   - Testing ke ok, production ke better dataset kavali

## 🆘 Problems Unte

**Dataset download avvaledu:**
- Alternative datasets try chey (Botometer, Cresci-2017)
- Or custom dataset create chey

**Training fail avutundi:**
- Dataset format check chey
- Labels 0 or 1 unda verify chey
- File path correct ga unda check chey

**Model save avvaledu:**
- `backend/models/` folder unda check chey
- Write permissions unda verify chey

## 📚 More Details

Full guide kosam: `DATASET_GUIDE.md` chudu

---

**Summary:** Dataset download chesi `data/` folder lo save chey, notebook update chey, training start chey, backend/frontend run chey. Done! 🚀

