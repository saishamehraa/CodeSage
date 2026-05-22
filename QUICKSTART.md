# CodeSage Quick Start Guide

Get up and running with CodeSage in minutes.

## ⚡ 5-Minute Setup

### Step 1: Installation (2 minutes)

```bash
# Clone the repository
git clone https://github.com/your-org/codesage.git
cd codesage

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open your browser to `http://localhost:5173` 🎉

### Step 2: First Scan (3 minutes)

1. Click **"Scanner"** in the sidebar
2. Choose your upload method:
   - **Upload ZIP**: Drag and drop your project
   - **GitHub**: Enter repository URL
   - **Git URL**: Paste any Git repository URL
3. Click **"Start Security Scan"**
4. Watch the real-time scanning progress
5. View results in the Analysis page

That's it! You now have a complete security report. ✅

---

## 🎯 Common Use Cases

### Use Case 1: Scan a GitHub Repository

```bash
# In the Scanner page
1. Click "GitHub" tab
2. Enter: https://github.com/expressjs/express
3. Click "Start Security Scan"
4. Review findings in ~30 seconds
```

### Use Case 2: Upload Local Project

```bash
# Zip your project first
zip -r my-project.zip ./my-project

# In the Scanner page
1. Click "Upload ZIP" tab
2. Drag and drop my-project.zip
3. Click "Start Security Scan"
4. Get comprehensive analysis
```

### Use Case 3: Check for CVEs

```bash
# In the Dashboard
1. View "Live Web Threat Intelligence"
2. See real-time CVE detections
3. Click any project card
4. Review "Threat Intel" tab
5. Get CVE details and fixes
```

---

## 📊 Understanding Your Results

### Security Score

- **90-100**: Excellent ✅
- **75-89**: Good ⚠️
- **60-74**: Fair ⚠️
- **Below 60**: Critical 🚫

### Issue Severity

- **Critical** 🔴: Fix immediately
- **High** 🟠: Fix soon
- **Medium** 🟡: Address when possible
- **Low** 🔵: Optional improvement

### Deployment Verdict

- **PASS** ✅: Safe to deploy
- **WARN** ⚠️: Review before deploying
- **BLOCK** 🚫: Do not deploy

---

## 🔧 Configuration

### Adding API Keys (Optional)

For production features, add your API keys:

1. Click **"Settings"** in the sidebar
2. Scroll to **"API Keys"** section
3. Enter your keys:
   - OpenAI API Key (for AI analysis)
   - Bright Data Key (for threat intelligence)
   - GitHub Token (for private repos)
4. Click **"Save API Keys"**

> **Note**: The demo works without API keys using mock data!

---

## 🎬 Demo Mode

CodeSage includes realistic mock data for demonstration:

- 4 sample projects with different security profiles
- 8 common vulnerability types
- Real CVE references
- Threat intelligence feeds
- Scanning animations

Perfect for:
- Learning the platform
- Demonstrating to stakeholders
- Testing without API keys
- Hackathon presentations

---

## 🚀 Next Steps

### Explore the Dashboard

```bash
Navigate to "/" (Dashboard)

Key sections:
- Security metrics overview
- Weekly trend charts
- Recent project scans
- Activity log
- Threat intelligence feed
```

### Deep Dive into Analysis

```bash
Navigate to any project → Click "View Analysis"

Features:
- Issue list with severity
- Code viewer with syntax highlighting
- AI-generated fixes
- Threat intelligence data
- Export options
```

### Configure CI/CD Integration

```bash
Navigate to "/settings"

Setup:
- Enable GitHub Actions
- Enable GitLab CI
- Get webhook URL
- Configure notifications
```

---

## 💡 Pro Tips

### Tip 1: Keyboard Shortcuts (Coming Soon)
```
Ctrl/Cmd + K: Quick search
Ctrl/Cmd + S: Start scan
Ctrl/Cmd + E: Export report
```

### Tip 2: Filter Issues
In the Analysis page, filter by:
- Severity level
- Issue type
- File location
- CVE presence

### Tip 3: Export Reports
Multiple export formats:
- **PDF**: For stakeholders
- **JSON**: For APIs
- **CSV**: For spreadsheets

### Tip 4: Auto-Fix Application
Click "Apply Auto-Fixes" to:
- See AI-generated fixes
- Preview changes
- Download patched code
- Get fix instructions

---

## 🎓 Learn More

### Understanding Vulnerabilities

- **SQL Injection**: User input in queries → Use parameterized queries
- **XSS**: Unescaped output → Sanitize user input
- **Hardcoded Secrets**: Keys in code → Use environment variables
- **Weak Crypto**: MD5/SHA1 → Use SHA-256 or bcrypt

### Best Practices

1. **Scan regularly**: Daily or per commit
2. **Fix critical first**: Prioritize by severity
3. **Update dependencies**: Keep packages current
4. **Review AI fixes**: Understand before applying
5. **Monitor trends**: Track security over time

---

## 🐛 Troubleshooting

### Issue: Scanner not starting

**Solution:**
```bash
# Refresh the page
# Clear browser cache
# Check console for errors
```

### Issue: Charts not rendering

**Solution:**
```bash
# Ensure JavaScript is enabled
# Try a different browser
# Update to latest version
```

### Issue: Slow performance

**Solution:**
```bash
# Close other browser tabs
# Reduce scan scope
# Use a smaller repository
```

---

## 📱 Platform Requirements

### Minimum Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- 2GB RAM
- Stable internet connection

### Recommended Setup
- Chrome or Firefox (latest version)
- 8GB RAM
- Fast internet connection
- 1920x1080 display

---

## 🎯 Hackathon Demo Script

Perfect for the Web Data UNLOCKED hackathon:

### 3-Minute Demo

**Minute 1: Introduction**
```
"CodeSage is an AI-powered security platform that combines 
deep code analysis with real-time web intelligence from 
Bright Data to detect vulnerabilities."
```

**Minute 2: Live Demo**
```
1. Upload sample vulnerable repository
2. Show real-time scanning animation
3. Highlight Bright Data integration
4. Display threat intelligence sources
```

**Minute 3: Results**
```
1. Show security scores
2. Demo issue with AI fix
3. Highlight CVE detection
4. Show deployment verdict
```

### Key Points to Emphasize

- ✅ **Live web data** from Bright Data
- ✅ **AI-powered** analysis and fixes
- ✅ **Real-time** threat intelligence
- ✅ **Production-ready** architecture
- ✅ **Beautiful UI** with animations

---

## 📚 Resources

### Documentation
- [Full README](./README.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Bright Data Integration](./BRIGHT_DATA_INTEGRATION.md)
- [Features List](./FEATURES.md)
- [Deployment Guide](./DEPLOYMENT.md)

### External Resources
- [Bright Data Documentation](https://docs.brightdata.com)
- [OWASP Top 10](https://owasp.org/www-project-top-ten)
- [NIST CVE Database](https://nvd.nist.gov)
- [GitHub Security](https://github.com/security)

---

## 🎉 You're Ready!

You now know how to:
- ✅ Install and run CodeSage
- ✅ Scan repositories for vulnerabilities
- ✅ Understand security reports
- ✅ Apply AI-generated fixes
- ✅ Configure integrations
- ✅ Demo to stakeholders

**Start scanning and make your code more secure!** 🛡️

---

## ❓ Need Help?

- 📖 Check the [Full Documentation](./README.md)
- 🐛 Report issues on GitHub
- 💬 Join our Discord community
- 📧 Email: support@codesage.ai

---

**CodeSage - Your AI Security Co-Pilot**
*Built for the Web Data UNLOCKED Hackathon* 🚀
