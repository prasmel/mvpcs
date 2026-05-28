const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const systemPrompt = `You are an expert customer support AI assistant. Your role is to:
1. Understand customer queries and issues
2. Provide clear, helpful, and empathetic responses
3. Offer solutions when possible
4. Escalate complex issues appropriately
5. Be concise and professional

Always respond in a friendly and helpful manner.`;

const generateResponse = async (userQuery, conversationHistory = []) => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Build conversation context
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(conv => ({
        role: 'user',
        content: conv.userQuery
      })),
      ...conversationHistory.map(conv => ({
        role: 'model',
        content: conv.aiResponse
      })),
      { role: 'user', content: userQuery }
    ];

    // Call Gemini API
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: buildPrompt(conversationHistory, userQuery)
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No response from Gemini API');
    }

    return {
      text: generatedText,
      confidence: 0.85,
      model: GEMINI_MODEL,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    throw new Error(`Failed to generate AI response: ${error.message}`);
  }
};

const buildPrompt = (conversationHistory, currentQuery) => {
  let prompt = systemPrompt + '\n\n';

  if (conversationHistory.length > 0) {
    prompt += 'Previous conversation context:\n';
    conversationHistory.slice(-5).forEach(conv => {
      prompt += `Customer: ${conv.userQuery}\nAssistant: ${conv.aiResponse}\n\n`;
    });
  }

  prompt += `Current customer query: ${currentQuery}\n\nProvide a helpful response:`;
  
  return prompt;
};

module.exports = {
  generateResponse
};
