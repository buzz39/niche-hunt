const YouTubeClient = require('./youtubeClient');
const googleTrends = require('google-trends-api');

class NicheAnalyzer {
  constructor(youtubeApiKey) {
    this.ytClient = new YouTubeClient(youtubeApiKey);
    
    // CPM estimates by category (industry averages from various reports)
    this.cpmRanges = {
      'finance': { min: 40, max: 60, desc: 'Credit cards, investing, insurance' },
      'business': { min: 25, max: 45, desc: 'Entrepreneurship, productivity, SaaS' },
      'tech': { min: 20, max: 35, desc: 'Reviews, tutorials, AI tools' },
      'realestate': { min: 35, max: 55, desc: 'Property investment, flipping' },
      'health': { min: 15, max: 30, desc: 'Fitness, nutrition, wellness' },
      'education': { min: 18, max: 28, desc: 'Courses, tutorials, how-to' },
      'lifestyle': { min: 8, max: 18, desc: 'Vlogs, travel, relationships' },
      'entertainment': { min: 5, max: 12, desc: 'Gaming, commentary, reactions' },
      'home': { min: 12, max: 22, desc: 'DIY, renovation, design' },
      'automotive': { min: 15, max: 25, desc: 'Cars, motorcycles, reviews' },
      'legal': { min: 30, max: 50, desc: 'Law advice, bankruptcy, divorce' },
      'solar': { min: 45, max: 70, desc: 'Solar panels, renewable energy' },
      'luxury': { min: 35, max: 50, desc: 'Watches, fashion, high-end goods' }
    };
  }

  /**
   * Analyze a niche by keyword
   */
  async analyzeNiche(keyword, category = 'general') {
    console.log(`\n🔍 Analyzing niche: "${keyword}"`);
    
    try {
      // 1. Search for channels in this niche
      const channels = await this.ytClient.searchChannels(keyword, 50);
      
      if (channels.length === 0) {
        console.log(`⚠️ No channels found for "${keyword}"`);
        return null;
      }

      // 2. Get detailed stats for top channels
      const channelIds = channels.slice(0, 20).map(ch => ch.snippet.channelId);
      const channelStats = await this.ytClient.getChannelStats(channelIds);

      // 3. Analyze channel metrics
      const metrics = this.analyzeChannelMetrics(channelStats);

      // 4. Get recent videos to analyze engagement
      const videos = await this.ytClient.searchVideos(keyword, 30);
      const videoIds = videos.slice(0, 20).map(v => v.id.videoId);
      const videoStats = await this.ytClient.getVideoStats(videoIds);

      // 5. Calculate engagement rates
      const engagement = this.calculateEngagement(videoStats);

      // 6. Get trend data
      const trendData = await this.getTrendData(keyword);

      // 7. Calculate difficulty score
      const difficulty = this.calculateDifficulty(metrics, engagement);

      // 8. Estimate CPM
      const cpmEstimate = this.estimateCPM(category, keyword);

      // 9. Generate monetization strategy
      const monetization = this.generateMonetizationStrategy(keyword, category);

      const result = {
        name: this.formatNicheName(keyword),
        keyword: keyword,
        category: category,
        difficulty: difficulty.label,
        difficultyScore: difficulty.score,
        cpm: cpmEstimate,
        monetization: monetization,
        metrics: {
          totalChannels: channels.length,
          avgSubscribers: metrics.avgSubscribers,
          avgViews: metrics.avgViews,
          topChannelSubs: metrics.topChannelSubs,
          competitionLevel: metrics.competitionLevel,
          avgEngagementRate: engagement.avgRate,
          uploadFrequency: metrics.uploadFrequency
        },
        trend: trendData,
        lastUpdated: new Date().toISOString(),
        description: this.generateDescription(keyword, metrics, engagement)
      };

      console.log(`✅ Analysis complete for "${keyword}"`);
      console.log(`   Difficulty: ${difficulty.label} (${difficulty.score}/100)`);
      console.log(`   Est. CPM: ${cpmEstimate}`);
      console.log(`   Channels found: ${channels.length}`);
      
      return result;

    } catch (error) {
      console.error(`❌ Error analyzing niche "${keyword}":`, error.message);
      return null;
    }
  }

  analyzeChannelMetrics(channelStats) {
    if (channelStats.length === 0) {
      return {
        avgSubscribers: 0,
        avgViews: 0,
        topChannelSubs: 0,
        competitionLevel: 'Unknown',
        uploadFrequency: 0
      };
    }

    const subscribers = channelStats.map(ch => 
      parseInt(ch.statistics?.subscriberCount || 0)
    );
    const views = channelStats.map(ch => 
      parseInt(ch.statistics?.viewCount || 0)
    );
    const videoCounts = channelStats.map(ch =>
      parseInt(ch.statistics?.videoCount || 0)
    );

    const avgSubscribers = Math.floor(
      subscribers.reduce((a, b) => a + b, 0) / subscribers.length
    );
    const avgViews = Math.floor(
      views.reduce((a, b) => a + b, 0) / views.length
    );
    const topChannelSubs = Math.max(...subscribers);

    // Calculate competition level
    let competitionLevel = 'Low';
    if (topChannelSubs > 1000000 && avgSubscribers > 100000) {
      competitionLevel = 'High';
    } else if (topChannelSubs > 500000 || avgSubscribers > 50000) {
      competitionLevel = 'Medium';
    }

    // Estimate upload frequency
    const avgVideoCount = videoCounts.reduce((a, b) => a + b, 0) / videoCounts.length;
    
    return {
      avgSubscribers,
      avgViews,
      topChannelSubs,
      competitionLevel,
      uploadFrequency: Math.floor(avgVideoCount / 52) // Rough weekly estimate
    };
  }

  calculateEngagement(videoStats) {
    if (videoStats.length === 0) {
      return { avgRate: 0, avgLikes: 0, avgComments: 0 };
    }

    let totalEngagementRate = 0;
    let totalLikes = 0;
    let totalComments = 0;
    let validVideos = 0;

    videoStats.forEach(video => {
      const views = parseInt(video.statistics?.viewCount || 0);
      const likes = parseInt(video.statistics?.likeCount || 0);
      const comments = parseInt(video.statistics?.commentCount || 0);

      if (views > 0) {
        const engagementRate = ((likes + comments) / views) * 100;
        totalEngagementRate += engagementRate;
        totalLikes += likes;
        totalComments += comments;
        validVideos++;
      }
    });

    return {
      avgRate: validVideos > 0 ? (totalEngagementRate / validVideos).toFixed(2) : 0,
      avgLikes: validVideos > 0 ? Math.floor(totalLikes / validVideos) : 0,
      avgComments: validVideos > 0 ? Math.floor(totalComments / validVideos) : 0
    };
  }

  calculateDifficulty(metrics, engagement) {
    let score = 0;

    // Factor 1: Competition (0-40 points)
    if (metrics.competitionLevel === 'High') {
      score += 35;
    } else if (metrics.competitionLevel === 'Medium') {
      score += 20;
    } else {
      score += 5;
    }

    // Factor 2: Average subscribers (0-30 points)
    if (metrics.avgSubscribers > 500000) {
      score += 30;
    } else if (metrics.avgSubscribers > 100000) {
      score += 20;
    } else if (metrics.avgSubscribers > 50000) {
      score += 10;
    } else {
      score += 5;
    }

    // Factor 3: Top channel dominance (0-20 points)
    if (metrics.topChannelSubs > 5000000) {
      score += 20;
    } else if (metrics.topChannelSubs > 1000000) {
      score += 10;
    } else {
      score += 5;
    }

    // Factor 4: Production requirements (0-10 points)
    // Higher engagement suggests higher production quality needed
    if (engagement.avgRate > 5) {
      score += 10;
    } else if (engagement.avgRate > 3) {
      score += 5;
    }

    // Normalize to 0-100 scale
    score = Math.min(100, score);

    let label = 'Low';
    if (score > 65) {
      label = 'High';
    } else if (score > 35) {
      label = 'Medium';
    }

    return { score, label };
  }

  estimateCPM(category, keyword) {
    const lowerKeyword = keyword.toLowerCase();
    
    // Try to match category
    for (const [cat, range] of Object.entries(this.cpmRanges)) {
      if (lowerKeyword.includes(cat) || category === cat) {
        return `$${range.min}-$${range.max}`;
      }
    }

    // Check for high-value keywords
    const highValueKeywords = ['insurance', 'mortgage', 'credit', 'loan', 'investment', 'lawyer'];
    const mediumValueKeywords = ['software', 'tool', 'course', 'tutorial', 'productivity'];
    
    if (highValueKeywords.some(kw => lowerKeyword.includes(kw))) {
      return '$35-$60';
    } else if (mediumValueKeywords.some(kw => lowerKeyword.includes(kw))) {
      return '$18-$30';
    }

    // Default range
    return '$10-$20';
  }

  generateMonetizationStrategy(keyword, category) {
    const strategies = [];
    const lowerKeyword = keyword.toLowerCase();

    // Check for affiliate opportunities
    if (lowerKeyword.includes('review') || lowerKeyword.includes('tool') || 
        lowerKeyword.includes('software') || lowerKeyword.includes('product')) {
      strategies.push('Affiliate Marketing (High Intent)');
    }

    // Check for digital product opportunities
    if (lowerKeyword.includes('tutorial') || lowerKeyword.includes('course') ||
        lowerKeyword.includes('template') || lowerKeyword.includes('guide')) {
      strategies.push('Digital Products');
    }

    // Check for sponsorship potential
    if (category === 'tech' || category === 'business' || category === 'finance') {
      strategies.push('Sponsorships');
    }

    // Always include ad revenue
    strategies.push('Ad Revenue');

    return strategies.join(', ');
  }

  async getTrendData(keyword) {
    try {
      const results = await googleTrends.interestOverTime({
        keyword: keyword,
        startTime: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
        granularTimeResolution: true
      });

      const data = JSON.parse(results);
      const values = data.default?.timelineData?.map(t => t.value[0]) || [];
      
      if (values.length === 0) {
        return { status: 'Unknown', score: 50 };
      }

      // Compare recent vs older data
      const recentAvg = values.slice(-10).reduce((a, b) => a + b, 0) / 10;
      const olderAvg = values.slice(0, 10).reduce((a, b) => a + b, 0) / 10;

      if (recentAvg > olderAvg * 1.2) {
        return { status: 'Rising', score: 75 };
      } else if (recentAvg < olderAvg * 0.8) {
        return { status: 'Declining', score: 25 };
      } else {
        return { status: 'Stable', score: 50 };
      }

    } catch (error) {
      console.log(`⚠️ Could not fetch trend data: ${error.message}`);
      return { status: 'Unknown', score: 50 };
    }
  }

  formatNicheName(keyword) {
    return keyword
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  generateDescription(keyword, metrics, engagement) {
    const parts = [];

    if (metrics.competitionLevel === 'Low') {
      parts.push('Low competition niche with growth potential.');
    } else if (metrics.competitionLevel === 'Medium') {
      parts.push('Moderate competition, suitable for creators with some experience.');
    } else {
      parts.push('High competition market requiring strong content differentiation.');
    }

    if (engagement.avgRate > 4) {
      parts.push('High engagement rates indicate active audience.');
    }

    if (metrics.topChannelSubs < 500000) {
      parts.push('No dominant players, opportunity for new entrants.');
    }

    return parts.join(' ');
  }

  getQuotaUsed() {
    return this.ytClient.getQuotaUsed();
  }
}

module.exports = NicheAnalyzer;
