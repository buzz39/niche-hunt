# ⚡ NicheHunt

> **Stop guessing. Start creating.**  
> A data-driven database of high-CPM, low-competition YouTube content niches — powered by the YouTube Data API v3 and Google Trends.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss)
![License](https://img.shields.io/badge/license-private-lightgrey)

---

## 📖 Overview

NicheHunt helps content creators discover profitable YouTube niches without the guesswork. Each niche in the database is backed by real metrics collected via the YouTube Data API — including competition scores, estimated CPMs, engagement rates, and Google Trends data.

The application is a dark-themed Next.js web app with a built-in paywall. Visitors can preview a sample of niches for free, then purchase one-time access to unlock the full database.

---

## ✨ Features

- 📊 **Real YouTube API data** — competition scores, subscriber counts, and engagement rates pulled directly from YouTube
- 📈 **Google Trends integration** — Rising, Stable, or Declining trend status for every niche
- 💰 **CPM estimates** — industry-based ranges per advertising vertical (Finance, Tech, Health, etc.)
- 🔍 **Filterable & sortable table** — filter by category, sort by name or difficulty
- 🔒 **Built-in paywall** — first 5 niches free; unlock the full database with a one-time payment
- 🌑 **Professional dark UI** — polished, responsive design built with Tailwind CSS
- 🤖 **Automated data collection** — scripts to gather and refresh niche data on a schedule

---

## 🗂️ Project Structure

```
niche-hunt/
├── app/
│   ├── data/
│   │   └── niches.ts          # Auto-generated niche database (TypeScript)
│   ├── privacy/               # Privacy policy page
│   ├── terms/                 # Terms of service page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Main landing page
├── scripts/
│   ├── collectData.js         # Data collection entry point
│   ├── nicheAnalyzer.js       # Niche scoring & CPM estimation
│   ├── youtubeClient.js       # YouTube Data API v3 wrapper
│   └── testSetup.js           # API key validation script
├── public/
├── .env.example               # Environment variable template
├── SETUP_GUIDE.md             # YouTube API setup instructions
├── DATA_COLLECTION_README.md  # Data collection system docs
├── QUICKSTART.md              # Quick launch guide
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- A **YouTube Data API v3** key (free — see [SETUP_GUIDE.md](./SETUP_GUIDE.md))

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# Edit .env and add your YouTube API key:
#   YOUTUBE_API_KEY=your_key_here

# 3. Validate your API key
npm run test-setup

# 4. Collect your first batch of niches
npm run collect:test   # 5 niches (smoke test)
npm run collect:50     # 50 niches

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run test-setup` | Validate YouTube API key and quota |
| `npm run collect:test` | Collect 5 niches (quick test) |
| `npm run collect:50` | Collect 50 niches |
| `npm run collect` | Collect with custom options (see below) |

### Custom Collection Options

```bash
# Collect a specific number of niches
node scripts/collectData.js --limit 100

# Collect specific categories only
node scripts/collectData.js --category finance tech business

# Show all available options
node scripts/collectData.js --help
```

---

## 📦 Data Collection

The automated pipeline collects real metrics from YouTube for 100+ seed keywords across 13 categories:

| Category | Examples |
|---|---|
| Finance | Credit cards, investing, crypto |
| Business | Productivity, SaaS, marketing |
| Tech | AI tools, reviews, tutorials |
| Health | Fitness, nutrition, wellness |
| Lifestyle | Minimalism, travel, organization |
| Education | Tutorials, courses, skills |
| Home | DIY, renovation, organization |
| Automotive | Reviews, maintenance, EVs |
| Entertainment | Gaming, reviews, analysis |
| Creative | Art, design, music |
| Legal | Advice, business law |
| Luxury | Watches, fashion, travel |
| Science | Space, physics, biology |

### Free Tier Limits (YouTube Data API)

- **10,000 quota units/day** (resets at midnight PT)
- Each niche uses ~300–400 units → **≈25–30 niches/day**
- Collect 500+ niches over ~20 days at no cost

For full details, see [DATA_COLLECTION_README.md](./DATA_COLLECTION_README.md).

---

## 🚢 Deployment

The recommended deployment target is **Vercel**:

```bash
npm install -g vercel
vercel
```

Alternatively, deploy to Netlify, Railway, or any platform that supports Next.js.

> **Note:** The `.env` file must never be committed. Add `YOUTUBE_API_KEY` as a server-side environment variable in your hosting dashboard.

---

## 📚 Additional Documentation

| Document | Description |
|---|---|
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Step-by-step YouTube API setup and troubleshooting |
| [DATA_COLLECTION_README.md](./DATA_COLLECTION_README.md) | Full data collection system reference |
| [QUICKSTART.md](./QUICKSTART.md) | Recommended launch strategy and cost breakdown |

---

## 🔒 Security

- Never commit your `.env` file — it contains your YouTube API key.
- The `.gitignore` is pre-configured to exclude `.env`.
- Restrict your API key to the YouTube Data API v3 in the Google Cloud Console.

---

## 📄 License

This project is proprietary. All rights reserved © 2026 NicheHunt.
