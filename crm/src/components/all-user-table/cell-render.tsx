import { useNavigate } from 'react-router-dom';
import type { AllUsersData } from '../../type/all-users';
import Button from '../Button';

export const ParentUserRender = ({ row }: { row: AllUsersData }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/parent/${row.parentId}`)}
      className="cursor-pointer"
    >
      <div className="text-sm font-medium text-white-100">{row.parentName}</div>
      <div className="text-xs text-white-70">{row.details}</div>
    </div>
  );
};

export const PhoneNumberRender = ({ row }: { row: AllUsersData }) => {
  return (
    <Button
      variant="text"
      onClick={() => {
        window.open(`tel:${row.phoneNumber}`, '_blank');
      }}
    >
      {row.phoneNumber}
    </Button>
  );
};

export const TestCodeRender = ({ row }: { row: AllUsersData }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/analytics/${row.testCode}`)}
      className="cursor-pointer text-app-primary hover:underline"
    >
      {row.testCode}
    </div>
  );
};
