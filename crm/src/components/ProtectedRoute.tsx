import { useTelegram } from '../hooks/useTelegram';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isReady } = useTelegram();

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-pink-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Telegram Access Only
          </h1>
          <p className="text-gray-600 mb-4">
            This application can only be accessed through a Telegram bot.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">
              No Telegram user data detected.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
