import { useRef, useEffect, useState } from 'react';
import '@dotlottie/player-component';
import { randomLottieByPath } from '../../config/lottie-manager';
import type { CSSProperties, ReactNode } from 'react';

type LottieElement = Element & {
  play: () => void;
  addEventListener: (event: 'complete', callback: () => void) => void;
};

const getStreakInfo = (
  streakCount: 3 | 5 | 10
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

// Reusable Lottie Player Component
export const DotLottiePlayer = ({
  src,
  style,
  speed = 1,
  background = 'transparent',
  onDone,
  info,
}: {
  src: string;
  style?: CSSProperties;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  background?: string;
  children?: ReactNode;
  onDone?: () => void;
  info: {
    title: string;
    subtitle: string;
    message: string;
    flyInMessage: string;
    stampColor: {
      bg: string;
      border: string;
      gradient: string;
    };
  };
}) => {
  const { title, subtitle, message, flyInMessage, stampColor } = info;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef(onDone);
  const [showStamp, setShowStamp] = useState(false);
  latestRef.current = onDone;

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }
    wrapperRef.current.innerHTML = `<dotlottie-player
      src=${src}
      background=${background}
      speed=${speed}
      loop
      style=${JSON.stringify(style || { width: '100%', height: '100%' })}
    >
    </dotlottie-player>`;

    requestAnimationFrame(() => {
      const player = wrapperRef.current?.querySelector(
        'dotlottie-player'
      ) as LottieElement;
      setTimeout(() => {
        player?.play();
      }, 500);

      // Trigger stamp animation after a delay
      setTimeout(() => {
        setShowStamp(true);
      }, 1000);

      player?.addEventListener('complete', () => {
        if (latestRef.current) {
          latestRef.current();
        }
      });
    });
  }, [background, speed, src, style]);

  return (
    <div className="relative">
      <div className="flex justify-center">
        <div
          ref={wrapperRef}
          style={{ width: 300, height: 300, marginBottom: '30px' }}
        />
      </div>
      <div className="text-wrap flex gap-5 flex-col items-center justify-center mx-auto my-2.5">
        <h1
          className="text-5xl font-bold animate-pulse"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
        >
          {title}
        </h1>
        <h2
          className="text-3xl font-bold"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
        >
          {subtitle}
        </h2>
      </div>
      <p className="text-2xl my-2.5 opacity-90">{message}</p>

      {/* Flying Stamp Message - positioned below the message */}
      <div className="relative mt-16 flex justify-center items-center">
        <div
          className={`${
            showStamp
              ? 'animate-stamp-fly-in'
              : 'opacity-0 scale-0 rotate-45 translate-x-full translate-y-full'
          }`}
          style={{
            animationFillMode: 'forwards',
          }}
        >
          <div
            className={`${stampColor.bg} text-white font-black text-2xl px-6 py-3 border-4 ${stampColor.border} transform rotate-12 shadow-2xl inline-block`}
            style={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              letterSpacing: '2px',
              textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
              borderStyle: 'solid',
              background: stampColor.gradient,
            }}
          >
            {flyInMessage}
          </div>
        </div>
      </div>

      {/* Add custom CSS for stamp animation */}
      <style>{`
        @keyframes stamp-fly-in {
          0% {
            opacity: 0;
            transform: translate(200px, -200px) rotate(45deg) scale(0.3);
          }
          50% {
            opacity: 1;
            transform: translate(0, 0) rotate(15deg) scale(1.2);
          }
          70% {
            transform: translate(0, 0) rotate(10deg) scale(0.95);
          }
          85% {
            transform: translate(0, 0) rotate(12deg) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translate(0, 0) rotate(12deg) scale(1);
          }
        }

        .animate-stamp-fly-in {
          animation: stamp-fly-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)
            forwards;
        }
      `}</style>
    </div>
  );
};

export const LottiePlayer = ({
  streak,
  onDone,
}: {
  streak: 3 | 5 | 10;
  onDone: () => void;
}) => {
  const lottiePath = randomLottieByPath(`streak/${streak}`);
  if (!lottiePath) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white flex items-center justify-center z-50">
      <DotLottiePlayer
        src={lottiePath}
        loop
        autoplay
        speed={1}
        onDone={onDone}
        info={getStreakInfo(streak)}
      />
    </div>
  );
};
