import { useEffect, useState } from 'react';
import { randomLottieByPath } from '../../config/lottie-manager';
import { celebrationStreaks, type StreakState } from '../../hooks/use-steak';
import { AnimationPlayer } from './lottie-player';

const getStreakInfo = (
  streakCount: number
): {
  title: string;
  subtitle: string;
  message: string;
  flyInMessage: string;
  stampColor: {
    bg: string;
    border: string;
    gradient: string;
  };
} => {
  if (streakCount === 3) {
    return {
      title: 'HAT-TRICK!',
      subtitle: '',
      message: "You're on fire! Keep it up!",
      flyInMessage: '3 in a row!',
      stampColor: {
        bg: 'bg-red-600',
        border: 'border-red-700',
        gradient: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
      },
    };
  } else if (streakCount === 5) {
    return {
      title: 'AMAZING!',
      subtitle: '',
      message: "Incredible streak! You're unstoppable!",
      flyInMessage: '5 in a row!',
      stampColor: {
        bg: 'bg-blue-600',
        border: 'border-blue-700',
        gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      },
    };
  } else if (streakCount === 10) {
    return {
      title: 'LEGENDARY!',
      subtitle: '',
      message: "Perfect 10! You're a spelling master!",
      flyInMessage: '10 in a row!',
      stampColor: {
        bg: 'bg-green-600',
        border: 'border-green-700',
        gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      },
    };
  }

  return {
    title: '',
    subtitle: '',
    message: '',
    flyInMessage: '',
    stampColor: {
      bg: 'bg-gray-600',
      border: 'border-gray-700',
      gradient: 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
    },
  };
};

const preloadLottie = async (url: string) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

type StreakPaths = Record<3 | 5 | 10, string>;

const usePrefetchStreak = (): StreakPaths => {
  const [paths] = useState(() => {
    return {
      3: randomLottieByPath('streak/3')!,
      5: randomLottieByPath('streak/5')!,
      10: randomLottieByPath('streak/10')!,
    };
  });
  const [blobs, setBlobs] = useState<StreakPaths>({
    3: '',
    5: '',
    10: '',
  });

  useEffect(() => {
    const loadBlobs = async () => {
      const _blob3 = preloadLottie(paths[3]);
      const _blob5 = preloadLottie(paths[5]);
      const _blob10 = preloadLottie(paths[10]);
      const [blob3, blob5, blob10] = await Promise.all([
        _blob3,
        _blob5,
        _blob10,
      ]);
      setBlobs({
        3: blob3,
        5: blob5,
        10: blob10,
      });
    };
    loadBlobs();
  }, [paths]);

  return blobs;
};

export const StreakAnimation = ({
  streak,
  onDone,
}: {
  streak: StreakState;
  onDone: () => void;
}) => {
  const allLottie = usePrefetchStreak();
  const lottiePath = celebrationStreaks.includes(streak.counter)
    ? allLottie[streak.counter as 3 | 5 | 10]
    : undefined;
  if (!streak.isPlaying) return null;

  return (
    <AnimationPlayer
      lottiePath={lottiePath}
      info={getStreakInfo(streak.counter)}
      onDone={onDone}
    />
  );
};
