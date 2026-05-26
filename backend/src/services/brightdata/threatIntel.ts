//backend/src/services/brightdata/threatIntel.ts
import axios from 'axios';

const BRIGHT_DATA_SERP_URL = 'https://api.brightdata.com/serp/req';
// The zone is usually tied to your account infrastructure, so keeping it in .env is fine,
// while the dynamic API key can be passed from the UI.
const BD_ZONE = process.env.BRIGHTDATA_ZONE; 

// FIX 1: Accept customApiKey as a parameter
export async function searchLiveThreatIntel(query: string, customApiKey?: string) {
  
  // FIX 2: Dynamically select the key
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
        country: 'us', 
        query: `site:cve.mitre.org OR site:github.com/advisories "${query}" exploit`,
        zone: BD_ZONE
      },
      {
        headers: {
          // FIX 3: Use the dynamically selected key here
          'Authorization': `Bearer ${activeKey}`,
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