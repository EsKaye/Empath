import { Message, MistralResponse } from '../types';
import { MISTRAL_API_URL, MISTRAL_MODEL, SYSTEM_PROMPT } from '../constants';
import { analyzeCategory, analyzeSentiment, isQuestion, formatResponse } from './sentiment';
import ENV from '../config/env';

if (!ENV.MISTRAL_API_KEY) {
  throw new Error('MISTRAL_API_KEY is not defined in environment variables');
}

async function validateResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Mistral API Error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData
    });

    let errorMessage = 'Failed to get a response from Mistral.';
    if (response.status === 429) {
      errorMessage = 'Too many requests. Please try again in a moment.';
    } else if (response.status === 401) {
      errorMessage = 'Authentication error. Please check your API key.';
    } else if (response.status >= 500) {
      errorMessage = 'Mistral service is temporarily unavailable. Please try again later.';
    }

    throw new Error(errorMessage);
  }
  return response;
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
  if (!text.trim()) {
    throw new Error('Please provide some text to analyze.');
  }

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
        'Authorization': `Bearer ${ENV.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages,
        temperature: 0.8,
        max_tokens: 1024,
      }),
    });

    await validateResponse(response);
    const data: MistralResponse = await response.json();

    if (!data.choices?.length) {
      throw new Error('No response received from Mistral. Please try again.');
    }

    const aiResponse = data.choices[0].message.content;
    if (!aiResponse?.trim()) {
      throw new Error('Received empty response from Mistral. Please try again.');
    }

    const formattedResponse = formatResponse(aiResponse);
    
    return {
      sentiment: analyzeSentiment(formattedResponse),
      response: formattedResponse,
      category: analyzeCategory(formattedResponse),
      isQuestion: isQuestion(formattedResponse)
    };
  } catch (error) {
    console.error('Error in analyzeSentimentAndRespond:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
} 