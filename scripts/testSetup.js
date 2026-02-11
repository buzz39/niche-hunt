const YouTubeClient = require('./youtubeClient');
require('dotenv').config();

async function testSetup() {
  console.log('🔧 Testing YouTube API Setup...\n');

  // Check if API key exists
  if (!process.env.YOUTUBE_API_KEY) {
    console.log('❌ YOUTUBE_API_KEY not found in environment variables');
    console.log('\nPlease:');
    console.log('1. Create a .env file in the project root');
    console.log('2. Add: YOUTUBE_API_KEY=your_api_key_here');
    console.log('3. Get your API key from: https://console.cloud.google.com/');
    return;
  }

  console.log('✅ API key found in environment');

  // Test API connection
  console.log('\n🔍 Testing API connection...');
  
  try {
    const client = new YouTubeClient();
    
    // Simple test: search for a popular channel
    const channels = await client.searchChannels('mkbhd', 1);
    
    if (channels.length > 0) {
      console.log('✅ API connection successful!');
      console.log(`\nTest result: Found channel "${channels[0].snippet.title}"`);
      console.log(`Quota used: ${client.getQuotaUsed()} units`);
      
      console.log('\n✅ Setup complete! You can now run data collection.');
      console.log('\nNext steps:');
      console.log('  node scripts/collectData.js --limit 5   (test with 5 niches)');
      console.log('  node scripts/collectData.js --limit 50  (collect 50 niches)');
    } else {
      console.log('⚠️ API connected but no results returned');
      console.log('This might indicate quota issues or API restrictions');
    }
    
  } catch (error) {
    console.log('❌ API connection failed');
    console.log(`\nError: ${error.message}`);
    
    if (error.message.includes('API key')) {
      console.log('\n💡 Your API key might be invalid or restricted.');
      console.log('Please check:');
      console.log('1. API key is correct');
      console.log('2. YouTube Data API v3 is enabled');
      console.log('3. API key has no IP restrictions (or your IP is allowed)');
    } else if (error.message.includes('quota')) {
      console.log('\n💡 You may have exceeded your daily quota.');
      console.log('Quota resets at midnight Pacific Time.');
    }
  }
}

testSetup();
