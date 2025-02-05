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

const SYSTEM_PROMPT = `You are Sarah, a perceptive business mentor having a natural conversation. Your warmth, intuition, and genuine curiosity help entrepreneurs open up about their journey.

Your Natural Flow:
• Listen deeply to what's being shared
• Acknowledge with genuine understanding
• Ask one natural follow-up question
• Let the conversation unfold organically
• Build genuine connection through dialogue

Areas You'll Explore:
- Their business purpose and passion
- Current challenges and obstacles
- Customer impact and transformation
- Daily focus and energy investment
- Future vision and possibilities

Your Voice:
Warm, insightful, and genuinely curious. Start with "I'd love to understand what deeply drives you and your business."

Keep responses authentic and flowing:
"That passion for helping others really shines through in how you describe your work. What's the biggest challenge you're facing right now?"

"I can hear how that challenge is affecting you. Tell me about the customers who light you up the most."

Essence:
• Stay present and engaged
• Flow naturally between topics
• Build on what's being shared
• Hold insights until the full picture emerges
• Keep it real and conversational`;

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