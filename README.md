# CodeSage - AI-Powered Enterprise DevSecOps Platform

![CodeSage Banner](https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=400&fit=crop)

CodeSage is an autonomous AI code reliability, cybersecurity, and deployment intelligence system that acts as a CI/CD gatekeeper for modern software teams.

## 🚀 Overview

CodeSage combines deep code analysis with live web-powered threat intelligence to provide comprehensive security assessments for your codebase. Built for the "Web Data UNLOCKED" hackathon, it demonstrates how AI becomes dramatically more powerful when connected to real-time web data.

### Key Features

- 🔍 **AI Code Analysis** - Multi-file, multi-language codebase scanning
- 🛡️ **Security Intelligence** - Live web threat detection via Bright Data APIs
- 🔧 **Auto-Fix Engine** - AI-generated security patches and fixes
- 📊 **Interactive Dashboard** - Real-time security metrics and visualizations
- 🚦 **Deployment Verdicts** - PASS/WARN/BLOCK decisions for CI/CD pipelines
- 🌐 **Threat Intelligence** - Real-time CVE detection and OWASP analysis

## 🛠️ Technology Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling with dark theme and glassmorphism
- **Motion (Framer Motion)** - Smooth animations
- **React Router** - Multi-page navigation
- **Recharts** - Data visualization
- **Monaco Editor** - Code editor integration
- **Radix UI** - Accessible component primitives

### AI & Intelligence Layer
- Multi-agent architecture for:
  - Code analysis
  - Security intelligence
  - Dependency analysis
  - Fix generation
  - Deployment verdicts

### Bright Data Integration
The platform integrates with Bright Data tools for real-time web intelligence:
- **SERP API** - Search CVE databases and security advisories
- **MCP Server** - Multi-channel proxy for web data
- **Web Unlocker** - Access protected security databases
- **Scraping Browser** - Automated threat intelligence gathering

## 📁 Project Structure

```
/src
  /app
    /components
      - Root.tsx              # Main layout with sidebar
      - Dashboard.tsx         # Security dashboard with metrics
      - Scanner.tsx           # Repository upload and scanning
      - Analysis.tsx          # Detailed issue analysis
      - Repository.tsx        # Repository file structure
      - Settings.tsx          # API keys and integrations
      /ui                     # Shadcn UI components
    /lib
      - mockData.ts           # Mock data for demonstrations
    - routes.tsx              # React Router configuration
    - App.tsx                # Main application entry
  /styles
    - theme.css              # Custom theme and animations
    - tailwind.css           # Tailwind configuration
    - fonts.css              # Font imports
```

## 🎯 Core Functionality

### 1. Repository Ingestion
- Upload ZIP files
- Connect GitHub repositories
- Clone from Git URLs
- Recursive file traversal

### 2. AI Code Analysis
For every file, the system:
- Detects programming language
- Analyzes line-by-line
- Identifies security issues
- Classifies severity (Critical/High/Medium/Low)

### 3. Live Web Threat Intelligence
Using Bright Data APIs to search:
- CVE databases
- GitHub advisories
- npm/PyPI vulnerabilities
- OWASP references
- Exploit discussions

### 4. Issue Detection
The platform identifies:
- SQL injection vulnerabilities
- Hardcoded secrets
- Weak cryptography
- CORS misconfigurations
- Vulnerable dependencies
- File upload issues
- Information disclosure

### 5. Auto-Fix Engine
Generates:
- Corrected code
- Safer implementations
- Patched dependencies
- Security best practices

### 6. Deployment Verdicts
Calculates:
- **Security Score** (0-100%)
- **Reliability Score** (0-100%)
- **Maintainability Score** (0-100%)
- **Final Verdict**: PASS / WARN / BLOCK

## 🎨 Design System

The UI features:
- **Dark theme** with slate color palette
- **Glassmorphism** effects with backdrop blur
- **Animated gradients** (violet, fuchsia, cyan)
- **Smooth transitions** using Motion
- **Terminal-inspired** components
- **Futuristic cybersecurity** aesthetic

## 🔌 API Integration

### Required API Keys
Configure in Settings page:

```env
# OpenAI API (for code analysis)
OPENAI_API_KEY=sk-YOUR_API_KEY_HERE

# Bright Data API (for threat intelligence)
BRIGHT_DATA_API_KEY=bd-YOUR_API_KEY_HERE

# GitHub Personal Access Token (for repository access)
GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE
```

### Bright Data Tools Integration

The platform uses these Bright Data services:

1. **SERP API** - Search for CVEs and security advisories
2. **MCP Server** - Proxy for accessing multiple security databases
3. **Web Unlocker** - Bypass restrictions on security sites
4. **Scraping Browser** - Automated browser for gathering intelligence

## 🔧 CI/CD Integration

CodeSage supports:
- ✅ GitHub Actions
- ✅ GitLab CI
- ⚙️ Jenkins
- ⚙️ CircleCI

### Webhook Integration
```bash
# Webhook URL format
https://api.codesage.ai/webhooks/{your-project-id}
```

Configure webhooks to block deployments when:
- Critical vulnerabilities are detected
- Security score drops below threshold
- New CVEs are found in dependencies

## 📊 Dashboard Features

### Security Metrics
- Total projects monitored
- Critical issues count
- Overall security score
- Daily scan statistics

### Visualizations
- Security trend charts (7-day view)
- Issue distribution pie chart
- Issue analysis by category
- Severity breakdown

### Activity Log
Real-time events including:
- Scan completions
- Deployment blocks
- CVE detections
- Auto-fix applications

### Threat Intelligence Feed
Live data from:
- GitHub Advisory Database
- npm Security Advisories
- OWASP Top 10
- CVE Database

## 🎬 Demo Flow

Perfect for hackathon presentations:

1. **Upload** a vulnerable repository
2. **Watch** AI scan the project with animated progress
3. **See** live web threat intelligence activate
4. **Discover** active CVEs and security issues
5. **Review** AI-generated fixes
6. **Monitor** dashboard update risk scores
7. **Observe** deployment verdict change to BLOCK
8. **Apply** fixes and see verdict change to PASS

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm package manager

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Configuration

1. Navigate to Settings page
2. Add your API keys:
   - OpenAI API key
   - Bright Data API key
   - GitHub token
3. Enable CI/CD integrations
4. Configure notification preferences

## 🎓 Use Cases

### For Development Teams
- Pre-deployment security checks
- Automated code review
- Dependency vulnerability monitoring
- Security training with fix suggestions

### For DevOps Teams
- CI/CD pipeline integration
- Deployment gating
- Compliance reporting
- Security metrics tracking

### For Security Teams
- Vulnerability assessment
- Threat intelligence gathering
- Security posture monitoring
- CVE impact analysis

## 🔒 Security Best Practices

CodeSage helps identify:
- **CWE-798**: Hardcoded credentials
- **CWE-89**: SQL injection
- **CWE-327**: Weak cryptography
- **CVE tracking**: Known vulnerabilities
- **OWASP Top 10**: Common web vulnerabilities

## 📈 Metrics & Scoring

### Security Score
Evaluates:
- Vulnerability severity
- Exposed secrets
- Insecure dependencies
- Weak cryptography

### Reliability Score
Evaluates:
- Error handling
- Input validation
- Resource management
- Edge case coverage

### Maintainability Score
Evaluates:
- Code quality
- Documentation
- Complexity
- Best practices

## 🏆 Hackathon Integration

Built for **Web Data UNLOCKED** hackathon by Bright Data.

### Demonstrates:
- Real-time web data integration
- Autonomous AI reasoning
- Live threat intelligence
- Production-ready architecture
- Scalable design patterns

### Bright Data Usage:
All security intelligence features leverage Bright Data APIs to:
- Search global CVE databases
- Scrape security advisories
- Monitor GitHub security alerts
- Track npm/PyPI vulnerabilities
- Gather OWASP threat data

## 📝 License

This is a demo project created for the Web Data UNLOCKED hackathon.

## 🙏 Acknowledgments

- **Bright Data** - Web intelligence APIs
- **Radix UI** - Component primitives
- **Recharts** - Data visualization
- **Monaco Editor** - Code editor
- **Lucide Icons** - Beautiful icons

---

**Built with ❤️ for the Web Data UNLOCKED Hackathon**

*CodeSage - Making the web safer, one line of code at a time.*
