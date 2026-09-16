/**
 * SmarTCARE AI Personalization Engine
 * 
 * Implements deterministic scoring and adaptive cognitive difficulty leveling.
 * Provides transparent, explainable recommendations without medical diagnosis claims.
 * 
 * Formula:
 * performanceScore = (accuracy * 0.45) + (speedScore * 0.20) + (consistencyScore * 0.20) + (completionScore * 0.15)
 */

export const DIFFICULTY_LEVELS = ['Beginner', 'Easy', 'Moderate', 'Advanced'];

export function calculatePerformanceScore({
  accuracy = 80,
  completionTime = 40,
  expectedTime = 60,
  consistency = 85,
  completed = true
}) {
  // Speed score: 100 is fast, lower is slower, clamped 20 - 100
  const speedRatio = Math.max(0.2, Math.min(2.0, expectedTime / (completionTime || expectedTime)));
  const speedScore = Math.min(100, Math.round(speedRatio * 50));
  const consistencyScore = Math.min(100, Math.max(0, consistency));
  const completionScore = completed ? 100 : 50;

  const score = Math.round(
    (accuracy * 0.45) +
    (speedScore * 0.20) +
    (consistencyScore * 0.20) +
    (completionScore * 0.15)
  );

  return {
    score: Math.min(100, Math.max(10, score)),
    speedScore,
    accuracy,
    consistencyScore,
    completionScore
  };
}

export function adaptDifficulty(currentDifficulty = 'Moderate', recentPerformance = {}) {
  const { accuracy = 80, mistakes = 0, hintsUsed = 0, speedScore = 70 } = recentPerformance;
  const currentIndex = DIFFICULTY_LEVELS.indexOf(currentDifficulty);
  const safeIndex = currentIndex === -1 ? 2 : currentIndex; // default Moderate

  let targetIndex = safeIndex;
  let reason = '';
  let trend = 'Stable activity';

  if (accuracy >= 85 && speedScore >= 70 && mistakes <= 2) {
    if (safeIndex < DIFFICULTY_LEVELS.length - 1) {
      targetIndex = safeIndex + 1;
      reason = `Accuracy was ${accuracy}% with high speed. SmarTCARE stepped up the challenge to ${DIFFICULTY_LEVELS[targetIndex]} to support active neuroplastic engagement.`;
      trend = 'Improving activity trend';
    } else {
      reason = `Peak mastery at ${currentDifficulty} level! Difficulty maintained with rich varied cultural patterns.`;
      trend = 'Improving activity trend';
    }
  } else if (accuracy <= 55 || mistakes >= 4 || hintsUsed >= 3) {
    if (safeIndex > 0) {
      targetIndex = safeIndex - 1;
      reason = `To keep activities relaxing and reduce cognitive fatigue, SmarTCARE adapted the challenge to ${DIFFICULTY_LEVELS[targetIndex]}.`;
      trend = 'Activity changed';
    } else {
      reason = `Gentle mode maintained. Hints and visual audio cues will be generously offered.`;
      trend = 'Needs attention';
    }
  } else {
    reason = `Performance is balanced and comfortable (${accuracy}% accuracy). Current ${currentDifficulty} challenge is maintained.`;
    trend = 'Stable activity';
  }

  return {
    nextDifficulty: DIFFICULTY_LEVELS[targetIndex],
    changed: targetIndex !== safeIndex,
    direction: targetIndex > safeIndex ? 'increase' : targetIndex < safeIndex ? 'decrease' : 'maintain',
    explanation: reason,
    trend
  };
}

export function explainActivitySelection(activityType, currentLevel, lastStats) {
  return {
    activity: activityType,
    level: currentLevel,
    title: 'Why was this activity selected?',
    explanation: `Based on your recent ${activityType.toLowerCase()} engagement (${lastStats?.accuracy || 82}% accuracy and calm response cadence), SmarTCARE chose a ${currentLevel.toLowerCase()} difficulty. This balances gentle memory recall with enjoyable North Eastern cultural familiarity.`,
    safetyNote: 'SmarTCARE is a supportive engagement platform. Activity adjustments are calibrated for daily cognitive stimulation and do not constitute clinical evaluations.'
  };
}
