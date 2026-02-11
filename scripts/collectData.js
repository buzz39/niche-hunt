const NicheAnalyzer = require('./nicheAnalyzer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Seed keywords organized by category
const SEED_KEYWORDS = {
  finance: [
    'credit card rewards', 'dividend investing', 'personal finance tips',
    'cryptocurrency trading', 'stock market analysis', 'real estate investing',
    'retirement planning', 'tax optimization', 'debt payoff strategies',
    'passive income ideas', 'financial independence', 'investing for beginners'
  ],
  business: [
    'productivity tools', 'remote work setup', 'AI business automation',
    'solopreneur tips', 'digital marketing strategies', 'email marketing',
    'content creation tools', 'notion templates', 'project management',
    'freelancing guide', 'business automation', 'startup advice'
  ],
  tech: [
    'AI tool reviews', 'coding tutorials', 'web development',
    'cybersecurity tips', 'smartphone reviews', 'laptop buying guide',
    'software comparisons', 'tech unboxing', 'programming challenges',
    'tech news analysis', 'gadget reviews', '3D printing projects'
  ],
  health: [
    'home workout routines', 'meal prep ideas', 'weight loss journey',
    'yoga for beginners', 'mental health tips', 'sleep optimization',
    'healthy recipes', 'fitness motivation', 'nutrition science',
    'meditation guide', 'bodyweight exercises', 'supplements review'
  ],
  lifestyle: [
    'minimalist living', 'tiny house tour', 'van life', 'sustainable living',
    'morning routines', 'book reviews', 'travel hacks', 'budget travel',
    'urban gardening', 'home organization', 'decluttering tips', 'frugal living'
  ],
  education: [
    'excel tutorials', 'google sheets automation', 'data analysis',
    'photoshop tutorials', 'video editing tips', 'language learning',
    'study techniques', 'online courses review', 'career advice',
    'resume tips', 'interview preparation', 'skill development'
  ],
  home: [
    'home renovation', 'DIY projects', 'interior design', 'smart home setup',
    'home office setup', 'ergonomic furniture', 'gardening tips',
    'home improvement', 'furniture makeover', 'kitchen organization',
    'bathroom remodel', 'woodworking projects'
  ],
  automotive: [
    'car reviews', 'electric vehicle comparison', 'car maintenance tips',
    'motorcycle reviews', 'auto detailing', 'car modification',
    'road trips', 'RV living', 'car buying guide', 'automotive technology'
  ],
  entertainment: [
    'gaming tutorials', 'game reviews', 'esports highlights',
    'movie reviews', 'film analysis', 'music production',
    'stoicism philosophy', 'history documentary', 'true crime stories',
    'mystery analysis', 'conspiracy theories', 'paranormal investigations'
  ],
  creative: [
    'digital art tutorials', 'animation guide', 'music theory',
    'photography tips', 'drawing tutorials', 'graphic design',
    'video editing', 'content creator tips', 'cinematography',
    'sound design', 'color grading', 'logo design'
  ],
  legal: [
    'legal advice', 'small business law', 'intellectual property',
    'contract review', 'real estate law', 'employment law'
  ],
  luxury: [
    'luxury watch review', 'designer fashion', 'luxury travel',
    'exotic cars', 'high-end real estate', 'fine dining'
  ],
  science: [
    'space exploration', 'physics explained', 'biology facts',
    'chemistry experiments', 'astronomy news', 'scientific discoveries'
  ]
};

class DataCollector {
  constructor() {
    if (!process.env.YOUTUBE_API_KEY) {
      throw new Error('YOUTUBE_API_KEY not found in environment variables');
    }
    
    this.analyzer = new NicheAnalyzer(process.env.YOUTUBE_API_KEY);
    this.results = [];
    this.outputDir = path.join(__dirname, '..', 'data');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Collect data for all seed keywords
   */
  async collectAll(limit = null) {
    console.log('🚀 Starting niche data collection...\n');
    console.log(`Target: ${limit || 'ALL'} niches`);
    console.log('This will take a while. Please be patient.\n');

    let totalAnalyzed = 0;
    let quotaLimit = 9000; // Leave some buffer from 10,000 daily limit

    for (const [category, keywords] of Object.entries(SEED_KEYWORDS)) {
      console.log(`\n📂 Category: ${category.toUpperCase()}`);
      console.log('─'.repeat(50));

      for (const keyword of keywords) {
        // Check if we've hit our limit
        if (limit && totalAnalyzed >= limit) {
          console.log(`\n✅ Reached target of ${limit} niches`);
          break;
        }

        // Check quota usage
        if (this.analyzer.getQuotaUsed() >= quotaLimit) {
          console.log(`\n⚠️ Approaching API quota limit (${this.analyzer.getQuotaUsed()}/10000)`);
          console.log('Stopping to avoid exceeding daily limit.');
          console.log('Run again tomorrow or use multiple API keys.');
          break;
        }

        // Analyze the niche
        const result = await this.analyzeNiche(keyword, category);
        
        if (result) {
          this.results.push(result);
          totalAnalyzed++;
          
          // Save progress periodically
          if (totalAnalyzed % 10 === 0) {
            this.saveResults();
            console.log(`\n💾 Progress saved: ${totalAnalyzed} niches analyzed`);
            console.log(`📊 API Quota used: ${this.analyzer.getQuotaUsed()}/10000\n`);
          }
        }

        // Rate limiting - wait between requests
        await this.sleep(2000);
      }

      if (limit && totalAnalyzed >= limit) {
        break;
      }
    }

    // Final save
    this.saveResults();
    this.printSummary();
    
    return this.results;
  }

  /**
   * Collect data for specific categories only
   */
  async collectByCategories(categories, limit = null) {
    console.log('🚀 Starting targeted niche data collection...\n');
    console.log(`Categories: ${categories.join(', ')}`);
    console.log(`Target: ${limit || 'ALL'} niches per category\n`);

    let totalAnalyzed = 0;

    for (const category of categories) {
      if (!SEED_KEYWORDS[category]) {
        console.log(`⚠️ Unknown category: ${category}`);
        continue;
      }

      console.log(`\n📂 Category: ${category.toUpperCase()}`);
      console.log('─'.repeat(50));

      const keywords = SEED_KEYWORDS[category];
      let categoryCount = 0;

      for (const keyword of keywords) {
        if (limit && categoryCount >= limit) {
          break;
        }

        const result = await this.analyzeNiche(keyword, category);
        
        if (result) {
          this.results.push(result);
          totalAnalyzed++;
          categoryCount++;
        }

        await this.sleep(2000);
      }
    }

    this.saveResults();
    this.printSummary();
    
    return this.results;
  }

  async analyzeNiche(keyword, category) {
    try {
      const result = await this.analyzer.analyzeNiche(keyword, category);
      return result;
    } catch (error) {
      console.error(`❌ Failed to analyze "${keyword}":`, error.message);
      return null;
    }
  }

  saveResults() {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `niches-${timestamp}.json`;
    const filepath = path.join(this.outputDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(this.results, null, 2));
    console.log(`\n💾 Saved ${this.results.length} niches to: ${filename}`);

    // Also save as TypeScript file for the frontend
    this.saveAsTypeScript();
  }

  saveAsTypeScript() {
    const tsContent = `// Auto-generated on ${new Date().toISOString()}
// Total niches: ${this.results.length}

export interface Niche {
  id: number;
  name: string;
  keyword: string;
  category: string;
  difficulty: string;
  difficultyScore: number;
  cpm: string;
  monetization: string;
  metrics: {
    totalChannels: number;
    avgSubscribers: number;
    avgViews: number;
    topChannelSubs: number;
    competitionLevel: string;
    avgEngagementRate: string;
    uploadFrequency: number;
  };
  trend: {
    status: string;
    score: number;
  };
  lastUpdated: string;
  description: string;
}

export const niches: Niche[] = ${JSON.stringify(
  this.results.map((n, i) => ({ ...n, id: i + 1 })), 
  null, 
  2
)};
`;

    const tsPath = path.join(__dirname, '..', 'app', 'data', 'niches.ts');
    fs.writeFileSync(tsPath, tsContent);
    console.log(`✅ Updated TypeScript file: app/data/niches.ts`);
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 COLLECTION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total niches analyzed: ${this.results.length}`);
    console.log(`API quota used: ${this.analyzer.getQuotaUsed()}/10000`);
    
    // Breakdown by difficulty
    const byDifficulty = this.results.reduce((acc, n) => {
      acc[n.difficulty] = (acc[n.difficulty] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\nBy Difficulty:');
    Object.entries(byDifficulty).forEach(([diff, count]) => {
      console.log(`  ${diff}: ${count}`);
    });

    // Breakdown by category
    const byCategory = this.results.reduce((acc, n) => {
      acc[n.category] = (acc[n.category] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\nBy Category:');
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });

    console.log('\n' + '='.repeat(60));
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const collector = new DataCollector();

  if (args[0] === '--category' || args[0] === '-c') {
    // Collect specific categories
    const categories = args.slice(1);
    collector.collectByCategories(categories, 20);
  } else if (args[0] === '--limit' || args[0] === '-l') {
    // Collect with limit
    const limit = parseInt(args[1]) || 50;
    collector.collectAll(limit);
  } else if (args[0] === '--help' || args[0] === '-h') {
    console.log(`
Usage:
  node collectData.js [options]

Options:
  -l, --limit <number>       Collect up to N niches
  -c, --category <cats...>   Collect specific categories only
  -h, --help                Show this help message

Examples:
  node collectData.js --limit 50
  node collectData.js --category finance tech business
  node collectData.js

Categories available:
  ${Object.keys(SEED_KEYWORDS).join(', ')}
    `);
  } else {
    // Default: collect first 50 niches
    collector.collectAll(50);
  }
}

module.exports = DataCollector;
