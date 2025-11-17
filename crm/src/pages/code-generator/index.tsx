import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserCard } from '../../components/user-card';
import { getTimeOfDay } from '../../utils/get-time-of-day';
import { useParentUsers, useParentAddUsers } from './useParentUsers';
import Button from '../../components/Button';
import { AddCircleOutline, Dialpad } from '@mui/icons-material';
import { Header } from '../../components/Header';
import { TestCodeModel } from '../../components/test-code-model';

const formData = {
  name: '',
  grade: null,
  testCode: null,
};
export default function CodeGenerator() {
  const { parentId } = useParams<{ parentId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState<{
    name: string;
    grade: number | null;
    testCode: string | null;
  }>(formData);

  const {
    data: usersResponse,
    isLoading,
    isError,
    error,
  } = useParentUsers({
    parentId: parentId || '',
  });

  const { mutateAsync: addUser, isPending: isSubmitting } = useParentAddUsers({
    parentId: parentId!,
  });
  const navigate = useNavigate();

  const handleGenerateCode = async () => {
    if (
      !studentDetails.name.trim() ||
      studentDetails.grade === null ||
      !studentDetails.testCode
    )
      return;

    try {
      const response = await addUser({
        name: studentDetails.name.trim(),
        grade: studentDetails.grade,
        testCode: studentDetails.testCode,
      });
      setIsModalOpen(false);
      setStudentDetails(formData);
      navigate(`/analytics/${response.testCode}?isNew=true`);
    } catch (error) {
      console.error('Failed to generate test code:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStudentDetails(formData);
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
            <div className="flex gap-1">
              <Button
                fullWidth
                variant="text"
                onClick={() => {
                  window.open(
                    `tel:${usersResponse?.parentDetails.phoneNumber}`,
                    '_blank'
                  );
                }}
              >
                <Dialpad className="mr-2" />
                {usersResponse?.parentDetails.phoneNumber}
              </Button>
              <Button
                fullWidth
                variant="outline"
                onClick={() => setIsModalOpen(true)}
              >
                <AddCircleOutline className="mr-2" />
                Generate New Test Code
              </Button>
            </div>
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
          <TestCodeModel
            handleCloseModal={handleCloseModal}
            studentDetails={studentDetails}
            setStudentDetails={setStudentDetails}
            handleGenerateCode={handleGenerateCode}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
