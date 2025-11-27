import { useRef, useEffect, useState } from 'react';
import '@dotlottie/player-component';
import { randomLottieByPath } from '../../config/lottie-manager';
import type { CSSProperties, ReactNode } from 'react';
import { celebrationStreaks, type StreakState } from '../../hooks/use-steak';

type LottieElement = Element & {
  play: () => void;
  addEventListener: (event: 'complete', callback: () => void) => void;
};

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

// Reusable Lottie Player Component
export const DotLottiePlayer = ({
  blob,
  style,
  speed = 1,
  background = 'transparent',
  onDone,
  info,
}: {
  blob: string;
  style?: CSSProperties;
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
    const wrapper = wrapperRef.current;
    wrapper.innerHTML = `<dotlottie-player
      src=${blob}
      background=${background}
      speed=${speed}
      id="lottie-player"
      style=${JSON.stringify(style || { width: '100%', height: '100%' })}
    >
    </dotlottie-player>`;

    requestAnimationFrame(() => {
      const player = wrapperRef.current?.querySelector(
        '#lottie-player'
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
  }, [background, speed, blob, style]);

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

type StreakPaths = Record<3 | 5 | 10, string>;

const useStreakPath = (): StreakPaths => {
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

const FallbackAnimation = ({
  onDone,
  streak,
}: {
  onDone: () => void;
  streak: number;
}) => {
  const [showStamp, setShowStamp] = useState(false);
  const info = getStreakInfo(streak);

  useEffect(() => {
    // Show stamp animation after 1.5 seconds
    const stampTimer = setTimeout(() => {
      setShowStamp(true);
    }, 1500);

    // Auto-dismiss after 3 seconds
    const dismissTimer = setTimeout(() => {
      onDone();
    }, 3000);

    return () => {
      clearTimeout(stampTimer);
      clearTimeout(dismissTimer);
    };
  }, [onDone]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white relative">
      {/* Animated Star Burst */}
      <div className="relative mb-8">
        {/* Central large star */}
        <div className="animate-pulse">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="animate-spin-slow"
          >
            <defs>
              <linearGradient
                id="starGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <path
              d="M60 10 L73 35 L100 35 L78 52 L85 78 L60 65 L35 78 L42 52 L20 35 L47 35 Z"
              fill="url(#starGradient)"
              stroke="#d97706"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Orbiting smaller stars */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 animate-spin"
            style={{
              transformOrigin: '0 0',
              animation: `orbit-${i} 2s linear infinite`,
              animationDelay: `${i * 0.25}s`,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="animate-twinkle"
            >
              <path
                d="M12 2 L14.5 8.5 L22 8.5 L16.5 13 L19 20 L12 16 L5 20 L7.5 13 L2 8.5 L9.5 8.5 Z"
                fill="#fcd34d"
                stroke="#f59e0b"
                strokeWidth="1"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Title and Message */}
      <div className="text-center mb-8">
        <h1
          className="text-5xl font-bold animate-bounce mb-4"
          style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            color: '#1f2937',
          }}
        >
          {info.title || 'CELEBRATION!'}
        </h1>
        <p className="text-2xl opacity-90 text-gray-700">
          {info.message || 'Great job!'}
        </p>
      </div>

      {/* Flying Stamp Animation */}
      <div className="relative">
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
            className={`${info.stampColor.bg} text-white font-black text-2xl px-6 py-3 border-4 ${info.stampColor.border} transform rotate-12 shadow-2xl inline-block`}
            style={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              letterSpacing: '2px',
              textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
              borderStyle: 'solid',
              background: info.stampColor.gradient,
            }}
          >
            {info.flyInMessage}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes orbit-0 { 0% { transform: translate(-50%, -50%) rotate(0deg) translateX(80px) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg) translateX(80px) rotate(-360deg); } }
        @keyframes orbit-1 { 0% { transform: translate(-50%, -50%) rotate(45deg) translateX(80px) rotate(-45deg); } 100% { transform: translate(-50%, -50%) rotate(405deg) translateX(80px) rotate(-405deg); } }
        @keyframes orbit-2 { 0% { transform: translate(-50%, -50%) rotate(90deg) translateX(80px) rotate(-90deg); } 100% { transform: translate(-50%, -50%) rotate(450deg) translateX(80px) rotate(-450deg); } }
        @keyframes orbit-3 { 0% { transform: translate(-50%, -50%) rotate(135deg) translateX(80px) rotate(-135deg); } 100% { transform: translate(-50%, -50%) rotate(495deg) translateX(80px) rotate(-495deg); } }
        @keyframes orbit-4 { 0% { transform: translate(-50%, -50%) rotate(180deg) translateX(80px) rotate(-180deg); } 100% { transform: translate(-50%, -50%) rotate(540deg) translateX(80px) rotate(-540deg); } }
        @keyframes orbit-5 { 0% { transform: translate(-50%, -50%) rotate(225deg) translateX(80px) rotate(-225deg); } 100% { transform: translate(-50%, -50%) rotate(585deg) translateX(80px) rotate(-585deg); } }
        @keyframes orbit-6 { 0% { transform: translate(-50%, -50%) rotate(270deg) translateX(80px) rotate(-270deg); } 100% { transform: translate(-50%, -50%) rotate(630deg) translateX(80px) rotate(-630deg); } }
        @keyframes orbit-7 { 0% { transform: translate(-50%, -50%) rotate(315deg) translateX(80px) rotate(-315deg); } 100% { transform: translate(-50%, -50%) rotate(675deg) translateX(80px) rotate(-675deg); } }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 1s ease-in-out infinite;
        }
        
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
          animation: stamp-fly-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export const LottiePlayer = ({
  streak,
  onDone,
}: {
  streak: StreakState;
  onDone: () => void;
}) => {
  const allLottie = useStreakPath();
  const lottiePath = celebrationStreaks.includes(streak.counter)
    ? allLottie[streak.counter as 3 | 5 | 10]
    : undefined;
  if (!streak.isPlaying) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white flex items-center justify-center z-50">
      {!lottiePath ? (
        <FallbackAnimation onDone={onDone} streak={streak.counter} />
      ) : (
        <DotLottiePlayer
          blob={lottiePath}
          speed={1}
          onDone={onDone}
          info={getStreakInfo(streak.counter)}
        />
      )}
    </div>
  );
};
