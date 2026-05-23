import axios from 'axios';

const BRIGHT_DATA_SERP_URL = 'https://api.brightdata.com/serp/req';
const BD_API_KEY = process.env.BRIGHTDATA_API_KEY;
const BD_ZONE = process.env.BRIGHTDATA_ZONE; 

export async function searchLiveThreatIntel(query: string) {
  // PRE-HACKATHON BYPASS: If you don't have credits/keys yet, skip safely.
  if (!BD_API_KEY || !BD_ZONE || BD_API_KEY === 'placeholder') {
    console.log(`[Bright Data] Skipped (Waiting for credits). Safe mock returned for: ${query}`);
    return { cve_found: false };
  }

  try {
    const response = await axios.post(
      BRIGHT_DATA_SERP_URL,
      { 
        country: 'us', 
        query: `site:cve.mitre.org OR site:github.com/advisories "${query}" exploit`,
        zone: BD_ZONE
      },
      {
        headers: {
          'Authorization': `Bearer ${BD_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const results = response.data.organic || [];
    if (results.length > 0) {
      return {
        cve_found: true,
        reference_url: results[0].link,
        snippet: results[0].snippet
      };
    }
    
    return { cve_found: false };
  } catch (error: any) {
    console.error("Bright Data SERP API Error:", error.response?.data || error.message);
    return { cve_found: false };
  }
}