import {
  forwardRef,
  useEffect,
  useState,
  useImperativeHandle,
  useRef,
} from 'react';

const Progress = ({ score, total }: { score: number; total: number }) => {
  return (
    <div className="w-[80vw] max-w-[200px] rounded-full border border-gray-300 bg-gray-100 p-1">
      <div
        className="h-1.5 rounded-full bg-gradient-to-r from-ui-primary to-ui-accentBlue transition-all duration-500"
        style={{
          width: `${(score / total) * 100}%`,
        }}
      ></div>
    </div>
  );
};

export const CountdownTimer = forwardRef<
  { start: (duration: number) => void; stop: () => void; reset: () => void },
  { onTimeUp?: () => void; className?: string; disableTimer?: boolean }
>(({ onTimeUp, className = '', disableTimer }, ref) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(0);

  useImperativeHandle(ref, () => ({
    start: (duration: number) => {
      requestAnimationFrame(() => {
        setInitialTime(duration);
        setTimeLeft(duration);
        setIsActive(true);
      });
    },
    stop: () => {
      requestAnimationFrame(() => {
        setIsActive(false);
      });
    },
    reset: () => {
      requestAnimationFrame(() => {
        setIsActive(false);
        setTimeLeft(0);
        setInitialTime(0);
      });
    },
  }));

  useEffect(() => {
    let intervalId: number | null = null;

    if (isActive && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setIsActive(false);
            if (onTimeUp) {
              onTimeUp();
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isActive && timeLeft === 0 && initialTime === 0) {
    return null;
  }
  if (disableTimer) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* Simple Countdown Timer */}
      <div
        className={`rounded-lg border px-3 py-1 text-center transition-all duration-300 ${
          timeLeft <= 5 && isActive
            ? 'border-red-500 text-red-600'
            : timeLeft <= 10 && isActive
              ? 'border-yellow-500 text-yellow-600'
              : 'border-gray-400 text-ui-text'
        }`}
      >
        <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
});

export type TimerRef = {
  startTimer: (duration: number) => void;
  stopTimer: () => void;
  resetTimer: () => void;
};

export const ProgressWithTimer = forwardRef<
  TimerRef,
  {
    score: number;
    total: number;
    onTimeUp?: () => void;
    disableTimer?: boolean;
  }
>(({ score, total, onTimeUp, disableTimer }, ref) => {
  const timerRef = useRef<{
    start: (duration: number) => void;
    stop: () => void;
    reset: () => void;
  }>(null);

  useImperativeHandle(ref, () => ({
    startTimer: (duration: number) => {
      timerRef.current?.start(duration);
    },
    stopTimer: () => {
      timerRef.current?.stop();
    },
    resetTimer: () => {
      timerRef.current?.reset();
    },
  }));

  return (
    <div className="flex flex-col items-center gap-2">
      <Progress score={score} total={total} />
      <CountdownTimer
        ref={timerRef}
        onTimeUp={onTimeUp}
        disableTimer={disableTimer}
      />
    </div>
  );
});
