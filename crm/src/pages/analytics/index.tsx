import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../components/Header';
import { useAnalytics } from './useAnalytics.ts';
import Button from '../../components/Button.tsx';
import { EditSharp } from '@mui/icons-material';
import { TestCodeModel } from '../../components/test-code-model';
import {
  useDeleteTestCode,
  useEditTestCode,
} from '../code-generator/useParentUsers';
import { AnalyticsTab } from './tab/index.tsx';

export default function Analytics() {
  const { testCode } = useParams<{ testCode: string }>();
  const currentDate = new Date();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [studentDetails, setStudentDetails] = useState<{
    name: string;
    grade: number | null;
    testCode: string | null;
  }>({
    name: '',
    grade: null,
    testCode: null,
  });

  const { mutateAsync: editTestCode, isPending: isSubmitting } =
    useEditTestCode({
      oldTestCode: testCode!,
    });

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const { data: analyticsData, isLoading } = useAnalytics({
    testCode: testCode!,
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  });

  const { mutateAsync: deleteTestCode } = useDeleteTestCode({
    oldTestCode: testCode!,
    parentId: analyticsData?.parent?.id!,
  });

  const handleModalOpen = () => {
    setIsModalOpen(true);
    setStudentDetails({
      grade: analyticsData?.student?.grade || null,
      name: analyticsData?.student?.name || '',
      testCode: testCode || null,
    });
  };

  return (
    <div className="h-screen bg-app text-app-primary flex flex-col ">
      <Header>
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="text-xl font-bold text-app-primary">
              Analytics Dashboard
            </h1>
            <p className="text-sm text-gray-400">
              Test Code:{' '}
              <span className="text-app-primary font-semibold">{testCode}</span>
            </p>
          </div>
          <div>
            <Button
              variant="text"
              disabled={isLoading || isSubmitting}
              onClick={handleModalOpen}
            >
              <EditSharp />
            </Button>
          </div>
        </div>
      </Header>

      <div className="flex-1 overflow-hidden">
        <AnalyticsTab parentId={analyticsData?.parent?.id!} />
      </div>
      {isModalOpen && (
        <TestCodeModel
          mode="edit"
          handleCloseModal={handleCloseModal}
          studentDetails={studentDetails}
          setStudentDetails={setStudentDetails}
          onSubmit={async () => {
            await editTestCode({
              name: studentDetails.name,
              grade: studentDetails.grade,
              testCode: studentDetails.testCode!,
            });
            navigate(`/analytics/${studentDetails.testCode}`);
          }}
          onDelete={async () => {
            await deleteTestCode();
            navigate(`/parent/${analyticsData?.parent?.id}`);
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
