// backend/src/services/ai/orchestrator.ts
import { analyzeCodeFile } from './codeAnalyzer';
import axios from 'axios';

// Order: High-performance Cloud -> Reliable/Cheaper Cloud -> Local Fallback
const MODEL_CHAIN = [
  "google/gemini-2.0-flash-exp:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "mistralai/mistral-nemo:free"
];

export async function orchestrateAnalysis(fileName: string, content: string) {
  // 1. Try OpenRouter Cloud models
  for (const model of MODEL_CHAIN) {
    try {
      console.log(`[Orchestrator] Attempting analysis with: ${model}`);
      return await analyzeCodeFile(fileName, content, model);
    } catch (error: any) {
      console.warn(`[Orchestrator] Model ${model} failed: ${error.message}. Switching...`);
    }
  }

  // 2. Final Fallback: Local Gemma 2B via Ollama
  console.log("[Orchestrator] All cloud models failed. Falling back to local Gemma.");
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'gemma:2b',
      prompt: `Analyze this code for security vulnerabilities. Return ONLY JSON. File: ${fileName}. Content: ${content}`,
      stream: false
    });
    
    // Clean and parse local output
    const raw = response.data.response.replace(/```json|```/g, '');
    return JSON.parse(raw).issues || [];
  } catch (localError) {
    console.error("[Orchestrator] Local fallback also failed:", localError);
    throw new Error("Analysis failed across all available models.");
  }
}