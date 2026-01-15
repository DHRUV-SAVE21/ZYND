# 🔑 How to Get Your Gemini API Key (2 Minutes)

## Step-by-Step

### 1. Go to Google AI Studio
**URL:** https://makersuite.google.com/app/apikey

Or search "Google AI Studio API Key"

### 2. Sign In
- Use your Google account
- Any Google account works (Gmail, etc.)

### 3. Get API Key
1. You'll see "Get API Key" button
2. Click it
3. Select "Create API key in new project" (or use existing project)
4. **Copy the key immediately!**

**Example key format:**
```
AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxx
```

### 4. Add to Your .env File

Open `backend/.env` and add:

```env
GEMINI_API_KEY=AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxx
```

**Replace the placeholder with your actual key!**

---

## ✅ Verify It Works

After adding the key, test it:

```bash
# In backend folder
python -c "import google.generativeai as genai; genai.configure(api_key='YOUR_KEY'); print('✅ Gemini API key works!')"
```

Replace YOUR_KEY with your actual key.

---

## 📊 Gemini Free Tier Limits

| Feature | Free Tier |
|---------|-----------|
| Requests per minute | 60 |
| Requests per day | Unlimited |
| Tokens per minute | 32,000 |
| Cost | **FREE!** 💰 |

**Perfect for development and testing!**

---

## 🔄 If You Need More Quota

**Paid tier options:**
- Gemini 1.0 Pro: $0.00025 / 1K characters
- Gemini 1.5 Pro: $0.00125 / 1K characters
- Gemini 1.5 Flash: $0.000125 / 1K characters

**Still much cheaper than OpenAI GPT-4!**

---

## 🚨 Common Issues

### "API key not valid"
**Solution:**
- Make sure you copied the entire key
- No extra spaces
- Key starts with "AIza"

### "Quota exceeded"
**Solution:**
- Free tier: 60 requests/min
- Wait 1 minute and try again
- Or upgrade to paid tier

### "Permission denied"
**Solution:**
- Enable Generative Language API in Google Cloud Console
- Usually automatic, but check if error persists

---

## 🔐 Security Notes

**DO NOT:**
- ❌ Commit .env file to git
- ❌ Share your API key publicly
- ❌ Use the same key for production and development

**DO:**
- ✅ Add .env to .gitignore (already done)
- ✅ Use different keys for different environments
- ✅ Rotate keys periodically

---

## ✨ You're All Set!

Once you have your Gemini API key in `.env`, you're ready to:
1. Run the backend
2. Use AI-powered flood predictions
3. Generate intelligent alerts
4. Coordinate emergency responses

**All powered by FREE Gemini AI!** 🎉

---

## 📚 Resources

- **Get API Key:** https://makersuite.google.com/app/apikey
- **Gemini Docs:** https://ai.google.dev/docs
- **Pricing:** https://ai.google.dev/pricing
- **Rate Limits:** https://ai.google.dev/docs/rate_limits

**Questions? Check the logs when running the backend!**
