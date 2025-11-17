import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserCard } from '../../components/user-card';
import { SelectableCardProvider } from '../../components/SelectableCard';
import { useSelectionContext } from '../../hooks/useSelectionContext';
import { getTimeOfDay } from '../../utils/get-time-of-day';
import {
  useParentUsers,
  useParentAddUsers,
  useBulkDeleteTestCodes,
} from './useParentUsers';
import Button from '../../components/Button';
import { AddCircleOutline, Dialpad, DeleteOutline } from '@mui/icons-material';
import { Header } from '../../components/Header';
import { TestCodeModel } from '../../components/test-code-model';

const formData = {
  name: '',
  grade: null,
  testCode: null,
};
// Selection controls component
const SelectionControls = ({ parentId }: { parentId: string }) => {
  const { selectedIds, hasSelections, clearSelections } = useSelectionContext();
  const { mutateAsync: bulkDelete } = useBulkDeleteTestCodes({
    parentId: parentId!,
  });

  const handleBulkDelete = async () => {
    await bulkDelete(selectedIds);
    clearSelections();
    return;
  };

  if (!hasSelections) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary-50 border-t border-primary-200 shadow-lg">
      <div className="flex items-center justify-between p-4 max-w-screen-xl mx-auto">
        <span className="text-primary-700 font-medium">
          {selectedIds.length} user{selectedIds.length !== 1 ? 's' : ''}{' '}
          selected
        </span>
        <div className="flex gap-2">
          <Button variant="text" size="sm" onClick={clearSelections}>
            Clear
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleBulkDelete}
            icon={<DeleteOutline className="w-4 h-4" />}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
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
  const [_selectedIds, _setSelectedIds] = useState<string[]>([]);

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
      return;
    } catch (error) {
      console.error('Failed to generate test code:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStudentDetails(formData);
  };

  return (
    <SelectableCardProvider>
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
            <div className="flex items-start py-3 flex-col">
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
            <div className="flex items-center py-3 gap-1">
              <Button
                fullWidth
                disabled={!usersResponse?.parentDetails.phoneNumber}
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

            <div className="space-y-2 pb-28">
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
              mode="create"
              handleCloseModal={handleCloseModal}
              studentDetails={studentDetails}
              setStudentDetails={setStudentDetails}
              onSubmit={handleGenerateCode}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        <SelectionControls parentId={parentId!} />
      </div>
    </SelectableCardProvider>
  );
}
