import { useState, useEffect } from 'react';

const loadingMessages = [
  {
    title: 'Brewing the perfect words... ☕',
    subtitle: 'Our dictionary is getting its morning coffee!',
    detail: 'Teaching vowels and consonants to play nice together...',
  },
  {
    title: 'Alphabetizing the chaos! 🔤',
    subtitle: 'Sorting letters from A to Z (and back again)!',
    detail: 'Even the alphabet needs organization sometimes...',
  },
  {
    title: 'Summoning the spelling spirits! 👻',
    subtitle: 'Casting spells to make words appear!',
    detail: 'Our wizards are checking their spell-books...',
  },
  {
    title: 'Words are doing warm-up exercises! 🏃‍♀️',
    subtitle: "They're stretching their syllables before the big game!",
    detail: 'Gotta limber up those consonants...',
  },
  {
    title: 'Loading the word factory! 🏭',
    subtitle: 'Quality-checking each letter for maximum spelling power!',
    detail: 'No typos allowed in this establishment...',
  },
  {
    title: 'Consulting the Grammar Gurus! 🧙‍♂️',
    subtitle: "They're debating whether it's 'gray' or 'grey'...",
    detail: "(It's taking longer than expected)",
  },
  {
    title: 'Downloading more RAM for the dictionary! 💾',
    subtitle: 'Turns out words take up more space than we thought!',
    detail:
      "Who knew 'pneumonoultramicroscopicsilicovolcanoconiosiss' was so heavy?",
  },
];

const loadingTips = [
  "💡 Tip: The word 'queue' is just 'Q' followed by four silent letters!",
  "🎯 Fun fact: 'Bookkeeper' is the only English word with three consecutive double letters!",
  "📚 Did you know? 'Dreamt' is the only English word that ends in 'mt'!",
  "🤓 Weird but true: 'Set' has the most different meanings in English!",
  "🌟 Cool fact: 'Facetious' contains all vowels in alphabetical order!",
  "🎪 Amazing: 'Almost' is the longest word with all letters in alphabetical order!",
  "🔥 Mind-blown: 'Typewriter' can be typed using only the top row of a keyboard!",
];

interface LoadingComponentProps {
  message?: string;
  progress?: number;
  showProgress?: boolean;
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
}

export const LoadingComponent = ({
  message,
  progress,
  showProgress = false,
  size = 'large',
  fullPage = true,
}: LoadingComponentProps) => {
  const [currentMessage] = useState(
    () => loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  );
  const [currentTip] = useState(
    () => loadingTips[Math.floor(Math.random() * loadingTips.length)]
  );
  const [dots, setDots] = useState('');
  const [letterIndex, setLetterIndex] = useState(0);

  const letters = ['S', 'P', 'E', 'L', 'L', 'I', 'N', 'G'];

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Letter loading animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLetterIndex(prev => (prev + 1) % letters.length);
    }, 400);
    return () => clearInterval(interval);
  }, [letters.length]);

  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl md:text-3xl',
    large: 'text-3xl md:text-5xl',
  };

  const containerClasses = fullPage
    ? 'min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated Loading Icon */}
        <div className="mb-8 relative">
          <div className="relative">
            {/* Spinning book icon */}
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              className="mx-auto mb-4 animate-spin-slow"
            >
              <defs>
                <linearGradient
                  id="bookGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              {/* Book cover */}
              <rect
                x="20"
                y="15"
                width="80"
                height="90"
                rx="8"
                fill="url(#bookGradient)"
                stroke="#1e40af"
                strokeWidth="2"
              />
              {/* Book spine */}
              <rect
                x="20"
                y="15"
                width="12"
                height="90"
                rx="8"
                fill="#1e40af"
              />
              {/* Book pages */}
              <rect
                x="35"
                y="25"
                width="60"
                height="3"
                fill="white"
                opacity="0.8"
              />
              <rect
                x="35"
                y="35"
                width="50"
                height="3"
                fill="white"
                opacity="0.8"
              />
              <rect
                x="35"
                y="45"
                width="55"
                height="3"
                fill="white"
                opacity="0.8"
              />
              {/* Floating letters */}
              <text
                x="60"
                y="70"
                fontSize="24"
                fill="white"
                textAnchor="middle"
                className="animate-pulse font-bold"
              >
                {letters[letterIndex]}
              </text>
            </svg>

            {/* Orbiting dots */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-spin"
                style={{
                  transformOrigin: '0 0',
                  animation: `orbit-${i} 3s linear infinite`,
                  animationDelay: `${i * 0.375}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Loading Message */}
        <div className="mb-8">
          <h1
            className={`${sizeClasses[size]} font-bold text-gray-800 mb-4 animate-fade-in`}
          >
            {message || currentMessage.title}
            <span className="inline-block w-8 text-left">{dots}</span>
          </h1>

          {!message && (
            <>
              <p className="text-xl md:text-2xl text-gray-600 mb-4 animate-fade-in-delay-1">
                {currentMessage.subtitle}
              </p>

              <p className="text-lg text-gray-500 italic animate-fade-in-delay-2">
                {currentMessage.detail}
              </p>
            </>
          )}
        </div>

        {/* Progress Bar */}
        {showProgress && typeof progress === 'number' && (
          <div className="mb-8 animate-fade-in-delay-2">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-shimmer"></div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {Math.round(progress)}% complete
            </p>
          </div>
        )}

        {/* Letter Loading Animation */}
        <div className="mb-8 animate-fade-in-delay-3">
          <div className="flex justify-center items-center gap-2 text-2xl font-bold">
            {letters.map((letter, index) => (
              <span
                key={index}
                className={`
                  transition-all duration-300 transform
                  ${
                    index <= letterIndex
                      ? 'text-blue-600 scale-110 animate-bounce'
                      : 'text-gray-300 scale-100'
                  }
                `}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        {/* Fun Tip */}
        {!message && (
          <div className="mt-8 p-4 bg-blue-100 rounded-lg border-l-4 border-blue-400 animate-fade-in-delay-4">
            <p className="text-blue-800 text-sm">{currentTip}</p>
          </div>
        )}

        {/* Custom CSS for animations */}
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes orbit-0 { 0% { transform: translate(-50%, -50%) rotate(0deg) translateX(70px); } 100% { transform: translate(-50%, -50%) rotate(360deg) translateX(70px); } }
          @keyframes orbit-1 { 0% { transform: translate(-50%, -50%) rotate(45deg) translateX(70px); } 100% { transform: translate(-50%, -50%) rotate(405deg) translateX(70px); } }
          @keyframes orbit-2 { 0% { transform: translate(-50%, -50%) rotate(90deg) translateX(70px); } 100% { transform: translate(-50%, -50%) rotate(450deg) translateX(70px); } }
          @keyframes orbit-3 { 0% { transform: translate(-50%, -50%) rotate(135deg) translateX(70px); } 100% { transform: translate(-50%, -50%) rotate(495deg) translateX(70px); } }
          @keyframes orbit-4 { 0% { transform: translate(-50%, -50%) rotate(180deg) translateX(70px); } 100% { transform: translate(-50%, -50%) rotate(540deg) translateX(70px); } }
          @keyframes orbit-5 { 0% { transform: translate(-50%, -50%) rotate(225deg) translateX(70px); } 100% { transform: translate(-50%, -50%) rotate(585deg) translateX(70px); } }
          @keyframes orbit-6 { 0% { transform: translate(-50%, -50%) rotate(270deg) translateX(70px); } 100% { transform: translate(-50%, -50%) rotate(630deg) translateX(70px); } }
          @keyframes orbit-7 { 0% { transform: translate(-50%, -50%) rotate(315deg) translateX(70px); } 100% { transform: translate(-50%, -50%) rotate(675deg) translateX(70px); } }
          
          .animate-spin-slow {
            animation: spin 6s linear infinite;
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
          
          .animate-fade-in-delay-1 {
            animation: fade-in 0.6s ease-out 0.2s both;
          }
          
          .animate-fade-in-delay-2 {
            animation: fade-in 0.6s ease-out 0.4s both;
          }
          
          .animate-fade-in-delay-3 {
            animation: fade-in 0.6s ease-out 0.6s both;
          }
          
          .animate-fade-in-delay-4 {
            animation: fade-in 0.6s ease-out 0.8s both;
          }
          
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default LoadingComponent;
