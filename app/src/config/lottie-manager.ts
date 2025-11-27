import lottieConfig from './lottie-config.json';

type StreakType = '3' | '5' | '10';
type LottieFolder = 'completed' | `streak/${StreakType}` | 'extra';

interface EmojiFile {
  fileName: string;
  path: string;
  originalPath: string;
}

interface EmojiGroup {
  dir_name: string;
  files: EmojiFile[];
}

interface EmojiConfig {
  [key: string]: EmojiGroup[];
}

export function exactLottieByPath(originalPath: string): string | null {
  const config = lottieConfig as EmojiConfig;

  for (const groupKey of Object.keys(config)) {
    for (const group of config[groupKey]) {
      for (const file of group.files) {
        if (file.originalPath === originalPath) {
          return file.path;
        }
      }
    }
  }

  return null;
}

export function randomLottieByPath(dirPath: LottieFolder): string | null {
  const config = lottieConfig as EmojiConfig;
  const matches: string[] = [];

  for (const groupKey of Object.keys(config)) {
    for (const group of config[groupKey]) {
      for (const file of group.files) {
        // match directory (start of path)
        if (file.path.startsWith(dirPath.replace(/\\/g, '/') + '/')) {
          matches.push(file.path);
        }
      }
    }
  }

  if (matches.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * matches.length);
  return `/lottie/${matches[randomIndex]}`;
}
