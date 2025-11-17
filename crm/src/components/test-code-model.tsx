import { Close } from '@mui/icons-material';
import Button from './Button';

export const TestCodeModel = ({
  handleCloseModal,
  studentDetails,
  setStudentDetails,
  onSubmit,
  isSubmitting,
  mode,
  onDelete,
}: {
  handleCloseModal: () => void;
  studentDetails: {
    name: string;
    grade: number | null;
    testCode: string | null;
  };
  setStudentDetails: React.Dispatch<
    React.SetStateAction<{
      name: string;
      grade: number | null;
      testCode: string | null;
    }>
  >;
  onSubmit: () => Promise<any>;
  onDelete?: () => Promise<any>;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
}) => {
  return (
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

          <div className="flex gap-1">
            <div>
              <label className="block text-sm font-medium text-app-primary mb-2">
                Test Code
              </label>
              <input
                type="text"
                value={studentDetails.testCode || ''}
                onChange={e =>
                  setStudentDetails({
                    ...studentDetails,
                    testCode: e.target.value,
                  })
                }
                placeholder="Enter test code"
                className="w-full p-3 bg-app rounded-lg border border-gray-600 text-app-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-app-primary mb-2">
                Grade
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
                placeholder="Enter grade"
                className="w-full p-3 bg-app rounded-lg border border-gray-600 text-app-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-between flex-row-reverse">
          <div className="flex gap-3 justify-start flex-row-reverse">
            <Button
              onClick={onSubmit}
              disabled={
                !studentDetails.name.trim() ||
                studentDetails.grade === null ||
                isSubmitting
              }
            >
              {mode === 'create' ? 'Add Code' : 'Update Code'}
            </Button>
            <Button onClick={handleCloseModal} variant="outline">
              Cancel
            </Button>
          </div>
          <div>
            {onDelete ? (
              <Button
                onClick={onDelete}
                variant="danger-text"
                disabled={isSubmitting}
              >
                Delete
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
