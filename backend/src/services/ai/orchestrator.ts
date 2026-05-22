// backend/src/services/ai/orchestrator.ts
import { analyzeCodeFile } from './codeAnalyzer';

// USE THESE STABLE FREE MODELS (Higher success rate on OpenRouter)
const MODEL_CHAIN = [
  "gryphe/llama-3-8b-instruct:free",
  "nousresearch/hermes-3-llama-3.1-8b:free",
  "meta-llama/llama-3.1-8b-instruct:free"
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