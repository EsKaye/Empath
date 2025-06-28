/**
 * Application Constants
 * 
 * This file contains all application-wide constants, configuration values,
 * and static data used throughout the application.
 */

import { APP_CONFIG } from '../config/env';

/**
 * Storage Keys
 * Used for localStorage and IndexedDB operations
 */
export const STORAGE_KEYS = {
  CONVERSATIONS: 'empath_conversations',
  CONVERSATIONS_BACKUP: 'empath_conversations_backup',
  ACTIVE_CONVERSATION: 'empath_active_conversation',
  USER_PREFERENCES: 'empath_user_preferences',
  THEME: 'empath_theme',
} as const;

/**
 * API Configuration
 */
export const API_CONFIG = {
  MISTRAL_BASE_URL: 'https://api.mistral.ai/v1/chat/completions',
  MISTRAL_MODEL: 'mistral-small',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

/**
 * Sentiment Types
 * Defines the different sentiment states for conversation analysis
 */
export const SENTIMENT_TYPES = {
  ALIGNED: 'ALIGNED',
  ALIGNED_TRANSFORMING: 'ALIGNED_TRANSFORMING',
  SEEKING: 'SEEKING',
  SEEKING_TRANSFORMING: 'SEEKING_TRANSFORMING',
  TRANSFORMING: 'TRANSFORMING',
  NEUTRAL: 'NEUTRAL',
} as const;

/**
 * Category Types
 * Defines the different categories for conversation classification
 */
export const CATEGORY_TYPES = {
  PURPOSE: 'purpose',
  ALIGNMENT: 'alignment',
  SERVICE: 'service',
  ABUNDANCE: 'abundance',
  WISDOM: 'wisdom',
  COMMUNITY: 'community',
  INNOVATION: 'innovation',
  MASTERY: 'mastery',
} as const;

/**
 * Sentiment Configuration
 * Maps sentiment types to their display properties
 */
export const SENTIMENT_CONFIG = {
  [SENTIMENT_TYPES.ALIGNED]: {
    label: 'Soul Aligned',
    color: 'bg-purple-50 text-purple-700',
    icon: 'Heart',
    description: 'Fully aligned with your soul purpose',
  },
  [SENTIMENT_TYPES.ALIGNED_TRANSFORMING]: {
    label: 'Divine Flow',
    color: 'bg-indigo-50 text-indigo-700',
    icon: 'Target',
    description: 'Flowing with divine guidance',
  },
  [SENTIMENT_TYPES.SEEKING]: {
    label: 'Seeking Clarity',
    color: 'bg-amber-50 text-amber-700',
    icon: 'Lightbulb',
    description: 'Searching for deeper understanding',
  },
  [SENTIMENT_TYPES.SEEKING_TRANSFORMING]: {
    label: 'Sacred Shift',
    color: 'bg-blue-50 text-blue-700',
    icon: 'ArrowUpRight',
    description: 'Undergoing spiritual transformation',
  },
  [SENTIMENT_TYPES.TRANSFORMING]: {
    label: 'Transforming',
    color: 'bg-green-50 text-green-700',
    icon: 'CheckCircle2',
    description: 'In active transformation',
  },
  [SENTIMENT_TYPES.NEUTRAL]: {
    label: 'Journey Begins',
    color: 'bg-purple-50 text-purple-700',
    icon: 'MessageSquare',
    description: 'Beginning your spiritual journey',
  },
} as const;

/**
 * Category Configuration
 * Maps category types to their display properties
 */
export const CATEGORY_CONFIG = {
  [CATEGORY_TYPES.PURPOSE]: {
    label: 'Soul Purpose',
    icon: 'Heart',
    color: 'text-purple-500',
    description: 'Discovering your life mission',
  },
  [CATEGORY_TYPES.ALIGNMENT]: {
    label: 'Energy Alignment',
    icon: 'Target',
    color: 'text-indigo-500',
    description: 'Aligning with your true self',
  },
  [CATEGORY_TYPES.SERVICE]: {
    label: 'Divine Service',
    icon: 'MessageSquare',
    color: 'text-blue-500',
    description: 'Serving others with love',
  },
  [CATEGORY_TYPES.ABUNDANCE]: {
    label: 'Sacred Abundance',
    icon: 'DollarSign',
    color: 'text-green-500',
    description: 'Manifesting prosperity',
  },
  [CATEGORY_TYPES.WISDOM]: {
    label: 'Inner Wisdom',
    icon: 'Lightbulb',
    color: 'text-amber-500',
    description: 'Accessing inner knowledge',
  },
  [CATEGORY_TYPES.COMMUNITY]: {
    label: 'Soul Tribe',
    icon: 'MessageSquare',
    color: 'text-pink-500',
    description: 'Connecting with your tribe',
  },
  [CATEGORY_TYPES.INNOVATION]: {
    label: 'Creative Flow',
    icon: 'Target',
    color: 'text-cyan-500',
    description: 'Expressing creativity',
  },
  [CATEGORY_TYPES.MASTERY]: {
    label: 'Spiritual Mastery',
    icon: 'CheckCircle2',
    color: 'text-violet-500',
    description: 'Achieving spiritual growth',
  },
} as const;

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  TYPING_SPEED: 30,
  SCROLL_BEHAVIOR: 'smooth' as ScrollBehavior,
  MAX_MESSAGE_LENGTH: APP_CONFIG.MAX_MESSAGE_LENGTH,
  AUTO_SAVE_INTERVAL: APP_CONFIG.AUTO_SAVE_INTERVAL,
  MAX_CONVERSATION_HISTORY: APP_CONFIG.MAX_CONVERSATION_HISTORY,
} as const;

/**
 * Error Messages
 * Standardized error messages used throughout the application
 */
export const ERROR_MESSAGES = {
  API_ERROR: 'Mind if we try that again?',
  NETWORK_ERROR: 'Having trouble connecting. Could you try again?',
  RATE_LIMIT: 'Let\'s take a quick pause - could you share that again in a moment?',
  SERVER_ERROR: 'Need a moment to process. Could we try that again?',
  VALIDATION_ERROR: 'Could you rephrase that?',
  STORAGE_ERROR: 'Having trouble saving your conversation.',
  UNKNOWN_ERROR: 'Something unexpected happened. Please try again.',
} as const;

/**
 * Success Messages
 * Standardized success messages used throughout the application
 */
export const SUCCESS_MESSAGES = {
  CONVERSATION_SAVED: 'Your journey has been saved.',
  CONVERSATION_EXPORTED: 'Your wisdom has been shared.',
  CONVERSATION_IMPORTED: 'Your journey has been restored.',
  CONVERSATION_RESET: 'A new journey begins.',
} as const;

/**
 * Accessibility Labels
 * ARIA labels and descriptions for screen readers
 */
export const ACCESSIBILITY_LABELS = {
  MAIN_CONTAINER: 'EmPath conversation interface',
  MESSAGE_INPUT: 'Share your thoughts and feelings',
  SEND_BUTTON: 'Send message',
  NEW_CONVERSATION: 'Start a new conversation',
  EXPORT_CONVERSATIONS: 'Export conversation history',
  IMPORT_CONVERSATIONS: 'Import conversation history',
  RESET_ALL: 'Reset all conversations',
  PANEL_TOGGLE: 'Toggle action panel',
} as const;

/**
 * Theme Configuration
 */
export const THEME_CONFIG = {
  LIGHT: {
    name: 'light',
    label: 'Light',
    icon: 'Sun',
  },
  DARK: {
    name: 'dark',
    label: 'Dark',
    icon: 'Moon',
  },
  SYSTEM: {
    name: 'system',
    label: 'System',
    icon: 'Monitor',
  },
} as const; 