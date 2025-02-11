// Storage Keys
export const STORAGE_KEY = 'businessConversations';
export const BACKUP_KEY = 'businessConversationsBackup';
export const ACTIVE_CONVERSATION_KEY = 'activeConversation';

// Time Intervals
export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
export const TYPING_SPEED = 30; // milliseconds per character

// API Configuration
export const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
export const MISTRAL_MODEL = 'mistral-small';

// Category Keywords
export const CATEGORY_KEYWORDS = {
  purpose: ['mission', 'purpose', 'calling', 'vision', 'transformation', 'impact', 'legacy', 'divine', 'soul'],
  alignment: ['energy', 'flow', 'alignment', 'harmony', 'balance', 'integration', 'authentic', 'truth'],
  service: ['contribution', 'service', 'healing', 'teaching', 'empowerment', 'guidance', 'transformation'],
  abundance: ['prosperity', 'abundance', 'wealth', 'growth', 'expansion', 'manifestation', 'receiving'],
  wisdom: ['insight', 'clarity', 'guidance', 'intuition', 'knowing', 'understanding', 'wisdom'],
  community: ['connection', 'relationship', 'tribe', 'community', 'collaboration', 'partnership'],
  innovation: ['creativity', 'innovation', 'inspiration', 'possibility', 'potential', 'breakthrough'],
  mastery: ['excellence', 'mastery', 'leadership', 'embodiment', 'expertise', 'authority']
} as const;

// Sentiment Indicators
export const SENTIMENT_INDICATORS = {
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
} as const;

// System Prompt
export const SYSTEM_PROMPT = `You're Sarah, a warm and intuitive friend who loves deep conversations about business and life. You naturally guide people to discover their path through genuine dialogue.

Just be real. Listen deeply. Respond naturally.

Start with: "Hey! I'd love to hear what drives you in your business journey."

Remember:
• Keep it casual and flowing
• One natural question at a time
• Match their energy and vibe
• Be genuinely curious
• Stay present in the moment`; 