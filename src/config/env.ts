/**
 * Environment Configuration
 * 
 * This file provides type-safe access to environment variables
 * with proper validation and fallback values.
 */

interface EnvironmentConfig {
  // API Configuration
  MISTRAL_API_KEY: string;
  
  // Application Configuration
  APP_TITLE: string;
  APP_DESCRIPTION: string;
  APP_VERSION: string;
  
  // Development Configuration
  DEV_MODE: boolean;
  API_TIMEOUT: number;
  
  // Feature Flags
  ENABLE_ANALYTICS: boolean;
  ENABLE_DEBUG_MODE: boolean;
}

/**
 * Validates and returns environment configuration
 * @throws Error if required environment variables are missing
 */
function getEnvironmentConfig(): EnvironmentConfig {
  const config: EnvironmentConfig = {
    // API Configuration
    MISTRAL_API_KEY: import.meta.env.VITE_MISTRAL_API_KEY || '',
    
    // Application Configuration
    APP_TITLE: import.meta.env.VITE_APP_TITLE || 'EmPath',
    APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'AI-Powered Empathy Companion',
    APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    
    // Development Configuration
    DEV_MODE: import.meta.env.DEV || false,
    API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
    
    // Feature Flags
    ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    ENABLE_DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
  };

  // Validate required environment variables
  const requiredVars: (keyof EnvironmentConfig)[] = ['MISTRAL_API_KEY'];
  const missingVars = requiredVars.filter(key => !config[key]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  return config;
}

/**
 * Environment configuration instance
 * Provides type-safe access to all environment variables
 */
const ENV = getEnvironmentConfig();

export default ENV;

/**
 * Environment validation utilities
 */
export const isDevelopment = ENV.DEV_MODE;
export const isProduction = !ENV.DEV_MODE;
export const isDebugMode = ENV.ENABLE_DEBUG_MODE;

/**
 * API configuration constants
 */
export const API_CONFIG = {
  TIMEOUT: ENV.API_TIMEOUT,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

/**
 * Application configuration constants
 */
export const APP_CONFIG = {
  TITLE: ENV.APP_TITLE,
  DESCRIPTION: ENV.APP_DESCRIPTION,
  VERSION: ENV.APP_VERSION,
  MAX_MESSAGE_LENGTH: 1000,
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
  MAX_CONVERSATION_HISTORY: 100,
} as const; 