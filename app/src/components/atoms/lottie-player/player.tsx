import {
  useRef,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

type LottieElement = Element & {
  play: () => void;
  addEventListener: (event: 'complete', callback: () => void) => void;
};

export const DotLottiePlayer = ({
  blob,
  style,
  speed = 1,
  background = 'transparent',
  onDone,
  info,
  loop,
}: {
  blob: string;
  style?: CSSProperties;
  speed?: number;
  background?: string;
  children?: ReactNode;
  onDone?: () => void;
  loop?: boolean;
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
      loop=${loop ? 'true' : 'false'}
      style=${JSON.stringify(style || { width: '100%', height: '100%' })}
    >
    </dotlottie-player>`;

    requestAnimationFrame(() => {
      const player = wrapperRef.current?.querySelector(
        '#lottie-player'
      ) as LottieElement;
      setTimeout(() => {
        if (player?.play) {
          player?.play();
        }
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

    const timerId = setTimeout(() => {
      if (latestRef.current) {
        latestRef.current();
      }
    }, 7000); // Fallback in case 'complete' event doesn't fire
    return () => {
      clearTimeout(timerId);
    };
  }, [background, speed, blob, style, loop]);

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
