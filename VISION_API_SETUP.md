# Google Cloud Vision API Integration Guide

## Current Status
Your AI Workout Planner meal detection is currently running in **DEMO MODE**. The system provides varied food combinations but does NOT actually analyze image content with AI.

## What You Need to Enable Real AI Detection

### Option 1: Google Cloud Vision API (Recommended - Already in Dependencies)

#### Step 1: Get Google Cloud Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Cloud Vision API**
4. Create a Service Account:
   - Go to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Give it a name (e.g., "ai-fitness-vision")
   - Grant role: "Cloud Vision API User"
5. Create and download JSON key:
   - Click on the service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create New Key" → JSON
   - Save the JSON file to your project (e.g., `google-credentials.json`)

#### Step 2: Configure Environment Variables
Add to your `.env` file:
```bash
USE_AI_DETECTION=true
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
GOOGLE_CLOUD_PROJECT_ID=your-project-id
```

#### Step 3: Update `.gitignore`
Add this line to prevent committing credentials:
```
google-credentials.json
```

#### Step 4: Restart the Server
```bash
npm run dev
```

The system will automatically detect the credentials and use Google Cloud Vision API!

---

### Option 2: OpenAI Vision API (GPT-4 Vision)

#### Requirements:
- OpenAI API key
- Install: `npm install openai`

#### Configuration:
```bash
USE_AI_DETECTION=true
OPENAI_API_KEY=your-openai-api-key
AI_PROVIDER=openai
```

---

### Option 3: Keep Demo Mode

If you want to use this as a portfolio/demo project:
1. Keep `USE_AI_DETECTION=false` in `.env`
2. Add a clear disclaimer in the UI: "Demo Mode - Food detection is simulated"
3. The system will continue to provide varied, realistic food combinations

---

## How It Works

### With AI Detection Enabled:
1. User uploads meal image
2. Image sent to Google Cloud Vision API
3. API returns detected labels (e.g., "grape", "fruit", "food")
4. System matches labels to nutrition database
5. Returns actual detected foods with nutrition info

### In Demo Mode (Current):
1. User uploads meal image
2. System generates unique seed from image data
3. Selects food combination based on meal type
4. Returns simulated results with nutrition info

---

## Cost Considerations

### Google Cloud Vision API Pricing:
- **First 1,000 requests/month**: FREE
- **1,001 - 5,000,000 requests**: $1.50 per 1,000 requests
- For a small app with 100 users doing 10 scans/month = 1,000 requests = FREE

### OpenAI Vision API Pricing:
- GPT-4 Vision: ~$0.01 per image
- More expensive but potentially more accurate

---

## Files Created

1. **`api/services/visionService.ts`** - Google Cloud Vision integration service
2. **`.env`** - Updated with Vision API configuration options
3. **This guide** - Setup instructions

---

## Next Steps

**Choose your path:**

**A) Enable Real AI Detection:**
   - Follow Option 1 steps above
   - Get Google Cloud credentials
   - Configure `.env`
   - Restart server

**B) Keep Demo Mode:**
   - No action needed
   - System works as-is with simulated results
   - Good for portfolio/demo purposes

---

## Testing

Once configured, test by:
1. Upload a grape image → Should detect "grapes" or "fruit"
2. Upload a pasta image → Should detect "pasta" or "noodles"
3. Check the response for `demoMode: false` to confirm AI is active

---

## Support

If you encounter issues:
1. Check `.env` file has correct paths
2. Verify JSON credentials file exists
3. Check console logs for Vision API initialization messages
4. Ensure Google Cloud Vision API is enabled in your project

---

**Current Mode**: DEMO MODE (Simulated Detection)
**To Activate AI**: Follow Option 1 above
