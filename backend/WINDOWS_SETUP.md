# Windows Setup Guide

## Quick Fix for Missing Dependencies

### Option 1: Install Missing Modules (Recommended)
```powershell
cd backend
.\venv\Scripts\activate
pip install emoji pandas scikit-learn
```

### Option 2: Use Windows-Compatible Requirements
```powershell
cd backend
.\venv\Scripts\activate
pip install -r requirements_windows.txt
```

### Option 3: Run Batch Script
```powershell
cd backend
.\install_dependencies.bat
```

## About FastText

FastText installation fails on Windows because it requires:
- Visual Studio Build Tools (C++ compiler)
- Complex compilation setup

**Solution**: The code is designed to work WITHOUT FastText!
- The system uses fallback feature extraction
- Predictions still work (with slightly lower accuracy)
- You can train models later on Linux/WSL if needed

## Test the Application

After installing dependencies:
```powershell
cd backend
.\venv\Scripts\activate
python app.py
```

The app should start on http://localhost:5000

## If You Still Get Errors

1. **ModuleNotFoundError: emoji**
   ```powershell
   pip install emoji
   ```

2. **ModuleNotFoundError: pandas**
   ```powershell
   pip install pandas
   ```

3. **FastText errors** - Ignore them! The system works without FastText.

## Verify Installation

```powershell
python -c "import emoji, pandas, sklearn; print('All modules installed!')"
```

