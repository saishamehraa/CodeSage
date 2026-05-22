//src/app/lib/mockData.ts
// Mock data for CodeSage platform

export interface Project {
  id: string;
  name: string;
  repository: string;
  lastScan: string;
  status: 'pass' | 'warn' | 'block';
  reliabilityScore: number;
  securityScore: number;
  maintainabilityScore: number;
  totalIssues: number;
  criticalIssues: number;
  filesScanned: number;
}

export interface Issue {
  id: string;
  file: string;
  line: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  message: string;
  description: string;
  cve?: string;
  fixSuggestion?: string;
}

export interface ScanProgress {
  phase: string;
  progress: number;
  currentFile?: string;
  message: string;
}

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-Commerce API',
    repository: 'github.com/company/ecommerce-api',
    lastScan: '2026-05-22T10:30:00Z',
    status: 'warn',
    reliabilityScore: 85,
    securityScore: 72,
    maintainabilityScore: 78,
    totalIssues: 24,
    criticalIssues: 3,
    filesScanned: 156,
  },
  {
    id: '2',
    name: 'Mobile App Backend',
    repository: 'github.com/company/mobile-backend',
    lastScan: '2026-05-21T15:45:00Z',
    status: 'pass',
    reliabilityScore: 94,
    securityScore: 91,
    maintainabilityScore: 88,
    totalIssues: 8,
    criticalIssues: 0,
    filesScanned: 203,
  },
  {
    id: '3',
    name: 'Payment Gateway',
    repository: 'github.com/company/payment-service',
    lastScan: '2026-05-22T09:15:00Z',
    status: 'block',
    reliabilityScore: 68,
    securityScore: 45,
    maintainabilityScore: 71,
    totalIssues: 47,
    criticalIssues: 12,
    filesScanned: 89,
  },
  {
    id: '4',
    name: 'Admin Dashboard',
    repository: 'github.com/company/admin-ui',
    lastScan: '2026-05-20T14:20:00Z',
    status: 'pass',
    reliabilityScore: 92,
    securityScore: 88,
    maintainabilityScore: 85,
    totalIssues: 11,
    criticalIssues: 1,
    filesScanned: 124,
  },
];

export const mockIssues: Issue[] = [
  {
    id: '1',
    file: 'src/auth/jwt.ts',
    line: 45,
    severity: 'critical',
    type: 'Security Vulnerability',
    message: 'Hardcoded JWT secret detected',
    description: 'JWT secret is hardcoded in the source code, making it vulnerable to exposure. This can lead to token forgery and unauthorized access.',
    cve: 'CWE-798',
    fixSuggestion: 'Move JWT secret to environment variables and use a secure secret management system.',
  },
  {
    id: '2',
    file: 'src/database/query.ts',
    line: 128,
    severity: 'critical',
    type: 'SQL Injection',
    message: 'Potential SQL injection vulnerability',
    description: 'User input is directly concatenated into SQL query without sanitization. This is a classic SQL injection vulnerability.',
    cve: 'CWE-89',
    fixSuggestion: 'Use parameterized queries or an ORM with built-in SQL injection protection.',
  },
  {
    id: '3',
    file: 'package.json',
    line: 24,
    severity: 'critical',
    type: 'Vulnerable Dependency',
    message: 'express@4.17.1 has known vulnerabilities',
    description: 'The installed version of Express.js has multiple known security vulnerabilities including CVE-2022-24999.',
    cve: 'CVE-2022-24999',
    fixSuggestion: 'Update express to version 4.18.2 or later.',
  },
  {
    id: '4',
    file: 'src/api/upload.ts',
    line: 67,
    severity: 'high',
    type: 'File Upload Vulnerability',
    message: 'No file type validation on upload',
    description: 'File uploads are accepted without proper validation of file type, size, or content. This could allow malicious file uploads.',
    fixSuggestion: 'Implement file type validation, size limits, and scan uploaded files for malware.',
  },
  {
    id: '5',
    file: 'src/utils/crypto.ts',
    line: 34,
    severity: 'high',
    type: 'Weak Cryptography',
    message: 'MD5 hash algorithm is deprecated',
    description: 'MD5 is cryptographically broken and should not be used for security purposes.',
    cve: 'CWE-327',
    fixSuggestion: 'Use SHA-256 or bcrypt for password hashing and data integrity checks.',
  },
  {
    id: '6',
    file: 'src/middleware/cors.ts',
    line: 12,
    severity: 'medium',
    type: 'CORS Misconfiguration',
    message: 'CORS allows all origins',
    description: 'CORS is configured to allow requests from any origin, which may expose sensitive data.',
    fixSuggestion: 'Configure CORS to only allow trusted domains.',
  },
  {
    id: '7',
    file: 'src/api/user.ts',
    line: 156,
    severity: 'medium',
    type: 'Information Disclosure',
    message: 'Stack trace exposed in error response',
    description: 'Error responses include full stack traces, which can reveal sensitive information about the application structure.',
    fixSuggestion: 'Remove stack traces from production error responses and log them securely instead.',
  },
  {
    id: '8',
    file: 'src/config/database.ts',
    line: 8,
    severity: 'low',
    type: 'Code Quality',
    message: 'Console.log statement in production code',
    description: 'Console.log statements should be removed from production code as they may leak sensitive information.',
    fixSuggestion: 'Use a proper logging library with log levels and remove console.log statements.',
  },
];

export const threatIntelligence = [
  {
    source: 'GitHub Advisory Database',
    findings: 12,
    severity: 'high',
    timestamp: '2026-05-22T10:25:00Z',
  },
  {
    source: 'npm Security Advisories',
    findings: 8,
    severity: 'critical',
    timestamp: '2026-05-22T10:26:00Z',
  },
  {
    source: 'OWASP Top 10',
    findings: 5,
    severity: 'high',
    timestamp: '2026-05-22T10:27:00Z',
  },
  {
    source: 'CVE Database',
    findings: 15,
    severity: 'medium',
    timestamp: '2026-05-22T10:28:00Z',
  },
];

export const scanPhases = [
  'Initializing repository scan',
  'Parsing file structure',
  'Analyzing dependencies',
  'Scanning for vulnerabilities',
  'Checking CVE database',
  'Running security intelligence',
  'Cross-file analysis',
  'Generating fix suggestions',
  'Calculating risk scores',
  'Preparing final report',
];

export const activityLog = [
  {
    id: '1',
    type: 'scan_complete',
    project: 'E-Commerce API',
    message: 'Security scan completed with 24 issues found',
    timestamp: '2026-05-22T10:30:00Z',
    severity: 'warn',
  },
  {
    id: '2',
    type: 'deployment_blocked',
    project: 'Payment Gateway',
    message: 'Deployment blocked due to 12 critical vulnerabilities',
    timestamp: '2026-05-22T09:15:00Z',
    severity: 'critical',
  },
  {
    id: '3',
    type: 'scan_complete',
    project: 'Mobile App Backend',
    message: 'Security scan passed all checks',
    timestamp: '2026-05-21T15:45:00Z',
    severity: 'success',
  },
  {
    id: '4',
    type: 'cve_detected',
    project: 'E-Commerce API',
    message: 'New CVE detected: CVE-2022-24999 in express@4.17.1',
    timestamp: '2026-05-21T14:20:00Z',
    severity: 'high',
  },
  {
    id: '5',
    type: 'auto_fix_applied',
    project: 'Admin Dashboard',
    message: 'Auto-fix applied for 6 security issues',
    timestamp: '2026-05-20T16:30:00Z',
    severity: 'success',
  },
];

export const codeExamples = {
  vulnerable: {
    jwt: `// Vulnerable code in src/auth/jwt.ts
const jwt = require('jsonwebtoken');

// CRITICAL: Never hardcode secrets!
const SECRET_KEY = "hardcoded-secret-key-12345";

function generateToken(userId) {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.log(error); // Bad: exposing error details
    throw error;
  }
}`,
    sql: `// Vulnerable code in src/database/query.ts
async function getUserByEmail(email) {
  // SQL Injection vulnerability!
  const query = \`SELECT * FROM users WHERE email = '\${email}'\`;
  return await db.query(query);
}

async function searchProducts(term) {
  // Another SQL injection point
  const sql = "SELECT * FROM products WHERE name LIKE '%" + term + "%'";
  return await db.query(sql);
}`,
    upload: `// Vulnerable code in src/api/upload.ts
app.post('/upload', upload.single('file'), (req, res) => {
  // No file validation!
  const file = req.file;
  
  fs.writeFileSync(\`./uploads/\${file.originalname}\`, file.buffer);
  
  res.json({ success: true, filename: file.originalname });
});`,
  },
  fixed: {
    jwt: `// Fixed code - Secure implementation
const jwt = require('jsonwebtoken');

// Use environment variable for secret
const SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('JWT_SECRET_KEY environment variable is not set');
}

function generateToken(userId) {
  return jwt.sign(
    { userId }, 
    SECRET_KEY, 
    { 
      expiresIn: '1h',
      algorithm: 'HS256' // Specify algorithm
    }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY, { algorithms: ['HS256'] });
  } catch (error) {
    // Log securely without exposing details
    logger.error('Token verification failed', { error: error.message });
    throw new Error('Invalid token');
  }
}`,
    sql: `// Fixed code - Using parameterized queries
async function getUserByEmail(email) {
  // Parameterized query prevents SQL injection
  const query = 'SELECT * FROM users WHERE email = $1';
  return await db.query(query, [email]);
}

async function searchProducts(term) {
  // Safe parameterized search
  const sql = 'SELECT * FROM products WHERE name ILIKE $1';
  const searchTerm = \`%\${term}%\`;
  return await db.query(sql, [searchTerm]);
}`,
    upload: `// Fixed code - Secure file upload
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
const maxSize = 5 * 1024 * 1024; // 5MB

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  
  // Validate file type
  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({ error: 'Invalid file type' });
  }
  
  // Validate file size
  if (file.size > maxSize) {
    return res.status(400).json({ error: 'File too large' });
  }
  
  // Generate safe filename
  const safeFilename = \`\${Date.now()}-\${crypto.randomBytes(8).toString('hex')}\${path.extname(file.originalname)}\`;
  
  fs.writeFileSync(\`./uploads/\${safeFilename}\`, file.buffer);
  
  res.json({ success: true, filename: safeFilename });
});`,
  },
};

export const webIntelligenceSources = [
  {
    name: 'NIST CVE Database',
    url: 'https://nvd.nist.gov',
    description: 'National Vulnerability Database',
    lastCrawled: '2026-05-22T10:25:00Z',
    findings: 156,
  },
  {
    name: 'GitHub Security Advisories',
    url: 'https://github.com/advisories',
    description: 'Open source security advisories',
    lastCrawled: '2026-05-22T10:26:00Z',
    findings: 89,
  },
  {
    name: 'npm Security Advisories',
    url: 'https://www.npmjs.com/advisories',
    description: 'JavaScript package vulnerabilities',
    lastCrawled: '2026-05-22T10:27:00Z',
    findings: 67,
  },
  {
    name: 'OWASP Top 10',
    url: 'https://owasp.org/www-project-top-ten',
    description: 'Most critical web application risks',
    lastCrawled: '2026-05-22T10:28:00Z',
    findings: 12,
  },
  {
    name: 'Snyk Vulnerability Database',
    url: 'https://snyk.io/vuln',
    description: 'Developer security platform',
    lastCrawled: '2026-05-22T10:29:00Z',
    findings: 134,
  },
];

export const dependencyVulnerabilities = [
  {
    package: 'express',
    version: '4.17.1',
    latestVersion: '4.18.2',
    severity: 'critical',
    cve: 'CVE-2022-24999',
    description: 'Denial of service vulnerability in express.js',
    fixCommand: 'npm update express',
  },
  {
    package: 'lodash',
    version: '4.17.15',
    latestVersion: '4.17.21',
    severity: 'high',
    cve: 'CVE-2020-8203',
    description: 'Prototype pollution vulnerability',
    fixCommand: 'npm update lodash',
  },
  {
    package: 'axios',
    version: '0.21.1',
    latestVersion: '1.4.0',
    severity: 'medium',
    cve: 'CVE-2021-3749',
    description: 'Regular expression denial of service',
    fixCommand: 'npm update axios',
  },
];