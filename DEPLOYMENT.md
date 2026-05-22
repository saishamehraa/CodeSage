# ☁️ Deployment Guide

CodeSage uses a **Unified Architecture**. The Express.js backend handles the API and background AI workers, while also serving the compiled React/Vite frontend as static files. 

This means you only need to deploy **one web service** exposing a single port.

## 🚀 Deploying to Render, Railway, or Heroku

Because the project is self-contained, deploying to modern PaaS providers is fully automated via our `package.json` scripts.

### 1. Platform Configuration
Connect your GitHub repository to your host (e.g., Render.com as a "Web Service"). Use the following settings:

* **Environment:** `Node`
* **Build Command:** `npm run build`
  *(This custom script installs root dependencies, builds the Vite frontend into `/dist`, then navigates into `/backend`, installs dependencies, and compiles TypeScript into `/backend/dist/index.js`)*
* **Start Command:** `npm run start`
  *(This starts the compiled Node.js server which mounts the API and serves the frontend).*

### 2. Environment Variables
You must supply the following environment variables in your deployment dashboard:

```env
# Supabase
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# External APIs
OPENROUTER_API_KEY=sk-or-v1-...
BRIGHTDATA_API_KEY=your_bright_data_key

# Node Environment
NODE_ENV=production