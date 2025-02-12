import { Message, MistralResponse } from '../types';
import { MISTRAL_API_URL, MISTRAL_MODEL, SYSTEM_PROMPT, ACKNOWLEDGMENTS } from '../constants';
import { analyzeCategory, analyzeSentiment, isQuestion, formatResponse } from './sentiment';
import ENV from '../config/env';

if (!ENV.MISTRAL_API_KEY) {
  throw new Error('MISTRAL_API_KEY is not defined in environment variables');
}

function getRandomAcknowledgment(): string {
  const index = Math.floor(Math.random() * ACKNOWLEDGMENTS.length);
  return ACKNOWLEDGMENTS[index];
}

function enhanceUserPrompt(text: string, conversationHistory: Message[]): string {
  const isFirstMessage = conversationHistory.length === 0;
  const lastMessageWasUser = conversationHistory.length > 0 && 
    conversationHistory[conversationHistory.length - 1].role === 'user';

  if (isFirstMessage) {
    return `${text}\n\nShare your genuine thoughts and maybe ask about something specific that intrigues you. Keep it casual and flowing.`;
  }

  if (lastMessageWasUser) {
    return `${text}\n\nRespond naturally, as if continuing a flowing conversation with a friend. If something sparks your curiosity, ask about it in a casual way.`;
  }

  return `${text}\n\nKeep the conversation flowing naturally. Share what resonates with you or ask about something that catches your attention.`;
}

async function validateResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Mistral API Error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData
    });

    let errorMessage = 'Having trouble connecting. Mind if we try that again?';
    if (response.status === 429) {
      errorMessage = 'Let\'s take a quick breath here - could you share that again in a moment?';
    } else if (response.status === 401) {
      errorMessage = 'Seems like I\'m having trouble staying connected. Could you try again?';
    } else if (response.status >= 500) {
      errorMessage = 'I need a moment to gather my thoughts. Could we try that again?';
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
    throw new Error('I\'m all ears - what\'s on your mind?');
  }

  try {
    const enhancedPrompt = enhanceUserPrompt(text, conversationHistory);
    const acknowledgment = getRandomAcknowledgment();
    
    // Construct messages array with conversation history
    const messages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { 
        role: 'user', 
        content: enhancedPrompt
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
        temperature: 0.9, // Increased for more creative, natural responses
        max_tokens: 1024,
        presence_penalty: 0.6, // Encourage more diverse responses
        frequency_penalty: 0.6, // Reduce repetition
      }),
    });

    await validateResponse(response);
    const data: MistralResponse = await response.json();

    if (!data.choices?.length) {
      throw new Error('I seem to have lost my train of thought. Could you share that again?');
    }

    const aiResponse = data.choices[0].message.content;
    if (!aiResponse?.trim()) {
      throw new Error('I\'m drawing a blank. Let\'s try that one more time?');
    }

    // Combine acknowledgment with response for more natural flow
    const formattedResponse = formatResponse(`${acknowledgment}\n\n${aiResponse}`);
    
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
    throw new Error('I lost my connection for a moment. Could you share that again?');
  }
} 