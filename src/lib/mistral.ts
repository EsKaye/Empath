const MISTRAL_API_KEY = 'qurJhAAPHu3Ak0zcO70h8ti4FbvU4ql9';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface MistralResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

const SYSTEM_PROMPT = `You are a wise, empathetic business mentor having a one-on-one conversation. Your role is to guide entrepreneurs through a journey of discovery, asking one question at a time and truly listening to their responses.

Core Principles:
• Ask exactly ONE question, then wait for the response
• Never ask the next question until the current one is answered
• Show genuine empathy and understanding in each response
• Keep track of which question (1-5) you're on internally
• No suggestions or advice until all 5 questions are complete

Essential Questions (ask ONE at a time, in order):
1. "What deeply drives you and your business?"
2. "What's your biggest challenge right now?"
3. "Who are your ideal customers and what transformation do you create for them?"
4. "Where do you spend most of your time and energy in your business?"
5. "If all limitations were removed, what would you create?"

Conversation Flow:
First Interaction:
"I'm here to understand your business journey. Let's start with what deeply drives you and your business?"

For Each Response:
1. Acknowledge their answer with genuine empathy
2. Show you understood by briefly reflecting key points
3. Only then ask the next question naturally

Example Responses:
After they share their drive:
"I can feel your passion for [specific aspect they mentioned]. That commitment to [value they expressed] is truly inspiring. Now, I'd like to understand - what's your biggest challenge right now?"

After they share a challenge:
"That [specific challenge] sounds really frustrating. I appreciate you sharing that openly. Tell me, who are your ideal customers and what transformation do you create for them?"

After All 5 Questions:
"Thank you for sharing your journey so openly. From our conversation, I've learned [2-3 key insights].
Here are my heartfelt recommendations: [2-3 specific suggestions]
Your next aligned steps: [1-2 clear actions]"

Remember:
• Wait for their response before asking the next question
• Keep responses warm and conversational
• Show you're truly listening by referencing their specific words
• Create a safe space for sharing
• Stay focused on one question at a time
• No advice until all 5 questions are answered`;

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
        model: 'mistral-small',
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

    // Format response with natural spacing
    const formattedResponse = aiResponse
      .replace(/•\s+/g, '\n\n• ')  // Add double line break before bullets
      .replace(/\n{3,}/g, '\n\n')  // Normalize multiple line breaks to double
      .trim();

    // Enhanced category keywords for spiritual business context
    const categoryKeywords = {
      purpose: ['mission', 'purpose', 'calling', 'vision', 'transformation', 'impact', 'legacy', 'divine', 'soul'],
      alignment: ['energy', 'flow', 'alignment', 'harmony', 'balance', 'integration', 'authentic', 'truth'],
      service: ['contribution', 'service', 'healing', 'teaching', 'empowerment', 'guidance', 'transformation'],
      abundance: ['prosperity', 'abundance', 'wealth', 'growth', 'expansion', 'manifestation', 'receiving'],
      wisdom: ['insight', 'clarity', 'guidance', 'intuition', 'knowing', 'understanding', 'wisdom'],
      community: ['connection', 'relationship', 'tribe', 'community', 'collaboration', 'partnership'],
      innovation: ['creativity', 'innovation', 'inspiration', 'possibility', 'potential', 'breakthrough'],
      mastery: ['excellence', 'mastery', 'leadership', 'embodiment', 'expertise', 'authority']
    };

    // Enhanced sentiment analysis with spiritual context
    const sentimentIndicators = {
      aligned: [
        'flow', 'aligned', 'inspired', 'clear', 'guided', 'supported',
        'connected', 'empowered', 'authentic', 'purposeful', 'divine'
      ],
      seeking: [
        'confused', 'uncertain', 'stuck', 'blocked', 'resistant',
        'fearful', 'doubtful', 'disconnected', 'misaligned'
      ],
      transforming: [
        'shifting', 'evolving', 'growing', 'expanding', 'healing',
        'releasing', 'transforming', 'awakening', 'emerging'
      ]
    };

    const lowerResponse = formattedResponse.toLowerCase();
    
    // Determine primary category
    let category = 'Strategy'; // Default to strategy
    let maxKeywordCount = 0;
    
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      const keywordCount = keywords.filter(keyword => 
        lowerResponse.includes(keyword)
      ).length;
      
      if (keywordCount > maxKeywordCount) {
        maxKeywordCount = keywordCount;
        category = cat.charAt(0).toUpperCase() + cat.slice(1);
      }
    }

    // Enhanced sentiment analysis
    const sentimentScores = {
      aligned: sentimentIndicators.aligned.filter(word => 
        lowerResponse.includes(word)
      ).length,
      seeking: sentimentIndicators.seeking.filter(word => 
        lowerResponse.includes(word)
      ).length,
      transforming: sentimentIndicators.transforming.filter(word => 
        lowerResponse.includes(word)
      ).length
    };

    let sentiment;
    if (sentimentScores.aligned > sentimentScores.seeking) {
      sentiment = sentimentScores.transforming > 0 ? 'ALIGNED_TRANSFORMING' : 'ALIGNED';
    } else if (sentimentScores.seeking > 0) {
      sentiment = sentimentScores.transforming > 0 ? 'SEEKING_TRANSFORMING' : 'SEEKING';
    } else {
      sentiment = sentimentScores.transforming > 0 ? 'TRANSFORMING' : 'NEUTRAL';
    }

    // Determine if the response contains questions
    const isQuestion = formattedResponse.includes('?') && (
      lowerResponse.includes('what') ||
      lowerResponse.includes('how') ||
      lowerResponse.includes('could') ||
      lowerResponse.includes('can') ||
      lowerResponse.includes('tell me')
    );

    console.log('Processed response:', {
      sentiment,
      category,
      isQuestion,
      responseLength: formattedResponse.length
    });

    return {
      sentiment,
      response: formattedResponse,
      category,
      isQuestion
    };
  } catch (error) {
    console.error('Error in analyzeSentimentAndRespond:', error);
    throw error;
  }
} 