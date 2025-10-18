# 🧪 Soil Analysis API - Setup Guide

## 📦 What's in this folder?

- **`train_model.py`** - Script to create the ML model
- **`main_api.py`** - FastAPI server for soil analysis
- **`best_pipeline.pkl`** - ML model file (will be created)

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Install Python Packages

Open PowerShell or Command Prompt in this folder and run:

```powershell
python -m pip install pandas numpy scikit-learn joblib fastapi uvicorn pydantic
```

**OR if you have `pip3`:**

```powershell
pip3 install pandas numpy scikit-learn joblib fastapi uvicorn pydantic
```

**OR if you have `py`:**

```powershell
py -m pip install pandas numpy scikit-learn joblib fastapi uvicorn pydantic
```

### Step 2: Train the Model (Create best_pipeline.pkl)

Run the training script:

```powershell
python train_model.py
```

**OR:**

```powershell
py train_model.py
```

You should see:
```
============================================================
SOIL IRRIGATION PREDICTION MODEL TRAINING
============================================================

[1/5] Generating synthetic training data...
✓ Generated 2000 samples
...
✓ MODEL TRAINING COMPLETE!
```

This will create **`best_pipeline.pkl`** in this folder!

### Step 3: Start the API Server

```powershell
python main_api.py
```

**OR:**

```powershell
py main_api.py
```

You should see:
```
✓ ML model loaded successfully!
INFO:     Uvicorn running on http://127.0.0.1:8000
```

✅ **Done! Your API is ready!**

---

## 🎯 Using the API

1. **Keep the API server running** (don't close the terminal)
2. **Open your web app**: http://localhost:9002
3. **Click "Soil Analysis"** in the navigation
4. **Enter values and analyze!**

---

## 🧪 Test the API Directly

### Option 1: Browser
Open: http://127.0.0.1:8000/docs

### Option 2: PowerShell
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/analyze" -Method POST -ContentType "application/json" -Body '{"N":90,"P":60,"K":70,"temperature":28.5,"humidity":75.0,"ph":6.8,"rainfall":120.0}'
```

### Option 3: Python
```python
import requests

data = {
    "N": 90,
    "P": 60,
    "K": 70,
    "temperature": 28.5,
    "humidity": 75.0,
    "ph": 6.8,
    "rainfall": 120.0
}

response = requests.post("http://127.0.0.1:8000/analyze", json=data)
print(response.json())
```

---

## ❓ Troubleshooting

### "pip is not recognized"
Try these alternatives:
```powershell
python -m pip install ...
# OR
py -m pip install ...
# OR
pip3 install ...
```

### "python is not recognized"
Try:
```powershell
py train_model.py
# OR
python3 train_model.py
```

### Check Python installation
```powershell
python --version
# OR
py --version
```

### Model file not created
- Make sure all packages are installed
- Check for error messages in the training output
- Ensure you have write permissions in this folder

### API won't start
- Check if port 8000 is already in use
- Make sure `best_pipeline.pkl` exists
- Verify all packages are installed

---

## 📊 What the Model Does

The trained model predicts whether irrigation is needed based on:
- **N, P, K** (soil nutrients)
- **Temperature** (°C)
- **Humidity** (%)
- **pH** (soil acidity)
- **Rainfall** (mm)

**Output:**
- **0** = Irrigation needed
- **1** = No irrigation needed

The API then converts this to a 0-5 score with recommendations!

---

## 🔄 Retrain the Model

If you want to retrain with different data:

1. Edit `train_model.py` (modify the `generate_synthetic_data` function)
2. Run: `python train_model.py`
3. Restart the API server

---

## 📁 File Structure

```
src/api/
├── train_model.py          ← Run this first to create the model
├── main_api.py             ← Run this to start the API server
├── best_pipeline.pkl       ← Created by train_model.py
└── README.md               ← This file
```

---

## ✅ Checklist

- [ ] Python installed
- [ ] Packages installed (`pip install ...`)
- [ ] Model trained (`python train_model.py`)
- [ ] `best_pipeline.pkl` file exists
- [ ] API server running (`python main_api.py`)
- [ ] Web app can connect to API

---

**Need help? Check the error messages and try the troubleshooting steps above!** 🚀
