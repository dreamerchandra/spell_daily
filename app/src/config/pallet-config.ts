export const phoneticColors = [
  'bg-game-primary-500/20 border-game-primary-500/60' as const, // Purple
  'bg-game-secondary-500/20 border-game-secondary-500/60' as const, // Orange
  'bg-emerald-500/20 border-emerald-500/60' as const, // Keep emerald for success
  'bg-blue-500/20 border-blue-500/60' as const, // Blue accent
  'bg-rose-500/20 border-rose-500/60' as const, // Rose accent
  'bg-cyan-500/20 border-cyan-500/60' as const, // Cyan accent
  'bg-indigo-500/20 border-indigo-500/60' as const, // Indigo accent
  'bg-pink-500/20 border-pink-500/60' as const, // Pink accent
];

export const getPhoneticColorByActualSyllable = (actualSyllable: string[]) => {
  const mapping: typeof phoneticColors = [];
  let charIndex = 0;

  actualSyllable.forEach((syllable, idx) => {
    for (let i = 0; i < syllable.length; i++) {
      const color = phoneticColors[idx % phoneticColors.length];
      mapping[charIndex] = color;
      charIndex++;
    }
  });

  return mapping;
};
