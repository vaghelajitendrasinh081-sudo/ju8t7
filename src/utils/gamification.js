// Gamified Level System Utility (Levels 1 to 100)

export const MAX_LEVEL = 100;

// Cumulative hours required to reach a specific level L (1-indexed)
// Level 1: 0 hrs
// Level 2: 1 hr
// Level 3: 3 hrs
// Level 4: 6 hrs ...
export function getRequiredHoursForLevel(level) {
  if (level <= 1) return 0;
  const L = Math.min(level, MAX_LEVEL);
  return (L * (L - 1)) / 2;
}

// Given total study hours, calculate current level (1..100) and progress info
export function calculateLevelFromHours(totalHours) {
  const hours = Math.max(0, Number(totalHours) || 0);

  let currentLevel = 1;
  for (let l = 1; l <= MAX_LEVEL; l++) {
    if (hours >= getRequiredHoursForLevel(l)) {
      currentLevel = l;
    } else {
      break;
    }
  }

  const isMax = currentLevel >= MAX_LEVEL;
  const currentLevelHoursReq = getRequiredHoursForLevel(currentLevel);
  const nextLevelHoursReq = isMax ? currentLevelHoursReq : getRequiredHoursForLevel(currentLevel + 1);
  const hoursInCurrentLevel = hours - currentLevelHoursReq;
  const hoursNeededForNextLevel = nextLevelHoursReq - currentLevelHoursReq;

  const progressPercent = isMax
    ? 100
    : Math.min(100, Math.max(0, Math.round((hoursInCurrentLevel / hoursNeededForNextLevel) * 100)));

  return {
    level: currentLevel,
    title: getRankTitle(currentLevel),
    totalHours: hours,
    currentLevelHoursReq,
    nextLevelHoursReq,
    hoursInCurrentLevel,
    hoursNeededForNextLevel,
    progressPercent,
    isMax
  };
}

export function getRankTitle(level) {
  if (level >= 100) return 'SUDARSHAN SOVEREIGN';
  if (level >= 91) return 'ZENITH TRANSCENDANT';
  if (level >= 81) return 'CHAKRA MASTER';
  if (level >= 71) return 'COSMIC SAGE';
  if (level >= 61) return 'ORBITAL COMMANDER';
  if (level >= 51) return 'NEURAL OBSERVER';
  if (level >= 41) return 'TACTICAL ARCHITECT';
  if (level >= 31) return 'QUANTUM STRATEGIST';
  if (level >= 21) return 'CYBERNETIC SCHOLAR';
  if (level >= 11) return 'KURUKSHETRA WARRIOR';
  if (level >= 6) return 'CADET INITIATE';
  return 'NOVICE RECRUIT';
}
