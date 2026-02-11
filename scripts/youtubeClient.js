const { google } = require('googleapis');
require('dotenv').config();

class YouTubeClient {
  constructor(apiKey) {
    this.youtube = google.youtube({
      version: 'v3',
      auth: apiKey || process.env.YOUTUBE_API_KEY
    });
    this.quotaUsed = 0;
  }

  /**
   * Search for channels by keyword
   * Cost: 100 quota units per request
   */
  async searchChannels(query, maxResults = 50) {
    try {
      const response = await this.youtube.search.list({
        part: 'snippet',
        q: query,
        type: 'channel',
        maxResults: Math.min(maxResults, 50),
        order: 'relevance',
        relevanceLanguage: 'en'
      });
      
      this.quotaUsed += 100;
      console.log(`✓ Searched channels for "${query}" - Quota used: ${this.quotaUsed}`);
      
      return response.data.items || [];
    } catch (error) {
      console.error(`Error searching channels: ${error.message}`);
      return [];
    }
  }

  /**
   * Get detailed channel statistics
   * Cost: 1 quota unit per request
   */
  async getChannelStats(channelIds) {
    if (!Array.isArray(channelIds)) {
      channelIds = [channelIds];
    }

    try {
      const response = await this.youtube.channels.list({
        part: 'statistics,snippet,contentDetails',
        id: channelIds.join(',')
      });

      this.quotaUsed += 1;
      
      return response.data.items || [];
    } catch (error) {
      console.error(`Error fetching channel stats: ${error.message}`);
      return [];
    }
  }

  /**
   * Search for videos by keyword
   * Cost: 100 quota units per request
   */
  async searchVideos(query, maxResults = 50, publishedAfter = null) {
    try {
      const params = {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: Math.min(maxResults, 50),
        order: 'relevance',
        relevanceLanguage: 'en'
      };

      if (publishedAfter) {
        params.publishedAfter = publishedAfter;
      }

      const response = await this.youtube.search.list(params);
      
      this.quotaUsed += 100;
      console.log(`✓ Searched videos for "${query}" - Quota used: ${this.quotaUsed}`);
      
      return response.data.items || [];
    } catch (error) {
      console.error(`Error searching videos: ${error.message}`);
      return [];
    }
  }

  /**
   * Get detailed video statistics
   * Cost: 1 quota unit per request
   */
  async getVideoStats(videoIds) {
    if (!Array.isArray(videoIds)) {
      videoIds = [videoIds];
    }

    try {
      const response = await this.youtube.videos.list({
        part: 'statistics,snippet,contentDetails',
        id: videoIds.join(',')
      });

      this.quotaUsed += 1;
      
      return response.data.items || [];
    } catch (error) {
      console.error(`Error fetching video stats: ${error.message}`);
      return [];
    }
  }

  /**
   * Get recent videos from a channel
   * Cost: 100 quota units per request
   */
  async getChannelVideos(channelId, maxResults = 10) {
    try {
      const response = await this.youtube.search.list({
        part: 'snippet',
        channelId: channelId,
        type: 'video',
        maxResults: Math.min(maxResults, 50),
        order: 'date'
      });

      this.quotaUsed += 100;
      
      return response.data.items || [];
    } catch (error) {
      console.error(`Error fetching channel videos: ${error.message}`);
      return [];
    }
  }

  /**
   * Get trending videos by category
   * Cost: 1 quota unit per request
   */
  async getTrendingVideos(categoryId = null, maxResults = 50) {
    try {
      const params = {
        part: 'snippet,statistics',
        chart: 'mostPopular',
        maxResults: Math.min(maxResults, 50),
        regionCode: 'US'
      };

      if (categoryId) {
        params.videoCategoryId = categoryId;
      }

      const response = await this.youtube.videos.list(params);
      
      this.quotaUsed += 1;
      
      return response.data.items || [];
    } catch (error) {
      console.error(`Error fetching trending videos: ${error.message}`);
      return [];
    }
  }

  getQuotaUsed() {
    return this.quotaUsed;
  }

  resetQuota() {
    this.quotaUsed = 0;
  }
}

module.exports = YouTubeClient;
