/**
 * Recommendation Service
 * Suggests tailored cognitive activities, relaxation breaks, and routine reminders
 * based on the time of day, active profile, and recent engagement metrics.
 */

export function getRecommendationsForTime(hour = new Date().getHours(), profileMetrics = {}) {
  // Morning (5am - 12pm)
  if (hour >= 5 && hour < 12) {
    return {
      period: 'Morning Freshness',
      greeting: 'Good morning! Your mind is fresh and receptive.',
      primaryActivity: {
        id: 'memory-cultural',
        title: 'NER Cultural Memory Match',
        category: 'Cultural Recall',
        route: '/games/cultural',
        icon: 'Sparkles',
        badge: 'Recommended Morning Activity',
        reason: 'Visual recall paired with familiar Assamese & North Eastern heritage activates long-term semantic memory.'
      },
      secondaryActivity: {
        id: 'routine-recall',
        title: 'Daily Routine Recall',
        category: 'Executive Function',
        route: '/games/daily-recall',
        icon: 'Calendar',
        badge: 'Routine Support',
        reason: 'Reinforces daily scheduling and morning medication awareness.'
      },
      wellnessTip: 'Take a short glass of warm water before starting games to enhance hydration.'
    };
  }

  // Afternoon (12pm - 5pm)
  if (hour >= 12 && hour < 17) {
    return {
      period: 'Afternoon Relaxation',
      greeting: 'Good afternoon! Take things at a peaceful pace.',
      primaryActivity: {
        id: 'sound-memory',
        title: 'Sound & Environmental Recall',
        category: 'Auditory Memory',
        route: '/games/sound',
        icon: 'Music',
        badge: 'Relaxing Auditory Exercise',
        reason: 'Gentle nature and traditional instruments provide low-effort sensory stimulation.'
      },
      secondaryActivity: {
        id: 'breathing-pacer',
        title: 'Paced Breathing (5 Minutes)',
        category: 'Well-being',
        route: '/breathing',
        icon: 'Wind',
        badge: 'Midday Reset',
        reason: 'Reduces midday stress and recharges attention span.'
      },
      wellnessTip: 'Rest your eyes for a few moments between activities.'
    };
  }

  // Evening / Night (5pm - 5am)
  return {
    period: 'Evening Wind-down',
    greeting: 'Good evening! Time for gentle reminiscence and relaxation.',
    primaryActivity: {
      id: 'memory-lane',
      title: 'Family Memory Lane',
      category: 'Reminiscence',
      route: '/memory-lane',
      icon: 'Heart',
      badge: 'Emotional Comfort',
      reason: 'Looking back at cherished family memories stimulates social warmth and eases restlessness.'
    },
    secondaryActivity: {
      id: 'grounding-54321',
      title: '5-4-3-2-1 Sensory Grounding',
      category: 'Relaxation',
      route: '/grounding',
      icon: 'Shield',
      badge: 'Calming Bedtime Exercise',
      reason: 'Anchors awareness into the present moment for restful sleep.'
    },
    wellnessTip: 'Dim bright lights and sip a warm herbal beverage before bedtime.'
  };
}
