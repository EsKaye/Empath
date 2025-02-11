import { Message, MistralResponse } from '../types';
import { MISTRAL_API_URL, MISTRAL_MODEL, SYSTEM_PROMPT } from '../constants';
import { analyzeCategory, analyzeSentiment, isQuestion, formatResponse } from './sentiment';

const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;

if (!MISTRAL_API_KEY) {
  throw new Error('MISTRAL_API_KEY is not defined in environment variables');
}

export async function analyzeSentimentAndRespond(
  text: string,
  conversationHistory: Message[] = []
): Promise<{
  sentiment: string;
  response: string;
  category: string;
  isQuestion: boolean;
}> {
  try {
    console.log('Making API request to Mistral with conversation history...');
    
    // Construct messages array with conversation history
    const messages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { 
        role: 'user', 
        content: `${text}\n\nProvide guidance and either ask relevant follow-up questions or suggest specific next steps.`
      }
    ];

    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages,
        temperature: 0.8, // Slightly increased for more natural responses
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Mistral API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data: MistralResponse = await response.json();
    console.log('Received response from Mistral:', data);

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response choices returned from API');
    }

    const aiResponse = data.choices[0].message.content;
    const formattedResponse = formatResponse(aiResponse);
    
    return {
      sentiment: analyzeSentiment(formattedResponse),
      response: formattedResponse,
      category: analyzeCategory(formattedResponse),
      isQuestion: isQuestion(formattedResponse)
    };
  } catch (error) {
    console.error('Error in analyzeSentimentAndRespond:', error);
    throw error;
  }
} 