export const USERS = [
  { key: 'sritha', name: 'Sritha', emoji: '🌿' },
  { key: 'mayuri', name: 'Mayuri', emoji: '🔮' },
];

export const MONTH_LABEL = 'November 2026';
export const DAYS = Array.from({ length: 30 }, (_, i) => i + 1);

export const QUOTES = [
  'Small steps every day add up to big results.',
  'Progress, not perfection.',
  'Consistency beats intensity when it comes to habits.',
  'Today is a fresh page. Make it count.',
  'You do not have to do everything, just the next thing.',
  'Show up for yourself, one checkbox at a time.',
  'Done is better than perfect.',
  'The best time to start was yesterday. The next best time is now.',
  'Every tick is a promise you kept to yourself.',
  'Momentum starts with a single task.',
];

/** Returns today's day-of-month if we are inside November 2026, otherwise null. */
export function todayDayOfNovember() {
  const now = new Date();
  return now.getFullYear() === 2026 && now.getMonth() === 10 ? now.getDate() : null;
}
