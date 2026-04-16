import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
export const TEST_ANTIROPIC_CONFIG = {
    apiKey: process.env.TEST_ANTHROPIC_API_KEY || 'mock-key-for-testing',
    model: process.env.TEST_ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
    maxTokens: 500,
    temperature: 0.1
};
//# sourceMappingURL=test-config.js.map