import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { UserCard } from '../../components/user-card';
import { getTimeOfDay } from '../../utils/get-time-of-day';
import { useParentUsers, useParentAddUsers } from './useParentUsers';
import Button from '../../components/Button';
import { AddCircleOutline, Close } from '@mui/icons-material';

export default function CodeGenerator() {
  const { user } = useTelegram();
  const { parentId } = useParams<{ parentId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: usersResponse,
    isLoading,
    isError,
    error,
  } = useParentUsers({
    parentId: parentId || '',
  });

  const { mutateAsync: addUser } = useParentAddUsers({
    parentId: parentId!,
  });

  const handleGenerateCode = async () => {
    if (!userName.trim()) return;

    setIsSubmitting(true);
    try {
      await addUser({ name: userName.trim() });
      setIsModalOpen(false);
      setUserName('');
    } catch (error) {
      console.error('Failed to generate test code:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserName('');
  };

  return (
    <div className="min-h-screen bg-app text-app-primary">
      <div className="mx-auto">
        <div className="py-4 px-6">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">📝</div>

            <div className="flex-1">
              <div className="text-sm font-medium text-white-50">
                {getTimeOfDay()}
              </div>
              <div className="text-lg font-semibold text-white-70">
                {user?.first_name ? `${user.first_name}'s Kids` : 'Parent Name'}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6">
          <h2 className="text-lg font-semibold mb-4 text-app-primary">
            Test Codes
            {usersResponse && (
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({usersResponse.users.length} of {usersResponse.total})
              </span>
            )}
          </h2>
          <div className="flex items-center  py-3 ">
            <Button
              fullWidth
              variant="text"
              onClick={() => setIsModalOpen(true)}
            >
              <AddCircleOutline className="mr-2" />
              Generate New Test Code
            </Button>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">Loading test codes...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-8 text-red-400">
                <p>Failed to load test codes</p>
                <p className="text-sm text-gray-500 mt-1">
                  {error instanceof Error
                    ? error.message
                    : 'Unknown error occurred'}
                </p>
              </div>
            ) : usersResponse?.users.length ? (
              usersResponse.users.map((userItem, index) => (
                <UserCard
                  user={userItem}
                  key={`${userItem.testCode}-${index}`}
                  handleItemClick={() => {}}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No test codes found matching the current filters
              </div>
            )}
          </div>
        </div>

        {/* Modal for User Name Input */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-app-secondary rounded-lg shadow-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-app-primary">
                  Generate New Test Code
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-app-primary transition-colors"
                >
                  <Close />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-app-primary mb-2">
                  Student Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  placeholder="Enter student name"
                  className="w-full p-3 bg-app rounded-lg border border-gray-600 text-app-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateCode}
                  disabled={!userName.trim() || isSubmitting}
                  className="flex-1 py-2 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
