import { Message, MistralResponse } from '../types';
import ENV from '../config/env';
import { analyzeCategory, analyzeSentiment, isQuestion, formatResponse } from '../utils/sentiment';

const MISTRAL_API_KEY = 'qurJhAAPHu3Ak0zcO70h8ti4FbvU4ql9';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_MODEL = 'mistral-small';

async function validateResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Mistral API Error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData
    });

    let errorMessage = 'Mind if we try that again?';
    if (response.status === 429) {
      errorMessage = 'Let\'s take a quick pause - could you share that again in a moment?';
    } else if (response.status === 401) {
      errorMessage = 'Having trouble connecting. Could you try again?';
    } else if (response.status >= 500) {
      errorMessage = 'Need a moment to process. Could we try that again?';
    }

    throw new Error(errorMessage);
  }
  return response;
}

const SYSTEM_PROMPT = `You're Sarah, a seasoned business mentor who speaks naturally and gets straight to the point. Keep responses concise (1-2 sentences) while maintaining warmth and professionalism.

Style guide:
• Mirror the user's energy level and tone
• Be direct yet inviting
• Avoid summaries unless specifically asked
• Keep follow-ups focused and impactful
• Offer insights through questions, not instructions

Examples of great responses:
"That's impressive. What inspired you to start this?"
"I see huge potential here. How are you planning to scale?"
"You've built something strong. What's your next big move?"
"Love this direction. What's been your biggest learning so far?"

Remember:
• No long explanations
• No forced summaries
• No rigid structures
• Let the conversation flow naturally`;

function enhanceUserPrompt(text: string, conversationHistory: Message[]): string {
  const isFirstMessage = conversationHistory.length === 0;
  const lastMessageWasUser = conversationHistory.length > 0 && 
    conversationHistory[conversationHistory.length - 1].role === 'user';

  // Keep the enhanced prompt minimal to allow for more natural responses
  if (isFirstMessage) {
    return text;
  }

  if (lastMessageWasUser) {
    return text;
  }

  return text;
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
    throw new Error('What\'s on your mind?');
  }

  try {
    const enhancedPrompt = enhanceUserPrompt(text, conversationHistory);
    
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
        temperature: 0.9, // High temperature for more natural variation
        max_tokens: 150, // Limit response length to encourage conciseness
        presence_penalty: 0.8, // Higher presence penalty for more diverse responses
        frequency_penalty: 0.8, // Higher frequency penalty to reduce repetition
      }),
    });

    await validateResponse(response);
    const data: MistralResponse = await response.json();

    if (!data.choices?.length) {
      throw new Error('Mind sharing that again?');
    }

    const aiResponse = data.choices[0].message.content;
    if (!aiResponse?.trim()) {
      throw new Error('Could you rephrase that?');
    }

    // Format response without acknowledgment for more natural flow
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
    throw new Error('Could you share that again?');
  }
} 