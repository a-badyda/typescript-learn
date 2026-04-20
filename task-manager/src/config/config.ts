import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env file
const systemPrompt : string = fs.readFileSync(path.resolve(process.cwd(),  'resources/systemPrompt.txt'), 'utf-8'); 
dotenv.config({ path: path.resolve(process.cwd(),  '.env')});

export const ANTHROPIC_CONFIG = {
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
  maxTokens: parseInt(process.env.MAX_TOKENS || '4096'),
  temperature: parseFloat(process.env.TEMPERATURE || '0.5'),
  systemPrompt : systemPrompt
};

// Validate required variables
if (!ANTHROPIC_CONFIG.apiKey) {
  throw new Error('ANTHROPIC_API_KEY not found in environment variables');
}
