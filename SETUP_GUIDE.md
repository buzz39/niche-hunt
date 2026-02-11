# Data Collection Setup Guide

This guide will help you set up the automated niche data collection system.

## Prerequisites

- Node.js installed (v18 or higher)
- Google account for YouTube Data API access

## Step 1: Get YouTube Data API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing one)
3. Enable the **YouTube Data API v3**:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key
   - (Optional) Restrict the key to YouTube Data API v3 only

### API Quota Information
- Free tier: 10,000 quota units per day
- Each niche analysis uses ~300-400 quota units
- You can analyze ~25-30 niches per day for free
- Quota resets at midnight Pacific Time (PT)

## Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```
   YOUTUBE_API_KEY=your_actual_api_key_here
   ```

3. **IMPORTANT**: Never commit your `.env` file to version control!

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Run Data Collection

### Collect 50 niches (default):
```bash
node scripts/collectData.js
```

### Collect specific number of niches:
```bash
node scripts/collectData.js --limit 100
```

### Collect specific categories only:
```bash
node scripts/collectData.js --category finance tech business
```

### See all options:
```bash
node scripts/collectData.js --help
```

## Step 5: Monitor Progress

The script will:
- Show real-time progress for each niche
- Save data every 10 niches (to prevent data loss)
- Display API quota usage
- Automatically update `app/data/niches.ts` for the frontend
- Save raw JSON data in `data/` directory

## Step 6: Build Frontend with New Data

After data collection completes:

```bash
npm run build
```

Then test locally:

```bash
npm run dev
```

## Data Output

The script generates two files:

1. **JSON file**: `data/niches-YYYY-MM-DD.json`
   - Raw data with full metrics
   - Can be used for analysis or backup

2. **TypeScript file**: `app/data/niches.ts`
   - Used by the Next.js frontend
   - Auto-formatted for the app

## Understanding the Data

Each niche includes:

- **name**: Formatted niche name
- **keyword**: Search keyword used
- **category**: Category (finance, tech, etc.)
- **difficulty**: Low, Medium, or High
- **difficultyScore**: 0-100 numeric score
- **cpm**: Estimated CPM range (e.g., "$20-$35")
- **monetization**: Suggested monetization strategies
- **metrics**: Detailed analytics
  - Total channels found
  - Average subscribers
  - Average views
  - Top channel size
  - Competition level
  - Engagement rate
  - Upload frequency
- **trend**: Google Trends analysis (Rising, Stable, Declining)
- **lastUpdated**: Timestamp of analysis
- **description**: Auto-generated description

## Scaling Up

### To collect 500+ niches:

1. **Option A: Multiple API Keys**
   - Create additional Google Cloud projects
   - Get multiple API keys
   - Run script with different keys on different days

2. **Option B: Paid Quota**
   - Contact Google to increase quota (costs money)
   - Not recommended for this use case

3. **Option C: Daily Collection**
   - Run 25-30 niches per day
   - Takes ~20 days to reach 500 niches
   - Most cost-effective approach

### Recommended Approach:
```bash
# Day 1: Finance & Business
node scripts/collectData.js --category finance business

# Day 2: Tech & Education  
node scripts/collectData.js --category tech education

# Day 3: Health & Lifestyle
node scripts/collectData.js --category health lifestyle

# Continue for remaining categories...
```

## Adding More Seed Keywords

Edit `scripts/collectData.js` and add keywords to the `SEED_KEYWORDS` object:

```javascript
const SEED_KEYWORDS = {
  yourCategory: [
    'keyword 1',
    'keyword 2',
    // Add more...
  ]
};
```

## Troubleshooting

### "YOUTUBE_API_KEY not found"
- Make sure `.env` file exists in project root
- Check that you've set `YOUTUBE_API_KEY=your_key`

### "Quota exceeded" error
- You've hit the 10,000 daily limit
- Wait until midnight PT for reset
- Or use a different API key

### No channels found for keyword
- Keyword might be too specific
- Try broader terms
- Check spelling

### Rate limiting errors
- Script already includes 2-second delays
- Increase delay if needed in `collectData.js`

## Best Practices

1. **Start small**: Test with `--limit 5` first
2. **Monitor quota**: Check usage regularly
3. **Save progress**: Script auto-saves every 10 niches
4. **Back up data**: Keep JSON files as backups
5. **Update regularly**: Re-run monthly to keep data fresh

## Next Steps

After collecting data:

1. Review data quality in `data/niches-YYYY-MM-DD.json`
2. Manually verify CPM estimates for your top niches
3. Add more detailed descriptions where needed
4. Set up automated monthly refreshes
5. Consider adding user feedback collection

## Support

If you encounter issues:

1. Check the console output for specific error messages
2. Verify your API key is valid
3. Ensure quota is available
4. Review the troubleshooting section above
