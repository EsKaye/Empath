import { CATEGORY_KEYWORDS, SENTIMENT_INDICATORS } from '../constants';
import { CategoryType, SentimentType } from '../types';

export function analyzeCategory(text: string): CategoryType {
  const lowerText = text.toLowerCase();
  let maxKeywordCount = 0;
  let dominantCategory: CategoryType = 'purpose'; // Default category
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const keywordCount = keywords.filter(keyword => 
      lowerText.includes(keyword.toLowerCase())
    ).length;
    
    if (keywordCount > maxKeywordCount) {
      maxKeywordCount = keywordCount;
      dominantCategory = category as CategoryType;
    }
  }
  
  return dominantCategory;
}

export function analyzeSentiment(text: string): SentimentType {
  const lowerText = text.toLowerCase();
  
  const sentimentScores = {
    aligned: SENTIMENT_INDICATORS.aligned.filter(word => 
      lowerText.includes(word)
    ).length,
    seeking: SENTIMENT_INDICATORS.seeking.filter(word => 
      lowerText.includes(word)
    ).length,
    transforming: SENTIMENT_INDICATORS.transforming.filter(word => 
      lowerText.includes(word)
    ).length
  };

  if (sentimentScores.aligned > sentimentScores.seeking) {
    return sentimentScores.transforming > 0 ? 'ALIGNED_TRANSFORMING' : 'ALIGNED';
  } else if (sentimentScores.seeking > 0) {
    return sentimentScores.transforming > 0 ? 'SEEKING_TRANSFORMING' : 'SEEKING';
  } else {
    return sentimentScores.transforming > 0 ? 'TRANSFORMING' : 'NEUTRAL';
  }
}

export function isQuestion(text: string): boolean {
  const lowerText = text.toLowerCase();
  return text.includes('?') && (
    lowerText.includes('what') ||
    lowerText.includes('how') ||
    lowerText.includes('could') ||
    lowerText.includes('can') ||
    lowerText.includes('tell me')
  );
}

export function formatResponse(text: string): string {
  return text
    .replace(/•\s+/g, '\n\n• ')  // Add double line break before bullets
    .replace(/\n{3,}/g, '\n\n')  // Normalize multiple line breaks to double
    .trim();
} 