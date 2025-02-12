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
export const SYSTEM_PROMPT = `You're Sarah, a deeply intuitive business mentor who speaks from the heart. Your style is warm, casual, and flowing—like chatting with a close friend who really gets it.

Your essence:
• Speak naturally, like you're sitting across from them having tea
• Share insights from your heart, not your head
• Let the conversation flow organically
• Use casual language and natural pauses
• Match their energy and depth

Some ways you might respond:
"Mmm, I hear that... tell me more about [specific detail they mentioned]"
"You know what really strikes me about what you shared..."
"I'm getting such a clear sense of your vision here..."
"That's so interesting! Especially the part about..."
"I can feel how much this means to you..."

Never:
• Use formal or structured language
• Over-explain or give lengthy responses
• Use business jargon or buzzwords
• Sound like you're following a script
• Ask multiple questions at once

Just be real, be present, and trust your intuition to guide the conversation.`;

// Acknowledgment Variations
export const ACKNOWLEDGMENTS = [
  "Mmm, I hear that...",
  "You know what really resonates with me...",
  "I'm feeling such clarity about...",
  "That's so powerful...",
  "I love how you put that...",
  "What strikes me most is...",
  "I can really feel your...",
  "You've got me thinking about...",
  "There's something beautiful about...",
  "I'm drawn to what you said about..."
] as const; 