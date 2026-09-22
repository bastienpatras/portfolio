// Mock API client for text classification demo

export interface ClassificationRequest {
  text: string;
  model?: string;
  return_probabilities?: boolean;
}

export interface ClassificationResponse {
  label: string;
  confidence: number;
  probabilities?: Record<string, number>;
}

// Mock implementation - replace with real API calls
export async function classifyText(
  request: ClassificationRequest
): Promise<ClassificationResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock sentiment analysis
  const text = request.text.toLowerCase();
  const positiveWords = ['great', 'amazing', 'excellent', 'good', 'love'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'poor'];

  const positiveScore = positiveWords.reduce(
    (score, word) => score + (text.includes(word) ? 1 : 0),
    0
  );
  const negativeScore = negativeWords.reduce(
    (score, word) => score + (text.includes(word) ? 1 : 0),
    0
  );

  const label =
    positiveScore > negativeScore
      ? 'positive'
      : negativeScore > positiveScore
      ? 'negative'
      : 'neutral';

  const total = positiveScore + negativeScore + 1;
  const probabilities = {
    positive: positiveScore / total,
    negative: negativeScore / total,
    neutral: 1 / total,
  };

  const confidence = Math.max(...Object.values(probabilities));

  return {
    label,
    confidence: parseFloat(confidence.toFixed(3)),
    ...(request.return_probabilities && {
      probabilities: Object.fromEntries(
        Object.entries(probabilities).map(([k, v]) => [k, parseFloat(v.toFixed(3))])
      ),
    }),
  };
}
