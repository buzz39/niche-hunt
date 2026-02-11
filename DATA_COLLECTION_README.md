# NicheHunt - Automated Data Collection System

## Overview

This project now includes a **real data collection system** that uses the YouTube Data API and Google Trends to gather legitimate niche information.

## What's Been Built

### ✅ Core Infrastructure (Complete)

1. **YouTube API Client** (`scripts/youtubeClient.js`)
   - Search channels and videos
   - Get detailed statistics
   - Track API quota usage
   - Handle rate limiting

2. **Niche Analyzer** (`scripts/nicheAnalyzer.js`)
   - Analyzes competition levels
   - Calculates difficulty scores (0-100)
   - Estimates CPM based on category and keywords
   - Generates monetization strategies
   - Analyzes engagement metrics
   - Integrates Google Trends data

3. **Data Collector** (`scripts/collectData.js`)
   - 100+ seed keywords across 13 categories
   - Automated batch processing
   - Progress saving (every 10 niches)
   - Quota monitoring
   - Auto-generates TypeScript file for frontend

4. **Setup Tools**
   - Environment configuration (`.env.example`)
   - Test script (`scripts/testSetup.js`)
   - Comprehensive setup guide (`SETUP_GUIDE.md`)

## Quick Start

### 1. Get API Key
Follow instructions in `SETUP_GUIDE.md` to get a YouTube Data API key (free).

### 2. Configure
```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your API key
# YOUTUBE_API_KEY=your_key_here
```

### 3. Test Setup
```bash
node scripts/testSetup.js
```

### 4. Collect Data
```bash
# Start with 5 niches to test
node scripts/collectData.js --limit 5

# Then collect more
node scripts/collectData.js --limit 50
```

## Data Collection Features

### Real Metrics Collected:

For each niche, the system analyzes:

- **50 channels** in the niche (top performers)
- **30 recent videos** for engagement data
- **90 days of trend data** from Google Trends
- Competition level based on:
  - Average subscriber counts
  - Top channel dominance
  - View distribution
  - Upload frequency

### Calculated Data:

- **Difficulty Score (0-100)**: Based on competition, existing channels, and production requirements
- **CPM Estimate**: Industry-based ranges by category (Finance: $40-60, Tech: $20-35, etc.)
- **Monetization Strategy**: AI-generated based on niche characteristics
- **Trend Status**: Rising, Stable, or Declining
- **Engagement Rates**: Average likes, comments per view

## Categories & Keywords

13 categories with 100+ seed keywords:
- Finance (credit cards, investing, crypto)
- Business (productivity, SaaS, marketing)
- Tech (AI tools, reviews, tutorials)
- Health (fitness, nutrition, wellness)
- Lifestyle (minimalism, travel, organization)
- Education (tutorials, courses, skills)
- Home (DIY, renovation, organization)
- Automotive (reviews, maintenance, EVs)
- Entertainment (gaming, reviews, analysis)
- Creative (art, design, music)
- Legal (advice, business law)
- Luxury (watches, fashion, travel)
- Science (space, physics, biology)

## Quota & Limitations

**Free Tier (YouTube API):**
- 10,000 quota units per day
- ~300-400 units per niche
- **25-30 niches per day** with free quota
- Resets at midnight Pacific Time

**To collect 500+ niches:**
- Option 1: Run daily for ~20 days
- Option 2: Use multiple API keys
- Option 3: Pay for increased quota (not recommended)

## Output Files

### 1. JSON Data (`data/niches-YYYY-MM-DD.json`)
Raw data with full metrics - used for backup and analysis.

### 2. TypeScript File (`app/data/niches.ts`)
Auto-generated, used by the Next.js frontend. Includes TypeScript interfaces.

## Data Quality

### What Makes This "Real" Data:

✅ **Sourced from YouTube API** - actual channel and video metrics  
✅ **Google Trends integration** - real trend analysis  
✅ **Industry CPM ranges** - based on published reports  
✅ **Competition calculated** - not subjectively assigned  
✅ **Engagement metrics** - real like/comment ratios  
✅ **Timestamp included** - shows when data was collected  
✅ **Methodology documented** - transparent about calculations

### Disclaimers to Add:

When selling this product, you should:
1. Clearly state CPMs are estimates based on industry averages
2. Note that actual results vary by location, season, and channel authority
3. Include data collection methodology
4. Show last-updated timestamps
5. Offer refunds if users aren't satisfied

## Next Steps

### Phase 2: Database Integration (Optional)

For a production system, you may want to:

1. **Set up Supabase or Vercel Postgres**
   - Store niches in a real database
   - Enable filtering, sorting, search
   - Track update history

2. **Build API Routes** (`app/api/niches/route.ts`)
   - Fetch niches dynamically
   - Add pagination
   - Implement search

3. **Add User Authentication**
   - Protect full database behind login
   - Track which users have purchased access
   - Implement real payment processing (Stripe, Gumroad)

### Phase 3: Ongoing Maintenance

1. **Monthly refresh** - Re-run scripts to update data
2. **Trend tracking** - Identify rising/declining niches
3. **User feedback** - Let users suggest niches
4. **Content expansion** - Add video idea generators, thumbnail templates, etc.

## Cost Analysis

### Current Solution (Free):
- YouTube API: FREE (10k quota/day)
- Google Trends: FREE (public API)
- Scripts run locally: FREE
- **Total: $0/month**

### With Database (Optional):
- Vercel Postgres/Supabase: ~$20-50/month
- Still very affordable

### ROI:
- Collect 500 niches over 20 days (FREE)
- Sell for $19 each = **$19 per customer**
- Break even at 3-4 customers if using database
- **Pure profit with free tier**

## Ethical Considerations

This system is designed to:
- Collect publicly available data
- Respect API rate limits
- Provide real value to customers
- Be transparent about methodology
- Avoid misleading claims

## Support

See `SETUP_GUIDE.md` for:
- Detailed setup instructions
- Troubleshooting common issues
- Best practices
- Scaling strategies

## License

This data collection system is part of the NicheHunt project.
