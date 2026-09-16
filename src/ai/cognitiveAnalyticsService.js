/**
 * Cognitive Analytics Service
 * 
 * Analyzes multi-session performance patterns, reminder adherence, and routine consistency.
 * 
 * ETHICAL GUARDRAILS:
 * Strictly avoids diagnostic assertions (e.g. "Dementia detected", "Alzheimer's worsening").
 * Strictly utilizes non-stigmatizing, descriptive language:
 * - "Stable activity"
 * - "Improving activity trend"
 * - "Activity trend changed"
 * - "Needs attention"
 */

export function analyzeSessionTrends(sessions = []) {
  if (!sessions || sessions.length === 0) {
    return {
      status: 'Stable activity',
      trendPercentage: 0,
      description: 'Baseline cognitive engagement is being established.',
      flagRequired: false
    };
  }

  // Calculate moving average of recent 3 vs previous 3
  const recent = sessions.slice(0, 3);
  const previous = sessions.slice(3, 6);

  const avgRecent = recent.reduce((sum, s) => sum + (s.accuracy || s.memory || 80), 0) / (recent.length || 1);
  const avgPrev = previous.length > 0 
    ? previous.reduce((sum, s) => sum + (s.accuracy || s.memory || 80), 0) / previous.length 
    : avgRecent;

  const diff = Math.round(avgRecent - avgPrev);

  if (diff >= 5) {
    return {
      status: 'Improving activity trend',
      trendPercentage: diff,
      description: `Cognitive activity metrics have shown an upward trend (+${diff}%) over recent sessions. Engagement is robust.`,
      flagRequired: false,
      color: 'text-green-600 bg-green-50 border-green-200'
    };
  } else if (diff <= -8) {
    return {
      status: 'Activity trend changed',
      trendPercentage: diff,
      description: `Average activity scores decreased by ${Math.abs(diff)}% across recent sessions. Game difficulty was adapted to ensure low fatigue.`,
      flagRequired: true,
      recommendation: 'Consider scheduling cognitive games during morning hours when alertness is peak, or encourage a 5-minute breathing break.',
      color: 'text-amber-700 bg-amber-50 border-amber-200'
    };
  }

  return {
    status: 'Stable activity',
    trendPercentage: diff,
    description: 'Activity engagement and response consistency remain steady within comfortable baseline expectations.',
    flagRequired: false,
    color: 'text-blue-700 bg-blue-50 border-blue-200'
  };
}

export function computeAdherence(reminders = []) {
  if (!reminders || reminders.length === 0) return { completed: 0, total: 0, rate: 100 };
  const completed = reminders.filter(r => r.completed).length;
  const total = reminders.length;
  const rate = Math.round((completed / total) * 100);
  return { completed, total, rate };
}
