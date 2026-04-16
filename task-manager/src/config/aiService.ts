import axios from 'axios';
import { ANTHROPIC_CONFIG } from './config.js';

interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AiResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class AiService {
  private config = ANTHROPIC_CONFIG;
  private baseUrl = 'https://api.anthropic.com/v1/messages';

  constructor() {
    // Double-check key exists
    if (!this.config.apiKey) {
      throw new Error('Ai API key not configured');
    }
  }

  async generateCompletion(
    messages: AiMessage[],
    systemPrompt?: string
  ): Promise<string> {
    try {
      const response = await axios.post<AiResponse>(
        this.baseUrl,
        {
          model: this.config.model,
          messages,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          ...(systemPrompt && { system: systemPrompt })
        },
        {
          headers: {
            'x-api-key': this.config.apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          }
        }
      );

      // Log token usage for cost tracking
      console.log('Token usage:', response.data.usage);

      return response.data.content[0].text;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Ai API error:', error.response?.data || error.message);
        
        // Handle rate limits
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please wait and retry.');
        }
        
        // Handle auth errors
        if (error.response?.status === 401) {
          throw new Error('Invalid API key. Check your ANTHROPIC_API_KEY environment variable.');
        }
      }
      throw error;
    }
  }

  // Helper method for single prompt
  async generateFromPrompt(prompt: string): Promise<string> {
    return this.generateCompletion([{ role: 'user', content: prompt }]);
  }
}