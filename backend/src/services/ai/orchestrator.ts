// backend/src/services/ai/orchestrator.ts
import { analyzeCodeFile } from './codeAnalyzer';

// USE THESE STABLE FREE MODELS (Higher success rate on OpenRouter)
const MODEL_CHAIN = [
  "google/gemini-2.0-flash-lite-001",
  "meta-llama/llama-3.3-70b-instruct:free",
  "mistralai/mistral-nemo"
];

export async function orchestrateAnalysis(fileName: string, content: string) {
  for (const model of MODEL_CHAIN) {
    try {
      console.log(`[Orchestrator] Attempting analysis with: ${model}`);
      return await analyzeCodeFile(fileName, content, model);
    } catch (error: any) {
      console.warn(`[Orchestrator] Model ${model} failed: ${error.message}`);
      // Continue to next model if this one fails
    }
  }

  // If we reach here, all models failed
  throw new Error("All cloud AI models currently unavailable.");
}