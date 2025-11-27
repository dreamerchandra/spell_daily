import { useState } from 'react';
import { Button } from './Button';

const wittyMessages = [
  {
    title: 'Oops! Something went SPELL-tacularly wrong! 📚',
    subtitle: 'Looks like our letters got scrambled worse than alphabet soup!',
    detail: 'Even our error messages need spell-check sometimes...',
  },
  {
    title: '404: Words Not Found! 🔍',
    subtitle:
      'We searched high and low, but this page is playing hide-and-seek!',
    detail: "Maybe it's off learning new vocabulary?",
  },
  {
    title: 'Error: Brain.exe has stopped working! 🧠',
    subtitle: 'Our servers are having a spelling bee emergency!',
    detail:
      "Don't worry, we're teaching them the difference between 'their' and 'there'...",
  },
  {
    title: 'Houston, we have a problem! 🚀',
    subtitle: 'Mission: Spelling failed to launch properly!',
    detail: 'Our rocket ship ran out of vowels mid-flight...',
  },
  {
    title: 'Spelling Bee Malfunction! 🐝',
    subtitle: 'The bees are on strike and refused to spell anything correctly!',
    detail: "They're demanding better working conditions and more flowers...",
  },
  {
    title: 'Dictionary Overload! 📖',
    subtitle: 'Too many words tried to load at once and caused a traffic jam!',
    detail: 'Even the alphabet needs to wait in line sometimes...',
  },
];

interface ErrorComponentProps {
  error?: string;
  resetErrorBoundary?: () => void;
  customMessage?: string;
}

export const ErrorComponent = ({
  error,
  resetErrorBoundary,
  customMessage,
}: ErrorComponentProps) => {
  const [currentMessage] = useState(
    () => wittyMessages[Math.floor(Math.random() * wittyMessages.length)]
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);

    // If there's a reset function (from error boundary), use it
    if (resetErrorBoundary) {
      setTimeout(() => {
        resetErrorBoundary();
        setIsRefreshing(false);
      }, 1000);
    } else {
      // Otherwise, refresh the page
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated Error Icon */}
        <div className="mb-8 relative">
          <div className="animate-bounce">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              className="mx-auto mb-4"
            >
              <defs>
                <linearGradient
                  id="errorGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
              {/* Broken page icon */}
              <rect
                x="20"
                y="10"
                width="60"
                height="80"
                rx="4"
                fill="url(#errorGradient)"
                className="animate-pulse"
              />
              <rect
                x="80"
                y="30"
                width="20"
                height="60"
                rx="2"
                fill="url(#errorGradient)"
                className="animate-pulse"
                style={{ animationDelay: '0.2s' }}
              />
              {/* Crack lines */}
              <path
                d="M35 25 L65 55 M65 25 L35 55"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Floating question marks */}
              <text
                x="15"
                y="100"
                fontSize="20"
                fill="#f59e0b"
                className="animate-float"
              >
                ?
              </text>
              <text
                x="95"
                y="110"
                fontSize="16"
                fill="#f59e0b"
                className="animate-float"
                style={{ animationDelay: '0.5s' }}
              >
                ?
              </text>
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 animate-fade-in">
            {currentMessage.title}
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-4 animate-fade-in-delay-1">
            {currentMessage.subtitle}
          </p>

          <p className="text-lg text-gray-500 italic animate-fade-in-delay-2">
            {currentMessage.detail}
          </p>

          {/* Custom or actual error message */}
          {(customMessage || error) && (
            <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 rounded-r-lg animate-fade-in-delay-3">
              <p className="text-red-700 text-sm font-mono">
                {customMessage || error}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="primary"
            size="lg"
            className="px-8 py-4 text-lg"
          >
            {isRefreshing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="32 32"
                  />
                </svg>
                Fixing the magic...
              </span>
            ) : (
              '🔄 Try Again (Pretty Please?)'
            )}
          </Button>

          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            size="lg"
            className="px-6 py-3"
          >
            ← Go Back
          </Button>
        </div>

        {/* Fun fact */}
        <div className="mt-12 p-4 bg-yellow-100 rounded-lg border-l-4 border-yellow-400 animate-fade-in-delay-4">
          <p className="text-yellow-800 text-sm">
            <strong>💡 Fun Fact:</strong> The word "error" comes from the Latin
            word "errare," which means "to wander" or "to stray." Looks like
            this page wandered off too! 🗺️
          </p>
        </div>

        {/* Custom CSS for animations */}
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
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
          
          .animate-float {
            animation: float 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ErrorComponent;
