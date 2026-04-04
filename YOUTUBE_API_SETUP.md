# YouTube API Setup Instructions

## 🎥 Automatic Video Fetching Setup

Your website is now configured to automatically fetch latest videos from your YouTube channel (@DaddyJSON)!

## Steps to Enable:

### 1. Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **YouTube Data API v3**:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

### 2. Create Environment File

Create a file named `.env.local` in your project root and add:

```env
YOUTUBE_API_KEY=your_api_key_here
YOUTUBE_CHANNEL_ID=UCxkIzPnMxVVYr7FXLna5KNQ
```

Replace `your_api_key_here` with your actual API key from step 1.

### 3. Restart Development Server

```bash
npm run dev
```

## ✨ Features:

- **Automatic Updates**: Latest 3 videos from your channel automatically appear
- **Fallback**: If API fails, shows your manually set videos
- **Smart Titles**: Long video titles are automatically shortened
- **Loading States**: Nice skeleton loaders while fetching

## 📝 Notes:

- API quota: 10,000 units/day (each page load uses ~3 units)
- Videos update on each page refresh
- Channel ID for DaddyJSON is already configured
- Works on homepage latest videos section

## 🔒 Security:

- `.env.local` is gitignored (API key stays private)
- Never commit your API key to GitHub
- Use `.env.local.example` as template
