# CodeSage - AI-Powered Enterprise DevSecOps Platform

![CodeSage Banner](https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=400&fit=crop)

CodeSage is an autonomous AI code reliability, cybersecurity, and deployment intelligence system that acts as a CI/CD gatekeeper for modern software teams.

## 🚀 Overview

CodeSage combines deep code analysis with live web-powered threat intelligence to provide comprehensive security assessments for your codebase. Built for the "Web Data UNLOCKED" hackathon, it demonstrates how AI becomes dramatically more powerful when connected to real-time web data.

If a vulnerability has an active exploit in the wild, CodeSage knows, alerts you, blocks the deployment, and generates the patch using high-performance open-source LLMs via **OpenRouter**.

## 🧠 Why CodeSage?

Traditional static analyzers detect code issues.

CodeSage goes further.

It combines:
- AI-powered code reasoning
- live web threat intelligence
- CVE correlation
- exploit awareness
- autonomous fix generation
- deployment risk assessment

to act as a real-time enterprise deployment gatekeeper.

If a dependency becomes actively exploited on the public web, CodeSage detects it instantly using Bright Data-powered intelligence pipelines and can automatically block unsafe production deployments.

### ✨ Key Features

- 🔍 **Multi-Agent AI Analysis** - Scans code line-by-line for OWASP vulnerabilities using OpenRouter (Llama-3.1/Mistral).
- 🛡️ **Security Intelligence** - Live web threat detection via Bright Data APIs.
- 🎬 **Cinematic Real-time UI** - Supabase WebSockets stream the AI's internal reasoning directly to the frontend.
- 🏗️ **Unified Architecture** - A single Node.js/Express server delivering a React Vite frontend and WebSocket API simultaneously.
- 🔧 **Auto-Fix Engine** - AI-generated security patches and fixes.
- 🚦 **Deployment Verdicts** - PASS/WARN/BLOCK decisions for CI/CD pipelines.

## 🛠️ Technology Stack

### Frontend
- **React 18 & Vite** - UI framework and build tool
- **TypeScript** - Type safety
- **TailwindCSS & Framer Motion** - Styling with dark theme, glassmorphism, and smooth animations
- **React Router** - Multi-page navigation
- **Recharts** - Data visualization
- **Monaco Editor** - Code editor integration
- **Radix UI** - Accessible component primitives

### Backend
- **Node.js & Express** - Unified server handling API and serving static React files
- **Multer & Simple-Git** - Repository and ZIP ingestion pipeline
- **Supabase** - PostgreSQL database with Realtime WebSockets

### AI & Intelligence Layer
- **OpenRouter** - Flexible access to high-performance open-source LLMs (Llama 3.1, Mistral, DeepSeek)
- **Multi-Agent Architecture** - Specialized agents for code analysis, dependency auditing, threat intelligence, fix generation, and deployment verdicts
- **Bright Data** - SERP API, Web Unlocker, and Scraping Browser for real-time vulnerability intelligence and exploit correlation

## 📁 Project Structure

```text
/backend
  /src
    /routes
      - scan.ts
    /services
      /ai
        - codeAnalyzer.ts
      /brightdata
        - threatIntel.ts
      - ingestion.ts
      - scanWorker.ts
    /workers
      - scanEngine.ts
    - index.ts 
  - schema.sql 
/src
  /app
    /components
      - Root.tsx              # Main layout with sidebar
      - Dashboard.tsx         # Security dashboard with metrics
      - Scanner.tsx           # Repository upload and scanning
      - Analysis.tsx          # Detailed issue analysis
      - Repository.tsx        # Repository file structure
      - Settings.tsx          # API keys and integrations
      - LiveScannerOverlay.tsx
      - LoadingScreen.tsx
      - StatsCard.tsx
      /ui                     # Shadcn UI components
    /hooks
      - useRealtimeScan.ts    
    /lib
      - mockData.ts           # Fallback data
      - api.ts                # Supabase data layer
      - supabase.ts           # Supabase client
    - routes.tsx              # React Router configuration
    - App.tsx                 # Main application entry

```

## 🚀 Quickstart (Local Development)

Because CodeSage uses a unified architecture, running it locally is incredibly simple.

**1. Clone & Install**

```bash
git clone https://github.com/saishamehraa/codesage.git
cd codesage

# This installs both frontend and backend dependencies
npm install

```

**2. Environment Variables**
Create a `.env` file in the `backend/` folder:

```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENROUTER_API_KEY=sk-or-v1-...
BRIGHTDATA_API_KEY=your-bright-data-api-key

```

Create a `.env.local` file in the root frontend folder:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

```

**3. Database Setup**
Run the SQL script located in `backend/schema.sql` in your Supabase SQL Editor.

**4. Run the Platform**

```bash
# Runs both the Vite frontend and Express backend concurrently
npm run dev

```

Open `http://localhost:5173` in your browser.

## 🎯 Core Functionality

### 1. Repository Ingestion

* Upload ZIP files
* Connect GitHub repositories
* Clone from Git URLs
* Recursive file traversal

### 2. Live Web Threat Intelligence

Using Bright Data APIs to search:

* CVE databases
* GitHub advisories
* npm/PyPI vulnerabilities
* OWASP references
* Exploit discussions

### 3. Issue Detection

The platform identifies:

* SQL injection vulnerabilities (CWE-89)
* Hardcoded secrets (CWE-798)
* Weak cryptography (CWE-327)
* CORS misconfigurations
* Vulnerable dependencies
* File upload issues
* Information disclosure

### 4. Deployment Verdicts

Calculates:

* **Security Score** (0-100%)
* **Reliability Score** (0-100%)
* **Maintainability Score** (0-100%)
* **Final Verdict**: PASS / WARN / BLOCK

## 🎨 Design System

The UI features:

* **Dark theme** with slate color palette
* **Glassmorphism** effects with backdrop blur
* **Animated gradients** (violet, fuchsia, cyan)
* **Smooth transitions** using Motion
* **Terminal-inspired** components
* **Futuristic cybersecurity** aesthetic

## 🔧 CI/CD Integration

CodeSage supports:

* ✅ GitHub Actions
* ✅ GitLab CI
* ⚙️ Jenkins
* ⚙️ CircleCI

### Webhook Integration

```bash
# Webhook URL format
https://api.codesage.ai/webhooks/{your-project-id}

```

Configure webhooks to block deployments when:

* Critical vulnerabilities are detected
* Security score drops below threshold
* New CVEs are found in dependencies

## 📊 Dashboard Features

### Security Metrics

* Total projects monitored
* Critical issues count
* Overall security score
* Daily scan statistics

### Visualizations

* Security trend charts (7-day view)
* Issue distribution pie chart
* Issue analysis by category
* Severity breakdown

### Activity Log

Real-time events including:

* Scan completions
* Deployment blocks
* CVE detections
* Auto-fix applications

## 🎬 Demo Flow

Perfect for hackathon presentations:

1. **Upload** a vulnerable repository
2. **Watch** AI scan the project with animated real-time WebSocket progress
3. **See** live web threat intelligence activate via Bright Data
4. **Discover** active CVEs and security issues
5. **Review** AI-generated fixes
6. **Monitor** dashboard update risk scores
7. **Observe** deployment verdict change to BLOCK
8. **Apply** fixes and see verdict change to PASS

## 🎓 Use Cases

### For Development Teams

* Pre-deployment security checks
* Automated code review
* Dependency vulnerability monitoring
* Security training with fix suggestions

### For DevOps Teams

* CI/CD pipeline integration
* Deployment gating
* Compliance reporting
* Security metrics tracking

### For Security Teams

* Vulnerability assessment
* Threat intelligence gathering
* Security posture monitoring
* CVE impact analysis

## 🔒 Security Best Practices

CodeSage helps identify:

* **CWE-798**: Hardcoded credentials
* **CWE-89**: SQL injection
* **CWE-327**: Weak cryptography
* **CVE tracking**: Known vulnerabilities
* **OWASP Top 10**: Common web vulnerabilities

## 📈 Metrics & Scoring

### Security Score

Evaluates:

* Vulnerability severity
* Exposed secrets
* Insecure dependencies
* Weak cryptography

### Reliability Score

Evaluates:

* Error handling
* Input validation
* Resource management
* Edge case coverage

### Maintainability Score

Evaluates:

* Code quality
* Documentation
* Complexity
* Best practices

## 📚 Documentation

- ARCHITECTURE.md
- BRIGHT_DATA_INTEGRATION.md
- DEPLOYMENT.md
- FEATURES.md

## 🏆 Hackathon Integration

Built for the **Web Data UNLOCKED** hackathon by Bright Data.

### Demonstrates:

* Real-time web data integration
* Autonomous AI reasoning
* Live threat intelligence
* Production-ready architecture
* Scalable design patterns

### Bright Data Usage:

All security intelligence features leverage Bright Data APIs to:

* Search global CVE databases
* Scrape security advisories
* Monitor GitHub security alerts
* Track npm/PyPI vulnerabilities
* Gather OWASP threat data

## 🚀 Future Roadmap

- Kubernetes security scanning
- Docker container analysis
- AI-powered exploit simulation
- SOC dashboard integrations
- Slack/MS Teams alerting
- Autonomous remediation pipelines
- Agent memory for long-term security intelligence

## 🌐 Why Bright Data?

CodeSage relies on Bright Data infrastructure to access live vulnerability intelligence across the public web.

Bright Data enables:
- real-time CVE correlation
- protected advisory scraping
- exploit intelligence gathering
- dependency vulnerability research
- uninterrupted threat analysis at scale

Without reliable web access, autonomous security reasoning at this level would not be possible.

## 🙏 Acknowledgments

* **Bright Data** - Web intelligence APIs
* **OpenRouter** - Flexible Open-Source AI Models
* **Radix UI** - Component primitives
* **Recharts** - Data visualization
* **Monaco Editor** - Code editor
* **Lucide Icons** - Beautiful icons

---

**Built with ❤️ for the Web Data UNLOCKED Hackathon**

*CodeSage - Making the web safer, one line of code at a time.*

---

![LICENSE](./license.md)