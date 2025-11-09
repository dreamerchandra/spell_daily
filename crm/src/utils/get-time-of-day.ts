export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 22) return 'Good evening';
  return 'Good night';
};
