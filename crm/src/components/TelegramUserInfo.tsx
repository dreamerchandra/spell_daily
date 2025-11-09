import { useTelegram } from '../hooks/useTelegram';

export default function TelegramUserInfo() {
  const {
    user,
    initData,
    platform,
    version,
    colorScheme,
    isReady,
    hapticFeedback,
    showAlert,
    showConfirm,
  } = useTelegram();

  const handleHapticFeedback = () => {
    hapticFeedback('medium');
  };

  const handleShowAlert = async () => {
    await showAlert('Hello from Telegram Web App!');
  };

  const handleShowConfirm = async () => {
    const confirmed = await showConfirm('Do you want to continue?');
    console.log('Confirmed:', confirmed);
  };

  if (!isReady) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Telegram Web App Info
          </h1>

          {user ? (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-green-600">
                ✅ User Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <span className="font-medium text-gray-700">User ID:</span>
                  <span className="ml-2 text-gray-900 font-mono">
                    {user.id}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="font-medium text-gray-700">First Name:</span>
                  <span className="ml-2 text-gray-900">{user.first_name}</span>
                </div>
                {user.last_name && (
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="font-medium text-gray-700">
                      Last Name:
                    </span>
                    <span className="ml-2 text-gray-900">{user.last_name}</span>
                  </div>
                )}
                {user.username && (
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="font-medium text-gray-700">Username:</span>
                    <span className="ml-2 text-gray-900">@{user.username}</span>
                  </div>
                )}
                {user.language_code && (
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="font-medium text-gray-700">Language:</span>
                    <span className="ml-2 text-gray-900">
                      {user.language_code}
                    </span>
                  </div>
                )}
                {user.is_premium !== undefined && (
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="font-medium text-gray-700">Premium:</span>
                    <span
                      className={`ml-2 font-medium ${user.is_premium ? 'text-yellow-600' : 'text-gray-600'}`}
                    >
                      {user.is_premium ? '⭐ Yes' : '❌ No'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-yellow-600 text-lg mb-2">
                ⚠️ No User Information
              </div>
              <p className="text-gray-600">
                This app is running outside of Telegram or user data is not
                available.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                To test with real data, open this app through a Telegram bot.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            App Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-medium text-gray-700">Platform:</span>
              <span className="ml-2 text-gray-900">{platform}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-medium text-gray-700">Version:</span>
              <span className="ml-2 text-gray-900">{version}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-medium text-gray-700">Color Scheme:</span>
              <span className="ml-2 text-gray-900">{colorScheme}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-medium text-gray-700">
                Init Data Length:
              </span>
              <span className="ml-2 text-gray-900">
                {initData.length} chars
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Telegram Features
          </h2>
          <div className="space-y-3">
            <button
              onClick={handleHapticFeedback}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200"
            >
              Test Haptic Feedback
            </button>
            <button
              onClick={handleShowAlert}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition duration-200"
            >
              Show Alert
            </button>
            <button
              onClick={handleShowConfirm}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition duration-200"
            >
              Show Confirm Dialog
            </button>
          </div>
        </div>

        {initData && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Raw Init Data
            </h2>
            <div className="bg-gray-100 p-3 rounded overflow-x-auto">
              <code className="text-sm text-gray-700 break-all">
                {initData}
              </code>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This data can be sent to your backend to verify the user's
              identity.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
