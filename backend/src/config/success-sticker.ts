export const celebrationGifs = [
  // 🎉 Confetti / Celebration
  'https://media.giphy.com/media/26xBukhNGkR0p7d9u/giphy.gif',
  'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
  'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif',

  // 🏆 Success / Achievement
  'https://media.giphy.com/media/OkJat1YNdoD3W/giphy.gif',
  'https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif',
  'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif',

  // 💵 Money / Reward
  'https://media.giphy.com/media/l1J9EdzfOSgfyueLm/giphy.gif',
  'https://media.giphy.com/media/26BRzozg4TCBXv6QU/giphy.gif',
  'https://media.giphy.com/media/3oz8xKaR836UJOYeOc/giphy.gif',
];

export const getRandomCelebrationGif = (): string => {
  const randomIndex = Math.floor(Math.random() * celebrationGifs.length);
  return celebrationGifs[randomIndex];
};
