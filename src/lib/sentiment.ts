import { pipeline, Pipeline } from '@xenova/transformers';

let sentimentAnalyzer: Pipeline | null = null;

export async function initSentimentAnalyzer() {
  if (!sentimentAnalyzer) {
    sentimentAnalyzer = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
  }
  return sentimentAnalyzer;
}

export async function analyzeSentiment(text: string): Promise<string> {
  const analyzer = await initSentimentAnalyzer();
  const result = await analyzer(text);
  return result[0].label;
}

export function generateEmpathyResponse(sentiment: string, text: string): string {
  const responses = {
    POSITIVE: [
      "I can sense your positive energy! That's wonderful to hear.",
      "It's great that you're feeling this way! Your positivity is inspiring.",
      "I'm really happy to hear about your positive experience.",
    ],
    NEGATIVE: [
      "I hear that you're going through a difficult time. That must be challenging.",
      "I'm sorry you're feeling this way. It's okay to have these feelings.",
      "Thank you for sharing this with me. It takes courage to express these feelings.",
    ],
  };

  const responseArray = responses[sentiment as keyof typeof responses] || responses.POSITIVE;
  const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];
  return randomResponse;
} 