# Bright Data Integration Guide

This document details how CodeSage integrates with Bright Data's web intelligence tools for real-time security threat analysis.

## 🌐 Overview

CodeSage leverages Bright Data's suite of web data collection tools to gather real-time security intelligence from across the web. This enables autonomous threat detection by accessing:

- CVE databases (NIST, MITRE)
- Security advisories (GitHub, npm, PyPI)
- Exploit repositories and discussions
- OWASP threat intelligence
- Vulnerability databases (Snyk, Sonatype)

## 🔧 Bright Data Tools Used

### 1. SERP API
**Purpose**: Search security databases and threat intelligence sources

#### Use Cases in CodeSage
- Search for CVE identifiers in vulnerability databases
- Find security advisories for npm/PyPI packages
- Discover exploit proof-of-concepts on GitHub
- Track OWASP vulnerability discussions

#### Example Implementation

```typescript
// Search for CVE information
async function searchCVE(cveId: string) {
  const serpApi = new BrightDataSERP({
    apiKey: process.env.BRIGHT_DATA_API_KEY,
  });

  const results = await serpApi.search({
    query: `${cveId} vulnerability details`,
    sources: ['nvd.nist.gov', 'cve.mitre.org', 'github.com/advisories'],
    limit: 20,
  });

  return results.map(result => ({
    title: result.title,
    url: result.url,
    snippet: result.snippet,
    source: result.source,
    date: result.date,
  }));
}

// Search for package vulnerabilities
async function searchPackageVulnerabilities(packageName: string, ecosystem: string) {
  const queries = [
    `${packageName} ${ecosystem} security vulnerability`,
    `${packageName} CVE`,
    `${packageName} security advisory`,
  ];

  const results = await Promise.all(
    queries.map(query => serpApi.search({ query, limit: 10 }))
  );

  return aggregateSecurityFindings(results);
}
```

#### Integration Points
- **Scan Phase**: "Checking CVE database"
- **Scan Phase**: "Running security intelligence"
- **Dashboard**: Threat Intelligence widget
- **Analysis Page**: Threat Intel tab

---

### 2. Web Unlocker
**Purpose**: Access protected security resources and databases

#### Use Cases in CodeSage
- Access paywalled security reports
- Retrieve data from bot-protected vulnerability databases
- Scrape security advisories behind login walls
- Access rate-limited security APIs

#### Example Implementation

```typescript
async function fetchSecurityAdvisory(url: string) {
  const unlocker = new BrightDataUnlocker({
    apiKey: process.env.BRIGHT_DATA_API_KEY,
  });

  const response = await unlocker.fetch(url, {
    headers: {
      'User-Agent': 'CodeSage Security Scanner/1.0',
    },
    renderJs: true,
    waitForSelector: '.advisory-content',
  });

  return parseAdvisoryContent(response.html);
}

// Bypass rate limiting on security APIs
async function fetchNpmAdvisory(packageName: string) {
  const url = `https://registry.npmjs.org/-/npm/v1/security/advisories/${packageName}`;
  
  const unlocker = new BrightDataUnlocker({
    apiKey: process.env.BRIGHT_DATA_API_KEY,
    proxy: {
      country: 'us',
      type: 'residential',
    },
  });

  const data = await unlocker.fetchJson(url);
  return data.advisories;
}
```

#### Integration Points
- **Background Jobs**: Automated vulnerability database updates
- **Real-time Scanning**: On-demand advisory retrieval
- **Dashboard**: Live threat intelligence feed

---

### 3. Scraping Browser
**Purpose**: Automated browser for complex security research

#### Use Cases in CodeSage
- Navigate multi-page vulnerability databases
- Extract data from JavaScript-heavy security platforms
- Scrape exploit code from GitHub repositories
- Monitor security discussion forums

#### Example Implementation

```typescript
async function scrapeGitHubAdvisories(packageName: string) {
  const browser = await BrightDataBrowser.launch({
    apiKey: process.env.BRIGHT_DATA_API_KEY,
    headless: true,
  });

  try {
    const page = await browser.newPage();
    
    // Navigate to GitHub advisories
    await page.goto(`https://github.com/advisories?query=${packageName}`);
    
    // Wait for results to load
    await page.waitForSelector('.advisory-item');
    
    // Extract advisory data
    const advisories = await page.evaluate(() => {
      const items = document.querySelectorAll('.advisory-item');
      return Array.from(items).map(item => ({
        id: item.querySelector('.advisory-id')?.textContent,
        severity: item.querySelector('.severity-badge')?.textContent,
        title: item.querySelector('.advisory-title')?.textContent,
        package: item.querySelector('.package-name')?.textContent,
        publishedDate: item.querySelector('.published-date')?.textContent,
      }));
    });

    return advisories;
  } finally {
    await browser.close();
  }
}

// Scrape OWASP vulnerability details
async function scrapeOWASPVulnerability(owaspId: string) {
  const browser = await BrightDataBrowser.launch({
    apiKey: process.env.BRIGHT_DATA_API_KEY,
  });

  const page = await browser.newPage();
  await page.goto(`https://owasp.org/www-project-top-ten/${owaspId}`);
  
  const data = await page.evaluate(() => ({
    description: document.querySelector('.description')?.textContent,
    examples: Array.from(document.querySelectorAll('.example')).map(
      el => el.textContent
    ),
    prevention: document.querySelector('.prevention')?.textContent,
    references: Array.from(document.querySelectorAll('.reference a')).map(
      a => ({ text: a.textContent, url: a.href })
    ),
  }));

  await browser.close();
  return data;
}
```

#### Integration Points
- **Deep Analysis**: Comprehensive vulnerability research
- **Weekly Jobs**: Update threat intelligence database
- **Manual Triggers**: On-demand deep dive into specific CVEs

---

### 4. MCP Server (Multi-Channel Proxy)
**Purpose**: Distributed web data collection infrastructure

#### Use Cases in CodeSage
- Parallel scanning of multiple security databases
- Geographic distribution for global threat intelligence
- High-volume data collection without rate limits
- Resilient scraping with automatic failover

#### Example Implementation

```typescript
async function scanMultipleSecuritySources(packageName: string) {
  const mcp = new BrightDataMCP({
    apiKey: process.env.BRIGHT_DATA_API_KEY,
    channels: 10, // Use 10 parallel connections
  });

  const sources = [
    'https://nvd.nist.gov',
    'https://github.com/advisories',
    'https://www.npmjs.com/advisories',
    'https://snyk.io/vuln',
    'https://security.snyk.io',
    'https://osv.dev',
  ];

  // Parallel scanning across all sources
  const results = await mcp.parallelScrape(
    sources.map(source => ({
      url: `${source}/search?q=${packageName}`,
      parser: getParserForSource(source),
    }))
  );

  return aggregateFindings(results);
}

// Rotating proxies for high-volume scanning
async function scanDependencyTree(dependencies: string[]) {
  const mcp = new BrightDataMCP({
    apiKey: process.env.BRIGHT_DATA_API_KEY,
    proxy: {
      type: 'rotating',
      country: ['us', 'de', 'uk'],
    },
  });

  const scanPromises = dependencies.map(async (dep) => {
    return await mcp.fetch(`https://deps.dev/npm/${dep}`, {
      parser: 'json',
    });
  });

  return await Promise.all(scanPromises);
}
```

#### Integration Points
- **Bulk Scanning**: Analyze entire dependency trees
- **CI/CD Integration**: High-throughput scanning for pipelines
- **Real-time Monitoring**: Continuous threat intelligence gathering

---

## 🎯 Security Intelligence Workflow

### Phase 1: Dependency Discovery
```
1. Parse package.json / requirements.txt / go.mod
2. Extract all direct and transitive dependencies
3. Build complete dependency graph
```

### Phase 2: Vulnerability Search (SERP API)
```
For each dependency:
  1. Search CVE databases
  2. Find security advisories
  3. Check exploit databases
  4. Look for OWASP references
```

### Phase 3: Deep Analysis (Web Unlocker + Scraping Browser)
```
For high-priority findings:
  1. Fetch full advisory details
  2. Scrape exploit code if available
  3. Gather remediation guidance
  4. Find similar vulnerabilities
```

### Phase 4: Continuous Monitoring (MCP Server)
```
Background process:
  1. Monitor new CVE publications
  2. Track security mailing lists
  3. Watch GitHub security advisories
  4. Alert on new threats
```

---

## 📊 Data Sources Matrix

| Source | Tool | Frequency | Data Collected |
|--------|------|-----------|----------------|
| NIST NVD | SERP API | Per scan | CVE details, CVSS scores |
| GitHub Advisories | Scraping Browser | Daily | Package vulnerabilities |
| npm Advisories | Web Unlocker | Per scan | JavaScript package issues |
| OWASP | SERP API | Weekly | Top 10 vulnerabilities |
| Snyk Database | MCP Server | Daily | Curated vulnerability data |
| Exploit-DB | SERP API | Per scan | Exploit availability |

---

## 🔐 API Configuration

### Environment Variables

```bash
# Bright Data API Configuration
BRIGHT_DATA_API_KEY=your_api_key_here
BRIGHT_DATA_ZONE=your_zone_name

# SERP API Settings
SERP_API_ENDPOINT=https://api.brightdata.com/serp/v1
SERP_API_RATE_LIMIT=100

# Web Unlocker Settings
UNLOCKER_API_ENDPOINT=https://api.brightdata.com/unlocker/v1
UNLOCKER_RENDER_JS=true

# Scraping Browser Settings
BROWSER_API_ENDPOINT=https://api.brightdata.com/browser/v1
BROWSER_HEADLESS=true

# MCP Server Settings
MCP_API_ENDPOINT=https://api.brightdata.com/mcp/v1
MCP_CHANNELS=10
```

### Rate Limiting

```typescript
const rateLimiter = new RateLimiter({
  serp: { requests: 100, per: 'minute' },
  unlocker: { requests: 50, per: 'minute' },
  browser: { requests: 20, per: 'minute' },
  mcp: { requests: 200, per: 'minute' },
});

// Use rate limiter before API calls
await rateLimiter.wait('serp');
const results = await serpApi.search(query);
```

---

## 🎬 Demo Scenarios

### Scenario 1: Real-time CVE Detection
```typescript
// User uploads repository with express@4.17.1
// CodeSage detects the dependency
// SERP API searches for "express 4.17.1 CVE"
// Finds CVE-2022-24999
// Web Unlocker fetches full advisory from NVD
// Dashboard shows critical vulnerability
```

### Scenario 2: Comprehensive Security Audit
```typescript
// User requests deep scan
// MCP Server parallelizes across all sources
// Scraping Browser extracts detailed data
// Combines findings from:
//   - NIST NVD
//   - GitHub Advisories
//   - npm Registry
//   - Snyk Database
// Generates comprehensive report
```

### Scenario 3: Continuous Monitoring
```typescript
// Background job runs every hour
// SERP API checks for new CVEs
// MCP Server monitors security feeds
// When new threat detected:
//   - Alert dashboard
//   - Re-scan affected projects
//   - Notify team
```

---

## 📈 Performance Optimization

### Caching Strategy

```typescript
const cache = {
  cve: new Map(), // Cache CVE lookups for 24 hours
  advisory: new Map(), // Cache advisories for 12 hours
  exploits: new Map(), // Cache exploit data for 6 hours
};

async function getCVEInfo(cveId: string) {
  if (cache.cve.has(cveId)) {
    return cache.cve.get(cveId);
  }

  const data = await serpApi.search(`${cveId} details`);
  cache.cve.set(cveId, data);
  
  setTimeout(() => cache.cve.delete(cveId), 24 * 60 * 60 * 1000);
  
  return data;
}
```

### Batch Processing

```typescript
// Process dependencies in batches
const BATCH_SIZE = 10;

async function scanDependencies(deps: string[]) {
  const batches = chunk(deps, BATCH_SIZE);
  
  for (const batch of batches) {
    await Promise.all(batch.map(scanDependency));
    await sleep(1000); // Rate limiting
  }
}
```

---

## 🧪 Testing Bright Data Integration

### Mock Responses for Development

```typescript
// Mock SERP API responses
const mockSerpResponse = {
  results: [
    {
      title: 'CVE-2022-24999 - Express.js Vulnerability',
      url: 'https://nvd.nist.gov/vuln/detail/CVE-2022-24999',
      snippet: 'Denial of service vulnerability...',
    },
  ],
};

// Use mocks in development
const useMock = process.env.NODE_ENV === 'development';
const results = useMock ? mockSerpResponse : await serpApi.search(query);
```

---

## 📚 Additional Resources

- [Bright Data Documentation](https://docs.brightdata.com)
- [SERP API Reference](https://docs.brightdata.com/serp-api)
- [Web Unlocker Guide](https://docs.brightdata.com/web-unlocker)
- [Scraping Browser Docs](https://docs.brightdata.com/scraping-browser)
- [MCP Server Overview](https://docs.brightdata.com/mcp)

---

## 🎯 Hackathon Demo Points

Highlight these integrations during the demo:

1. **Live SERP Search** - Show real-time CVE lookup
2. **Web Unlocker** - Access protected advisory database
3. **Scraping Browser** - Extract GitHub security data
4. **MCP Parallel** - Demonstrate high-speed scanning
5. **Real Results** - Show actual threat intelligence gathered

---

**Built for Web Data UNLOCKED Hackathon**
*Demonstrating the power of AI + Real-time Web Intelligence*
