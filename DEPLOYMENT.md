# CodeSage Deployment Guide

This guide covers deploying CodeSage to production environments.

## 🚀 Quick Deploy

### Prerequisites
- Node.js 18 or higher
- pnpm package manager
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-org/codesage.git
cd codesage

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser to http://localhost:5173
```

## 📦 Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

The build output will be in the `dist/` directory.

## ☁️ Deployment Options

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Configure build settings:
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

### Netlify

1. Connect your Git repository
2. Configure build settings:
   - **Build Command**: `pnpm build`
   - **Publish Directory**: `dist`

### AWS S3 + CloudFront

```bash
# Build the project
pnpm build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t codesage .
docker run -p 80:80 codesage
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# API Keys (Add your actual keys here)
VITE_OPENAI_API_KEY=sk-your-openai-key
VITE_BRIGHT_DATA_API_KEY=bd-your-brightdata-key
VITE_GITHUB_TOKEN=ghp-your-github-token

# API Endpoints
VITE_API_URL=https://api.codesage.ai
VITE_WEBHOOK_URL=https://api.codesage.ai/webhooks

# Feature Flags
VITE_ENABLE_AUTO_FIX=true
VITE_ENABLE_THREAT_INTEL=true
```

## 🔧 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy CodeSage

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
        env:
          VITE_OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          VITE_BRIGHT_DATA_API_KEY: ${{ secrets.BRIGHT_DATA_API_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🎯 Performance Optimization

### Build Optimizations

The project is already configured with:
- Code splitting
- Tree shaking
- Asset optimization
- Lazy loading

### CDN Configuration

For static assets, configure your CDN to cache:
- JavaScript/CSS files: 1 year
- Images: 1 month
- HTML: No cache (or short cache with revalidation)

### Compression

Enable gzip/brotli compression on your server:

**Nginx:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
gzip_min_length 1000;
```

**CloudFront:**
Enable automatic compression in behaviors settings.

## 📊 Monitoring

### Error Tracking

Recommended integrations:
- Sentry for error tracking
- LogRocket for session replay
- DataDog for APM

### Analytics

Add analytics to track:
- Scan completions
- Issues detected
- Fix applications
- User engagement

## 🔒 Security Considerations

### API Key Management

**Never commit API keys to version control!**

Use environment variables or secret management services:
- AWS Secrets Manager
- HashiCorp Vault
- Vercel Environment Variables
- GitHub Secrets

### CSP Headers

Configure Content Security Policy:

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.openai.com https://api.brightdata.com;";
```

### HTTPS

Always use HTTPS in production:
- Let's Encrypt for free SSL certificates
- CloudFront supports automatic HTTPS
- Vercel/Netlify provide HTTPS by default

## 🔄 Rollback Strategy

### Quick Rollback

If deployment fails:

**Vercel:**
```bash
vercel rollback
```

**AWS S3:**
```bash
# Restore previous version
aws s3 sync s3://backup-bucket/ s3://production-bucket/
```

### Version Tagging

Tag releases for easy rollback:
```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

## 📈 Scaling

### Horizontal Scaling

For high traffic:
1. Deploy multiple instances behind load balancer
2. Use CDN for static assets
3. Implement edge caching

### Database Considerations

If adding a backend database:
- Use connection pooling
- Implement read replicas
- Add caching layer (Redis)
- Use CDN for API responses

## 🧪 Testing Before Deploy

```bash
# Run type checking
pnpm tsc --noEmit

# Run linting
pnpm lint

# Build and test
pnpm build
pnpm preview
```

## 📝 Deployment Checklist

Before deploying to production:

- [ ] All API keys configured in environment variables
- [ ] Build completes without errors
- [ ] All routes work correctly
- [ ] Analytics configured
- [ ] Error tracking enabled
- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] Compression enabled
- [ ] CDN configured for static assets
- [ ] Monitoring dashboards set up
- [ ] Rollback plan documented
- [ ] Team notified of deployment

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### Environment Variables Not Working

Make sure variables are prefixed with `VITE_` for Vite to expose them to the client.

### Monaco Editor Not Loading

Ensure Vite configuration includes Monaco workers:
```js
// Already configured in vite.config.ts
```

### Route 404 Errors

Configure your server to redirect all requests to `index.html`:

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Netlify:**
Create `_redirects` in `public/`:
```
/* /index.html 200
```

## 🎉 Post-Deployment

After successful deployment:
1. Test all critical features
2. Verify analytics tracking
3. Check error monitoring
4. Review performance metrics
5. Update documentation
6. Notify stakeholders

## 📞 Support

For deployment issues:
- Check GitHub Issues
- Review deployment logs
- Contact DevOps team
- Review this documentation

---

**Happy Deploying! 🚀**
