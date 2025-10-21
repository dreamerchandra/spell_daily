export const phoneticColors = [
  'bg-blue-500/20 border-blue-500/60' as const,
  'bg-green-500/20 border-green-500/60' as const,
  'bg-purple-500/20 border-purple-500/60' as const,
  'bg-orange-500/20 border-orange-500/60' as const,
  'bg-pink-500/20 border-pink-500/60' as const,
  'bg-cyan-500/20 border-cyan-500/60' as const,
  'bg-yellow-500/20 border-yellow-500/60' as const,
  'bg-red-500/20 border-red-500/60' as const,
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
