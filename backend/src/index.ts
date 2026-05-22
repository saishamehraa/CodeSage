// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import scanRouter from './routes/scan';

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Mount API Routes FIRST
app.use('/api', scanRouter);

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