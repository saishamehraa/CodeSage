//backend/src/services/brightdata/threatIntel.ts
import axios from 'axios';

const BRIGHT_DATA_SERP_URL = 'https://api.brightdata.com/serp/req';
const BD_ZONE = process.env.BRIGHTDATA_ZONE; 

export async function searchLiveThreatIntel(query: string, customApiKey?: string) {
  
  const activeKey = customApiKey || process.env.BRIGHTDATA_API_KEY;

  // PRE-HACKATHON BYPASS: If no key exists yet, skip safely.
  if (!activeKey || !BD_ZONE || activeKey === 'placeholder') {
    console.log(`[Bright Data] Skipped (Missing keys/credits). Safe mock returned for: ${query}`);
    return { cve_found: false };
  }

  try {
    const response = await axios.post(
      BRIGHT_DATA_SERP_URL,
      { 
        zone: BD_ZONE,
        // FIX: Bright Data requires 'query' to be an object containing the 'q' parameter
        query: {
          q: `site:cve.mitre.org OR site:github.com/advisories "${query}" exploit`,
          gl: 'us', // Geolocation
          hl: 'en'  // Language
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${activeKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    // Depending on the SERP API configuration, it might return an array or an object
    const results = response.data.organic || (response.data[0] && response.data[0].organic) || [];
    
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