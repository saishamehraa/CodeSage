// backend/src/index.ts
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import scanRouter from './routes/scan';

// NEW: Import the Cognee memory engine
import { getHistoricalDrift } from './services/cognee/memoryEngine';

// 3. Debugging
console.log("✅ Dotenv loaded. OpenRouter key found:", !!process.env.OPENROUTER_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Mount API Routes FIRST
app.use('/api', scanRouter);

// NEW: Cognee Memory API Route
// This powers the "View All Previous Analysis" button on the dashboard
app.get('/api/memory/history', async (req, res) => {
  const { repoUrl } = req.query;
  if (!repoUrl) {
    return res.status(400).json({ error: "Repository URL is required to fetch memory." });
  }

  const historicalInsights = await getHistoricalDrift(repoUrl as string);
  res.json({ success: true, insights: historicalInsights });
});

// Health Check for Judges/Ping services
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'CodeSage Unified App is running' });
});

// 2. Serve the React Frontend (STATIC FILES)
// Assuming the backend is compiled to backend/dist/index.js
// and the frontend is compiled to the root /dist folder.
const frontendDistPath = path.join(__dirname, '../../dist');
app.use(express.static(frontendDistPath));

// 3. Catch-all Route for React Router
// MUST be the last route. If it's not an API route, give them the React app.
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 CodeSage AI Orchestrator running on port ${PORT}`);
});