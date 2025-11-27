import { useEffect, useState } from 'react';
import { randomLottieByPath } from '../../config/lottie-manager';
import { AnimationPlayer } from './lottie-player';

const getStreakInfo = (): {
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
  return {
    title: 'Completed!',
    subtitle: '',
    message: 'Please come back tomorrow for more!',
    flyInMessage: 'Amazing Job!',
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

const usePrefetchStreak = (): string | undefined => {
  const [paths] = useState(randomLottieByPath('completed'));
  const [blobs, setBlobs] = useState<string | undefined>(undefined);
  useEffect(() => {
    const loadBlobs = async () => {
      if (!paths) return;
      const blob = await preloadLottie(paths);
      setBlobs(blob);
    };
    loadBlobs();
  }, [paths]);

  return blobs;
};

export const CompletedAnimation = ({
  isCompleted,
}: {
  isCompleted: boolean;
}) => {
  const blobs = usePrefetchStreak();
  if (!isCompleted) return null;

  return (
    <AnimationPlayer
      lottiePath={blobs}
      info={getStreakInfo()}
      loop
      onDone={() => {}}
    />
  );
};
