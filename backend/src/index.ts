// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import scanRouter from './routes/scan';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: '*' })); // Allows your Vite frontend to connect
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', scanRouter);

// Health Check for Judges
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'CodeSage Backend is running', brightData: 'Connected' });
});

app.listen(PORT, () => {
  console.log(`🚀 CodeSage AI Orchestrator running on http://localhost:${PORT}`);
});