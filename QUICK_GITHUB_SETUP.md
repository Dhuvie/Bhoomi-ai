# ⚡ Quick GitHub Setup - Copy & Paste Commands

## 🚀 Step 1: Remove Old Git & Initialize New

```powershell
# Navigate to project
cd C:\Users\dhuvie123\Documents\GitHub\SIH2025

# Remove old git
Remove-Item -Recurse -Force .git

# Initialize new git
git init
git branch -M main

# Configure git (replace with your details)
git config user.name "Your Name"
git config user.email "your-email@example.com"
```

---

## 📦 Step 2: Commit Everything

```powershell
# Add all files
git add .

# Commit
git commit -m "Initial commit: AgriVision AI - AI-powered agricultural intelligence platform"
```

---

## 🌐 Step 3: Create GitHub Repository

1. **Go to:** https://github.com/new

2. **Fill in:**
   - **Name:** `agrivision-ai`
   - **Description:** `🌾 AI-Powered Agricultural Intelligence Platform | Crop yield prediction, pest detection, soil analysis & market insights for Indian farmers | Next.js 15 + Google Gemini + TypeScript`
   - **Public** ✅
   - **DO NOT** check any boxes (no README, no .gitignore, no license)

3. **Click "Create repository"**

---

## 🔗 Step 4: Connect & Push

```powershell
# Add remote (replace Dhuvie with your username if different)
git remote add origin https://github.com/Dhuvie/agrivision-ai.git

# Push to GitHub
git push -u origin main
```

**If asked for password:** Use a Personal Access Token
- Get one here: https://github.com/settings/tokens
- Click "Generate new token (classic)"
- Select "repo" scope
- Copy token and use as password

---

## 🏷️ Step 5: Add Topics (On GitHub)

Go to your repository → Click "⚙️" next to "About" → Add topics:

```
agriculture, artificial-intelligence, nextjs, typescript, react, tailwindcss, google-gemini, crop-prediction, pest-detection, soil-analysis, weather-forecast, multilingual, indian-farmers, smart-farming, agritech, machine-learning
```

---

## 📝 Step 6: Repository Description

In the "About" section:

**Description:**
```
🌾 AI-Powered Agricultural Intelligence Platform for Indian Farmers
```

**Website:** (leave empty for now)

✅ Check "Releases"
✅ Check "Packages"

---

## 🎉 Done!

Your repository is now live at:
```
https://github.com/Dhuvie/agrivision-ai
```

---

## 🔄 Future Updates

```powershell
# After making changes
git add .
git commit -m "Your commit message"
git push
```

---

## 📱 Share Your Project

**LinkedIn:**
```
🌾 Excited to share AgriVision AI - an AI-powered platform for farmers!

Features:
✨ Crop yield predictions
🐛 Pest & disease detection
🧪 Soil analysis
🌤️ Weather integration
💰 Market prices
🌍 4 languages

Built with Next.js 15 + Google Gemini

⭐ https://github.com/Dhuvie/agrivision-ai

#AI #Agriculture #NextJS #OpenSource
```

**Twitter:**
```
🌾 Just launched AgriVision AI!

AI-powered platform for farmers with crop predictions, pest detection, soil analysis & more.

Built with Next.js 15 + Google Gemini

⭐ https://github.com/Dhuvie/agrivision-ai

#AI #Agriculture #NextJS
```

---

## 🚀 Deploy to Vercel (Optional)

1. Go to: https://vercel.com/new
2. Import your GitHub repository
3. Add environment variable: `GEMINI_API_KEY`
4. Click Deploy!

---

## ✅ Checklist

- [ ] Remove old .git
- [ ] Initialize new git
- [ ] Commit all files
- [ ] Create GitHub repository
- [ ] Push to GitHub
- [ ] Add topics
- [ ] Update description
- [ ] Share on social media
- [ ] Deploy to Vercel (optional)

---

**That's it! Your project is now on GitHub! 🎉**
