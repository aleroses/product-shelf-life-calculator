import { USER_LEVELS } from '../constants/levels';

export const getUserLevel = (totalCalculations: number): string => {
  let level = USER_LEVELS[0].name;
  for (const lvl of USER_LEVELS) {
    if (totalCalculations >= lvl.minCalculations) {
      level = lvl.name;
    }
  }
  return level;
};

export const getNextLevel = (
  totalCalculations: number
): { name: string; remaining: number } | null => {
  for (const lvl of USER_LEVELS) {
    if (totalCalculations < lvl.minCalculations) {
      return {
        name: lvl.name,
        remaining: lvl.minCalculations - totalCalculations,
      };
    }
  }
  return null;
};

export const getLevelProgress = (totalCalculations: number): number => {
  const currentIndex = USER_LEVELS.findIndex((lvl, i) => {
    const next = USER_LEVELS[i + 1];
    return (
      totalCalculations >= lvl.minCalculations &&
      (!next || totalCalculations < next.minCalculations)
    );
  });

  if (currentIndex === -1) return 100;
  if (currentIndex === USER_LEVELS.length - 1) return 100;

  const current = USER_LEVELS[currentIndex];
  const next = USER_LEVELS[currentIndex + 1];
  const range = next.minCalculations - current.minCalculations;
  const progress = totalCalculations - current.minCalculations;

  return Math.min(100, Math.round((progress / range) * 100));
};
