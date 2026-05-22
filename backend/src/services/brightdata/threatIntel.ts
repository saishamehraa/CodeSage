// backend/src/services/brightdata/threatIntel.ts
import axios from 'axios';

const BRIGHT_DATA_SERP_URL = 'https://api.brightdata.com/serp/req';
const BD_API_KEY = process.env.BRIGHTDATA_API_KEY;

export async function searchLiveThreatIntel(query: string) {
  try {
    // This triggers Bright Data's SERP API to fetch real-time Google results
    const response = await axios.post(
      BRIGHT_DATA_SERP_URL,
      { country: 'us', query: `site:cve.mitre.org OR site:github.com/advisories "${query}" exploit` },
      {
        headers: {
          'Authorization': `Bearer ${BD_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // In a real implementation, Bright Data returns a response ID, 
    // and you poll or use a webhook to get the final JSON results.
    // For the hackathon demo, we parse the returned organic results:
    
    const results = response.data.organic || [];
    if (results.length > 0) {
      return {
        cve_found: true,
        reference_url: results[0].link,
        snippet: results[0].snippet
      };
    }
    
    return { cve_found: false };
  } catch (error) {
    console.error("Bright Data SERP API Error:", error);
    return { cve_found: false };
  }
}