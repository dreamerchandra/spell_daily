import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserCard } from '../../components/user-card';
import { getTimeOfDay } from '../../utils/get-time-of-day';
import { useParentUsers, useParentAddUsers } from './useParentUsers';
import Button from '../../components/Button';
import { AddCircleOutline, Close } from '@mui/icons-material';
import { Header } from '../../components/Header';

export default function CodeGenerator() {
  const { parentId } = useParams<{ parentId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState<{
    name: string;
    grade: number | null;
  }>({
    name: '',
    grade: null,
  });
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
  const navigate = useNavigate();

  const handleGenerateCode = async () => {
    if (!studentDetails.name.trim() || studentDetails.grade === null) return;

    setIsSubmitting(true);
    try {
      const response = await addUser({
        name: studentDetails.name.trim(),
        grade: studentDetails.grade,
      });
      setIsModalOpen(false);
      setStudentDetails({ name: '', grade: null });
      navigate(`/analytics/${response.testCode}?isNew=true`);
    } catch (error) {
      console.error('Failed to generate test code:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStudentDetails({ name: '', grade: null });
  };

  return (
    <div className="min-h-screen bg-app text-app-primary">
      <Header>
        <div className="flex items-center space-x-3">
          <div className="text-2xl">📝</div>
          <div>
            <div className="text-sm text-gray-400">{getTimeOfDay()}</div>
            <div className="text-lg font-semibold text-app-primary">
              {usersResponse?.users[0]
                ? `${usersResponse.users[0].parentName}'s Kids`
                : 'Parent Name'}
            </div>
          </div>
        </div>
      </Header>

      <div className="mx-auto">
        <div className="px-6">
          <div className="flex items-start  py-3 flex-col mb-4">
            <h2 className="text-lg font-semibold text-app-primary">
              Test Codes
              {usersResponse && (
                <span className="text-sm font-normal text-gray-400 ml-2">
                  ({usersResponse.users.length} of {usersResponse.total})
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-400">
              {usersResponse?.parentDetails.details &&
                ` (${usersResponse.parentDetails.details})`}
            </p>
          </div>
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
                  handleItemClick={() => {
                    navigate(`/analytics/${userItem.testCode}`);
                  }}
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

              <div className="mb-6 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-app-primary mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={studentDetails.name}
                    onChange={e =>
                      setStudentDetails({
                        ...studentDetails,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter student name"
                    className="w-full p-3 bg-app rounded-lg border border-gray-600 text-app-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-app-primary mb-2">
                    Grade Name
                  </label>
                  <input
                    type="number"
                    value={studentDetails.grade || ''}
                    onChange={e =>
                      setStudentDetails({
                        ...studentDetails,
                        grade: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="Enter grade name"
                    className="w-full p-3 bg-app rounded-lg border border-gray-600 text-app-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
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
                  disabled={
                    !studentDetails.name.trim() ||
                    studentDetails.grade === null ||
                    isSubmitting
                  }
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
