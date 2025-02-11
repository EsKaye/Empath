export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface BusinessMetrics {
  estimatedRoi?: string;
  implementationTime?: string;
  difficulty?: 'Low' | 'Medium' | 'High';
  priority?: 'Low' | 'Medium' | 'High';
}

export interface BusinessPrompt {
  id: string;
  text: string;
  sentiment: string;
  response: string;
  category: string;
  createdAt: Date;
  isQuestion: boolean;
  messages: Message[];
  metrics?: BusinessMetrics;
}

export interface MistralResponse {
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

export type SentimentType = 
  | 'ALIGNED'
  | 'ALIGNED_TRANSFORMING'
  | 'SEEKING'
  | 'SEEKING_TRANSFORMING'
  | 'TRANSFORMING'
  | 'NEUTRAL';

export type CategoryType =
  | 'purpose'
  | 'alignment'
  | 'service'
  | 'abundance'
  | 'wisdom'
  | 'community'
  | 'innovation'
  | 'mastery'; 